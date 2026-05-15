# Runbook inicial - Catalogo de productos

## 1. Proposito y alcance

Este runbook es la guia operativa minima para el equipo de guardia del catalogo de productos. Cubre las tres alarmas definidas en el modulo Terraform `observability` (5xx ratio, latencia p95, errores de conexion a BD), los procedimientos comunes (logs, rollback, rotacion de credenciales) y el esquema de severidades. Su objetivo es que un ingeniero on-call pueda diagnosticar y mitigar incidentes sin leer toda la documentacion del proyecto.

## 2. Servicios cubiertos

| Servicio | Tecnologia | Notas |
|---|---|---|
| `api` | Fastify (Node) | Endpoints publicos `/products`, `/products/:id`, `/health`. |
| `web` | Next.js | Frontend que consume `api`. |
| `db`  | Base de datos relacional privada | Solo accesible desde subred privada del entorno. |

## 3. Endpoints de salud y metricas

Local (desarrollo):

| Recurso | URL local |
|---|---|
| API health | `http://localhost:4000/health` |
| API productos | `http://localhost:4000/products` |
| API producto por id | `http://localhost:4000/products/{id}` |
| Frontend | `http://localhost:3000` |

Por entorno cloud (sustituir host base al elegir cloud / DNS):

| Entorno | Patron de URL API | Patron de URL Web |
|---|---|---|
| dev | `https://api.dev.<dominio>/health` | `https://www.dev.<dominio>` |
| pre | `https://api.pre.<dominio>/health` | `https://www.pre.<dominio>` |
| prod | `https://api.<dominio>/health` | `https://www.<dominio>` |

Metricas minimas expuestas (alineadas con el modulo `observability`): `http_5xx_ratio`, `http_latency_p95_ms`, `db_connection_errors`, CPU, memoria, conexiones BD. El dashboard del entorno agrupa estos widgets.

## 4. Alertas y procedimientos

Todas las alarmas notifican al topic configurado en `var.alert_notification_topic`. Sustituir referencias a "dashboard del entorno" y "log aggregator" por la herramienta real al elegir cloud (CloudWatch, Azure Monitor, GCP Cloud Monitoring, Datadog, Grafana, etc.).

### 4.1 `alarm_5xx` - 5xx ratio elevado

- **Umbral**: `http_5xx_ratio` > `var.alarm_5xx_threshold_pct` durante 3 periodos de 60s.
- **Sintomas**: usuarios reciben errores 500/502/503; pico de errores en el dashboard del entorno; posibles timeouts del frontend.
- **Primeras 3 acciones**:
  1. Revisar logs de `api` en el log aggregator filtrando por `level=error` y `status>=500` en los ultimos 15 minutos. Identificar mensaje y stacktrace dominante.
  2. Verificar conectividad y salud de BD: alarma `alarm_db_errors`, metrica de conexiones activas y `GET /health` del api.
  3. Si el error coincide con el deploy mas reciente, ejecutar rollback (ver seccion 5.2).
- **Escalado**: si el ratio sigue por encima del umbral 15 min tras mitigacion inicial, escalar a SEV2 y avisar al canal de guardia (seccion 7).

### 4.2 `alarm_latency` - Latencia p95 elevada

- **Umbral**: `http_latency_p95_ms` > `var.alarm_latency_p95_ms` durante 3 periodos de 60s.
- **Sintomas**: respuestas lentas, timeouts intermitentes, degradacion del frontend.
- **Comprobaciones**:
  1. CPU y memoria de instancias `api` y `web` en el dashboard del entorno.
  2. BD: consultas lentas / locks / saturacion de conexiones. Revisar slow queries del motor.
  3. Dependencias externas: latencia de servicios aguas abajo invocados por la api.
  4. Trafico: descartar pico legitimo (campana, bot) revisando RPS.
- **Mitigacion**:
  - Escalar horizontalmente `api` si CPU > 80% sostenida.
  - Reiniciar instancias con fugas de memoria si se confirman.
  - Activar cache de respuesta para `GET /products` si la presion viene de lectura masiva.
  - Si correlaciona con un deploy reciente, rollback (seccion 5.2).
- **Escalado**: SEV2 si p95 supera 2x el umbral o si afecta a mas de un servicio.

### 4.3 `alarm_db_errors` - Errores de conexion a BD

- **Umbral**: `db_connection_errors` > 5 en 2 periodos de 300s.
- **Sintomas**: `/products` devuelve 500; logs `api` con errores de conexion, timeout o auth a BD.
- **Checks**:
  1. **Reglas de red / security group**: subred privada de BD permite trafico desde `api`. Revisar cambios recientes de IaC.
  2. **Credenciales**: el secret `db_password` esta vigente y montado correctamente en `api` (ver modulo `secrets`). Comprobar fecha de ultima rotacion.
  3. **BD viva**: estado del motor (running, no en mantenimiento), espacio en disco, numero de conexiones vs limite.
  4. **DNS / endpoint**: la api resuelve el host de BD correctamente.
- **Recovery**:
  - Si es saturacion de conexiones: ajustar pool en `api` o aumentar `max_connections` de BD.
  - Si es credenciales: re-deploy de `api` para releer el secret; si esta comprometido, rotar (seccion 5.3).
  - Si es red: revertir el ultimo cambio de IaC sobre `network` o `database`.
- **Escalado**: SEV1 si BD esta caida o inaccesible en prod.

## 5. Procedimientos comunes

### 5.1 Ver logs por entorno

Comandos genericos (sustituir al elegir herramienta cloud / aggregator):

```
# Listar logs recientes del servicio api en el entorno <env>
log-cli tail --group "<project>-<env>/app" --filter "service=api" --since 30m

# Filtrar errores
log-cli query --group "<project>-<env>/app" --filter "service=api level=error" --since 1h

# Logs de infraestructura (audit / flow logs)
log-cli tail --group "<project>-<env>/infra" --since 30m
```

Sustituir `log-cli` por `aws logs`, `az monitor log-analytics`, `gcloud logging`, etc., al fijar proveedor.

### 5.2 Rollback de un deploy

1. Identificar la version anterior estable: tag/commit de la ultima release marcada como verde en CI.
2. Lanzar el pipeline de despliegue del entorno apuntando a ese tag.
3. En prod requiere aprobacion humana (gate ya definido).
4. Verificar `GET /health` y dashboard del entorno tras 5 minutos.
5. Confirmar que `alarm_5xx` y `alarm_latency` vuelven a estado OK.
6. Abrir incidente post-mortem (seccion 8) referenciando el commit revertido.

### 5.3 Rotar `db_password`

Referencia: modulo `infra/landing-zone/modules/secrets`.

1. Generar nuevo valor del secret `db_password` en el gestor de secretos del entorno.
2. Actualizar la versionar del secret (sin eliminar la anterior hasta validar).
3. Disparar redeploy de `api` para que recargue el secret.
4. Validar conexion: `GET /products` responde 200 y `alarm_db_errors` permanece OK.
5. Una vez confirmado, marcar la version anterior como obsoleta segun la politica de retencion del modulo `secrets`.
6. Registrar la rotacion (fecha, operador, motivo) en el log de auditoria.

No commitear nunca el valor del secret en codigo ni en este runbook.

## 6. Severidades y escalado

| Severidad | Criterio | Respuesta inicial | Comunicacion |
|---|---|---|---|
| SEV1 | Servicio caido en prod, BD inaccesible, perdida de datos. | <= 15 min | Canal guardia + responsable producto. |
| SEV2 | Degradacion significativa (p95 >> umbral, 5xx sostenido) sin caida total. | <= 30 min | Canal guardia. |
| SEV3 | Anomalia detectada por alarma sin impacto directo al usuario. | <= 4 h habiles | Canal guardia (informativo). |

On-call (placeholder, rellenar con personas reales):

| Rol | Titular | Suplente |
|---|---|---|
| On-call primario api/web | `<pendiente>` | `<pendiente>` |
| On-call BD / datos | `<pendiente>` | `<pendiente>` |
| Manager de incidentes | `<pendiente>` | `<pendiente>` |

## 7. Contactos y canales

Placeholders a sustituir cuando se elija plataforma de mensajeria:

| Proposito | Canal |
|---|---|
| Guardia / alertas automaticas | `#catalog-oncall` (Slack/Teams - pendiente) |
| Coordinacion incidentes | `#catalog-incidents` (Slack/Teams - pendiente) |
| Comunicacion a stakeholders | `#catalog-status` (Slack/Teams - pendiente) |
| Escalado fuera de horario | Telefono de guardia - pendiente |

## 8. Post-incidente

Para cualquier SEV1 o SEV2 se elabora un post-mortem en las 72h siguientes. Checklist minimo:

- [ ] Timeline: deteccion, primera accion, mitigacion, resolucion (con timestamps UTC).
- [ ] Impacto: usuarios afectados, duracion, servicios degradados.
- [ ] Root cause: causa tecnica y causa contribuyente (proceso, organizacion).
- [ ] Que funciono y que no en la respuesta.
- [ ] Action items: cada uno con responsable y fecha objetivo. Convertir en backlog.
- [ ] Revision blameless: foco en sistema y proceso, no en personas.
- [ ] Adjuntar enlaces a logs, dashboards y commits relevantes.
