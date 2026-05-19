# Spec — Catálogo de Games retro 8-bit (`/games`)

16 clásicos icónicos del retro 8-bit europeo (1984-1995): 10 de Amstrad CPC 464/6128 + 6 de Commodore 64. Ficha de detalle, filtros y buscador.

> **Estado vivo.** Última actualización: iter-11 (multi-sistema CPC + C64).

## Requirements

### REQ-GAMES-1: Tipos backend

Given el código backend,
when se importa desde `apps/api/src/types/game.ts`,
then SHALL exportar:
- `interface GameQuote { outlet: string; year: number; quote: string; url?: string; author?: string }`,
- `interface Game { id, title, year, developer, publisher, genre, system, description, coverUrl, quotes }`,
- `type GameGenre = string` (laxo en backend para evitar ciclo types→data).

**Validación:** `npx tsc --noEmit` + uso en routes/data.

### REQ-GAMES-2: Dataset de 16 juegos multi-sistema

Given `apps/api/src/data/games.ts`,
when se importa `GAMES`,
then SHALL ser `readonly Game[]` con exactamente 16 entradas (10 CPC + 6 C64).
Cada entrada cumple:
- `id` kebab-case sin acentos (`^[a-z0-9]+(-[a-z0-9]+)*$`),
- `year` en `[1984, 1995]`,
- `system` matchea `/^(Amstrad CPC (464|6128|464 \/ 6128)|Commodore 64)$/`,
- `description.length >= 200`,
- `coverUrl` empieza por `/covers/games/`,
- `quotes.length in [1, 2]` con cada quote `outlet`/`year`/`quote` no
  vacíos y `url` ausente o `^https://`.

**Validación:** suite dinámica `apps/api/tests/games.test.ts`.

### REQ-GAMES-3: Constante GAME_GENRES

Given el dataset,
when se exporta `GAME_GENRES` desde `apps/api/src/data/games.ts`,
then SHALL ser `readonly string[]` con géneros únicos del dataset
ordenados alfabéticamente.

**Validación:** test `GAME_GENRES is sorted alphabetically` + `has no duplicates`.

### REQ-GAMES-4: GET /games

Given el dataset,
when un cliente hace `GET /games`,
then SHALL devolver los 16 juegos. Parámetros `?q=<substring>` y
`?genre=<exacto>` filtran case-insensitive y exacto respectivamente.
Combinables. Schema: `q maxLength 200`, `genre maxLength 50`,
`additionalProperties: false`.

**Validación:** `games.test.ts` (filtros, combinaciones, 400 por overlong).

### REQ-GAMES-5: GET /games/:id

Given un id de juego,
when un cliente hace `GET /games/:id`,
then SHALL devolver el juego (200) o 404 con shape
`{statusCode, error, message}`. Schema id: `pattern "^[A-Za-z0-9_.-]+$"`,
`minLength 1`, `maxLength 128`.

**Validación:** `games.test.ts`.

### REQ-GAMES-6: Frontend mirror

Given el frontend,
when se importa desde `apps/web/lib/game-types.ts`,
then SHALL exportar `Game`, `GameQuote`, `GAME_GENRES` (literal `as const`)
y `GameGenre = (typeof GAME_GENRES)[number]`. `apps/web/lib/games-api.ts`
expone `fetchGames({ q?, genre? })` y `fetchGame(id)`, omitiendo `genre`
cuando vale `"all"`.

**Validación:** `npx tsc --noEmit -p tsconfig.json` en `apps/web`.

### REQ-GAMES-7: Listado /games

Given el navegador en `/games`,
when la página carga,
then MUST mostrar:
- hero con `<h1>` que contenga literalmente "AMSTRAD CPC" y "COMMODORE 64",
- subtítulo "16 CLÁSICOS RETRO 8-BIT · 1984-1995",
- 16 cards con cover + cinta de género + título + año,
- buscador `data-testid="game-search-input"` con `aria-label="Buscar juegos"`,
- fila de chips `role="group" aria-label="Filtrar por género"` con 1
  chip "Todos" + N chips de género (`data-testid="game-genre-chip-<slug>"`),
  donde N = `GAME_GENRES.length` (13 tras iter-11).

**Validación:** `e2e/games.spec.ts` + smoke MCP `reports/iter-11/smoke-games-c64.png`.

### REQ-GAMES-8: Buscador con debounce

Given el listado,
when el usuario teclea "knight" en el buscador,
then la grid SHALL mostrar exactamente 1 card (`data-game-id="knight-lore"`),
con debounce 250ms y AbortController.

**Validación:** `e2e/games.spec.ts:65`.

### REQ-GAMES-9: Chips de género con toggle

Given el listado,
when el usuario hace click en el chip "Aventura isométrica",
then SHALL mostrar exactamente las cards con `data-genre="Aventura
isométrica"` (3 actualmente: Knight Lore, Head Over Heels, La Abadía
del Crimen). Click de nuevo en el mismo chip lo deselecciona y restaura
el listado completo (16). "Todos" exhibe `aria-pressed="true"` cuando
ningún género está activo.

**Validación:** `e2e/games.spec.ts:89`, `:119`.

### REQ-GAMES-10: Combinar buscador + género

Given el listado,
when el usuario activa género "Aventura isométrica" y teclea "knight",
then SHALL mostrar exactamente 1 card (`knight-lore`).

**Validación:** `e2e/games.spec.ts:154`.

### REQ-GAMES-11: Limpiar filtros

Given filtros activos (chip + búsqueda),
when el usuario hace click en "Limpiar filtros"
(`data-testid="game-clear-filters"`),
then el input SHALL volver a vacío, el chip "Todos" exhibe
`aria-pressed="true"` y el listado vuelve a 16 cards.

**Validación:** `e2e/games.spec.ts:190`.

### REQ-GAMES-12: Ficha /games/:id

Given un id existente,
when el usuario navega a `/games/<id>`,
then MUST renderizar:
- breadcrumb `<nav aria-label="Migas">` con link a `/games`,
- `<h1>` con `game.title`,
- portada grande (sin lazy, above the fold),
- `<dl>` con 5 metadatos: AÑO, DESARROLLADOR, EDITOR, GÉNERO, SISTEMA,
- `<section aria-labelledby="description-title">` con descripción
  `>=200` chars,
- `<section aria-labelledby="press-title">` con `<figure>` por quote
  conteniendo `<blockquote>`, `<cite>` (outlet + año) y `<a
  target="_blank" rel="noopener noreferrer">` SOLO si la quote tiene
  `url` (render condicional, no obligatorio).

**Validación:** `e2e/games.spec.ts:237` + smoke MCP `reports/iter-7/smoke-game-detail.png`.

### REQ-GAMES-13: 404 not-found

Given un id inexistente,
when el usuario navega a `/games/<unknown>`,
then SHALL renderizar el not-found específico con `<h1>JUEGO NO ENCONTRADO</h1>`
y link "Volver a Games" → `/games`.

**Validación:** `e2e/games.spec.ts:337`.

### REQ-GAMES-14: Estética retro coherente

Given cualquier página bajo `/games`,
when se renderiza,
then SHALL aplicar:
- paleta metalera (`var(--metal-blood)`, `var(--metal-bone)`,
  `border-stone-800`),
- detalles retro: `border-2` en cards, scanlines opacity 0.07 en hero,
  fuente monoespaciada selectiva (metadatos, año en card).
- Header global IRON DECK presente (entry "Games" entre "Discos" y
  "Contacto").

**Validación:** smoke MCP en 2 fichas.

### REQ-GAMES-15: 16 portadas con MIME válido

Given `apps/web/public/covers/games/`,
when se inspeccionan los archivos,
then SHALL contener al menos 16 archivos `<id>.jpg` (uno por entry de
`GAMES`), todos `>0` bytes, renderizables en navegador (mime sniffing
absorbe los PNG renombrados a .jpg como deuda menor documentada).

**Validación:** `Get-ChildItem` + smoke MCP listado.

## Evidencia histórica

Cumplido en iter-7 (commit `c03bcfc`). Decisiones clave registradas:
- Sustitución Sorcery → Dizzy (PRD §5 RF-B3, fuente canónica no localizable).
- 5 portadas PNG renombradas a .jpg (deuda menor REC-6).
- `buildUrl` duplicado entre `albums-api.ts`/`games-api.ts`/`api.ts` (deuda preexistente REC-7).
- `la-abadia-del-crimen.jpg` es DOS box art (no inlay CPC nativa).
- 13 quotes sin `url` declarada (gate latente: REC-5 muestreo archive.org).

iter-11 (PRD `specs/iter-11-prd.md`) amplía a multi-sistema:
- +6 títulos Commodore 64 (1984-1990): The Last Ninja, Impossible Mission,
  Maniac Mansion, IK+, Wizball, Turrican.
- SYSTEM_PATTERN deja de estar acoplado a CPC.
- Hero `/games` pasa a "AMSTRAD CPC & COMMODORE 64".
- Boulder Dash NO se duplica para C64 (la entry CPC ya cubre la obra,
  decisión consciente).
- 12 nuevas quotes C64 sin `url` declarada (mismo gate latente REC-5).

Ver `specs/acceptance-criteria-archive.md` § "Catálogo Games — Amstrad CPC (iteración 7)".

## Deudas (backlog iter-8+)

- REC-4: hardening CSP/HSTS (`@fastify/helmet` + `next.config.headers`).
- REC-5: muestreo archive.org para urls de citas.
- REC-6: renombrar 5 PNG a extensión real.
- REC-7: consolidar `buildUrl` en `lib/api.ts`.
- REC-8: sustituir flyers arcade por inlays CPC específicos.
- REC-9: smoke automatizado `HEAD /covers/games/<slug>.jpg` × 10.
