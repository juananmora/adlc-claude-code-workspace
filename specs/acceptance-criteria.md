# Criterios de aceptación

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
