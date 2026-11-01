# Investigación técnica: verificación de arranque local del API

## Alcance y fuentes

Se contrastaron la constitución, la especificación aprobada, `apps/api/README.md`, `apps/api/package.json`, `src/config.ts`, `src/server.ts`, `src/app.ts`, configuración TypeScript/Vitest y el test existente de health. Los resultados estáticos se complementan con evidencia de ejecución registrada por los eventos controlados T001–T007 en `task-trace.jsonl`.

## Hallazgos y resolución

| Tema | Hallazgo/evidencia | Consecuencia |
|---|---|---|
| Stack y scripts | API Node.js + TypeScript + Fastify 5/ESM. `package.json` define `dev`, `build`, `start` y `test`. | Se documentan los scripts existentes con `--prefix apps/api`; no se añaden wrappers. |
| Build | `tsc -p tsconfig.json`, salida en `dist`. T004 registra build satisfactorio y `apps/api/dist/server.js`. | El build observado se informa separado del listener. |
| Tests | Vitest; el health usa `app.inject()`. T006 registra `npm test --prefix apps/api` satisfactorio: 6 archivos, 511 tests. | Los tests no se presentan como evidencia de socket/listener. |
| Server y health | `server.ts` inicia `app.listen`, maneja SIGINT/SIGTERM y reporta `shutting down`; `GET /health` responde `{ "status": "ok" }`. | T003 y T004 registran HTTP 200 y el JSON exacto en ambos modos; SIGINT registró `shutting down`. |
| Configuración | `HOST` default `0.0.0.0`, `PORT` default `4000`; el puerto no vacío debe ser válido. | README documenta defaults, overrides y el destino alcanzable para HOST configurado. |
| `PORT` vacío | T001 registra aprobación humana y actualización de la spec: vacío equivale a no especificado y usa 4000. Coincide con `src/config.ts`. | La discrepancia quedó resuelta; no se cambió código. |
| Archivo de entorno | `apps/api/.env.example` no está presente en el checkout. | La guía no requiere copiarlo. |
| Runtime local | El manifiesto no fija `engines`; Dockerfile usa Node 22 pero no determina requisito local. | Se indica Node/npm compatibles sin prometer una versión específica. |
| HTTP client | El comando `curl` forma parte de la guía aprobada, pero la imagen de validación no contiene curl. T003/T004 registran solicitudes reales mediante `fetch` integrado de Node. | La prueba HTTP se ejecutó; no se afirma que se haya ejecutado curl. |
| Alcance | T005 mantiene disclaimer para `apps/web`, Docker Compose, Terraform y harnesses Python. | Resultados limitados a `apps/api`; las otras capas no se declaran validadas. |
| Diff | T007 registra `git diff --check` satisfactorio y ausencia de cambios en código, tests, manifests/lockfiles, runtime o infraestructura. | La feature es documental, junto con la actualización aprobada de la spec y metadatos de tareas/trace controlados. |

## Comandos y resultados observados

- `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`: documentado como comando configurado; no hay evento T001–T007 que registre su ejecución.
- `npm run build --prefix apps/api`: pasó; emitió `apps/api/dist/server.js` (T004).
- `npm test --prefix apps/api`: pasó; 6 archivos de test, 511 tests (T006).
- `npm run dev --prefix apps/api`: solicitud en vivo a `127.0.0.1:4000/health`, HTTP 200 y `{"status":"ok"}`; SIGINT y `shutting down` (T003).
- `npm start --prefix apps/api`: tras build, solicitud en vivo a la misma ruta, HTTP 200 y `{"status":"ok"}`; SIGINT y `shutting down` (T004).
- La imagen no incluye `curl`; las solicitudes observadas se realizaron con `fetch` de Node. Esto es evidencia de HTTP equivalente para la verificación, no evidencia de ejecución del comando curl.

## Decisiones

1. Usar comandos y scripts existentes del API y no añadir dependencias.
2. Requerir request HTTP a proceso independiente además de build/tests, porque `app.inject()` no prueba el listener.
3. Mantener el requisito local de Node como compatibilidad del paquete, sin inferir versión desde Docker.
4. No requerir `.env.example`, que está ausente.
5. Documentar `PORT=""` como fallback a 4000, siguiendo el cambio de spec aprobado en T001 y el código existente; no modificar comportamiento.

## Límites

La evidencia registrada cubre solo `apps/api`: build, tests y respuestas HTTP de los modos desarrollo y compilado. No se ejecutó el comando de instalación según los eventos citados, ni se comprobó el comando `curl` (no instalado). No se afirma validación de `apps/web`, Docker Compose, Terraform, despliegues o harnesses Python. La discrepancia editorial entre el estado humano registrado de la constitución y su encabezado local no se resuelve aquí ni autoriza su publicación.
