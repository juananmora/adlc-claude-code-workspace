# Delta — `deployment-docker` (nueva área)

> Tras `/ship` y merge, los `## ADDED Requirements` se moverán a `specs/areas/deployment-docker/spec.md` (nuevo).

## ADDED Requirements

### REQ-DOCKER-1: Dockerfile multi-stage para la API

Given el código de `apps/api`,
when se ejecuta `docker build -t ironheart-api ./apps/api`,
then el build MUST completar sin errores y producir una imagen con:
- base `node:22-alpine`,
- usuario no-root (`USER node`),
- comando de arranque `node dist/server.js`,
- puerto expuesto 4000,
- tamaño final <300 MB.

**Validación:** `docker build` + `docker images ironheart-api`.

### REQ-DOCKER-2: Dockerfile multi-stage para el frontend

Given el código de `apps/web` con `output: "standalone"` en `next.config.mjs`,
when se ejecuta `docker build -t ironheart-web ./apps/web`,
then el build MUST completar sin errores y producir una imagen con:
- base `node:22-alpine`,
- standalone copy (`.next/standalone` + `.next/static` + `public`),
- usuario no-root,
- comando `node server.js`,
- puerto expuesto 3000,
- variable `HOSTNAME=0.0.0.0` para escuchar en todas las interfaces,
- tamaño final <400 MB.

**Validación:** `docker build` + `docker images ironheart-web`.

### REQ-DOCKER-3: `.dockerignore` previene fuga de artefactos del host

Given un repo con `node_modules/`, `.next/`, `dist/`, `.env.local`,
`test-results/` en local,
when se construye cualquier imagen,
then el contexto de build MUST excluir esos directorios.

**Validación:** existencia de `apps/api/.dockerignore` y `apps/web/.dockerignore` con los patrones del design.

### REQ-DOCKER-4: `docker compose up -d` arranca ambos servicios

Given el repo en estado limpio sin imágenes preconstruidas,
when se ejecuta `docker compose up -d --build`,
then el comando MUST completar y ambos servicios SHALL aparecer como `healthy` en `docker compose ps` en <90 segundos tras finalizar el build.

**Validación:** `docker compose up -d --build && docker compose ps`.

### REQ-DOCKER-5: Healthcheck de la API

Given el contenedor `ironheart-api` arrancado,
when Docker ejecuta el healthcheck cada 10s tras 30s de gracia,
then la API SHALL responder `GET /products` con status 200 desde dentro del contenedor.

**Validación:** `docker inspect ironheart-api --format='{{.State.Health.Status}}'` devuelve `healthy`.

### REQ-DOCKER-6: Healthcheck del frontend

Given el contenedor `ironheart-web` arrancado tras `api`,
when Docker ejecuta el healthcheck cada 10s tras 45s de gracia,
then el frontend SHALL responder `GET /` con status 200 desde dentro.

**Validación:** `docker inspect ironheart-web --format='{{.State.Health.Status}}'` devuelve `healthy`.

### REQ-DOCKER-7: Orden de arranque

Given el servicio `web` declara `depends_on: api: condition: service_healthy`,
when se hace `docker compose up`,
then `web` MUST NO arrancar hasta que `api` esté `healthy`.

**Validación:** timestamps de `docker inspect` confirman que `web.State.StartedAt` > `api.State.Health.Status=healthy`.

### REQ-DOCKER-8: Comunicación API↔web funcional

Given ambos contenedores `healthy`,
when un navegador en el host abre `http://localhost:3000/`,
then la página MUST cargar con productos servidos por `http://localhost:4000/products` sin errores en consola.

**Validación:** smoke MCP con Chrome DevTools en `/` y `/about`.

### REQ-DOCKER-9: Pausa y reanudación

Given ambos contenedores en estado `healthy`,
when el usuario ejecuta `docker compose stop` y después `docker compose start`,
then ambos servicios SHALL volver a estado `healthy` en <90 segundos sin rebuild.

**Validación:** `docker compose stop && docker compose start && docker compose ps`.

### REQ-DOCKER-10: Sin secretos en código ni en imágenes

Given las imágenes construidas,
when un auditor inspecciona Dockerfiles, compose, o `docker history`,
then NO MUST aparecer ningún secreto, token o credencial. Las variables sensibles SHALL inyectarse en runtime vía `environment:` o `.env` no versionado.

**Validación:** grep en `apps/*/Dockerfile` y `docker-compose.yml` por `(api[_-]?key|token|secret|password|bearer)`: 0 matches.

### REQ-DOCKER-11: Sin regresiones funcionales

Given el código del repo,
when se ejecutan vitest y Playwright contra el host (no Docker),
then la suite SHALL seguir verde (233/233 vitest, 46/46 Playwright). Dockerizar es aditivo.

**Validación:** ejecución completa de la suite.

### REQ-DOCKER-12: Documentación clara para arrancar

Given un dev con Docker instalado y el repo clonado,
when lee la sección "Arrancar con Docker" del `README.md`,
then SHALL poder arrancar la aplicación con un único comando documentado y acceder a `http://localhost:3000`.

**Validación:** sección presente en README con bloques ejecutables tal cual.
