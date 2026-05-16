# Iteración 7 — Reporte de cierre (Fase 12)

> **Catálogo "Games" Amstrad CPC** — 10 clásicos icónicos, listado con buscador + filtro por género, ficha de detalle con prensa de la época, entrada en header global. Espeja patrón `/albums` con detalles retro 8-bit.

## Resumen

Iter-7 entrega un catálogo `/games` paralelo a `/albums` con 10 juegos curados de Amstrad CPC (1984-1995): backend Fastify con `GET /games(?q,&genre=)` + `GET /games/:id`, frontend Next 15 con listado, ficha, `not-found`, y link `Games` en el header. Sin tocar catálogos previos. Suite vitest 233/233, Playwright 38/38 (0 regresiones sobre 28 previos), tsc verde en backend y frontend, smoke MCP limpio en 4 URLs (0 errores consola, 43/43 network OK), `npm audit` 0 vulnerabilidades en ambos paquetes.

## Aprobación humana firmada (Fase 11)

**Opción A — APROBADO con compromiso de visado legal previo a release público.**

> Texto literal del usuario:
> "Opción A: APRUEBO con compromiso de visado legal previo a release público. Cierre operativo: invoco /ship cuando me lo indiques."

Significado operativo:
- Cierre interno (PR a `main`) aprobado.
- SEC-07-01 (fair use de portadas Wikipedia) queda registrado como compromiso humano: **antes de cualquier despliegue público**, esta iteración (o una posterior) pasará por visado legal o sustitución de portadas.
- El compromiso debe constar en el commit message y en el cuerpo del PR.

## Auditoría criterio por criterio

> 38 criterios marcados [x] con evidencia. 1 criterio [ ] pendiente de acción humana legítima (`/ship`). Estado de detalle en `specs/acceptance-criteria.md`, sección "Catálogo Games — Amstrad CPC (iteración 7)".

| # | Área | Criterio (resumido) | Evidencia | Estado |
|---|---|---|---|---|
| 1 | Backend tipos | `types/game.ts` exporta `Game`/`GameQuote`/`GameGenre` | `tsc --noEmit` verde + inspección líneas 11/35/38 | ok |
| 2 | Backend dataset | `GAMES` 10 entradas + `GAME_GENRES` 8 ordenado | tests `dataset size` + `GAME_GENRES sorted` verdes | ok |
| 3 | Backend shape | Cada juego cumple shape (year/system/desc≥200/coverUrl/quotes 1-2) | suite dinámica 110/110 verdes | ok |
| 4 | Backend quote | Cada quote outlet/year/quote no vacíos, url https si presente | tests verdes; 0 urls en dataset → cumple por vacuidad | ok con gap rojo (urls vacías) |
| 5 | Backend GET /games | 10 juegos sin filtros | test verde | ok |
| 6 | Backend ?q | Filtra case-insensitive | test `q=knight` 1 resultado verde | ok |
| 7 | Backend ?genre | Filtra exacto | test `genre=Aventura...` ≥2 verde | ok |
| 8 | Backend combinable | q+genre | test combinado verde | ok |
| 9 | Backend maxLength | q:200 / genre:50 | inspección routes/games.ts:7-10 + test 400 overlong verde | ok |
| 10 | Backend GET /games/:id | Devuelve juego | test knight-lore verde | ok |
| 11 | Backend 404 | shape `{statusCode,error,message}` | test verde | ok |
| 12 | Backend register | app.ts registra gamesRoutes | inspección app.ts:7,33 | ok |
| 13 | Backend suite | vitest verde | `Test Files 4 passed, Tests 233 passed` en 2.16s | ok |
| 14 | Frontend tipos | `game-types.ts` mirror exacto + GAME_GENRES literal | `tsc --noEmit` verde + inspección | ok |
| 15 | Frontend cliente | `games-api.ts` con fetchGames/fetchGame, exclusión "all", 404→null | inspección líneas 20-65 | ok (deuda: buildUrl duplicado preexistente) |
| 16 | Frontend listado | `app/games/page.tsx` SSR + fallback `[]` | inspección líneas 22-86 | ok |
| 17 | Frontend hero | H1 literal "GAMES" + "AMSTRAD CPC 464/6128" | inspección + `smoke-games-list.png` | ok |
| 18 | Frontend buscador | debounce 250ms + testid + role group | inspección líneas 67-90, 144 | ok |
| 19 | Frontend chips | aria-pressed + testid por género + slug correcto | 8 testids verificados manualmente | ok |
| 20 | Frontend clear | testid + condicional + reset | inspección líneas 153-162 | ok |
| 21 | Frontend card | testid + data-game-id + data-genre + border-2 + cinta | inspección líneas 19-64 | ok |
| 22 | Frontend ficha | h1 + dl ×5 + descripción ≥200 | inspección + `smoke-game-detail.png` (Knight Lore) | ok |
| 23 | Frontend quotes | `<figure>/<blockquote>/<cite>` + `<a rel="noopener noreferrer">` condicional | inspección líneas 162-200 | ok (gate latente: 0 quotes con url) |
| 24 | Frontend not-found | mensaje + link a /games | inspección not-found.tsx | ok |
| 25 | Frontend header | Link "Games" añadido entre Discos y Contacto | inspección iron-deck-header.tsx:49-54 | ok |
| 26 | Frontend paleta | Coherente metalera | capturas smoke | ok |
| 27 | Frontend retro | border-2 + monoespaciada + scanlines opacity 0.07 | capturas smoke (scanlines discretas) | ok |
| 28 | Portadas archivos | 10 archivos > 0 bytes | Glob + sizes 16KB-443KB | ok |
| 29 | Portadas smoke | 10 portadas 200/304 en listado | URL 1: 21/21 status 200 + verificación visual `smoke-games-list.png` | ok |
| 30 | E2E spec | 10 casos cubren criterios funcionales | `games.spec.ts:34-349` | ok |
| 31 | Suite Playwright | verde con --workers=1 | `38 passed (1.8m)`: 28 previos + 10 nuevos, 0 regresiones | ok |
| 32 | Smoke API listener | :4000 vivo | Get-NetTCPConnection Listen PID 35120 | ok |
| 33 | Smoke web listener | :3000 vivo | Get-NetTCPConnection Listen PID 29160 | ok |
| 34 | Smoke navegación | 4 URLs con MCP | capturas + outputs verificados | ok |
| 35 | Smoke network | 0 4xx/5xx | 43/43 status 200/304 en 3 URLs | ok |
| 36 | Smoke consola | 0 errores | confirmado en 4 URLs | ok |
| 37 | Smoke capturas | en reports/iter-7/ no en raíz | 3 PNG ubicadas correctamente | ok |
| 38 | Security audit | 0 HIGH/CRITICAL | `npm audit` → `found 0 vulnerabilities` en api y web | ok |
| 39 | Security rel | rel="noopener noreferrer" + target="_blank" | inspección page.tsx:188-189 condicional | ok |
| 40 | Security https | 0 `http://` en data/games.ts | grep verde, vacuidad documentada | ok |
| 41 | Security secretos | 0 secretos en delta | greps verdes + .env* desde commit inicial | ok |
| 42 | Security skill | security-review aplicada, APROBADO CON OBSERVACIONES | `reports/iter-7/security-engineer.md` | ok (1 MEDIUM legal escalado y firmado por humano, 1 LOW transversal) |
| 43 | Reviewer | review-pr aplicada, APROBAR | `reports/iter-7/reviewer.md` | ok |
| 44 | Cierre auditoría | tabla criterio×evidencia×estado | esta tabla | ok |
| 45 | Cierre reporte | reporte final | este documento | ok |
| 46 | Cierre /ship | usuario invoca | **pendiente acción humana — aprobación firmada, invocación pendiente** | pendiente |

**45 [x] / 1 [ ]** legítimamente pendiente.

## Security gate

**Veredicto: APROBADO CON OBSERVACIONES.** Reporte: `reports/iter-7/security-engineer.md`.

| Severidad | Conteo | Estado |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 1 | **SEC-07-01** — fair use editorial de portadas Wikipedia. **Resuelto por aprobación humana Opción A**: cierre interno OK, visado legal pendiente antes de release público. |
| LOW | 1 | **SEC-07-02** — sin headers globales CSP/HSTS/X-Frame-Options. Deuda transversal preexistente, no introducida por iter-7. Aplazado a iter-8 hardening (REC-4). |

Detalle de chequeos en el reporte del security-engineer:
- npm audit (api+web): 0 vulnerabilidades.
- Secretos: 0 matches en el delta + `.env*` desde commit inicial.
- HTTPS: 0 `http://` en dataset (vacuidad documentada).
- `rel="noopener noreferrer"` + `target="_blank"`: presentes en `app/games/[id]/page.tsx:188-189` (render condicional).
- Schemas Fastify: maxLength + pattern + additionalProperties:false correctos.
- CORS: sin wildcards, conservado de iter-6.
- Error handler: shape `{statusCode, error, message}`, sin filtrar stacks.
- 0 `dangerouslySetInnerHTML`, 2 `<img>` con `alt` descriptivo.
- Lockfiles: sin cambios.

## Veredicto del reviewer

**APROBAR CON OBSERVACIONES NO BLOQUEANTES.** Reporte: `reports/iter-7/reviewer.md`.

- 17 RFs (B1-B6 + F1-F8 + E1-E3) verificados 1:1 con archivo:línea o test.
- 0 scope creep, 0 bloqueantes, 0 discrepancias materiales con orquestador y security-engineer.
- 9 recomendaciones priorizadas: 3 de cierre (todas ejecutadas por orquestador en este reporte) + 6 para iter-8.
- Sin reabrir el security gate.

## Gaps y deudas declaradas (no bloqueantes)

| Gap | Resolución |
|---|---|
| 13 quotes sin `url` declarada | Gate latente OK; backlog REC-5 para iter-8 (muestreo archive.org). |
| 5 portadas son PNG renombrados a `.jpg` | Mime sniffing absorbe sin bug; backlog REC-6 para iter-8 (renombrar o re-codificar). |
| `la-abadia-del-crimen.jpg` es DOS box art, no inlay CPC | Sustitución documentada en backend-engineer.md. Backlog REC-8 si fuente CPC localizable. |
| 4 portadas son flyers arcade (no inlay CPC) | Sustitución documentada. Backlog REC-8. |
| Sorcery (Virgin 1984) → Dizzy (Codemasters 1987) | Justificación: portada canónica de Sorcery no localizable en Wikipedia/CPC-Power; Dizzy es CPC nativo, mismo periodo, igual de icónico, portada verificable. Aceptado por PRD §5 RF-B3. |
| `buildUrl` duplicado entre `albums-api.ts`, `games-api.ts`, `api.ts` | Deuda preexistente no introducida por iter-7. Backlog REC-7. |
| Ausencia de CSP/HSTS/X-Frame-Options globales | SEC-07-02 LOW. Backlog REC-4 para iter-8 hardening dedicado. |
| Fair use editorial de portadas Wikipedia | SEC-07-01 MEDIUM. **Firmado por humano Opción A**: cierre interno OK, visado legal pendiente antes de release público. |

## Backlog generado para iter-8 (no bloquea iter-7)

| ID | Acción |
|---|---|
| REC-4 | `@fastify/helmet` + `next.config.headers()` con CSP/HSTS (resolución SEC-07-02). |
| REC-5 | Muestreo en archive.org de 2-3 URLs https para citas (Amstrad Action, Crash, MicroHobby). |
| REC-6 | Renombrar a extensión real los 5 PNG actualmente con `.jpg`, o re-codificar a JPG. |
| REC-7 | Consolidar `buildUrl` en un único helper compartido por `albums-api.ts`, `games-api.ts` y `api.ts`. |
| REC-8 | Sustituir flyers arcade y DOS box art por inlays CPC específicos cuando localizables. |
| REC-9 | Añadir test smoke `HEAD /covers/games/<slug>.jpg` × 10 (regresión auditable sin captura manual). |

## Archivos del delta

**Backend** (`apps/api/`):
- `src/types/game.ts` (nuevo)
- `src/data/games.ts` (nuevo, 10 juegos)
- `src/routes/games.ts` (nuevo)
- `src/app.ts` (modificado: import + register de gamesRoutes)
- `tests/games.test.ts` (nuevo, 123 tests verdes)

**Frontend** (`apps/web/`):
- `lib/game-types.ts` (nuevo)
- `lib/games-api.ts` (nuevo)
- `app/games/page.tsx` (nuevo)
- `app/games/[id]/page.tsx` (nuevo)
- `app/games/[id]/not-found.tsx` (nuevo)
- `components/games-grid.tsx` (nuevo)
- `components/game-card.tsx` (nuevo)
- `components/iron-deck-header.tsx` (modificado: +1 Link a `/games`)
- `e2e/games.spec.ts` (nuevo, 10 tests verdes)
- `public/covers/games/*.jpg` (10 archivos nuevos)

**Specs** (`specs/`):
- `games-amstrad-cpc-prd.md` (nuevo)
- `acceptance-criteria.md` (sección iter-7 añadida y marcada)

**Reportes** (`reports/iter-7/`):
- `backend-engineer.md`
- `frontend-engineer-t4.md`
- `frontend-engineer-t5.md`
- `frontend-engineer-t6-t8.md`
- `qa-engineer.md`
- `security-engineer.md`
- `reviewer.md`
- `orchestrator-close.md` (este documento)
- `smoke-games-list.png`
- `smoke-game-detail.png`
- `smoke-game-detail-2.png`

## Comandos para reproducir

```powershell
# Desde la raíz del repo

# Backend
cd apps\api
npx tsc --noEmit                     # → sin output (0 errores)
npm test                              # → Test Files 4 passed, Tests 233 passed
npm audit --audit-level=high         # → found 0 vulnerabilities

# Frontend
cd ..\web
npx tsc --noEmit -p tsconfig.json    # → sin output (0 errores)
npm audit --audit-level=high         # → found 0 vulnerabilities

# Servers vivos para Playwright y smoke manual
# (en dos shells separados, background)
cd ..\api && npm run dev             # :4000
cd ..\web && npm run dev             # :3000

# Verificar listeners
Get-NetTCPConnection -State Listen -LocalPort 4000,3000

# Suite Playwright
cd ..\web
npx playwright test --workers=1      # → 38 passed (1.8m)

# Smoke manual (Chrome o equivalente):
#   http://localhost:3000/games
#   http://localhost:3000/games/knight-lore
#   http://localhost:3000/games/la-abadia-del-crimen
#   http://localhost:3000/games/unknown-id-xxx
```

## Próximos pasos

1. **Usuario invoca `/ship`** para abrir el PR. `/ship` reutilizará el veredicto APROBAR de `reports/iter-7/reviewer.md` (fresco) sin relanzar reviewer.
2. Tras merge del PR, este criterio del `acceptance-criteria.md` quedará marcado [x] automáticamente o manualmente.
3. Backlog REC-4..REC-9 a planificar en iter-8.
4. **Antes de cualquier despliegue público**: visado legal de SEC-07-01 conforme al compromiso firmado en Opción A.
