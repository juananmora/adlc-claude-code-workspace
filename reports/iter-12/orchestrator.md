# iter-12 — cierre orquestador (`/tours`)

## Resumen

Iteración 12 introduce el área `/tours` (10 giras históricas del metal 1984-2008) end-to-end. Backend Fastify + frontend IRON DECK + tests vitest + Playwright contra Docker + smoke MCP. Es la **primera iteración ejecutada con los agentes y skills reescritos en bloque** — prueba de validación del harness portátil.

## Criterios de aceptación (auditoría Fase 8)

> Auditoría completa por el reviewer en `reports/iter-12/reviewer.md`. Aquí versión condensada.

| Criterio (G/W/T) | RFC | Evidencia | Estado |
|---|---|---|---|
| GET /tours sin filtros → 200 + 10 entradas ordenadas year ASC | MUST | `apps/api/tests/tours.test.ts` ("returns all (10) ordered by year ASC"); vitest 75/75 | OK |
| GET /tours?decade=1990 → solo decade===1990 | MUST | `tours.test.ts` ("filters by decade=1990") | OK |
| GET /tours?q=... substring CI en name | MUST | `tours.test.ts` ("filter q substring case-insensitive on name"), `q=TOUR` | OK |
| GET /tours?band=... igualdad estricta | MUST | `tours.test.ts` ("filters by band exact match") | OK |
| GET /tours/:id válido → 200 + Tour | MUST | `tours.test.ts` ("GET /tours/:id existing") | OK |
| GET /tours/:id inexistente → 404 `{statusCode, error, message}` | MUST | `tours.test.ts` ("GET /tours/:id 404 with error shape") | OK |
| Path traversal en id → 400/404 sin leak | MUST | `tours.test.ts` ("rejects invalid id pattern") | OK |
| Dataset ids únicos + slug ascii kebab-case | SHALL | `tours.test.ts` ("dataset invariants") | OK |
| Descripciones ≥200 chars | MUST | `tours.test.ts` ("descriptions >=200 chars") | OK |
| Header link "Tours" entre "Consolas" y "About" | MUST | `tours.spec.ts` ("header link Tours") + `iron-deck-header.tsx:61-66` | OK |
| Listado renderiza h1 "Tours" + 10 cards | MUST | `tours.spec.ts` ("listado /tours renderiza 10 cards") | OK |
| Listado 0 errores consola | MUST | `tours.spec.ts` ("0 errores consola") + smoke MCP `/tours` | OK |
| Chip 1990 filtra a decade=1990 | MUST | `tours.spec.ts` ("chip 90s filtra a decade=1990") | OK |
| Buscador filtra por name con debounce 250ms | MUST | `tours.spec.ts` ("buscador filtra por name", `q=Justice`) | OK |
| Ficha h1 + breadcrumb + dl 5dt + descripción ≥200 | MUST | `tours.spec.ts` ("ficha de tour") | OK |
| 404 not-found con link "Volver a Tours" | MUST | `tours.spec.ts` ("404") + smoke MCP `/tours/unknown-xxx` | OK |
| `tours-api.ts` usa `resolveApiBase()` + `encodeURIComponent` | MUST | inspección + smoke MCP en 2 fichas SSR contra Docker | OK |
| `apps/api npm test` → 100% verde | MUST | output literal en `qa-engineer.md`: 511/511 | OK |
| Playwright contra Docker → 100% verde | MUST | output literal: 63/63 (9 nuevos + 54 previos) | OK |
| `npm audit --audit-level=high` → 0 vulns | MUST | `security-engineer.md`: api y web 0 vulns | OK |
| `credits.ts` con 10 entradas para tours en /about | MUST | inspección + reviewer | OK |
| Smoke MCP /tours, 2 fichas, 404 → 0 errores consola | MUST | `smoke-mcp.md` + 4 screenshots | OK |

**Conteo: 22 MUST/SHALL verdes, 0 rojos.**

## Security gate (Fase 7)

- Veredicto **APROBADO**.
- **0 CRITICAL / 0 HIGH / 0 MEDIUM / 2 LOW.**
- Deudas LOW (no bloqueantes):
  - `SEC-12-L01` — cartelería placeholder (JPG mínimo base64). Resolución futura: imágenes reales fair-use editorial.
  - `SEC-12-L02` — el 404 ecoa el id ya validado por regex. Patrón heredado de albums/games/consoles, riesgo nulo.
- Heredados vivos del iter-11: ninguno bloqueante.

## Reviewer (Fase 10)

- Veredicto **APROBAR**.
- Observaciones no bloqueantes que se cerrarán en el merge:
  - `openspec/changes/tours/verify-report.md` queda con plantilla — `/ship` lo rellena.
  - `specs/areas/tours/spec.md` se moverá desde `openspec/changes/tours/specs/tours.md` al cerrar el change.
  - Entrada en `openspec/config.yaml § history.decisions[]` con `DEC-007` pendiente de commit hash post-merge.

## Smoke MCP (Fase 9)

4 rutas verdes contra `docker compose up -d` con ambos contenedores healthy:

| Ruta | HTTP | Consola | Captura |
|---|---|---|---|
| `/tours` | 200 | 0 errores | smoke-tours-listado.png |
| `/tours/world-slavery-tour` | 200 | 0 errores | smoke-tours-ficha-world-slavery.png |
| `/tours/black-album-tour` | 200 | 0 errores | smoke-tours-ficha-black-album.png |
| `/tours/unknown-xxx` | 404 | 0 errores | smoke-tours-404.png |

SSR Docker confirmado: las dos fichas son server components y renderizaron correctamente contra `http://api:4000` (DNS interno de compose). Defensa DEC-005 activa via `resolveApiBase()`.

## Gaps y pendientes humanos

- **Aprobación humana de la iter** (Fase 11) — pendiente.
- Tras aprobación: invocar `/ship` para abrir PR. `/ship` reutilizará `reports/iter-12/reviewer.md` (fresco, veredicto APROBAR) sin relanzar la auditoría.
- Imágenes reales fair-use editorial de cartelería de tours — diferido a iter futura.

## Comandos para reproducir

```powershell
# Vitest backend
cd apps/api ; npm test                          # 511/511

# Type check + lint frontend
cd apps/web ; npx tsc --noEmit -p tsconfig.json # exit 0
cd apps/web ; npm run lint                      # 0 warnings
cd apps/web ; npm run build                     # OK

# Stack dockerizado
docker compose build
docker compose up -d
# Esperar healthchecks ambos healthy
docker compose ps

# E2E contra Docker
cd apps/web ; npx playwright test --workers=1   # 63/63

# Smoke MCP manual: /tours, /tours/world-slavery-tour, /tours/black-album-tour, /tours/unknown-xxx

docker compose down
```

## Veredicto del harness

El harness reescrito (agentes + skills + paquete portable) ha pasado su primera iteración real end-to-end **sin intervención manual** salvo redirección inicial:

- 5 agentes ejecutados: backend, frontend, qa, security, reviewer.
- Cada uno invocó la skill declarada y reportó con la sección `## Skills ejecutadas`.
- Los reportes se persistieron en `reports/iter-12/`.
- Los anti-patrones codificados se respetaron:
  - `resolveApiBase()` desde el primer minuto.
  - `encodeURIComponent` en path params.
  - `--workers=1` en Playwright.
  - Tests **contra Docker**, no solo contra dev.
  - `qa-engineer`, `security-engineer`, `reviewer` ejecutados (no se saltaron pese a ser una iter "de prueba").
  - 0 errores de consola exigidos y conseguidos.
  - Auditoría criterio por criterio con evidencia citada.

Conclusión: **harness validado**. El paquete portable `.claude-portable/` puede llevarse a un nuevo proyecto con confianza razonable.

## Próximos pasos

1. Humano aprueba el cierre (Fase 11).
2. Invocar `/ship` para abrir el PR. `/ship` debería:
   - Mover `openspec/changes/tours/specs/tours.md` → `specs/areas/tours/spec.md`.
   - Añadir `DEC-007` a `openspec/config.yaml` con el commit hash.
   - Abrir el PR contra main con la tabla de criterios.
