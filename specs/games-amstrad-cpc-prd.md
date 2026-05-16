# PRD — Catálogo "Games" Amstrad CPC (iteración 7)

> Fuente de verdad de los criterios de aceptación: `specs/acceptance-criteria.md` (sección "Catálogo Games — Amstrad CPC (iteración 7)").
> Manual operativo: `CLAUDE.md` (12 fases ADLC).

## 1. Objetivo

Añadir una nueva sección `/games` al portal `apps/web` que muestre **10 clásicos icónicos de Amstrad CPC (464 / 6128)**, con ficha de detalle por juego, buscador por título y filtro por género (chips), siguiendo la estética metalera/retro oscura del catálogo de discos pero con detalles 8-bit. Backend en `apps/api` con dataset curado y endpoints REST tipados.

## 2. Alcance

- Backend Fastify:
  - Tipos `Game` y `GameReview` (citas de prensa).
  - Dataset estático con 10 juegos curados.
  - Endpoints `GET /games` (con `?q=` y `?genre=`) y `GET /games/:id`.
  - Constante `GAME_GENRES` exportada.
  - Tests vitest (estáticos y dinámicos por dataset).
- Frontend Next.js 15:
  - Tipos mirror + cliente HTTP.
  - Página listado `/games` con buscador (debounced, mismo patrón que `/albums`), filtro por género en chips, grid responsive de cards.
  - Página detalle `/games/[id]` con portada grande, metadatos (año, estudio, editor, género, sistema), descripción extensa y bloque de citas de prensa.
  - `not-found.tsx` para id inexistente.
  - Hero header retro tipográfico "GAMES — AMSTRAD CPC 464/6128".
  - Entrada "Games" en el header global (decisión: añadir, mejora UX sin riesgo, paralela a "Discos").
- Portadas en `apps/web/public/covers/games/<slug>.jpg` (descargadas de Wikipedia/CPC-Power con User-Agent realista). Slugs en kebab-case sin acentos.
- Tests E2E Playwright para listado, buscador, filtro por género y ficha de detalle.
- Spec con criterios verificables en `specs/acceptance-criteria.md`.

## 3. Fuera de alcance

- Catálogo extendido (>10 juegos).
- Reviews multi-sección largas (basta con descripción + 1-2 citas por juego).
- Backend dinámico (la BD privada queda como está; el dataset es estático en código).
- Compras, carrito o ratings de usuarios para juegos. El carrito existente no integra con games.
- Internacionalización adicional. Mantener idioma actual del portal.
- Cambios al catálogo de discos o de productos.

## 4. Usuarios / actores

- Visitante del portal interesado en cultura retro / nostalgia Amstrad.
- Mismo perfil que `/albums`: navegación informativa, no transaccional.

## 5. Requisitos funcionales

### Backend
- **RF-B1**: `GET /games` devuelve array de juegos. Soporta `?q=<title substring>` y `?genre=<exact>`. Combinables. `q` con `maxLength: 200`, `genre` con `maxLength: 50` (coherente con `routes/albums.ts`). `additionalProperties: false`. Param `id` con regex `^[A-Za-z0-9_.-]+$`.
- **RF-B2**: `GET /games/:id` devuelve el juego o `404` si no existe, con el mismo patrón que `/albums/:id`.
- **RF-B3**: Dataset con exactamente **10** juegos curados. Lista por defecto (puede ajustarse 1-2 con justificación documentada en el commit):
  1. Renegade (Imagine, 1987)
  2. Knight Lore (Ultimate Play the Game, 1985)
  3. Chase H.Q. (Ocean, 1988)
  4. Operation Wolf (Ocean, 1988)
  5. Head Over Heels (Ocean, 1987)
  6. Boulder Dash (First Star Software / Front Runner, 1985)
  7. Elite (Firebird, 1985)
  8. La Abadía del Crimen (Opera Soft, 1987)
  9. Sorcery (Virgin Games, 1985)
  10. R-Type (Electric Dreams, 1988)
- **RF-B4**: Cada juego incluye: `id` (slug), `title`, `year`, `developer`, `publisher`, `genre`, `system` (string con uno o dos modelos: "Amstrad CPC 464" / "Amstrad CPC 464 / 6128" / "Amstrad CPC 6128"), `description` (>=200 chars), `coverUrl` (path relativo `/covers/games/<slug>.jpg`, mismo nombre de campo que `Album.coverUrl`), `quotes: GameQuote[]` con 1-2 citas de prensa de la época.
- **RF-B5**: Cada `GameQuote` incluye: `outlet` (no vacío), `year` (entero `[1984, 1995]`), `quote` (no vacío), `url` (`https://...` o ausente si no localizable). Si no hay URL fiable, el campo se omite y se documenta como gap rojo en el reporte de cierre.
- **RF-B6**: Constante `GAME_GENRES: readonly string[]` exportada, ordenada alfabéticamente, con los géneros únicos del dataset.

### Frontend
- **RF-F1**: `/games` lista los 10 juegos en grid responsive (mismo patrón que `/albums`).
- **RF-F2**: Buscador por título con debounce 250ms.
- **RF-F3**: Fila de chips de género con `role="group"`, `aria-label="Filtrar por género"`, `aria-pressed` en cada chip y `data-testid="game-genre-chip-<slug>"`. Click en chip activo lo deselecciona.
- **RF-F4**: Botón "Limpiar filtros" resetea búsqueda y género.
- **RF-F5**: Card del juego muestra portada, título, año, género (badge). Hover con sombra dura.
- **RF-F6**: `/games/[id]` muestra portada grande, título (H1), año, estudio (developer), editor (publisher), género, sistema, descripción extensa y bloque de citas con `<figure><blockquote>…</blockquote><figcaption>` o `<cite>` con `<a target="_blank" rel="noopener noreferrer">` cuando exista URL.
- **RF-F7**: `not-found.tsx` para juegos inexistentes con enlace de vuelta a `/games`.
- **RF-F8**: Entrada "Games" en `iron-deck-header.tsx` enlaza a `/games`.

### Estética
- **RF-E1**: Paleta coherente con la metalera oscura existente (`var(--metal-blood)`, `var(--metal-bone)`, `border-stone-800`, mayúsculas tracking ancho).
- **RF-E2**: Detalles retro/8-bit: borders `border-2` nítidos, fuente monoespaciada en metadatos del juego (`font-mono` o similar), scanlines opcionales en el hero con `linear-gradient` repeating.
- **RF-E3**: Hero header en `/games` con tipografía grande "GAMES — AMSTRAD CPC 464/6128".

## 6. Requisitos no funcionales

- **RNF-1**: TypeScript estricto. `tsc --noEmit` verde en backend y frontend.
- **RNF-2**: Suite vitest backend completa verde (incluye los nuevos tests). Conteo literal en reporte.
- **RNF-3**: Suite Playwright completa verde con `--workers=1` (deuda heredada documentada).
- **RNF-4**: 0 errores 4xx/5xx y 0 errores en consola en smoke MCP sobre `/games` y al menos 2 fichas distintas.
- **RNF-5**: `npm audit --audit-level=high` sin HIGH/CRITICAL en `apps/api` y `apps/web`.
- **RNF-6**: URLs de citas 100% `https://`. Si alguna falla, se omite y se reporta gap.
- **RNF-7**: Sin dependencias nuevas salvo justificación explícita en el reporte.

## 7. Restricciones

- No tocar catálogo de discos (`apps/api/src/data/albums*.ts`, `apps/web/app/albums/`, `apps/web/components/album*.tsx`).
- No tocar `apps/api/src/data/products.ts` ni `/products`.
- No introducir secretos.
- No fabricar URLs ni datos: año/estudio/cita verificables o vacíos.
- No descartar errores de consola como "ruido" sin investigarlos.

## 8. Arquitectura esperada

### Backend (`apps/api`)

```
src/
  types/
    album.ts          (existente, intacto)
    game.ts           (NUEVO — Game, GameQuote, GameGenre)
  data/
    albums.ts         (intacto)
    album-reviews.ts  (intacto)
    products.ts       (intacto)
    games.ts          (NUEVO — 10 juegos + GAME_GENRES)
  routes/
    albums.ts         (intacto)
    products.ts       (intacto)
    games.ts          (NUEVO — GET /games, GET /games/:id)
  app.ts              (modificar: registerGames)
tests/
  albums.test.ts            (intacto)
  albums-review.test.ts     (intacto)
  products.test.ts          (intacto)
  games.test.ts             (NUEVO — endpoints + dataset)
```

`GET /games` schema Fastify con querystring `{ q?: string(maxLength 50), genre?: string(maxLength 50) }`. Filtrado en memoria con `findGames({ q, genre })`. `GET /games/:id` con `404` por id desconocido.

### Frontend (`apps/web`)

```
app/
  albums/                       (intacto)
  games/
    page.tsx                    (NUEVO — server component, fetch inicial + GamesGrid)
    [id]/
      page.tsx                  (NUEVO — ficha)
      not-found.tsx             (NUEVO)
components/
  album-card.tsx                (intacto)
  albums-grid.tsx               (intacto)
  game-card.tsx                 (NUEVO)
  games-grid.tsx                (NUEVO — buscador + chips + grid)
  iron-deck-header.tsx          (modificar: añadir "Games")
lib/
  album-types.ts                (intacto)
  albums-api.ts                 (intacto)
  game-types.ts                 (NUEVO — mirror de Game/GameQuote)
  games-api.ts                  (NUEVO — fetchGames, fetchGame)
public/
  covers/
    games/
      <slug>.jpg                (NUEVOS — 10 portadas + fallback)
e2e/
  games.spec.ts                 (NUEVO — listado, buscador, chip, ficha)
```

## 9. Criterios de aceptación verificables

Se mantienen en `specs/acceptance-criteria.md`, sección "Catálogo Games — Amstrad CPC (iteración 7)". Cada checkbox lleva el comando o test que lo valida. Auditoría final en Fase 8.

## 10. Riesgos

- **R1 — Portadas no localizables**: alguna imagen no descargable por bloqueo de User-Agent o 404. Mitigación: User-Agent realista; si falla, placeholder neutro y gap rojo documentado, no se inventa.
- **R2 — Citas sin URL fiable**: la prensa de la época (Amstrad Action, MicroHobby, Crash) está parcialmente digitalizada. Mitigación: solo se incluyen URLs verificables; el resto se documenta sin URL como gap rojo en `acceptance-criteria.md`.
- **R3 — Paralelización Playwright**: la API es single-threaded en dev; se mantiene `--workers=1` como deuda heredada de iteración 4.
- **R4 — Conflicto en `iron-deck-header.tsx`**: solo el agente frontend lo edita; ningún otro agente debe tocarlo en la iteración.
- **R5 — Hardcode duplicado**: la deuda de `BANDS` hardcoded en frontend ya existía (R1 reviewer iter-6). Para `GAME_GENRES`, exponer constante en `lib/game-types.ts` re-exportando desde la API si se importa, o documentar mirror si no.

## 11. Puntos de aprobación humana

- **Fase 11 (CLAUDE.md)**: el usuario aprueba el cierre tras leer la tabla de criterios, el security gate y el veredicto del reviewer.
- **Cierre operativo**: el usuario invoca `/ship` para abrir el PR. No se hace `git push` ni `gh pr create` desde el agente.
- **Decisión de ajustar la lista de 10 juegos**: si durante la ejecución algún subagente propone sustituir un título, debe documentarlo en el reporte y esperar OK explícito del usuario antes de cerrar.
