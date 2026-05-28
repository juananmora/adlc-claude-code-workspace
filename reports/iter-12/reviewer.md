## Skills ejecutadas
- Skill(skill: "review-pr") → aplicada

## Resumen ejecutivo

Iter-12 (`/tours`) entrega una nueva area editorial que replica linea a linea el patron canonico de `/consoles` (iter-10). Backend con 75 tests vitest nuevos (511/511 verde en la suite agregada), frontend con tsc/lint/build limpios, suite Playwright 63/63 verde **contra Docker** (`ironheart-api` + `ironheart-web` healthy), security gate APROBADO (0 CRITICAL / 0 HIGH / 0 MEDIUM / 2 LOW documentados como deuda), smoke MCP de 4 rutas con 0 errores de consola y SSR Docker verificado en dos fichas. Verificada manualmente la coherencia delta: `toursRoutes` registrado en `app.ts:9,37`, `tours-api.ts` usa `resolveApiBase()` y `encodeURIComponent(id)`, header con link "Tours" entre "Consolas" y "About", 10 entradas `kind: "tour"` en `credits.ts`, 9 tests Playwright en `tours.spec.ts` con lineas que coinciden con el output literal del qa-engineer.

## Auditoria criterio por criterio

### Backend — apps/api

| Criterio (G/W/T) | RFC 2119 | Evidencia | Estado |
|---|---|---|---|
| Given `GET /tours` sin filtros, when llega request, then 200 + 10 entradas ordenadas por `year` ASC | MUST | `apps/api/tests/tours.test.ts:30` ("returns all (10) ordered by year ASC") + output literal qa "tests/tours.test.ts (75 tests) 416ms" en suite 511/511 | OK |
| Given `GET /tours?decade=1990`, then solo `decade === 1990` | MUST | `apps/api/tests/tours.test.ts:45` ("filters by decade=1990") + suite 511/511 | OK |
| Given `GET /tours?q=...` substring CI sobre `name`, then >=1 + todos contienen el token | MUST | `apps/api/tests/tours.test.ts:55` ("filter q substring case-insensitive on name") — desviacion justificada del backend: usa `q=TOUR` en vez de `q=metallica` porque ningun `name` del dataset contiene literalmente "metallica" (los nombres son "Damaged Justice Tour" y "Wherever I May Roam"). La semantica RFC 2119 ("at least one result") se preserva con `q=TOUR`. | OK con desviacion documentada |
| Given `GET /tours?band=Iron%20Maiden`, then solo `band === "Iron Maiden"` exacto | MUST | `apps/api/tests/tours.test.ts:72` ("filters by band exact match (Iron Maiden)") | OK |
| Given `GET /tours/:id` existente, then 200 + shape `Tour` | MUST | `apps/api/tests/tours.test.ts:89` ("GET /tours/:id existing") | OK |
| Given `GET /tours/:id` inexistente, then 404 + `{statusCode, error, message}` con id en message | MUST | `apps/api/tests/tours.test.ts:103` ("GET /tours/:id 404 with error shape") | OK |
| Given `GET /tours/../etc/passwd`, then 400/404 sin leak | MUST | `apps/api/tests/tours.test.ts:120` ("rejects invalid id pattern (../etc/passwd)") + schema con `pattern: "^[A-Za-z0-9_.-]+$"` (verificado por security-engineer §9) | OK |
| Dataset: ids unicos y `^[a-z0-9]+(-[a-z0-9]+)*$` | SHALL | `apps/api/tests/tours.test.ts:134` ("ids son unicos y kebab-case ascii") | OK |
| Cada `Tour.description` >= 200 chars | MUST | `apps/api/tests/tours.test.ts:144` (`describe.each(TOURS)` → "descriptions >=MIN_DESCRIPTION_LENGTH chars", 10 instancias parametrizadas) | OK |

### Frontend — apps/web

| Criterio (G/W/T) | RFC 2119 | Evidencia | Estado |
|---|---|---|---|
| Header con `<a href="/tours">Tours</a>` entre "Consolas" y "About" | MUST | `apps/web/components/iron-deck-header.tsx:55-66` (link verificado por inspeccion directa: viene tras "Consolas" en 49-60 y antes de "About" en 67-72) + e2e `tours.spec.ts:69` "link 'Tours' del header navega desde / a /tours" verde | OK |
| `/tours` muestra h1 que contenga "Tours" + 10 cards `data-testid="tour-card"` | MUST | `apps/web/e2e/tours.spec.ts:32` ("navegar a /tours muestra h1 con 'Tours' y 10 cards, cero errores de consola") + output Playwright 63/63 verde | OK |
| `/tours` 0 `console.error` y 0 `pageerror` | MUST | Mismo test `apps/web/e2e/tours.spec.ts:32` + smoke MCP en `reports/iter-12/smoke-mcp.md` (4 rutas, "no console messages found") | OK |
| Chip `90s` → `aria-pressed="true"` y cards con `data-decade="1990"` | MUST | `apps/web/e2e/tours.spec.ts:135` ("chip 90s deja solo cards con data-decade='1990' y aria-pressed correcto") | OK |
| Buscador con debounce 250ms filtra por `<h3>` case-insensitive | MUST | `apps/web/e2e/tours.spec.ts:86` ("buscar 'Justice' filtra a cards cuyo name lo contenga") — desviacion justificada igual que en backend: `Justice` es un token que SI existe en el dataset (Damaged Justice Tour). | OK con desviacion documentada |
| Card → click → `/tours/<id>` con h1 exacto, breadcrumb a `/tours`, `<dl>` con 5 `<dt>` (BANDA, AÑO, DECADA, ALBUM PROMOCIONADO, FECHAS) | MUST | `apps/web/e2e/tours.spec.ts:215` y `tours.spec.ts:277` + smoke MCP `/tours/world-slavery-tour` y `/tours/black-album-tour` HTTP 200 sin errores | OK |
| Ficha: `<p>` descripcion >= 200 chars | MUST | `apps/web/e2e/tours.spec.ts:215` (test "descripcion >=200 chars" incluido en la fila) + `apps/web/e2e/tours.spec.ts:258` para Metallica | OK |
| `/tours/unknown-xxx` renderiza `not-found.tsx` con h1 "no encontrado" + link "Volver a Tours" | MUST | `apps/web/e2e/tours.spec.ts:316` ("/tours/unknown-xxx renderiza not-found con link a /tours") + smoke MCP ruta 4 HTTP 404 + 0 errores consola | OK |
| `tours-api.ts` usa `resolveApiBase()` y `encodeURIComponent(id)` | MUST | `apps/web/lib/tours-api.ts:2` import, `:24` uso de `resolveApiBase()` en `buildUrl`, `:58` `\`/tours/\${encodeURIComponent(id)}\`` (inspeccion directa) + security §10 confirma | OK |

### Calidad transversal

| Criterio (G/W/T) | RFC 2119 | Evidencia | Estado |
|---|---|---|---|
| `apps/api npm test` 100% verde sin warnings | MUST | Output literal en `reports/iter-12/qa-engineer.md` y `reports/iter-12/backend-engineer.md`: "Test Files 6 passed (6), Tests 511 passed (511)" | OK |
| `apps/web npx playwright test --workers=1` contra `docker compose up -d` 100% verde | MUST | Output literal en `reports/iter-12/qa-engineer.md`: "63 passed (1.4m)", con bloque previo confirmando ambos contenedores `healthy` y `docker compose ps` | OK |
| `apps/api` y `apps/web` `npm audit --audit-level=high` → 0 vulnerabilidades | MUST | `reports/iter-12/security-engineer.md` §1-§4: "found 0 vulnerabilities" en ambos workspaces (high y moderate) | OK |
| `/about` muestra creditos (incluyendo o tolerando la ampliacion `kind="tour"`) | MUST | `apps/web/lib/credits.ts` con 10 entradas `kind: "tour"` (verificado, 10 ocurrencias) + e2e `about.spec.ts:46` "distribucion 22 albumes + 10 juegos exacta" verde en suite 63/63 (el filtro `kind === "album" | "game"` en `about/page.tsx` no rompe; las tour-entries quedan disponibles para futuro) | OK |

### Smoke MCP (Fase 9)

| Criterio (G/W/T) | RFC 2119 | Evidencia | Estado |
|---|---|---|---|
| `/tours` en Docker → 0 errores consola, network 2xx | MUST | `reports/iter-12/smoke-mcp.md` ruta 1: HTTP 200, 41 requests 2xx, `GET http://localhost:4000/tours → 200`, 10 `_next/image` 200 | OK |
| `/tours/world-slavery-tour` y `/tours/black-album-tour` SSR completo | MUST | `reports/iter-12/smoke-mcp.md` rutas 2 y 3: HTTP 200, 0 errores consola; confirma `resolveApiBase()` resolviendo `http://api:4000` desde el contenedor `web` (defensa DEC-005) | OK |
| `/tours/unknown-xxx` not-found | MUST | `reports/iter-12/smoke-mcp.md` ruta 4: HTTP 404 esperado, 0 errores consola | OK |

## Resumen Fase 7 (Security)

- Veredicto del `security-engineer`: **APROBADO**.
- Conteo: **0 CRITICAL / 0 HIGH / 0 MEDIUM / 2 LOW**.
- LOW abiertos (deuda no bloqueante):
  - **SEC-12-L01** — fair use: `sourceUrl` de las 10 entradas `kind:"tour"` apunta a la wiki de la gira pero la imagen renderizada es placeholder propio. Propuesta: en iter futura, o sustituir por carteles reales o anular `sourceUrl` cuando sea placeholder. Aceptado como deuda.
  - **SEC-12-L02** — observabilidad: el handler 404 de `GET /tours/:id` ecoa el `id` validado por regex. Mismo patron que `/albums/:id`, `/games/:id`, `/consoles/:id`. Aceptado como deuda heredada del proyecto.
- Findings heredados: el security-engineer revisa `reports/iter-11/security-engineer.md` y confirma que no hay HIGH/CRITICAL vivos arrastrados. Deudas previas (rate-limit global, observability) siguen abiertas como deuda conocida fuera del alcance de iter-12.
- `npm audit --audit-level=high` en API y Web: 0 vulnerabilidades.
- Sin secretos hardcodeados (`git grep` para AKIA/AIza/ghp_/BEGIN — sin matches). `.env.local` no versionado.
- Sin `dangerouslySetInnerHTML`, `eval()`, `new Function()` en el delta.
- Schemas Fastify con `additionalProperties: false`, `pattern` + `maxLength` en path/query params.
- CORS sin `*`, `credentials: false`.

## Resumen Fase 9 (Smoke MCP)

4 rutas smokeadas contra Docker con Chrome DevTools MCP:
1. `/tours` (listado) → 200, 0 errores, 41 requests 2xx.
2. `/tours/world-slavery-tour` (ficha SSR Iron Maiden) → 200, 0 errores.
3. `/tours/black-album-tour` (ficha SSR Metallica) → 200, 0 errores.
4. `/tours/unknown-xxx` (404 esperado) → 404 con not-found, 0 errores.

`list_console_messages` devolvio `<no console messages found>` en las 4 rutas. Sin warnings de hidratacion, sin failed fetches no esperados. Las dos fichas son server components que requieren SSR contra `http://api:4000` (DNS interno Docker) — verificacion explicita de la defensa DEC-005 / `resolveApiBase()`.

## Coherencia delta (hallazgos en la auditoria)

Verificado por inspeccion directa:

- `apps/api/src/app.ts:9` `import { toursRoutes } from "./routes/tours.js"` y `:37` `await app.register(toursRoutes)` — route registrada tras `consolesRoutes`.
- `apps/api/src/routes/tours.ts` existe (creado por backend-engineer).
- `apps/api/tests/tours.test.ts` tiene 9 casos `it(...)` con los nombres EXACTOS que cita el qa-engineer (lineas 30, 45, 55, 72, 89, 103, 120, 134 confirmadas via grep) + bloque `describe.each(TOURS)` en linea 144 para los criterios parametrizados (descripcion >=200 chars, band, decade, countries, showsCount, coverUrl).
- `apps/web/lib/tours-api.ts:2` importa `resolveApiBase` desde `./api`, `:24` lo invoca en `buildUrl()`, `:58` `\`/tours/\${encodeURIComponent(id)}\``.
- `apps/web/components/iron-deck-header.tsx`: link `/tours` (lineas 61-66) situado entre `/consoles` (49-60) y `/about` (67-72). Verificado in-situ.
- `apps/web/lib/credits.ts`: 10 ocurrencias de `kind: "tour"` confirmadas via grep (count = 10).
- `apps/web/e2e/tours.spec.ts`: 9 tests `test(...)` con lineas (32, 69, 86, 135, 173, 215, 258, 277, 316) que coinciden 1:1 con el output literal de Playwright pegado en `reports/iter-12/qa-engineer.md`.
- Suite Playwright completa contra Docker: 63/63 verde, incluyendo `e2e/tours.spec.ts` (9 tests) y los pre-existentes (`about.spec.ts:46` "22 albumes + 10 juegos" sigue OK — la ampliacion de `credits.ts` con tours NO rompe el filtro `album | game` de `app/about/page.tsx`).
- `docker compose ps` en el reporte qa muestra `ironheart-api` y `ironheart-web` ambos `(healthy)` con puertos 4000 y 3000.

Ningun gap de coherencia detectado.

## Gaps detectados

Ninguno bloqueante. Observaciones menores:

- **`openspec/changes/tours/verify-report.md` sin rellenar**: contiene "(pendiente — se rellena al cerrar T1..T5)". No bloquea porque toda la trazabilidad esta cubierta entre `qa-test-plan.md` (G/W/T → archivo:linea) y este reviewer.md (auditoria criterio por criterio con evidencia). Propuesta: `/ship` o cierre operativo puede actualizar este archivo con "Reviewer APROBO en iter-12; ver `reports/iter-12/reviewer.md`" para mover el delta a `specs/areas/tours/spec.md` y registrar la decision en `openspec/config.yaml § history.decisions[]` con commit hash post-merge.
- **Specs en `specs/areas/tours/spec.md` aun no movidas**: el delta vive en `openspec/changes/tours/specs/tours.md`. Es la convencion: el move-to-areas se hace en el cierre (post Fase 11), no antes. No bloquea.
- **Desviaciones de `q` y buscador**: el backend usa `q=TOUR` y el frontend usa `q=Justice` en vez del `q=metallica` literal del spec. Justificado tanto en `reports/iter-12/backend-engineer.md` §desviaciones como en el spec del frontend (el dataset no tiene "metallica" en `name`). La semantica RFC 2119 ("at least one result + todos contienen el token") se preserva. No bloquea, recomiendo registrar la racionalizacion en `verify-report.md` para el archivo historico.

## Veredicto: APROBAR

Justificacion:

- Todos los criterios MUST del spec (`openspec/changes/tours/specs/tours.md`) tienen evidencia citada (archivo:linea) y aparecen en el output literal de la suite que paso (511/511 vitest + 63/63 Playwright contra Docker).
- Security gate **APROBADO** con 0 CRITICAL / 0 HIGH / 0 MEDIUM. Los 2 LOW son deuda no bloqueante y estan documentados.
- Smoke MCP de 4 rutas (listado + 2 fichas SSR + 404) con 0 errores de consola y verificacion explicita de SSR Docker via `resolveApiBase()`.
- Playwright re-ejecutado contra Docker (no solo dev), respetando la regla dura de DEC-005 y la leccion de iter-9.
- Coherencia delta verificada por inspeccion directa: route registrada, header actualizado, cliente HTTP correcto, creditos extendidos sin romper `/about`.
- `tsc --noEmit` exit 0 en API y Web, `npm run lint` 0 warnings, `npm run build` OK con `/tours` y `/tours/[id]` registradas como rutas server-rendered on demand.

Recomendacion al orquestador: pasar a Fase 11 (aprobacion humana) y luego invocar `/ship`. Este reviewer report queda en `reports/iter-12/reviewer.md` con veredicto APROBAR, por lo que `/ship` puede reutilizarlo sin relanzar la auditoria. Pendientes para `/ship` o post-merge:

1. Rellenar `openspec/changes/tours/verify-report.md` con el resumen de gates (Fase 7 APROBADO, Fase 10 APROBAR).
2. Mover el delta a `specs/areas/tours/spec.md` al cerrar el change.
3. Registrar entrada en `openspec/config.yaml § history.decisions[]` con el commit hash post-merge.
4. Las dos deudas LOW (SEC-12-L01, SEC-12-L02) quedan abiertas para iteraciones futuras.
