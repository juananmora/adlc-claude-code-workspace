---
name: observability-design
description: Diseña logs estructurados (pino vía Fastify), métricas + trazas en Application Insights, dashboards, alertas con runbooks y SLOs por entorno. Define variables del módulo Terraform observability/ sin loguear secretos ni PII.
when_to_use: Cuando hay que añadir monitorización, métricas, logs, alertas, dashboards, SLOs o runbooks. También cuando entra en operación una nueva área del catálogo y hay que instrumentar.
allowed-tools: Read Write Edit Grep Glob
---

# Skill: Observability Design

Skill prescriptiva. Stack canónico del repo: pino (Fastify) + Application Insights + Log Analytics + Action Group + Metric Alerts.

## Señales obligatorias

### Logs (pino)

Fastify ya carga pino. Convenciones:

- Cada request loguea: `req.id`, `req.method`, `req.url`, `req.headers.host`, status, duration. **Nunca** `Authorization`, `Cookie`, `Set-Cookie`, body con secrets.
- Errores 5xx van por `app.log.error(error)` (ya en `app.ts`).
- Logs de negocio explícitos cuando ayudan al troubleshooting:
  ```ts
  request.log.info({ event: "filter_applied", area: "consoles", filter: { generation }, count });
  ```

### Métricas (App Insights / Container Apps integration)

| Métrica | Tipo | Etiquetas | Threshold prod |
|---|---|---|---|
| `http_requests_total` | counter | route, status | — |
| `http_request_duration_seconds` | histogram | route | p95 < 500ms |
| `http_errors_5xx_ratio` | derived (request_failed/requests) | route | < 1% |
| `db_connection_errors_total` | counter | — | 0 sostenido |
| `api_cold_start_duration_ms` | gauge | replica_name | < 2000ms |
| `container_app_replicas_active` | gauge | revision | — |

### Trazas

App Insights distributed tracing por defecto en Container Apps con el SDK Node oficial. Spans nombrados por route. Correlation ID propagado entre frontend ↔ API si añades `traceparent` desde el frontend.

## SLOs por entorno

| SLO | dev | pre | prod | Ventana |
|---|---|---|---|---|
| Disponibilidad 2xx+3xx | 99.0% | 99.5% | 99.9% | 30d rolling |
| Latencia p95 GET listado | 2000ms | 1000ms | 500ms | 30d |
| Error rate 5xx | <10% | <5% | <1% | 7d |
| Healthcheck `/health` | 99% | 99.5% | 99.95% | 30d |

Cada SLO con error budget definido. Cuando se queme, freeze de deploys no críticos.

## Alertas (Action Group + Metric Alerts en Terraform)

Plantilla por alerta:

```markdown
### <ALERT_NAME>

- **Significa**: <una frase>.
- **Umbral**: <métrica> <comparador> <valor> sostenido <ventana>.
- **Severity**: 1 | 2 | 3.
- **Acciones**: webhook a #ops-channel + email + (si sev 1) PagerDuty.
- **Runbook**: docs/runbooks/<alert-name>.md.
- **Propietario**: <agente o persona>.
- **Resolución**: <criterio para cerrar el incidente>.
```

Mínimo obligatorio:

1. `api-5xx-high` — sev 1 — 5xx > threshold sostenido 5 min.
2. `api-latency-p95-high` — sev 2 — p95 > threshold sostenido 10 min.
3. `db-connection-errors` — sev 1 — errores DB > threshold en 5 min.
4. `healthcheck-down` — sev 1 — `/health` != 200 durante 2 min.

## Runbooks (uno por alerta)

`docs/runbooks/<alert-name>.md`:

```markdown
# Runbook: <ALERT_NAME>

## Qué significa
<una frase>

## Comprobaciones iniciales
1. ¿La aplicación está corriendo? Revisar Container Apps replicas.
2. ¿Hay deploy reciente? `gh run list --workflow=deploy.yml --limit=5`
3. KQL en Log Analytics:
   ```kql
   AppRequests | where TimeGenerated > ago(15m) and Success == false
   | summarize count() by Name, ResultCode | order by count_ desc
   ```

## Posibles causas
- Deploy con regresión.
- BD inaccesible (Private Endpoint roto).
- Burst de tráfico.

## Mitigación primera línea
- Rollback al artefacto anterior (`gh workflow run deploy.yml -f environment=prod` con el artefacto anterior).
- Si BD: comprobar Private Endpoint, NSGs.

## Escalado
Si no mejora en 15 min → escalar al on-call de plataforma.
```

## Variables que pasa al terraform-engineer (módulo observability/)

```hcl
variable "log_retention_days"        { type = number }   # 30 / 60 / 365
variable "alarm_5xx_threshold_pct"   { type = number }   # 10 / 5 / 1
variable "alarm_latency_p95_ms"      { type = number }   # 2000 / 1000 / 500
variable "alarm_db_errors_threshold" { type = number }   # 10
variable "alert_webhook_url"         { type = string }   # webhook ops
```

## Comandos de validación

```powershell
# No se loguean secretos / PII (heurística)
git grep -nE 'log\.(info|warn|error|debug)\(.*(authorization|cookie|password|token|secret|email)' apps/

# KQL en Azure Portal → Log Analytics
# AppRequests | summarize p50=percentile(DurationMs, 50), p95=percentile(DurationMs, 95) by Name
# AppExceptions | summarize count() by OuterMessage | top 10 by count_
```

## Reglas duras

- Cada alerta exige runbook + propietario.
- Nada de PII en logs (emails, nombres reales no notorios, IDs personales).
- Umbrales explícitos por env, no "lo que sea". Justifica los de prod con datos.
- Action Groups separados por env (dev no spamea #ops-prod-incidents).
- Trazas con `traceparent` propagado en cross-service calls.

## Anti-patrones

- "Logueo todo y luego filtro" → riesgo de secretos. Filtra en origen.
- Alertas sin runbook → nadie sabe qué hacer.
- Mismos umbrales en dev y prod → demasiado sensibles en dev, demasiado laxos en prod.
- Dashboards genéricos sin desglose por área (`/products`, `/albums`, `/games`, `/consoles`) — la mayoría de incidents son area-específicos.
