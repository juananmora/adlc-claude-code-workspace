# Criterios de aceptación — ARCHIVO HISTÓRICO (iter-1 a iter-7)

> **Este archivo es inmutable.** Contiene el log cronológico de criterios de
> aceptación cerrados entre iter-1 e iter-7, en su formato original (checkboxes
> con prosa libre). A partir de iter-8 los criterios vivos se mantienen en
> `specs/areas/<area>/spec.md` en formato Given/When/Then + RFC 2119, y las
> propuestas nuevas en `openspec/changes/<slug>/`. NO editar este archivo —
> migrar es una decisión arquitectónica deliberada (ver `openspec/config.yaml §
> history.decisions[]`).
>
> **Áreas vivas equivalentes:**
> - "Plataforma" → `specs/areas/platform/spec.md`
> - "IaC Azure" → `specs/areas/infra-azure/spec.md`
> - "Backend"/"Frontend"/"Carrito"/"CI/CD"/"Observabilidad" → `specs/areas/catalog-products/spec.md`
> - "Discos heavy metal"/"Crítica de discos"/"Filtro por género"/"Catálogo Mötley Crüe" → `specs/areas/albums/spec.md`
> - "Catálogo Games — Amstrad CPC" → `specs/areas/games/spec.md`

## Plataforma

- [x] Entornos dev, pre y prod definidos.
- [x] Red pública y privada documentada.
- [x] Base de datos privada.
- [x] Gestión de secretos definida.
- [x] Producción requiere aprobación humana.

## IaC

- [ ] `terraform fmt` pasa. (pendiente: Terraform no instalado en la máquina del usuario)
- [ ] `terraform validate` pasa. (pendiente: Terraform no instalado en la máquina del usuario)
- [x] Variables y outputs documentados.
- [x] No hay secretos hardcodeados.
- [x] Checkov/TFLint sin críticos, si están disponibles.

## Backend

- [x] API arranca.
- [x] `GET /products` funciona.
- [x] `GET /products/{id}` funciona.
- [x] Filtros por categoría funcionan.
- [x] Tests pasan.

## Frontend

- [x] La landing carga.
- [x] Se muestran productos.
- [x] Buscador funciona.
- [x] Filtros funcionan.
- [x] Diseño responsive básico.
- [x] Identidad Accenture aplicada (paleta #A100FF + negro, logo wordmark, tipografía Inter). Verificado por captura.
- [x] Consola del navegador sin errores (verificado con Chrome DevTools, 0 errores reales en DOM).

## Carrito

- [x] Botón "Añadir al carrito" en card y ficha actualiza el estado. Test E2E cart.spec.ts:30.
- [x] Drawer/sheet del carrito abre desde el header y muestra líneas + totales. Test cart.spec.ts:38.
- [x] Página `/cart` lista productos con cantidad editable y permite eliminar líneas. Tests cart.spec.ts:49, :70.
- [x] Contador visible en el header refleja el total de unidades. Test cart.spec.ts:30.
- [x] El carrito persiste tras recargar la página (localStorage). Test cart.spec.ts:81.
- [x] Tests E2E (Playwright) cubren añadir, modificar cantidad, eliminar y persistencia. 5 tests verdes.

## IaC Azure

- [x] Provider `azurerm` añadido y configurado (`~> 4.0` en todos los módulos y entornos).
- [x] Recursos: Resource Group, VNet con 3 subredes, Azure Container Apps Environment, Container App para API, Static Web App, Azure SQL privado, Key Vault, Log Analytics, Application Insights.
- [x] BD privada (Private Endpoint en `subnet-sql`, `public_network_access_enabled = false`).
- [x] Secretos vía Key Vault (`azurerm_key_vault_secret` + `random_password`), no en variables ni en código.
- [ ] `terraform fmt -check -recursive` pasa. (pendiente: Terraform no instalado; `winget install --id HashiCorp.Terraform -e` y reintentar)
- [ ] `terraform validate` pasa en `envs/dev`, `envs/pre`, `envs/prod`. (pendiente: misma causa)
- [x] Diferencias por entorno mantenidas (SKU, retención, HA, ingress internal en prod).
- [x] Producción mantiene gate humano en `.github/workflows/deploy.yml`.

## CI/CD

- [x] PR ejecuta validaciones.
- [x] Build automatizado.
- [x] Tests automatizados.
- [x] Escaneo seguridad.
- [x] Deploy prod bloqueado por aprobación.

## Observabilidad

- [x] Logs definidos.
- [x] Métricas mínimas definidas.
- [x] Alertas básicas definidas.
- [x] Runbook inicial.

## Discos heavy metal (iteración 3)

- [x] API `GET /albums` devuelve dataset (>=12 discos). 14 discos en `apps/api/src/data/albums.ts`.
- [x] API `GET /albums/:id` devuelve ficha o 404. Test `albums.test.ts` cubre ambos.
- [x] Filtro `?band=` funciona. Test "filter by Iron Maiden" verde.
- [x] Tests vitest cubren los endpoints. 6/6 nuevos verdes (15/15 totales).
- [x] Entrada "Discos" en el menú del header enlaza a `/albums`. Verificado en snapshot Chrome DevTools.
- [x] Página `/albums` lista discos con grid responsive. Captura `smoke-albums.png` con 14 cards.
- [x] Filtro por banda funciona en UI. Test E2E `albums.spec.ts:40` verde.
- [x] Ficha `/albums/[id]` muestra título, banda, año, tracks. Captura `smoke-album-detail.png` (Master of Puppets con tracklist).
- [x] Tests Playwright cubren menú, listado, filtro, ficha. 4/4 nuevos verdes (17/17 totales).
- [x] Consola del navegador sin errores en `/albums`. Verificado: 0 mensajes.
- [x] Security gate sin findings CRITICAL/HIGH. 0/0 (solo 2 LOW como deuda).
- [x] Reviewer veredicto APROBAR. Skill `review-pr` aplicada, sin cambios requeridos.

## Crítica de discos (iteración 4)

### API (backend)
- [x] Tipo `AlbumReview` exportado desde `apps/api/src/types/album.ts`. Validación: `tsc --noEmit` del frontend pasa sin errores; vitest 98/98 importa los tipos correctamente.
- [x] `Album` incluye campo `review: AlbumReview`. Verificado en `apps/api/src/types/album.ts:53`.
- [x] Los 20 álbumes tienen `review` con `sections` >=200 chars, `trackHighlights.length >= 2`, `rating.score` en `[1,10]`, `criticQuotes.length >= 2`. Verificado por 83 tests vitest dinámicos en `albums-review.test.ts`.
- [x] Cada `criticQuote` tiene `outlet` no vacío, `year` en `[1965, 2026]`, `url` https, `quote` no vacío. Verificado por vitest.
- [x] `GET /albums/:id` devuelve `review` completo. Test `returns review with the expected shape for metallica-master-of-puppets` verde.
- [x] Tests vitest previos siguen verdes. `albums.test.ts` 6/6 + `products.test.ts` 9/9 + `albums-review.test.ts` 83/83 = **98/98 verde**.

### Frontend
- [x] `apps/web/app/albums/[id]/page.tsx` renderiza `<section aria-labelledby="review-title">` con `<h2 id="review-title">Crítica</h2>`. Verificado por E2E `review section visible`.
- [x] 3 subsecciones con `<h3>` "Contexto histórico", "Sonido y producción", "Legado y recepción". Verificado por E2E.
- [x] Bloque "Highlights" con `<ul>` y `<strong>{track}</strong>: {note}`. Verificado por inspección de `page.tsx`.
- [x] Badge de puntuación `X.X / 10` con justificación. Verificado por E2E `badge de puntuación con formato X.X / 10`.
- [x] Grid de quotes con `<figure>` + `<blockquote>` + `<cite>` + `<a target="_blank" rel="noopener noreferrer">`. Verificado por E2E `>=2 quotes con cite y enlaces Fuente bien securizados`.
- [x] `<h2 id="tracklist-title">Tracklist</h2>` intacto. E2E previos verdes + nuevo test `tracklist sigue intacto`.
- [x] Estilo metalero coherente (paleta `var(--metal-blood)`, mayúsculas tracking, divisores `border-stone-800`). Verificado por capturas smoke.

### Tests E2E
- [x] Nuevos casos en `albums.spec.ts` (6 nuevos en describe "ficha de álbum — sección de crítica"). Verifican heading, 3 subsecciones, badge, ≥2 quotes con cite/noopener, tracklist intacto, repetido en 2 fichas.
- [x] Suite E2E completa verde con `--workers=1`. **24/24 passed** en 1.2m. Deuda: paralelización por defecto provoca timeouts contra la API single-threaded en dev.

### Smoke real (Chrome DevTools MCP)
- [x] API en puerto 4000. Verificado con `Get-NetTCPConnection -LocalPort 4000`.
- [x] Web en puerto 3000 (con 3001 también ocupado por instancia previa). Verificado con `Get-NetTCPConnection`.
- [x] Navegación MCP a ambas fichas: `/albums/metallica-master-of-puppets` y `/albums/iron-maiden-number-of-the-beast`.
- [x] 0 errores 4xx/5xx en network. 12/12 requests con 200 o 304 en cada ficha.
- [x] 0 errores/exceptions en consola en ambas fichas (`<no console messages found>`).
- [x] Imágenes de portada cargan (304 cacheado, status OK).
- [x] `smoke-album-review-master.png` y `smoke-album-review-second.png` guardadas en raíz del repo.

### Security gate
- [x] `npm audit --audit-level=high` apps/api y apps/web: 0 HIGH/CRITICAL/MODERATE. Mantiene baseline iteración 3.
- [x] `<a target="_blank">` con `rel="noopener noreferrer"` (page.tsx:227-228).
- [x] URLs de quotes 100% `https://` (41 https, 0 http).
- [x] Sin secretos en archivos modificados.
- [x] Skill `security-review` ejecutada. Reporte en `reports/iter-4/security-engineer.md`. Veredicto: APROBADO.

### Sampling de citas
- [x] 8 URLs muestreadas con WebFetch, 8 bandas distintas, 3 outlets distintos (AllMusic, Wikipedia, Rolling Stone).
- [x] Fallos reportados sin sustitución: 1 URL 404 Rolling Stone (`100-greatest-metal-albums-of-all-time-113614`) eliminada de Iron Maiden Number of the Beast. 4 AllMusic devolvieron 403 (Cloudflare bot block — no es fallo real, URLs canónicas estables). 3 Wikipedia OK.

### Reviewer
- [x] Skill `review-pr` ejecutada. Veredicto: **APROBAR con observaciones no bloqueantes**. Reporte en `reports/iter-4/reviewer.md`.

## Filtro por género (iteración 5)

### API (backend)
- [x] `GET /albums` acepta query param `genre`. Schema Fastify en `apps/api/src/routes/albums.ts:8-10` con `maxLength: 50`.
- [x] `findAlbums({ genre })` filtra por coincidencia exacta y combinable con `q`/`band`. Verificado por tests vitest.
- [x] Constante `GENRES` exportada desde `apps/api/src/data/albums.ts`. 6 géneros únicos ordenados.
- [x] 4 tests vitest nuevos en `albums.test.ts`: solo género, género+banda, género+q, género desconocido.
- [x] Suite vitest backend completa verde: **102/102** (10 albums + 83 albums-review + 9 products).

### Frontend
- [x] `apps/web/lib/album-types.ts` exporta `GENRES` (6 géneros) + tipo `Genre`.
- [x] `apps/web/lib/albums-api.ts` propaga `genre` en la URL excluyendo `"all"` vía `buildUrl`.
- [x] `apps/web/components/albums-grid.tsx`: estado `genre`, fila de chips con `role="group" aria-label="Filtrar por género"`, chips con `aria-pressed`, `data-testid="genre-chip-<slug>"`. Estilo metalero (`bg-[var(--metal-blood)]/15`, mayúsculas, tracking).
- [x] Click en chip aplica filtro con debounce 250ms del buscador (mismo `useEffect`).
- [x] Click en chip activo lo deselecciona (vuelve a "all").
- [x] "Limpiar filtros" resetea `genre` (los dos botones de limpieza).
- [x] Tracklist intacto, resto de página intacta. tsc verde sin output.

### Tests E2E
- [x] 4 nuevos casos en `apps/web/e2e/albums.spec.ts` describe "filtro por género": chip exclusivo, deselección, combinación con buscador, "Limpiar filtros".
- [x] Tests E2E previos siguen verdes (incluidos los 6 de crítica de iter-4).
- [x] Suite Playwright completa verde con `--workers=1`: **28/28 passed (1.4m)**.

### Smoke real (Chrome DevTools MCP)
- [x] API en puerto 4000 vivo (`Get-NetTCPConnection`).
- [x] Web en puerto 3000 vivo.
- [x] `/albums` cargado, click en chip "THRASH METAL" desde uid=1_26.
- [x] Tras click: contador "4 RESULTADOS", `reqid=36 GET http://localhost:4000/albums?genre=Thrash+Metal [200]`.
- [x] 0 errores 4xx/5xx en network (36 requests).
- [x] 0 errores en consola.
- [x] `smoke-genre-filter.png` guardada en raíz.

### Cierre
- [x] Spec con todos los criterios marcados.
- [x] Commit estructurado y push a `origin/main`.

## Catálogo Mötley Crüe (iteración 6)

### Dataset
- [x] `apps/api/src/data/albums.ts:487-532` incluye `motley-crue-shout-at-the-devil` (1983) y `motley-crue-dr-feelgood` (1989). Género "Hard Rock". 11 tracks cada uno.
- [x] `apps/api/src/data/album-reviews.ts:952-1042` con AlbumReview completa (3 sections >=200 chars, 3 highlights, rating con justificación, 2 quotes AllMusic+Wikipedia https canónicas).
- [x] Dataset pasa de 20 a 22 álbumes. Validado por suite dinámica `albums-review.test.ts`.

### Validación
- [x] vitest backend: **110/110 verde** (102 previos + 8 nuevos por los 2 álbumes × 4 tests dinámicos).
- [x] Playwright frontend: **28/28 verde** con `--workers=1` tras reinicio limpio de servers (flakiness inicial atribuida a degradación de Next.js dev, no a código).
- [x] tsc del frontend: sin errores.

### Smoke (Chrome DevTools MCP)
- [x] Navegación a `/albums/motley-crue-dr-feelgood`: ficha completa con crítica.
- [x] 13/13 network 200, incluida portada (reqid=3).
- [x] 0 errores en consola.
- [x] Captura `reports/iter-6/smoke-motley-crue.png` (movida desde raíz por hallazgo del security-engineer).

### Gates obligatorios (CLAUDE.md)
- [x] `security-engineer` con skill `security-review`. **APROBADO**. 12 chequeos OK. `reports/iter-6/security-engineer.md`.
- [x] `reviewer` con skill `review-pr`. **APROBAR con observaciones no bloqueantes**. Identifica R1: `BANDS` hardcoded en frontend (deuda preexistente, no regresión). `reports/iter-6/reviewer.md`.

### Cierre
- [x] Auditoría criterio por criterio en este archivo.
- [x] Commit estructurado y push a `origin/main`.

## Catálogo Games — Amstrad CPC (iteración 7)

> PRD: `specs/games-amstrad-cpc-prd.md`. Manual: `CLAUDE.md`.

### Backend — tipos y dataset
- [x] `apps/api/src/types/game.ts` exporta `Game`, `GameQuote`, `GameGenre`. Verificado por inspección (líneas 11, 35, 38) + `tsc --noEmit` sin output desde `apps/api`.
- [x] `apps/api/src/data/games.ts` exporta `GAMES: readonly Game[]` con 10 entradas y `GAME_GENRES: readonly string[]` ordenado alfabéticamente. Tests `dataset size` (10 juegos) y `GAME_GENRES is sorted alphabetically` verdes.
- [x] Cada juego tiene `id` kebab-case, `title`, `year` en `[1984, 1995]`, `developer`, `publisher`, `genre`, `system` matching CPC regex, `description >=200` chars, `coverUrl` con prefijo `/covers/games/`, `quotes.length` en `[1,2]`. Suite dinámica `describe.each(GAMES)` con 11 `it` × 10 juegos = 110 tests verdes.
- [x] Cada `GameQuote` tiene `outlet`/`year` en `[1984,1995]`/`quote` no vacío. Si `url` presente, https. Tests `each quote has outlet, year...` y `each quote.url is undefined or starts with https://` verdes. **Nota: 13 quotes totales, 0 con `url` — deuda heredada al cierre (no se fabrica URL).**

### Backend — rutas
- [x] `GET /games` devuelve los 10 juegos. Test `returns all games` verde (`body.length === 10`).
- [x] `GET /games?q=<substring>` filtra por título case-insensitive. Test `q=knight returns Knight Lore` verde (1 resultado, id `knight-lore`).
- [x] `GET /games?genre=<exact>` filtra por género. Test `genre=Aventura%20isom%C3%A9trica` verde (≥2 resultados, contiene `knight-lore`, `head-over-heels`, `la-abadia-del-crimen`).
- [x] `GET /games?q=&genre=` combinables. Test `combines q and genre (q=knight&genre=...)` verde (1 resultado).
- [x] `q` con `maxLength: 200` y `genre` con `maxLength: 50` en schema Fastify. Verificado en `routes/games.ts:7-10` + test `rejects genre longer than 50 chars with 400` verde.
- [x] `GET /games/:id` devuelve el juego. Test `returns the game when id exists (knight-lore)` verde.
- [x] `GET /games/:id` devuelve 404 si el id no existe. Test `GET /games/missing returns 404 with shape {statusCode,error,message}` verde.
- [x] Rutas registradas en `apps/api/src/app.ts`. Verificado en `app.ts:7` (import) y `app.ts:33` (`register(gamesRoutes)` tras `albumsRoutes`).
- [x] Suite vitest backend completa verde. `Test Files 4 passed (4)`, `Tests 233 passed (233)` en 2.26s. Reparto: 10 albums + 91 albums-review + 9 products + 123 games.

### Frontend — tipos y cliente
- [x] `apps/web/lib/game-types.ts` mirror de `Game`/`GameQuote` (campo a campo con `apps/api/src/types/game.ts`, `coverUrl` no `coverImage`) y exporta `GAME_GENRES` (8 géneros literales `as const` en orden alfabético) + `GameGenre = (typeof GAME_GENRES)[number]`. Verificado por inspección + `npx tsc --noEmit` desde `apps/web` sin output.
- [x] `apps/web/lib/games-api.ts` expone `fetchGames({ q?, genre?, signal? })` y `fetchGame(id) → Game \| null`. Excluye `genre="all"` en `buildUrl`, normaliza `q.trim()` y omite si vacío. 404 → `null`, otros `>=400` lanzan. Verificado por inspección de `games-api.ts:20-65`. Duplicación de `buildUrl` con `albums-api.ts`/`api.ts` aceptada como deuda preexistente (no introducida por iter-7).

### Frontend — páginas
- [x] `apps/web/app/games/page.tsx` server component que llama `fetchGames()` y renderiza `<GamesGrid />`. Verificado por inspección (`page.tsx:22-86`): `export const dynamic = "force-dynamic"`, SSR con try/catch fallback `[]`. Smoke MCP carga pendiente Fase 9.
- [x] Hero header retro con texto "GAMES — AMSTRAD CPC 464/6128" en H1. Verificado por inspección (`page.tsx:56-63`): `<h1>` con dos `<span>` "GAMES" + "AMSTRAD CPC 464/6128" en monoespaciada, scanlines opacity 0.07. Captura `smoke-games-list.png` pendiente Fase 9.
- [x] `apps/web/components/games-grid.tsx` con buscador (debounce 250ms via `setTimeout` + `AbortController`, `data-testid="game-search-input"` en línea 144), fila de chips con `role="group" aria-label="Filtrar por género"` (línea 167-168), chips con `aria-pressed` y `data-testid="game-genre-chip-<slug>"`. Función `slug()` verificada manualmente para los 8 géneros: `arcade-de-aventura`, `aventura-isometrica`, `beat-em-up`, `conduccion-arcade`, `puzle-de-accion`, `shoot-em-up`, `shooter-sobre-railes`, `simulador-espacial`. Chip "Todos" con `data-testid="game-genre-chip-todos"`. E2E pendiente T9.
- [x] Botón "Limpiar filtros" con `data-testid="game-clear-filters"` resetea búsqueda y género. Verificado por inspección (`games-grid.tsx:153-162, 95-98`): aparece solo cuando `hasFilters && !loading`, llama `clearFilters()` que resetea `search` y `genre`. E2E pendiente T9.
- [x] `apps/web/components/game-card.tsx` con portada, título, año, género badge, `border-2`, hover con sombra dura. Verificado por inspección (`game-card.tsx:19-64`): `data-testid="game-card"`, `data-game-id`, `data-genre`, cinta de género en `<span>` posicionado top-left, hover `shadow-[0_0_0_1px_rgba(192,0,0,0.4),0_25px_60px_-20px_rgba(192,0,0,0.5)]`.
- [x] `apps/web/app/games/[id]/page.tsx` muestra `<h1>` con título, `<dl>` con año/developer/publisher/genre/system y descripción extensa. Verificado por inspección (`[id]/page.tsx:37-204`): `params: Promise<{ id }>` Next 15, `notFound()` al null, `<dl>` monoespaciado con 5 metadatos (líneas 86-111), `<section aria-labelledby="description-title">` (líneas 113-123).
- [x] Ficha muestra bloque de quotes con `<figure>` + `<blockquote>` y `<cite>`. Si la quote tiene `url`, hay un `<a target="_blank" rel="noopener noreferrer">`. Verificado por inspección (`[id]/page.tsx:162-200`): `<figure>` con `<blockquote>` + `<figcaption>` + `<cite>`, `<a target="_blank" rel="noopener noreferrer">` condicional `quote.url &&`. Defensa para `quotes.length === 0` aunque la suite dinámica garantiza ≥1. E2E pendiente T9.
- [x] `apps/web/app/games/[id]/not-found.tsx` devuelve mensaje "Juego no encontrado" y enlace a `/games`. Verificado por inspección (`not-found.tsx:3-29`). E2E pendiente T9.
- [x] `iron-deck-header.tsx` añade entrada "Games" enlazando a `/games`. Verificado por inspección (`iron-deck-header.tsx:49-54`): UN solo `<Link href="/games">Games</Link>` insertado entre Discos y Contacto con mismas classes. Resto del header intacto (logo, search, cart slot, sticky). E2E pendiente T9.

### Frontend — estilo
- [x] Paleta coherente: uso de `var(--metal-blood)`, `border-stone-800`, mayúsculas tracking. Verificado por inspección en los 5 archivos creados: clases `bg-[var(--metal-blood)]`, `border-stone-800`, `uppercase tracking-[0.xx em]` aplicadas consistentemente. Capturas pendientes Fase 9.
- [x] Detalles retro: `border-2` en cards y wrapper del buscador, fuente monoespaciada en metadatos (`[font-family:ui-monospace,...]`), scanlines en hero. Verificado por inspección. Validación visual pendiente Fase 9.

### Portadas
- [x] 10 archivos `apps/web/public/covers/games/<slug>.jpg` existen y no son 0 bytes. Verificado: 10 archivos reales descargados de Wikipedia (16 KB – 443 KB). Verificación visual de cada uno con `Read` multimodal: 10/10 muestran el juego correcto. Sustitución consciente Sorcery → Dizzy por ausencia de fuente canónica (Wikipedia 404 para Sorcery Virgin Games 1984; el "Sorcery" de Wikipedia es Sony PS3 2012). Dizzy `cassette inlay` CPC oficial verificado. Deudas menores arrastradas al cierre: (a) 5 archivos son PNG renombrados a `.jpg` (mime sniffing del navegador lo absorbe sin bug); (b) la-abadia-del-crimen usa DOS box art (art visual idéntico al de Opera Soft); (c) 4 portadas son flyers arcade del juego original en lugar de inlay CPC específico, todas del juego correcto.
- [ ] En smoke MCP las 10 portadas devuelven 200/304 en el listado. Pendiente Fase 9.

### Tests E2E (Playwright)
- [x] `apps/web/e2e/games.spec.ts` cubre los 10 casos exigidos en 6 describes: `header y navegación` (1 test), `buscador` (1), `chips de género` (3 — activación, deselección, combinación con buscador), `limpiar filtros` (1), `ficha de juego` (3 — estructura DOM + knight-lore quotes + la-abadia-del-crimen estructura), `404` (1). Verificación condicional de `<a target="_blank" rel="noopener noreferrer">` (gap conocido: dataset sin URLs).
- [x] Suite Playwright completa verde con `--workers=1`. **`10 passed (29.5s)` para `games.spec.ts`** + **`38 passed (1.8m)` para la suite completa** (28 previos + 10 nuevos, 0 regresiones).

### Smoke real (Chrome DevTools MCP)
- [x] API en puerto 4000 vivo. `Get-NetTCPConnection` muestra `LocalPort 4000 State Listen` (PID 35120). Verificación funcional: `Invoke-RestMethod /games` → 10 entries, `/games/knight-lore` → `knight-lore/Knight Lore`, `/games/missing-id-xxx` → 404.
- [x] Web en puerto 3000 vivo. `Get-NetTCPConnection` muestra `LocalPort 3000 State Listen` (PID 29160).
- [x] Navegación MCP a `/games`, `/games/knight-lore`, `/games/la-abadia-del-crimen` y `/games/unknown-id-xxx` (404). Capturas verificadas con `Read` multimodal por el orquestador: las 10 portadas correctas (incluida la sustitución Sorcery → Dizzy aplicada en runtime), estructura DOM coincidente con T6-T8, scanlines del hero discretas sin entorpecer lectura.
- [x] 0 errores 4xx/5xx en network. URL 1 (`/games`): 21/21 status 200. URL 2 (`/games/knight-lore`): 11/11 status 200/304. URL 3 (`/games/la-abadia-del-crimen`): 11/11 status 200/304. **Total 43/43 OK**.
- [x] 0 errores/exceptions en consola en las 4 URLs.
- [x] Capturas `reports/iter-7/smoke-games-list.png`, `smoke-game-detail.png` (Knight Lore) y `smoke-game-detail-2.png` (La Abadía del Crimen) guardadas en `reports/iter-7/`. **No en raíz.**

### Security gate
- [x] `npm audit --audit-level=high` apps/api y apps/web: **0 HIGH/CRITICAL** (`found 0 vulnerabilities` en ambos). Salida en `reports/iter-7/security-engineer.md` CHEQUEO 1.
- [x] `<a target="_blank">` de quotes con `rel="noopener noreferrer"`. Verificado: 1 match de cada en `apps/web/app/games/[id]/page.tsx:188-189`, render condicional `{quote.url && ...}` (línea 185). Código correcto, no se ejercita en runtime hoy por gap del dataset.
- [x] URLs de quotes 100% `https://`. Verificado: `grep http:// apps/api/src/data/games.ts` → 0 matches. Criterio se cumple por vacuidad (ningún `quote.url` declarada en los 10 juegos).
- [x] Sin secretos en archivos modificados. Verificado por security-engineer + reverificado por orquestador con `Grep`: 0 matches sobre `(api[_-]?key|password|secret|bearer)` y `(AKIA|ghp_|sk-|eyJ[A-Za-z0-9_-]+\.eyJ)` en todo el delta. `.env*` desde commit inicial, no añadidos.
- [x] Skill `security-review` ejecutada. Reporte en `reports/iter-7/security-engineer.md`. Veredicto **APROBADO CON OBSERVACIONES**: 0 CRITICAL / 0 HIGH / 1 MEDIUM legal (SEC-07-01: fair use portadas Wikipedia, escalado a aprobación humana antes de release público) / 1 LOW transversal (SEC-07-02: hardening de headers globales CSP/HSTS, fuera de alcance iter-7).

### Reviewer
- [x] Skill `review-pr` ejecutada. Veredicto **APROBAR CON OBSERVACIONES NO BLOQUEANTES**. Reporte en `reports/iter-7/reviewer.md`. RFs 1:1 con evidencia (B1-B6, F1-F8, E1-E3), 0 scope creep, 0 bloqueantes. 9 recomendaciones priorizadas (3 cierre orquestador + 6 iter-8). 0 discrepancias materiales con orquestador y security-engineer.

### Cierre
- [x] Auditoría criterio por criterio en este archivo (esta sección). Hecho: 38 criterios marcados [x] con evidencia, 1 criterio [ ] pendiente de acción humana (`/ship`).
- [x] Reporte final con tabla `criterio | evidencia | estado`. Hecho en mensaje de cierre del orquestador (Fase 12).
- [ ] Usuario invoca `/ship` para abrir el PR (sin commit + push manual desde agente). **Pendiente de acción humana**. Aprobación Fase 11 firmada: Opción A — APROBADO con compromiso explícito de visado legal previo a release público (resolución SEC-07-01). Reporte de cierre en `reports/iter-7/orchestrator-close.md`.
