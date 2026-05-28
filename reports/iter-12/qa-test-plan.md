# Test plan iter-12 — /tours

Skill aplicada: `Skill(skill: "generate-tests")`.

## Mapping criterio (G/W/T) → test

### Backend — apps/api

| Criterio (G/W/T) | Severidad | Archivo:línea | Estado |
|---|---|---|---|
| Given `GET /tours`, when sin filtros, then 200 + 10 entradas ordenadas por `year` ASC | MUST | `apps/api/tests/tours.test.ts:30` | verde |
| Given `GET /tours?decade=1990`, when filtro definido, then solo entradas con `decade === 1990` | MUST | `apps/api/tests/tours.test.ts:45` | verde |
| Given `GET /tours?q=TOUR` (case-insensitive substring), then ≥1 + todos contienen `tour` en `name` | MUST | `apps/api/tests/tours.test.ts:55` | verde |
| Given `GET /tours?band=Iron%20Maiden`, then solo `band === "Iron Maiden"` | MUST | `apps/api/tests/tours.test.ts:72` | verde |
| Given `GET /tours/:id` con id existente, then 200 + shape `Tour` | MUST | `apps/api/tests/tours.test.ts:89` | verde |
| Given `GET /tours/:id` con id inexistente, then 404 + shape `{ statusCode, error, message }` | MUST | `apps/api/tests/tours.test.ts:103` | verde |
| Given `GET /tours/../etc/passwd`, then 400/404, nunca leak | MUST | `apps/api/tests/tours.test.ts:120` | verde |
| Dataset: ids únicos y slug kebab-case | SHALL | `apps/api/tests/tours.test.ts:134` | verde |
| Cada `Tour.description` ≥200 chars | MUST | `apps/api/tests/tours.test.ts:144` (describe.each) | verde |
| `TOUR_BANDS` sin duplicados y ordenado | MUST | `apps/api/tests/tours.test.ts:180` | verde |
| `TOUR_DECADES === [1980, 1990, 2000]` | MUST | `apps/api/tests/tours.test.ts:209` | verde |
| `TOURS.length === 10` | MUST | `apps/api/tests/tours.test.ts:215` | verde |

### Frontend — apps/web (Playwright E2E)

| Criterio (G/W/T) | Severidad | Archivo:línea | Estado |
|---|---|---|---|
| Header link `Tours` desde `/` navega a `/tours` y muestra 10 cards | MUST | `apps/web/e2e/tours.spec.ts` (test "header link Tours navega a /tours") | verde |
| `/tours` renderiza h1 con "Tours" + 10 `data-testid="tour-card"` + 0 errores consola | MUST | `apps/web/e2e/tours.spec.ts` (test "listado /tours muestra h1 'Tours' y 10 cards, cero errores") | verde |
| Buscador filtra por name (debounce 250ms) — `q` que matchee real | MUST | `apps/web/e2e/tours.spec.ts` (test "buscar 'Justice' filtra cards por name") | verde |
| Chip `90s` activa `aria-pressed="true"` + cards con `data-decade="1990"` | MUST | `apps/web/e2e/tours.spec.ts` (test "chip 90s deja solo cards con data-decade='1990'") | verde |
| Click otra vez chip `90s` deselecciona y vuelven 10 cards | MUST | `apps/web/e2e/tours.spec.ts` (test "click otra vez en chip 90s lo deselecciona y vuelven 10 cards") | verde |
| Ficha `/tours/world-slavery-tour`: h1 + breadcrumb + dl con 5 dt + descripción ≥200 chars | MUST | `apps/web/e2e/tours.spec.ts` (test "/tours/world-slavery-tour muestra h1, breadcrumb, dl con 5 metadatos y descripción >=200 chars") | verde |
| Click en una card lleva a `/tours/<id>` (aria-label) | MUST | `apps/web/e2e/tours.spec.ts` (test "click en una card lleva a /tours/<id>") | verde |
| `/tours/unknown-xxx` renderiza not-found con link `/tours` | MUST | `apps/web/e2e/tours.spec.ts` (test "/tours/unknown-xxx renderiza not-found con link a /tours") | verde |

## Capas

- **Unit + integración API**: `cd apps/api; npm test`
- **Type check API**: `cd apps/api; npx tsc --noEmit`
- **E2E**: `cd apps/web; npx playwright test --workers=1`
- **Type check Web**: `cd apps/web; npx tsc --noEmit -p tsconfig.json`
- **Contra Docker**: `docker compose up -d` + esperar healthy + Playwright contra `http://localhost:3000`.

## Smoke MCP — rutas obligatorias (las ejecuta el orquestador)

- `/`                           → home, header con link `Tours`, 0 errores consola.
- `/tours`                      → listado, 10 cards, 0 errores consola, network 2xx.
- `/tours/world-slavery-tour`   → ficha 1 (Iron Maiden, server component, fetch SSR OK).
- `/tours/black-album-tour`     → ficha 2 (Metallica), distinta a la anterior.
- `/tours/unknown-xxx`          → 404 / not-found, h1 con "Tour no encontrado", link a `/tours`.

Por cada ruta: capturar consola y network. Errores 4xx/5xx (excepto el 404 del último que es esperado), exceptions o warnings de hidratación = bugs reales.
