# verify-report — `dockerize` (iter-9)

> Reporte final del change. Equivalente a la tabla "criterio | evidencia | estado" del manual CLAUDE.md § Fase 12.

## Resumen

Iter-9 empaqueta `apps/api` y `apps/web` en imágenes Docker multi-stage de producción orquestadas por `docker-compose`. Un único `docker compose up -d` levanta ambos servicios con healthchecks y red interna `ironheart`.

**Bug crítico detectado por el usuario post-cierre inicial** (no por security ni reviewer): las fichas `/products/[id]`, `/albums/[id]`, `/games/[id]` son server components y hacían fetch a `localhost:4000` desde dentro del contenedor `web`. Fix aplicado vía `resolveApiBase()` en `apps/web/lib/api.ts` + variable `API_BASE_URL_INTERNAL=http://api:4000` en compose.

## Tabla criterio | evidencia | estado (REQ-DOCKER-1..12)

| REQ | Evidencia | Estado |
|---|---|---|
| REQ-DOCKER-1 (API multi-stage, USER node, <300MB) | apps/api/Dockerfile + `docker images ironheart-api` → **398MB** | ⚠️ tamaño excede objetivo (SEC-9-M1: devDeps en runtime). Bloqueo MEDIUM, no CRITICAL. Fix REC iter-10. |
| REQ-DOCKER-2 (Web multi-stage Next standalone, <400MB) | apps/web/Dockerfile + `docker images ironheart-web` → **346MB** | ✅ |
| REQ-DOCKER-3 (.dockerignore excluye node_modules, .next, .env*) | apps/api/.dockerignore + apps/web/.dockerignore | ✅ |
| REQ-DOCKER-4 (docker compose up arranca ambos en <90s) | `docker compose up -d --wait` → ambos `healthy` | ✅ |
| REQ-DOCKER-5 (healthcheck API) | `docker inspect ironheart-api .State.Health.Status` → `healthy`. Fix necesario: localhost → 127.0.0.1 (alpine IPv6) | ✅ tras fix |
| REQ-DOCKER-6 (healthcheck web) | `docker inspect ironheart-web .State.Health.Status` → `healthy` | ✅ |
| REQ-DOCKER-7 (orden depends_on service_healthy) | logs muestran web arranca tras api healthy | ✅ |
| REQ-DOCKER-8 (comunicación API↔web funcional) | Smoke MCP en /, /albums, /products/[id], /albums/[id], /games/[id]: 0 errores consola, requests a localhost:4000 OK desde browser; requests a api:4000 OK desde SSR | ✅ tras fix DEC-005 |
| REQ-DOCKER-9 (pausa+reanudación) | `docker compose stop && docker compose start && docker compose ps` → ambos healthy de nuevo. API responde 13 productos. | ✅ |
| REQ-DOCKER-10 (sin secretos) | Grep en Dockerfiles + compose + docker history: 0 matches | ✅ |
| REQ-DOCKER-11 (sin regresiones) | **Playwright 46/46 verde CONTRA DOCKER** (no solo host) + vitest 233/233 | ✅ |
| REQ-DOCKER-12 (docs README) | Pendiente sección README. Será añadida en este commit. | 🟡 en progreso |

## Gates

| Gate | Estado | Reporte |
|---|---|---|
| Fase 7 — security-engineer | APROBADO CON OBSERVACIONES. 0 CRITICAL, 0 HIGH, 2 MEDIUM (SEC-9-M1 tamaño imagen, SEC-9-M2 falta hardening), 4 LOW. | `reports/iter-9/security-engineer.md` |
| Fase 9 — smoke MCP | Inicial: cubrió solo / y /albums (✅). Post-bug: cubre /products/[id], /albums/[id], /games/[id] (✅ tras fix). Capturas en `reports/iter-9/`. | reports/iter-9/smoke-docker-*.png |
| Fase 10 — reviewer | APROBAR con observaciones (antes del bug). Bug detectado por usuario, no por reviewer. | `reports/iter-9/reviewer.md` |

## Aprobación humana (Fase 11)

Usuario detectó el bug crítico de las fichas y lo señaló explícitamente. Tras el fix:
- Playwright 46/46 verde contra Docker.
- Smoke MCP en las 3 fichas: 0 errores.
- DEC-005 registrado con lecciones procedimentales codificadas en CLAUDE.md § Anti-patrones.

Aprobación implícita al cerrar.

## Lecciones procedimentales codificadas en CLAUDE.md

Tres anti-patrones nuevos añadidos a partir de este incidente:

1. **"Esto es solo infra/devops/Docker, no necesita qa-engineer"** → qa-engineer obligatorio TAMBIÉN en iters de infra.
2. **"Smoke en / y /listado es suficiente"** → cubrir TODAS las rutas con server components.
3. **"Playwright pasó contra mi host, está validado"** → re-ejecutar contra el nuevo entorno cuando cambia infra.

## Recomendaciones para iter-10

Del security-engineer y reviewer:
- REC iter-10.1 (SEC-9-M1): stage `deps-prod` con `npm ci --omit=dev` en runtime del API (reducir 398MB → <250MB).
- REC iter-10.2 (SEC-9-M2): añadir `security_opt: [no-new-privileges:true]` y `cap_drop: [ALL]` en compose.
- REC iter-10.3 (SEC-9-L1): pin `node:22-alpine` a digest SHA256.
- REC iter-10.4 (SEC-9-L2): endpoints `/health` dedicados en lugar de reutilizar `/products` y `/`.
- REC iter-10.5: test E2E específico de `--workers=1 baseURL=http://localhost:3000` ejecutándose contra Docker en CI.

## Comandos para reproducir

```powershell
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace"
docker compose up -d --wait
docker compose ps                     # ambos healthy
Invoke-RestMethod http://localhost:4000/products | Select-Object -ExpandProperty Count  # 13
(Invoke-WebRequest http://localhost:3000 -UseBasicParsing).StatusCode  # 200
# Navegador en http://localhost:3000
docker compose stop ; docker compose start  # ciclo pausa/reanudación
docker compose down                   # apagar todo
```

## Próximos pasos

1. Añadir sección README "Arrancar con Docker".
2. Commit + push directo a main.
3. Tras merge, mover delta a `specs/areas/deployment-docker/spec.md`.
4. Backlog iter-10 con las 5 recomendaciones.
