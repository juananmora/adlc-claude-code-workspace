## Skills ejecutadas
- Skill(skill: "security-review") → aplicada (containerización)

## Resumen ejecutivo

**Veredicto: APROBADO CON OBSERVACIONES**

El delta de iter-9 (`dockerize`) cumple los controles de seguridad fundamentales sobre containerización:
no hay secretos hardcodeados, ambos Dockerfiles corren como `USER node` (no-root), se usa base pinneada
`node:22-alpine`, multi-stage minimiza superficie, `.dockerignore` excluye artefactos y `.env*` locales,
los healthchecks están definidos, no se usa `privileged`, `network_mode: host` ni monturas de paths
sensibles del host, y CORS_ORIGIN se inyecta con orígenes explícitos (sin wildcard `*`). El gap relevante
es el tamaño de la imagen API (398 MB vs. objetivo `<300 MB` del REQ-DOCKER-1), causado por copiar
`node_modules` completo del stage `deps` (incluye devDeps), lo cual además incrementa innecesariamente
la superficie de dependencias en runtime — se clasifica MEDIUM (deuda de hardening) y NO bloquea el
gate, pero debe documentarse y plantearse fix en próxima iteración.

**Conteo: 0 CRITICAL, 0 HIGH, 2 MEDIUM, 4 LOW**

---

## Findings detallados

| ID | Severidad | Categoría | Archivo:línea | Hallazgo | Recomendación | Riesgo residual |
|----|-----------|-----------|---------------|----------|---------------|------------------|
| SEC-9-M1 | MEDIUM | Superficie de ataque / tamaño | apps/api/Dockerfile:5,20 | El stage `deps` ejecuta `npm ci` (incluye devDeps) y el stage `runtime` copia ese `node_modules` completo. Esto explica los 398 MB (>300 MB objetivo del REQ-DOCKER-1) e incrementa la superficie de dependencias presentes en producción. | Añadir un stage `deps-prod` con `npm ci --omit=dev --ignore-scripts` y `COPY --from=deps-prod /app/node_modules ./node_modules` en runtime. Mantener el actual solo para el build. | Bajo: las devDeps en runtime no se ejecutan, pero amplían el área de CVEs y violan el principio de mínima superficie. |
| SEC-9-M2 | MEDIUM | Hardening del contenedor | docker-compose.yml (todo) | Faltan opciones de hardening estándar en compose: `read_only: true` para el FS de runtime, `cap_drop: [ALL]`, `security_opt: [no-new-privileges:true]`, y `mem_limit` / `pids_limit`. | Añadir, al menos: `security_opt: ["no-new-privileges:true"]` y `cap_drop: ["ALL"]` a ambos servicios. `read_only` requiere validar que Next/Fastify no escriban en disco; si necesitan tmp, añadir `tmpfs`. | Bajo en dev/local; relevante si el compose se reutiliza en entornos compartidos. |
| SEC-9-L1 | LOW | Pin de imagen | apps/api/Dockerfile:2,8,15 — apps/web/Dockerfile:2,8,17 | `node:22-alpine` está pinneado por major+variante, pero no por digest SHA256. Un repush del tag upstream cambiaría la imagen base sin auditoría. | Pin por digest: `FROM node:22-alpine@sha256:<digest>`. Renovable con dependabot/renovate. | Bajo: el tag `22-alpine` no es mutable de forma silenciosa para versiones LTS publicadas, pero podría serlo en teoría. |
| SEC-9-L2 | LOW | Healthcheck calidad | docker-compose.yml:14,39 | El healthcheck de la API hace `wget --spider /products`, válido pero acoplado a un endpoint funcional. El de web hace `wget --spider /` (página completa). Ambos funcionan, pero no son healthchecks dedicados. | Considerar exponer `/health` ligero en la API y un endpoint similar en web. Para esta iteración es suficiente. | Bajo. |
| SEC-9-L3 | LOW | Defensa en profundidad | apps/api/Dockerfile, apps/web/Dockerfile | No se setea `ENV NODE_OPTIONS=--disable-proto=delete` ni se restringe `npm` (no relevante en runtime, pero `npm` sigue presente porque viene en la imagen base). | Opcionalmente eliminar npm/yarn del runtime stage o usar `node:22-alpine-slim` cuando esté disponible. | Muy bajo: USER node ya limita lo que puede hacer un atacante. |
| SEC-9-L4 | LOW | Información en build args | apps/web/Dockerfile:12-13 — docker-compose.yml:26-27 | `NEXT_PUBLIC_API_BASE_URL` se pasa como `ARG` y queda en `docker history`. Es público por diseño (variable `NEXT_PUBLIC_*` se inserta en bundle cliente), pero **conviene documentar explícitamente** que NUNCA debe usarse este patrón con secretos. | Añadir comentario en Dockerfile: `# ARG seguro solo para NEXT_PUBLIC_*. Nunca pasar secretos por ARG.` | Muy bajo, pero previene errores futuros. |

### Resumen contra REQ-DOCKER-*

| REQ | Cumple | Evidencia | Notas |
|-----|--------|-----------|-------|
| REQ-DOCKER-1 (API multi-stage, node:22-alpine, USER node, <300MB) | PARCIAL | Dockerfile líneas 2,8,15,23,24. `docker images` reporta 398MB. | Tamaño NO cumple. Resto OK. Ver SEC-9-M1. |
| REQ-DOCKER-2 (web multi-stage, standalone, USER node, <400MB) | OK | Dockerfile líneas 22-27. `docker images` 346MB. | OK. |
| REQ-DOCKER-3 (.dockerignore) | OK | apps/{api,web}/.dockerignore incluye node_modules, .next, dist, .env*.local, test-results, .git. | OK. |
| REQ-DOCKER-4 (`docker compose up -d` healthy) | OK | Preverificación: ambos containers Healthy tras `--wait`. | OK. |
| REQ-DOCKER-5 (healthcheck API) | OK | docker-compose.yml:13-18. Smoke devuelve healthy. | OK. |
| REQ-DOCKER-6 (healthcheck web) | OK | docker-compose.yml:38-43. Smoke devuelve healthy. | OK. |
| REQ-DOCKER-7 (`depends_on: service_healthy`) | OK | docker-compose.yml:35-37. | OK. |
| REQ-DOCKER-8 (comunicación web↔API) | OK | Preverificación: / y /albums sin errores de consola, network 200. | OK. |
| REQ-DOCKER-9 (pausa/reanudación) | OK | Preverificación: stop+start → healthy. | OK. |
| REQ-DOCKER-10 (sin secretos) | OK | Grep `(api[_-]?key|token|secret|password|bearer)` en Dockerfile,*.yml,*.yaml,.dockerignore: 0 matches en el delta. `docker history` solo expone `NEXT_PUBLIC_*` por diseño. | OK. |
| REQ-DOCKER-11 (sin regresiones) | NA en este gate | Validado por qa-engineer. | — |
| REQ-DOCKER-12 (documentación) | NA en este gate | Validado por reviewer. | — |

### Buenas prácticas Docker auditadas

- USER no-root en runtime: OK en ambos (apps/api/Dockerfile:23, apps/web/Dockerfile:26).
- Base image versionada: OK (`node:22-alpine` en los 4 stages relevantes).
- Multi-stage: OK (deps → build → runtime en ambos).
- devDeps en runtime: PROBLEMA (SEC-9-M1) — node_modules del stage `deps` se copia tal cual.
- .dockerignore excluye node_modules, .next, .env*.local, .git, test-results, dist: OK.
- COPY de secretos: ausente.
- ARG con secretos: ausente. Solo `NEXT_PUBLIC_API_BASE_URL` (público por diseño).
- HEALTHCHECK: presente en compose (no en Dockerfile, válido y preferido en compose).
- `privileged: true` / `network_mode: host` / `cap_add` / docker.sock: ausentes (grep 0 matches).
- Volúmenes sensibles del host montados: ninguno.
- Puertos: solo 3000 y 4000 publicados (necesarios). No hay exposición innecesaria.
- CORS: `CORS_ORIGIN: "http://localhost:3000,http://web:3000"` — orígenes explícitos, sin `*`. OK.

---

## Salida de greps + preverificación citada

### Grep secretos en delta (orquestador, preverificado y reproducido aquí)

```
$ grep -rEi "(api[_-]?key|token|secret|password|bearer)" apps/api/Dockerfile apps/web/Dockerfile docker-compose.yml
(0 matches)
```

### Grep hardening de compose (verificado en este gate)

```
$ grep -E "privileged|network_mode.*host|cap_add|/var/run/docker.sock" docker-compose.yml
No matches found
```

### Grep CORS_ORIGIN

```
docker-compose.yml:12:      CORS_ORIGIN: "http://localhost:3000,http://web:3000"
```
→ Orígenes explícitos. Sin wildcard.

### Preverificación del orquestador (citada literal)

- Build:
  ```
  Image adlc-claude-code-workspace-api Built
  Image adlc-claude-code-workspace-web Built
  ```
- Tamaños:
  ```
  adlc-claude-code-workspace-web  latest  346MB
  adlc-claude-code-workspace-api  latest  398MB
  ```
- Up con healthchecks:
  ```
  Container ironheart-api  Healthy
  Container ironheart-web  Healthy
  ```
- Pausa/reanudación: ambos Healthy tras `stop` + `start`.
- Smoke web `/` y `/albums`: 0 errores consola, network 200, llamadas a `http://localhost:4000/*` OK.
- Healthcheck fix IPv6→IPv4 (`localhost` → `127.0.0.1`) ya aplicado: NO es un finding de seguridad,
  es un fix de robustez operacional documentado.

---

## Mitigaciones y riesgo residual

- **SEC-9-M1 (tamaño/devDeps en runtime):** mitigación = añadir stage `deps-prod` con `npm ci --omit=dev --ignore-scripts`.
  Riesgo residual sin fix: superficie de CVEs ampliada por devDeps no ejecutadas pero presentes en disco.
  No bloqueante para iter-9, pero recomendado en próxima iteración.
- **SEC-9-M2 (hardening compose):** mitigación = añadir `security_opt: ["no-new-privileges:true]`, `cap_drop: ["ALL"]`.
  Riesgo residual sin fix: en local/dev mínimo. Si se reutiliza compose en entornos compartidos, escalar a HIGH.
- **SEC-9-L1..L4:** oportunidades de mejora, riesgo residual muy bajo en contexto local.

---

## Próximos pasos

1. Aceptar veredicto APROBADO CON OBSERVACIONES para iter-9.
2. Crear tareas de deuda técnica de seguridad (NO bloqueantes) en backlog:
   - `SEC-9-M1` Stage `deps-prod` con `--omit=dev` para reducir API <300MB y minimizar superficie.
   - `SEC-9-M2` Añadir `security_opt: no-new-privileges` y `cap_drop: ALL` en compose.
3. (Opcional, baja prio) Documentar en `apps/web/Dockerfile` que el patrón ARG solo aplica a `NEXT_PUBLIC_*`.
4. El gap REQ-DOCKER-1 (`tamaño <300MB`) debe reflejarse como rojo no bloqueante en la tabla de criterios.
5. Antes de cualquier despliegue productivo (fuera de este iter), revisar:
   - Pin por digest de la base image (SEC-9-L1).
   - Endpoint `/health` dedicado en la API (SEC-9-L2).
   - Gestión de secretos vía secret manager / env-file no versionado (REQ-DOCKER-10 ya OK para local).

Reporte en reports/iter-9/security-engineer.md.
