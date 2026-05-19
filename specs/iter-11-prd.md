# PRD iter-11 — Pantera en `/albums` + Commodore 64 en `/games`

> Fecha: 2026-05-19. Orquestación: Claude principal (ADLC 12 fases).
> Alcance: 2 dominios (`albums`, `games`). Sin tocar `infra`, `consoles`, `platform`, `catalog-products`.

## 1. Objetivo

Ampliar dos catálogos vivos del site con material clásico solicitado por el usuario:

1. **Catálogo `/albums`**: añadir 2 discos de **Pantera** (banda groove/thrash metal,
   ausente hasta ahora pese a estar pedida en la spec del dominio).
2. **Catálogo `/games`**: añadir juegos icónicos de **Commodore 64**, ampliando
   el dominio (hasta ahora cerrado a Amstrad CPC) a un catálogo *multi-sistema
   retro 8-bit*.

## 2. Alcance

### 2.1 Discos Pantera

| id | título | año | género |
|---|---|---|---|
| `pantera-vulgar-display-of-power` | Vulgar Display of Power | 1992 | Groove Metal |
| `pantera-cowboys-from-hell` | Cowboys from Hell | 1990 | Groove Metal |

Razón de la selección: el usuario pide explícitamente *Vulgar Display of Power*
y delega la elección del segundo a la propia orquestación. *Cowboys from Hell*
es el debut "definitivo" del Pantera moderno y el complemento canónico de
*Vulgar*: completan el díptico fundacional del groove metal de los 90.

### 2.2 Juegos Commodore 64

Selección curada (6 títulos) representativa del catálogo C64 1984-1990:

| id | título | año | género | dev/publisher |
|---|---|---|---|---|
| `the-last-ninja` | The Last Ninja | 1987 | Acción isométrica | System 3 |
| `impossible-mission` | Impossible Mission | 1984 | Plataformas puzle | Epyx |
| `maniac-mansion` | Maniac Mansion | 1987 | Aventura gráfica | Lucasfilm Games |
| `ik-plus` | International Karate + | 1987 | Lucha | System 3 |
| `wizball` | Wizball | 1987 | Shoot 'em up | Sensible Software / Ocean |
| `turrican` | Turrican | 1990 | Plataformas run & gun | Manfred Trenz / Rainbow Arts |

> **Sobre Boulder Dash**: ya está en el catálogo como entrada CPC. No se duplica
> para C64 aunque originalmente naciera en Atari/C64: se documenta en spec
> como decisión consciente.

### 2.3 Cambios estructurales necesarios

El dataset `games` está hoy *acoplado a Amstrad CPC* en:

- `apps/api/tests/games.test.ts`: regex `SYSTEM_PATTERN` solo acepta CPC;
  `MIN_YEAR`/`MAX_YEAR` cerrado a 1984-1995; `expect(GAMES).toHaveLength(10)`.
- `apps/api/src/types/game.ts`: jsdoc `system` solo describe CPC.
- `apps/web/app/games/page.tsx`: `<h1>` literal "AMSTRAD CPC 464/6128",
  subtítulo "10 CLÁSICOS ICÓNICOS · 1984-1995", metadata "Games — Amstrad CPC".
- `apps/web/e2e/games.spec.ts`: probablemente asserciones de textos/count.

Decisión: **generalizar a catálogo retro 8-bit multi-sistema**. Justificación:
es ya el segundo sistema que entra; mantener el acoplamiento haría que cada
nuevo sistema (ZX Spectrum, MSX) requiriera rebrandeo. La generalización es
barata si se hace ahora.

- Hero pasa a "RETRO 8-BIT — AMSTRAD CPC & COMMODORE 64" (h1) +
  "16 clásicos · 1984-1990" (subtítulo dinámico no acoplado al recuento).
- Regex `SYSTEM_PATTERN` acepta `"Amstrad CPC ..."` o `"Commodore 64"`.
- `MIN_YEAR`/`MAX_YEAR` permanecen 1984-1995 (sigue cubriendo todas las nuevas
  entradas); no se relajan más allá de lo necesario.
- `expect(GAMES).toHaveLength(N)` se sustituye por `>=10 && <=20` con asserción
  específica de presencia de los 6 nuevos ids.

## 3. Fuera de alcance

- No se añaden otros sistemas (Spectrum, MSX, NES).
- No se cambia la estructura visual de la ficha (`<dl>` 5 campos sigue OK).
- No se ataca deuda preexistente del backlog (REC-4 a REC-9 del spec games).
- No se toca `consoles` ni se añade Commodore 64 como videoconsola (es
  microordenador, encaja en games pero NO en consoles).

## 4. Requisitos funcionales

### RF-A1 — Pantera disponible en `/albums`

- `GET /albums` MUST devolver `>= 24` entradas (22 + 2 Pantera).
- `GET /albums?band=Pantera` MUST devolver exactamente 2 entradas, ambas con
  `band === "Pantera"`.
- `GET /albums/pantera-vulgar-display-of-power` MUST devolver 200 con `review`
  completa (mismas reglas REQ-ALB-3: 3 sections >=200 chars, >=2 trackHighlights,
  rating con score y justification, >=2 criticQuotes con `url` https).
- `GET /albums/pantera-cowboys-from-hell` MUST cumplir lo mismo.
- La página `/albums` MUST renderizar ambas cards (verificable por
  `data-album-id`).
- La ficha `/albums/pantera-vulgar-display-of-power` MUST renderizar h1
  "Vulgar Display of Power" + "Pantera" + crítica completa.

### RF-A2 — Catálogo multi-sistema en `/games`

- `GET /games` MUST devolver 16 entradas (10 CPC + 6 C64).
- `GET /games?genre=Lucha` MUST devolver al menos 1 entrada (`ik-plus`).
- `GET /games/maniac-mansion` MUST devolver 200 con `system === "Commodore 64"`.
- La página `/games` MUST renderizar h1 que mencione AMSTRAD y COMMODORE.
- Las nuevas cards MUST tener `data-game-id` correspondiente y `data-genre`.
- El nuevo género `Lucha` (de IK+) MUST aparecer como chip si no está ya.

### RF-A3 — Sin regresiones

- Todos los e2e existentes (albums, games, consoles, catalog, cart) deben
  seguir verdes tras los cambios. Si rompen por asserciones textuales obsoletas
  (p.ej. hero "AMSTRAD CPC 464/6128"), se actualizan acotadamente.
- Suite vitest `apps/api` 100% verde tras añadir entradas y regex multi-sistema.

## 5. Criterios de aceptación (G/W/T + RFC 2119)

- [ ] Given `GET /albums?band=Pantera`, when la API responde,
      then el body MUST tener `length === 2` y ambos con `band === "Pantera"`.
      Validación: `apps/api/tests/albums.test.ts` (nuevo caso).

- [ ] Given el dataset de álbumes, when se importa `albums`,
      then MUST contener `pantera-vulgar-display-of-power` y
      `pantera-cowboys-from-hell`.
      Validación: `npm run test --workspace apps/api`.

- [ ] Given `GET /albums/pantera-vulgar-display-of-power`, when la API responde,
      then `body.review.criticQuotes.length >= 2` y cada quote MUST tener
      `url` empezando por `https://`.
      Validación: suite dinámica `albums-review.test.ts`.

- [ ] Given el usuario en `/albums`, when la página carga,
      then MUST renderizar cards con `data-album-id="pantera-vulgar-display-of-power"`
      y `data-album-id="pantera-cowboys-from-hell"`.
      Validación: smoke MCP + Playwright `e2e/albums.spec.ts`.

- [ ] Given `GET /games`, when la API responde,
      then `body.length === 16` y MUST contener los 6 ids C64 nuevos.
      Validación: `apps/api/tests/games.test.ts` (ajustado).

- [ ] Given el dataset `GAMES`, when cada entry se valida con SYSTEM_PATTERN,
      then SHALL aceptar `"Amstrad CPC (464|6128|464 / 6128)"` o
      `"Commodore 64"`.
      Validación: regex ajustada en `games.test.ts`.

- [ ] Given el usuario en `/games`, when la página carga,
      then el `<h1>` MUST contener "AMSTRAD" y "COMMODORE".
      Validación: smoke MCP + Playwright.

- [ ] Given `GET /games/maniac-mansion`, when la API responde,
      then `body.system === "Commodore 64"` y `body.developer === "Lucasfilm Games"`.
      Validación: caso vitest específico.

- [ ] Given el suite e2e completa `apps/web/e2e`, when se ejecuta contra
      stack arrancado, then SHALL pasar 100% (con asserciones actualizadas
      donde aplique).
      Validación: `npx playwright test`.

## 6. Requisitos no funcionales

- **Seguridad**: todas las URLs nuevas en `criticQuotes`/`quotes` deben ser
  https y enlazar a fuentes verificables (Wikipedia, AllMusic, archive.org).
- **Performance**: ampliar dataset N→16 (games) y 22→24 (albums) no requiere
  paginación. Sigue cabiendo en SSR + filtros client-side.
- **Mantenibilidad**: la generalización del catálogo de games debe permitir
  añadir un tercer sistema (Spectrum) con cambios solo en `data/games.ts`,
  no en hero ni en tests estructurales.

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| E2E `games.spec.ts` rompe por hero textual | Ajustar asserciones acotadamente. Si no se puede sin reescribir todo el archivo, documentar en reporte y arreglar. |
| Boulder Dash duplicado CPC/C64 confunde | Decisión explícita en spec: una sola entrada (la CPC actual). Documentado. |
| Quotes C64 sin url verificable | Si no se confirma url https, se omite el campo (no se inventa). El test ya permite `url?` ausente. Documentar gap por entry afectada. |
| Smoke MCP no cubre nuevas fichas | Capturar al menos 1 screenshot por dominio nuevo (Pantera + Maniac Mansion). |

## 8. Plan operativo (tareas)

1. **PRD** (este archivo) — DONE.
2. **Backend albums**: añadir 2 entries en `albums.ts` + 2 reviews completas en
   `album-reviews.ts`. Spec `specs/areas/albums/spec.md` REQ-ALB-1 → `>=24`.
3. **Backend games**: añadir 6 entries en `games.ts`. Spec
   `specs/areas/games/spec.md` REQ-GAMES-2 → 16, multi-sistema.
4. **Tests vitest**: ampliar SYSTEM_PATTERN, dataset size, casos band=Pantera.
5. **Frontend albums**: descargar 2 covers en `apps/web/public/covers/`.
6. **Frontend games**: descargar 6 covers en `apps/web/public/covers/games/`.
   Ajustar hero `apps/web/app/games/page.tsx` (h1, subtítulo, metadata).
7. **E2E**: ajustar asserciones obsoletas en `e2e/games.spec.ts`.
8. **Smoke MCP**: arrancar stack, capturar 4 screenshots
   (`reports/iter-11/smoke-albums-pantera.png`,
   `smoke-album-detail-pantera.png`, `smoke-games-c64.png`,
   `smoke-game-detail-maniac-mansion.png`).
9. **Security gate** (Fase 7): urls quotes, no secretos, deps.
10. **Reviewer** (Fase 10): veredicto APROBAR antes de cierre.
11. **Cierre**: tabla criterios + comandos repro + pendientes humanos.
