## Skills ejecutadas
- Skill(skill: "generate-tests") → aplicada

## Resumen

QA de iter-12 para el área `tours`. Test plan publicado en `reports/iter-12/qa-test-plan.md`, mapeando cada criterio G/W/T de `openspec/changes/tours/specs/tours.md` a un test concreto. Tests Vitest del backend ya entregados por el agente backend (75 verdes) y suite Playwright `apps/web/e2e/tours.spec.ts` creada de cero por QA espejando `consoles.spec.ts` línea a línea. Validación cruzada contra Docker: `docker compose build` + `docker compose up -d` con ambos contenedores `healthy`, suite completa de Playwright **63/63 verde** apuntando a `http://localhost:3000` (puertos publicados por el compose).

## Mapping criterio → archivo:línea → estado

### Backend — apps/api (vitest)

| Criterio (G/W/T) | Severidad | Archivo:línea | Estado |
|---|---|---|---|
| `GET /tours` sin filtros → 200 + 10 entradas ordenadas por `year` ASC | MUST | apps/api/tests/tours.test.ts:30 | verde |
| `GET /tours?decade=1990` → solo entradas con `decade === 1990` | MUST | apps/api/tests/tours.test.ts:45 | verde |
| `GET /tours?q=TOUR` substring case-insensitive sobre `name` | MUST | apps/api/tests/tours.test.ts:55 | verde |
| `GET /tours?band=Iron%20Maiden` → solo `band === "Iron Maiden"` | MUST | apps/api/tests/tours.test.ts:72 | verde |
| `GET /tours/:id` existente → 200 + shape `Tour` | MUST | apps/api/tests/tours.test.ts:89 | verde |
| `GET /tours/:id` inexistente → 404 + `{statusCode,error,message}` con id en message | MUST | apps/api/tests/tours.test.ts:103 | verde |
| `GET /tours/../etc/passwd` → 400/404, nunca leak | MUST | apps/api/tests/tours.test.ts:120 | verde |
| Dataset: ids únicos y kebab-case ascii | SHALL | apps/api/tests/tours.test.ts:134 | verde |
| Cada tour: `description` ≥200 chars | MUST | apps/api/tests/tours.test.ts:144 (describe.each) | verde |
| Cada tour: `band ∈ TOUR_BANDS`, `decade ∈ TOUR_DECADES` | MUST | apps/api/tests/tours.test.ts:152, 156 | verde |
| Cada tour: `countries.length >= 3`, `showsCount` int positivo, `coverUrl` empieza por `/covers/tours/` | MUST | apps/api/tests/tours.test.ts:160-176 | verde |
| `TOUR_BANDS` ordenado alfabéticamente y sin duplicados | MUST | apps/api/tests/tours.test.ts:180-188 | verde |
| `TOUR_DECADES === [1980, 1990, 2000]` | MUST | apps/api/tests/tours.test.ts:209 | verde |
| `TOURS.length === 10` | MUST | apps/api/tests/tours.test.ts:215 | verde |

### Frontend — apps/web (Playwright E2E)

| Criterio (G/W/T) | Severidad | Archivo:línea | Estado |
|---|---|---|---|
| `/tours` renderiza h1 con "Tours" + 10 cards + 0 errores consola | MUST | apps/web/e2e/tours.spec.ts:32 | verde |
| Header link `Tours` desde `/` navega a `/tours` y muestra 10 cards | MUST | apps/web/e2e/tours.spec.ts:69 | verde |
| Buscador `Justice` filtra cards cuyo `<h3>` contenga "justice" (debounce 250ms, waitForResponse pre-armado) | MUST | apps/web/e2e/tours.spec.ts:86 | verde |
| Chip 90s → `aria-pressed="true"` + todas las cards con `data-decade="1990"` | MUST | apps/web/e2e/tours.spec.ts:135 | verde |
| Click chip 90s otra vez → deselecciona, chip "todas" `aria-pressed="true"` y vuelven 10 cards | MUST | apps/web/e2e/tours.spec.ts:173 | verde |
| `/tours/world-slavery-tour`: h1 exacto, breadcrumb a `/tours`, `<dl>` con 5 `<dt>` (banda/año/década/álbum promocionado/fechas), descripción ≥200 chars | MUST | apps/web/e2e/tours.spec.ts:215 | verde |
| `/tours/black-album-tour`: h1 "Wherever I May Roam", `<dl>` con 5 `<dt>`, descripción ≥200 chars | MUST | apps/web/e2e/tours.spec.ts:258 | verde |
| Click en una card lleva a `/tours/<id>` (aria-label "Ver detalle de ...") y muestra ficha completa | MUST | apps/web/e2e/tours.spec.ts:277 | verde |
| `/tours/unknown-xxx` renderiza not-found con link `/tours` | MUST | apps/web/e2e/tours.spec.ts:316 | verde |

### Calidad transversal

| Criterio | Estado |
|---|---|
| `apps/api` `npm test` 100% verde sin warnings | verde — 511 tests / 6 files |
| `apps/web` `npx playwright test --workers=1` contra Docker 100% verde | verde — 63 tests |
| `apps/web/lib/credits.ts` muestra créditos en /about | verde (test pre-existente sigue pasando, ver fila `about.spec.ts` abajo) |

## Output literal — `npm test` (apps/api)

```
> api@0.1.0 test
> vitest run


 RUN  v4.1.6 C:/02 - Accenture/03 - Repositorios/adlc-claude-code-workspace/apps/api

 ✓ tests/products.test.ts (9 tests) 417ms
 ✓ tests/albums.test.ts (11 tests) 427ms
 ✓ tests/albums-review.test.ts (99 tests) 441ms
 ✓ tests/consoles.test.ts (127 tests) 441ms
 ✓ tests/games.test.ts (190 tests) 440ms
 ✓ tests/tours.test.ts (75 tests) 416ms

 Test Files  6 passed (6)
      Tests  511 passed (511)
   Start at  07:37:35
   Duration  3.03s (transform 1.15s, setup 0ms, import 3.96s, tests 2.58s, environment 1ms)
```

## Verificación contra Docker

### `docker compose ps` tras `docker compose up -d` + espera healthchecks

```
NAME            IMAGE                            COMMAND                  SERVICE   CREATED          STATUS                    PORTS
ironheart-api   adlc-claude-code-workspace-api   "docker-entrypoint.s…"   api       23 seconds ago   Up 22 seconds (healthy)   0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp
ironheart-web   adlc-claude-code-workspace-web   "docker-entrypoint.s…"   web       23 seconds ago   Up 16 seconds (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
```

Bucle de espera (un único intento bastó, ambos healthy en el primer poll):

```
try=0 api=healthy web=healthy
```

Curl sanity sobre rutas tours (host → contenedores):

```
GET /tours -> 200
GET /api tours -> 200   (puerto :4000)
GET /tours/world-slavery-tour -> 200
GET /tours/unknown-xxx -> 404
```

### Output literal — `npx playwright test --workers=1 e2e/tours.spec.ts` (contra Docker)

```
Running 9 tests using 1 worker

  ok 1 [chromium] › e2e\tours.spec.ts:32:7 › listado › navegar a /tours muestra h1 con 'Tours' y 10 cards, cero errores de consola (2.1s)
  ok 2 [chromium] › e2e\tours.spec.ts:69:7 › header y navegación › link 'Tours' del header navega desde / a /tours (1.1s)
  ok 3 [chromium] › e2e\tours.spec.ts:86:7 › buscador › buscar 'Justice' filtra a cards cuyo name lo contenga (1.6s)
  ok 4 [chromium] › e2e\tours.spec.ts:135:7 › chips de década › chip 90s deja solo cards con data-decade='1990' y aria-pressed correcto (1.2s)
  ok 5 [chromium] › e2e\tours.spec.ts:173:7 › chips de década › click otra vez en chip 90s lo deselecciona y vuelven 10 cards (1.6s)
  ok 6 [chromium] › e2e\tours.spec.ts:215:7 › ficha de tour › /tours/world-slavery-tour muestra h1, breadcrumb, dl con 5 metadatos y descripción >=200 chars (890ms)
  ok 7 [chromium] › e2e\tours.spec.ts:258:7 › ficha de tour › /tours/black-album-tour renderiza ficha completa con metadatos esperados (839ms)
  ok 8 [chromium] › e2e\tours.spec.ts:277:7 › ficha de tour › click en una card lleva a /tours/<id> y muestra ficha completa (1.0s)
  ok 9 [chromium] › e2e\tours.spec.ts:316:7 › 404 › /tours/unknown-xxx renderiza not-found con link a /tours (850ms)

  9 passed (16.7s)
```

### Output literal — `npx playwright test --workers=1` SUITE COMPLETA (contra Docker)

```
Running 63 tests using 1 worker

  ok  1 [chromium] › e2e\about.spec.ts:14:7 › /about — créditos del proyecto › entrada 'About' en el header navega a /about y muestra h1 (2.0s)
  ok  2 [chromium] › e2e\about.spec.ts:29:7 › /about — créditos del proyecto › /about muestra >=32 credit-entry con data-id y data-kind válidos (1.2s)
  ok  3 [chromium] › e2e\about.spec.ts:46:7 › /about — créditos del proyecto › distribución 22 álbumes + 10 juegos exacta (840ms)
  ok  4 [chromium] › e2e\about.spec.ts:54:7 › /about — créditos del proyecto › cada credit-entry tiene un link 'Fuente' externo con target=_blank y rel noopener (1.5s)
  ok  5 [chromium] › e2e\about.spec.ts:75:7 › /about — créditos del proyecto › /about contiene secciones 'Sobre este proyecto', 'Stack' y 'Agradecimientos' (805ms)
  ok  6 [chromium] › e2e\about.spec.ts:90:7 › /about — créditos del proyecto › sección 'Stack' lista las tecnologías clave (897ms)
  ok  7 [chromium] › e2e\about.spec.ts:112:7 › /about — créditos del proyecto › sección 'Agradecimientos' menciona gentle-ai (779ms)
  ok  8 [chromium] › e2e\about.spec.ts:126:7 › /about — créditos del proyecto › /about no genera errores 4xx/5xx ni consola (1.3s)
  ok  9 [chromium] › e2e\albums.spec.ts:22:5 › menú 'Discos' del header lleva a /albums y muestra al menos 12 cards (1.4s)
  ok 10 [chromium] › e2e\albums.spec.ts:40:5 › filtro por banda 'Iron Maiden' deja solo cards con data-band='Iron Maiden' (1.6s)
  ok 11 [chromium] › e2e\albums.spec.ts:67:5 › buscador 'Master' encuentra al menos 1 card (1.3s)
  ok 12 [chromium] › e2e\albums.spec.ts:86:5 › ficha desde card muestra título h1 + tracklist con <ol> y >=5 <li> (1.2s)
  ok 13 [chromium] › e2e\albums.spec.ts:146:7 › ficha de álbum — sección de crítica › review section visible en /albums/metallica-master-of-puppets (1.1s)
  ok 14 [chromium] › e2e\albums.spec.ts:156:7 › ficha de álbum — sección de crítica › 3 subsecciones h3: contexto histórico, sonido y producción, legado y recepción (1.1s)
  ok 15 [chromium] › e2e\albums.spec.ts:172:7 › ficha de álbum — sección de crítica › badge de puntuación con formato X.X / 10 (1.1s)
  ok 16 [chromium] › e2e\albums.spec.ts:185:7 › ficha de álbum — sección de crítica › >=2 quotes con cite y enlaces Fuente bien securizados (1.2s)
  ok 17 [chromium] › e2e\albums.spec.ts:222:7 › ficha de álbum — sección de crítica › tracklist sigue intacto junto a la sección de crítica (1.1s)
  ok 18 [chromium] › e2e\albums.spec.ts:233:9 › ficha de álbum — sección de crítica › crítica completa también renderiza en /albums/metallica-master-of-puppets (1.2s)
  ok 19 [chromium] › e2e\albums.spec.ts:233:9 › ficha de álbum — sección de crítica › crítica completa también renderiza en /albums/iron-maiden-number-of-the-beast (1.2s)
  ok 20 [chromium] › e2e\albums.spec.ts:303:7 › filtro por género › click en chip 'Thrash Metal' deja solo cards con data-genre='Thrash Metal' (1.3s)
  ok 21 [chromium] › e2e\albums.spec.ts:333:7 › filtro por género › click otra vez en el mismo chip lo deselecciona y restablece el listado completo (1.8s)
  ok 22 [chromium] › e2e\albums.spec.ts:376:7 › filtro por género › combinar género Thrash Metal + buscador 'Master' devuelve solo Master of Puppets (1.5s)
  ok 23 [chromium] › e2e\albums.spec.ts:413:7 › filtro por género › 'Limpiar filtros' resetea género además de banda y búsqueda (2.1s)
  ok 24 [chromium] › e2e\cart.spec.ts:30:5 › añadir un producto desde una card actualiza el contador del header (1.4s)
  ok 25 [chromium] › e2e\cart.spec.ts:38:5 › abrir el drawer muestra el producto añadido (1.6s)
  ok 26 [chromium] › e2e\cart.spec.ts:49:5 › ir a /cart y aumentar cantidad actualiza el total (1.2s)
  ok 27 [chromium] › e2e\cart.spec.ts:70:5 › eliminar línea deja el carrito vacío (1.4s)
  ok 28 [chromium] › e2e\cart.spec.ts:81:5 › recargar tras añadir 2 productos mantiene el carrito (localStorage) (1.7s)
  ok 29 [chromium] › e2e\catalog.spec.ts:23:5 › listado muestra al menos 10 productos (1.1s)
  ok 30 [chromium] › e2e\catalog.spec.ts:30:5 › buscador filtra por 'ThinkPad' (1.3s)
  ok 31 [chromium] › e2e\catalog.spec.ts:57:5 › filtro por categoría 'Portátiles' devuelve solo portátiles (1.6s)
  ok 32 [chromium] › e2e\catalog.spec.ts:80:5 › estado vacío permite limpiar filtros (1.7s)
  ok 33 [chromium] › e2e\consoles.spec.ts:31:7 › listado › navegar a /consoles muestra h1 con 'Consolas' y 10 cards, cero errores de consola (924ms)
  ok 34 [chromium] › e2e\consoles.spec.ts:68:7 › header y navegación › link 'Consolas' del header navega desde / a /consoles (1.1s)
  ok 35 [chromium] › e2e\consoles.spec.ts:87:7 › buscador › buscar 'Nintendo' filtra a cards cuyo name lo contenga (1.5s)
  ok 36 [chromium] › e2e\consoles.spec.ts:136:7 › chips de generación › chip Gen 5 deja solo cards con data-generation='5' y aria-pressed correcto (1.2s)
  ok 37 [chromium] › e2e\consoles.spec.ts:174:7 › chips de generación › click otra vez en chip Gen 5 lo deselecciona y vuelven 10 cards (1.6s)
  ok 38 [chromium] › e2e\consoles.spec.ts:217:7 › ficha de consola › /consoles/nintendo-64 muestra h1, breadcrumb, dl con 5 metadatos y >=3 juegos icónicos (812ms)
  ok 39 [chromium] › e2e\consoles.spec.ts:261:7 › ficha de consola › click en una card lleva a /consoles/<id> y muestra ficha completa (1.0s)
  ok 40 [chromium] › e2e\consoles.spec.ts:301:7 › 404 › /consoles/unknown-id-xxx renderiza not-found con link a /consoles (778ms)
  ok 41 [chromium] › e2e\games.spec.ts:45:7 › header y navegación › entrada 'Games' en el header navega a /games y muestra 16 cards (1.0s)
  ok 42 [chromium] › e2e\games.spec.ts:65:7 › buscador › buscador 'knight' filtra a 1 card (Knight Lore) (1.1s)
  ok 43 [chromium] › e2e\games.spec.ts:89:7 › chips de género › chip 'Aventura isométrica' deja solo cards con data-genre='Aventura isométrica' (1.2s)
  ok 44 [chromium] › e2e\games.spec.ts:119:7 › chips de género › click otra vez en el mismo chip lo deselecciona y vuelve a 16 cards (1.6s)
  ok 45 [chromium] › e2e\games.spec.ts:154:7 › chips de género › combinar género 'Aventura isométrica' + buscador 'knight' devuelve solo Knight Lore (1.5s)
  ok 46 [chromium] › e2e\games.spec.ts:190:7 › limpiar filtros › 'Limpiar filtros' resetea género + búsqueda y vuelve a 16 cards (1.9s)
  ok 47 [chromium] › e2e\games.spec.ts:237:7 › ficha de juego › click en una card lleva a la ficha con h1, dl con 5 metadatos y descripción (1.0s)
  ok 48 [chromium] › e2e\games.spec.ts:268:7 › ficha de juego › ficha de /games/knight-lore muestra quotes con figure/blockquote/cite y enlaces seguros (1.0s)
  ok 49 [chromium] › e2e\games.spec.ts:305:7 › ficha de juego › ficha de /games/la-abadia-del-crimen también renderiza estructura completa (1.1s)
  ok 50 [chromium] › e2e\games.spec.ts:337:7 › 404 › /games/unknown-id-123 muestra not-found con link a /games (955ms)
  ok 51 [chromium] › e2e\home.spec.ts:12:5 › home carga sin errores de consola (1.8s)
  ok 52 [chromium] › e2e\product-detail.spec.ts:7:5 › navegar de catálogo a ficha muestra nombre, precio, specs y botón (1.2s)
  ok 53 [chromium] › e2e\product-detail.spec.ts:42:5 › producto inexistente renderiza página not-found (755ms)
  ok 54 [chromium] › e2e\responsive.spec.ts:8:5 › header accesible en viewport móvil (375px) (861ms)
  ok 55 [chromium] › e2e\tours.spec.ts:32:7 › listado › navegar a /tours muestra h1 con 'Tours' y 10 cards, cero errores de consola (799ms)
  ok 56 [chromium] › e2e\tours.spec.ts:69:7 › header y navegación › link 'Tours' del header navega desde / a /tours (1.0s)
  ok 57 [chromium] › e2e\tours.spec.ts:86:7 › buscador › buscar 'Justice' filtra a cards cuyo name lo contenga (1.5s)
  ok 58 [chromium] › e2e\tours.spec.ts:135:7 › chips de década › chip 90s deja solo cards con data-decade='1990' y aria-pressed correcto (1.2s)
  ok 59 [chromium] › e2e\tours.spec.ts:173:7 › chips de década › click otra vez en chip 90s lo deselecciona y vuelven 10 cards (1.5s)
  ok 60 [chromium] › e2e\tours.spec.ts:215:7 › ficha de tour › /tours/world-slavery-tour muestra h1, breadcrumb, dl con 5 metadatos y descripción >=200 chars (805ms)
  ok 61 [chromium] › e2e\tours.spec.ts:258:7 › ficha de tour › /tours/black-album-tour renderiza ficha completa con metadatos esperados (758ms)
  ok 62 [chromium] › e2e\tours.spec.ts:277:7 › ficha de tour › click en una card lleva a /tours/<id> y muestra ficha completa (926ms)
  ok 63 [chromium] › e2e\tours.spec.ts:316:7 › 404 › /tours/unknown-xxx renderiza not-found con link a /tours (767ms)

  63 passed (1.4m)
```

## Comandos para reproducir

```powershell
# Vitest backend
cd "C:/02 - Accenture/03 - Repositorios/adlc-claude-code-workspace/apps/api"
npm test

# Docker + Playwright (suite completa contra el stack publicado)
cd "C:/02 - Accenture/03 - Repositorios/adlc-claude-code-workspace"
docker compose build
docker compose up -d
# Esperar healthchecks
$tries = 0; while ((docker inspect -f '{{.State.Health.Status}}' ironheart-api 2>$null) -ne 'healthy' -and $tries -lt 40) { Start-Sleep 3; $tries++ }
docker compose ps

cd apps/web
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test --workers=1 e2e/tours.spec.ts
npx playwright test --workers=1
```

## Rutas para smoke MCP (las ejecuta el orquestador)

- `/`                            → home; verificar header con link `Tours` visible, 0 errores consola.
- `/tours`                       → listado; 10 cards, h1 con "TOURS", 0 errores consola, network requests 2xx.
- `/tours/world-slavery-tour`    → ficha 1 (Iron Maiden, server component, fetch SSR a `http://api:4000/tours/world-slavery-tour` desde dentro del contenedor `web`).
- `/tours/black-album-tour`      → ficha 2 (Metallica), distinta a la anterior; valida SSR multi-id.
- `/tours/unknown-xxx`           → 404 esperado; debe renderizar `not-found.tsx` con h1 "Tour no encontrado" y link `/tours`.

Por cada ruta: capturar consola y network. Errores 4xx/5xx (excepto el 404 del último, que es esperado), exceptions, warnings de hidratación = bugs reales.

## Gaps / pendientes

- Ninguno bloqueante en QA. Suite verde, contra Docker, sin errores de consola.
- Pendientes humanos a manos del orquestador: ejecutar smoke MCP (Fase 9) y lanzar `security-engineer` (Fase 7) y `reviewer` (Fase 10) antes de cerrar.
