# Spec — Catálogo de discos heavy metal (`/albums`)

22 álbumes con crítica multi-sección, filtros por banda y género, ficha de detalle.

> **Estado vivo.** Última actualización: iter-6 (commit `4cc586a`).

## Requirements

### REQ-ALB-1: Backend GET /albums

Given el dataset estático de álbumes,
when un cliente hace `GET /albums`,
then la API SHALL devolver `>=22` entradas, cada una con `id`, `title`,
`band`, `year`, `genre`, `description`, `coverUrl`, `tracks` (array no
vacío) y `review` (objeto completo).

**Validación:** `apps/api/tests/albums.test.ts` + `albums-review.test.ts`.

### REQ-ALB-2: Filtros backend

Given `GET /albums`,
when un cliente pasa `?q=<substring>`, `?band=<exacto>` o `?genre=<exacto>`
(o combinaciones),
then SHALL filtrar correctamente. Géneros desconocidos devuelven `[]`.
Los parámetros tienen `maxLength: 50` (band/genre) y `maxLength: 200` (q),
con `additionalProperties: false`.

**Validación:** `albums.test.ts` cubre los 4 casos y rechazo 400.

### REQ-ALB-3: Backend GET /albums/:id con review

Given un id de álbum existente,
when un cliente hace `GET /albums/:id`,
then SHALL devolver el álbum completo incluyendo `review` con:
- `sections.{historicalContext, sound, legacy}` cada una `>=200` chars,
- `trackHighlights.length >= 2`,
- `rating.score` en `[1, 10]` con `justification` no vacío,
- `criticQuotes.length >= 2`, cada quote con `outlet`, `year` en
  `[1965, 2026]`, `url` https y `quote` no vacíos.

Id desconocido devuelve 404 con shape `{statusCode, error, message}`.

**Validación:** suite dinámica `albums-review.test.ts` (83 tests × ítems).

### REQ-ALB-4: Constante GENRES ordenada

Given el dataset de álbumes,
when se exporta `GENRES` desde `apps/api/src/data/albums.ts`,
then SHALL ser un array de strings únicos ordenados alfabéticamente,
derivado del dataset.

**Validación:** test vitest sobre orden y unicidad.

### REQ-ALB-5: Listado /albums

Given el navegador en `/albums`,
when la página carga,
then MUST mostrar 22 cards en grid responsive con cover + título +
banda + año + cinta de género; hero con foto promocional y heading
"DISCOS QUE NO MUEREN".

**Validación:** `e2e/albums.spec.ts:22` + smoke MCP.

### REQ-ALB-6: Buscador

Given el listado cargado,
when el usuario teclea "Master" en el buscador,
then la grid SHALL mostrar `>=1` card cuyo `title` contenga "Master",
debounce 250ms, AbortController activo.

**Validación:** `e2e/albums.spec.ts:67`.

### REQ-ALB-7: Filtro por banda

Given el listado,
when el usuario selecciona "Iron Maiden" en el dropdown de banda,
then SHALL mostrar solo cards con `data-band="Iron Maiden"`.

**Validación:** `e2e/albums.spec.ts:40`.

### REQ-ALB-8: Filtro por género (chips)

Given el listado,
when el usuario hace click en el chip "Thrash Metal",
then SHALL mostrar solo cards con `data-genre="Thrash Metal"` y el
chip exhibe `aria-pressed="true"`. Click en el mismo chip lo
deselecciona (vuelve a "all"). "Limpiar filtros" resetea género +
banda + búsqueda.

**Validación:** `e2e/albums.spec.ts` tests de filtro por género (iter-5).

### REQ-ALB-9: Ficha de álbum con crítica

Given un id de álbum,
when el usuario navega a `/albums/<id>`,
then MUST renderizar:
- `<h1>` con título y banda,
- portada, año, género,
- `<section aria-labelledby="review-title">` con `<h2>Crítica</h2>`,
- badge `score X.X / 10` + justificación,
- 3 subsecciones `<h3>`: "Contexto histórico", "Sonido y producción",
  "Legado y recepción",
- bloque "Highlights" con `<ul>` y `<strong>{track}</strong>: {note}`,
- grid de quotes con `<figure><blockquote><cite>` y `<a target="_blank"
  rel="noopener noreferrer">` para URLs externas,
- `<h2 id="tracklist-title">Tracklist</h2>` con `<ol>`.

**Validación:** `e2e/albums.spec.ts` (6 tests de crítica iter-4) + smoke MCP.

### REQ-ALB-10: Identidad metalera

Given cualquier página bajo `/albums`,
when se renderiza,
then SHALL aplicar la paleta `var(--metal-blood)` + `var(--metal-bone)`,
fuente brutalist (`var(--font-metal)`), divisores `border-stone-800`,
mayúsculas tracking. El header global IRON DECK aparece en todas las
páginas del catálogo (resuelto en hotfix iter-7.1).

**Validación:** smoke MCP captura.

## Evidencia histórica

Iters 3, 4, 5, 6 cerraron este catálogo:
- iter-3: 14 álbumes + filtro banda.
- iter-4: crítica multi-sección (83 tests dinámicos).
- iter-5: filtro por género (chips).
- iter-6: +2 álbumes de Mötley Crüe (22 totales).

Ver `specs/acceptance-criteria-archive.md` §§ "Discos heavy metal", "Crítica de discos", "Filtro por género", "Catálogo Mötley Crüe".
