# Tasks — `dockerize`

## Phase 1 — Preparación del frontend

- [ ] 1.1 Editar `apps/web/next.config.mjs` añadiendo `output: "standalone"`. Verificar que `npm run build` sigue funcionando localmente.

## Phase 2 — Dockerfiles + dockerignore

- [ ] 2.1 Crear `apps/api/.dockerignore` con los patrones del design.
- [ ] 2.2 Crear `apps/api/Dockerfile` multi-stage (deps + build + runtime).
- [ ] 2.3 Crear `apps/web/.dockerignore`.
- [ ] 2.4 Crear `apps/web/Dockerfile` multi-stage con standalone output.

## Phase 3 — docker-compose

- [ ] 3.1 Crear `docker-compose.yml` en la raíz con servicios `api` y `web`, red `ironheart`, healthchecks, `depends_on` con `service_healthy`.

## Phase 4 — Build y smoke

- [ ] 4.1 `docker compose build` desde la raíz. Esperado: ambas imágenes construidas sin warnings.
- [ ] 4.2 `docker images` verificar tamaños: api <300MB, web <400MB.
- [ ] 4.3 `docker compose up -d --wait` (espera healthchecks). Esperado: ambos `healthy` en <90s.
- [ ] 4.4 `curl http://localhost:4000/products` → 200 con JSON.
- [ ] 4.5 `curl http://localhost:3000` → 200 con HTML.
- [ ] 4.6 Smoke MCP en `http://localhost:3000/about` o `/albums`: 0 errores consola, 0 4xx/5xx en network.
- [ ] 4.7 `docker compose stop && docker compose start && docker compose ps` → ambos healthy de nuevo.

## Phase 5 — Gates

- [ ] 5.1 Lanzar `security-engineer` con `security-review` sobre Dockerfiles, compose, base images. Esperado: 0 HIGH/CRITICAL. Reporte en `reports/iter-9/security-engineer.md`.
- [ ] 5.2 Lanzar `reviewer` con `review-pr` end-to-end. Reporte en `reports/iter-9/reviewer.md`. Veredicto APROBAR obligatorio.

## Phase 6 — Documentación

- [ ] 6.1 Añadir sección "Arrancar con Docker" al `README.md` con bloques ejecutables.
- [ ] 6.2 `verify-report.md` con tabla criterio | evidencia | estado.
- [ ] 6.3 Registrar DEC-005 en `openspec/config.yaml § history.decisions[]`.

## Phase 7 — Cierre

- [ ] 7.1 Auditoría criterio por criterio en `specs/deployment-docker.md`.
- [ ] 7.2 Verificación de regresión: vitest 233/233 + Playwright 46/46 (contra host, sin Docker).
- [ ] 7.3 Commit + push directo a main siguiendo el patrón de iteraciones anteriores.
- [ ] 7.4 Tras merge, mover delta a `specs/areas/deployment-docker/spec.md` (nuevo).
