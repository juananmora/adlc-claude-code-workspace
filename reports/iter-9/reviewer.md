# Reviewer — Iter-9 (dockerize)

## Skills ejecutadas
- Skill(skill: "review-pr") → aplicada

## Veredicto
**APROBAR** con observaciones no bloqueantes. La dockerización funciona end-to-end (ambos containers healthy, smoke OK, restart < 60s). El único objetivo no cumplido es el tamaño de la imagen API (398MB vs <300MB), clasificado como MEDIUM no bloqueante porque no afecta funcionalidad ni seguridad.

## Auditoría REQ-DOCKER-1..12

| REQ | Estado | Evidencia |
|---|---|---|
| REQ-DOCKER-1 (imágenes ligeras, objetivo <300MB) | ⚠️ PARCIAL | api 398MB excede objetivo; web 346MB también lo excede ligeramente. Multi-stage aplicado, base alpine OK. |
| REQ-DOCKER-2 (multi-stage build) | ✅ OK | 3 stages (deps/build/runtime) en ambos Dockerfiles. |
| REQ-DOCKER-3 (no-root user) | ✅ OK | `USER node` en runtime stage de api y web. |
| REQ-DOCKER-4 (Next.js standalone) | ✅ OK | `output: "standalone"` en next.config.mjs; runtime copia `.next/standalone` + `.next/static` + `public`. |
| REQ-DOCKER-5 (compose orquesta ambos) | ✅ OK | docker-compose.yml define api + web en red `ironheart`. |
| REQ-DOCKER-6 (healthchecks) | ✅ OK | Ambos servicios con healthcheck wget contra 127.0.0.1; ambos healthy. |
| REQ-DOCKER-7 (depends_on service_healthy) | ✅ OK | web depende de `api: service_healthy`. |
| REQ-DOCKER-8 (CORS configurable) | ✅ OK | `CORS_ORIGIN` env en compose incluye localhost:3000 y web:3000. |
| REQ-DOCKER-9 (puertos publicados) | ✅ OK | 4000:4000 (api) y 3000:3000 (web). |
| REQ-DOCKER-10 (build args para API URL pública) | ✅ OK | `ARG NEXT_PUBLIC_API_BASE_URL` en web Dockerfile + args en compose. |
| REQ-DOCKER-11 (smoke end-to-end) | ✅ OK | /products → 13 productos; web GET / → 200; MCP en / y /albums sin errores. |
| REQ-DOCKER-12 (resiliencia restart) | ✅ OK | stop + start → ambos healthy < 60s. |

## Decisiones de diseño aceptables
- Multi-stage con `node:22-alpine` en ambos servicios.
- `USER node` (no-root) en runtime stages.
- Healthcheck con `127.0.0.1` en vez de `localhost` (fix correcto del bug IPv6 en alpine).
- `depends_on` con `condition: service_healthy` para arrancar web sólo cuando api esté lista.
- `ARG NEXT_PUBLIC_API_BASE_URL` como build arg público (no es secreto: el navegador del cliente lo lee en el bundle).
- Red dedicada `ironheart` (bridge) para aislar tráfico interno.

## Riesgos no documentados
- **API runtime stage incluye node_modules completo (incluye devDependencies)**: la línea `COPY --from=build /app/node_modules ./node_modules` arrastra todo lo instalado en deps con `npm ci` (sin `--omit=dev`). Es la causa probable del exceso de 100MB sobre el objetivo. Reproducible: ejecutar `npm ci --omit=dev` en una stage runtime aparte resolvería el gap de REQ-DOCKER-1.
- **No hay `HEALTHCHECK` en los Dockerfiles**: depende exclusivamente de docker-compose. Si alguien arranca las imágenes con `docker run` (sin compose), no habrá healthcheck. No bloquea, pero reduce portabilidad.
- **`container_name` fijo** (`ironheart-api`, `ironheart-web`): impide correr dos stacks en paralelo en la misma máquina. Aceptable para dev local, pero conviene saberlo.

## Recomendaciones

| Prioridad | Acción |
|---|---|
| iter-10 (MEDIUM) | API: añadir stage `prod-deps` con `npm ci --omit=dev` y copiar **solo** esos node_modules al runtime. Bajará la imagen ~100MB y cumplirá REQ-DOCKER-1. |
| iter-10 (LOW) | Pinear `node:22-alpine` a digest SHA256 para builds reproducibles. |
| iter-10 (nice-to-have) | Añadir `HEALTHCHECK` fallback en ambos Dockerfiles para portabilidad fuera de compose. |
| nice-to-have | Script `scripts/docker-clean.ps1` para purgar imágenes/volúmenes huérfanos en dev. |
| nice-to-have | Documentar en README cómo cambiar `NEXT_PUBLIC_API_BASE_URL` para entornos no-locales. |

## Próximos pasos para el orquestador
- Cerrar iter-9 con el gap de tamaño documentado como deuda asignada a iter-10.
- Confirmar con humano que el exceso de 98MB en API es aceptable temporalmente.
- Recordar al usuario que despliegue a registry/cloud sigue requiriendo aprobación humana.
- Invocar `/ship` para abrir PR (este reporte queda en `reports/iter-9/reviewer.md` con veredicto APROBAR).
- Si el humano prefiere no arrastrar deuda, abrir iter-10 inmediatamente con la sola tarea de `npm ci --omit=dev`.

Reporte en reports/iter-9/reviewer.md.
