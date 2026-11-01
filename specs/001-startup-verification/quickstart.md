# Quickstart: API local

Este procedimiento está diseñado para ejecutarse desde la raíz del repositorio. Describe comandos existentes; en esta etapa no se han ejecutado. Node.js y npm deben estar instalados en versiones compatibles con el paquete y el lockfile. `apps/api/package.json` no fija una versión local (`engines`); no se deriva una versión del Dockerfile. Para la comprobación en vivo se necesita `curl` o un cliente HTTP equivalente.

## Instalar, compilar y probar (API únicamente)

```bash
npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund
npm run build --prefix apps/api
npm test --prefix apps/api
```

La compilación TypeScript genera artefactos en `apps/api/dist/` de acuerdo con `apps/api/tsconfig.json`. El build y los tests son checks de la API; por sí solos no comprueban que el proceso standalone esté escuchando.

## Modo desarrollo

En una terminal, desde la raíz:

```bash
npm run dev --prefix apps/api
```

Con el proceso todavía activo, desde otra terminal:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

El criterio de éxito es observar estado HTTP **200** y cuerpo JSON exacto:

```json
{"status":"ok"}
```

Detén el proceso foreground con Ctrl+C. El código instala manejadores de SIGINT/SIGTERM, registra `shutting down` e intenta cerrar Fastify. La presencia de ese mensaje no sustituye el resultado de la petición HTTP.

## Modo compilado

Después de un build satisfactorio y con el puerto libre, inicia:

```bash
npm start --prefix apps/api
```

En otra terminal, mientras sigue activo:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

Inspecciona de nuevo HTTP 200 y `{ "status": "ok" }`, y luego detén el proceso con Ctrl+C. Ejecuta las dos modalidades secuencialmente para no competir por el puerto predeterminado.

## Configuración y errores

- Defaults desde `apps/api/src/config.ts`: `HOST=0.0.0.0` y `PORT=4000`. Pueden configurarse `HOST` y `PORT`; el puerto debe estar entre 1 y 65535 según la validación del código. Si HOST se limita a una dirección que no alcanza loopback, ajusta el destino HTTP a una dirección accesible para esa interfaz.
- Si el puerto está ocupado, el server no consiguió arrancar aunque el build/tests pasen. Libera el puerto o elige un `PORT` válido distinto y apunta el cliente a ese puerto.
- Puerto fuera del rango o valor no numérico puede hacer fallar la configuración/arranque; revisa el error reportado. Los errores de bind/listen y la falta de respuesta HTTP son fallos de esta comprobación.
- **Aclaración previa a implementar:** el código actual considera `PORT=""` como no especificado y aplica el default 4000. La spec aprobada dice que vacío falla. Este quickstart registra el comportamiento del código inspeccionado, pero no resuelve el requisito aprobado; una persona debe aclarar la spec antes de implementar/cerrar.
- La ausencia o incompatibilidad de Node.js/npm es un bloqueo del entorno, no evidencia de que el servicio arranque.
- No copies `.env.example`: ese archivo no aparece en el checkout inspeccionado.

## Alcance de resultados

Los comandos anteriores están limitados a `apps/api`. No validan ni implican validación de `apps/web`, Docker Compose, Terraform, despliegues ni harnesses Python. Los tests del API usan `app.inject()` para probar manejadores dentro de Fastify y no sustituyen el request HTTP contra el server standalone.