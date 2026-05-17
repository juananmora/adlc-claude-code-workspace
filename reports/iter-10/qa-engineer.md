# QA Engineer — iter-10 (Consoles E2E)

## Skills ejecutadas
- Skill(skill: "generate-tests") → aplicada

## Resumen

Creado `apps/web/e2e/consoles.spec.ts` con 8 tests E2E que cubren listado, header, buscador, chips de generación, ficha y 404 del dominio Consoles. Suite local del nuevo spec verde (8/8). Suite global de E2E verde (54/54) contra Docker (web:3000, api:4000), no-regresión confirmada.

## Cases cubiertos y locators

| # | Suite | Caso | Locator/expectativa clave |
|---|---|---|---|
| 1 | listado | `/consoles` muestra h1 "Consolas" + 10 cards + 0 errores consola | `getByRole("heading", {level:1})` con `toContainText(/consolas/i)`, `getByTestId("console-card").count()===10`, `collectConsoleErrors().errors` y `pageErrors` ambos `[]` |
| 2 | header | Link "Consolas" desde `/` navega a `/consoles` | `getByRole("navigation",{name:/Principal/i}).getByRole("link",{name:"Consolas"})` |
| 3 | buscador | Teclear "Nintendo" filtra y borrar restaura 10 | `getByTestId("console-search-input")`, `waitForResponse(/consoles\?.*q=nintendo/i)`, verifica que cada card h3 contiene "nintendo" |
| 4 | chips | Click `console-gen-chip-5` → solo cards con `data-generation="5"` + `aria-pressed="true"` | `getByTestId("console-gen-chip-5")`, `waitForResponse(/consoles\?.*generation=5)`, loop `getAttribute("data-generation")==="5"` |
| 5 | chips | Click otra vez en chip Gen 5 → `aria-pressed="false"` y 10 cards | `chip.click()` + `toHaveAttribute("aria-pressed","false")` + `console-gen-chip-todas` con `aria-pressed="true"` + `poll(count===10)` |
| 6 | ficha | `/consoles/nintendo-64` → h1 "Nintendo 64" + breadcrumb a `/consoles` + dl con 5 dt (fabricante/año/generación/media/unidades vendidas) + `<ul>` con >=3 `<li>` icónicos | `heading nivel 1` con `toHaveText("Nintendo 64")`, `nav[aria-label="Migas"]` con link `href="/consoles"`, `dl > dt` count 5, `section[aria-labelledby="iconic-games-title"] ul > li` count >= 3 |
| 7 | ficha (genérica) | Click en primera card → URL `/consoles/<id>`, h1 visible, dl con 5 dt, descripción >=200 chars | `getByTestId("console-card").first().getByRole("link",{name:/Ver detalle de/i})` |
| 8 | 404 | `/consoles/unknown-id-xxx` → h1 "Consola no encontrada" + link "Volver a Consolas" a `/consoles` | `heading {level:1, name:/consola no encontrada/i}`, `link {name:/volver a consolas/i}` con `href="/consoles"` |

## Decisiones tomadas

- **Helper reutilizado**: `helpers/console-errors.ts` (`collectConsoleErrors`) ya existía y filtra el ruido conocido de Next devtools (segment-explorer, react-devtools, fast-refresh, webpack-hmr, unsplash 4xx). Lo uso en el test 1 con tolerancia cero. No inventé un helper nuevo.
- **Sincronización con debounce 250ms**: copio el patrón de `games.spec.ts`. `waitForResponse` armado ANTES de `.fill()` / `.click()`. Para acciones que vuelven a "all" (segunda activación del chip, borrar input), espero por el cambio visible (`aria-pressed`, `count===10`), no por la red, porque el race click → debounce → fetch no es estable con `waitForResponse`.
- **Conteo Gen 5**: verificado en `apps/api/src/data/consoles.ts` que `generation: 5` → 2 entradas (`playstation`, `nintendo-64`). Por eso el test 4 valida `count >= 2` (no exactamente 2: el assertion exhaustivo es que TODAS las visibles tienen `data-generation="5"`, lo cual es más robusto frente a futuras adiciones al dataset).
- **Buscador "Nintendo"**: no asserto el conteo exacto (el backend decide qué hace match), solo `>=1` y que TODAS las cards tienen "nintendo" en su h3. Más resiliente a evoluciones del dataset (p.ej. si se añade "Nintendo Wii U" en iter futura).
- **dt nombres en la ficha**: extraigo `allInnerTexts()` y verifico que aparecen los 5 nombres (case-insensitive) sin asumir orden estricto, evitando acoplamiento accidental al markup.
- **Descripción >=200 chars**: requisito del PRD (descripciones largas, no placeholders), validado con `innerText().trim().length >= 200`.
- **No instalé dependencias**, no toqué `playwright.config.ts`, no arranqué otro servidor. Usé el Docker stack que ya estaba arriba (web:3000, api:4000).

## Salidas literales de Playwright

### `npx playwright test e2e/consoles.spec.ts --workers=1 --reporter=line`

```
Running 8 tests using 1 worker

[1/8] [chromium] › e2e\consoles.spec.ts:31:7 › listado › navegar a /consoles muestra h1 con 'Consolas' y 10 cards, cero errores de consola
[2/8] [chromium] › e2e\consoles.spec.ts:68:7 › header y navegación › link 'Consolas' del header navega desde / a /consoles
[3/8] [chromium] › e2e\consoles.spec.ts:87:7 › buscador › buscar 'Nintendo' filtra a cards cuyo name lo contenga
[4/8] [chromium] › e2e\consoles.spec.ts:136:7 › chips de generación › chip Gen 5 deja solo cards con data-generation='5' y aria-pressed correcto
[5/8] [chromium] › e2e\consoles.spec.ts:174:7 › chips de generación › click otra vez en chip Gen 5 lo deselecciona y vuelven 10 cards
[6/8] [chromium] › e2e\consoles.spec.ts:217:7 › ficha de consola › /consoles/nintendo-64 muestra h1, breadcrumb, dl con 5 metadatos y >=3 juegos icónicos
[7/8] [chromium] › e2e\consoles.spec.ts:261:7 › ficha de consola › click en una card lleva a /consoles/<id> y muestra ficha completa
[8/8] [chromium] › e2e\consoles.spec.ts:301:7 › 404 › /consoles/unknown-id-xxx renderiza not-found con link a /consoles
  8 passed (13.1s)
```

### `npx playwright test --workers=1 --reporter=line` (suite completa, tail -30)

```
[25/54] [chromium] › e2e\cart.spec.ts:38:5 › abrir el drawer muestra el producto añadido
[26/54] [chromium] › e2e\cart.spec.ts:49:5 › ir a /cart y aumentar cantidad actualiza el total
[27/54] [chromium] › e2e\cart.spec.ts:70:5 › eliminar línea deja el carrito vacío
[28/54] [chromium] › e2e\cart.spec.ts:81:5 › recargar tras añadir 2 productos mantiene el carrito (localStorage)
[29/54] [chromium] › e2e\catalog.spec.ts:23:5 › listado muestra al menos 10 productos
[30/54] [chromium] › e2e\catalog.spec.ts:30:5 › buscador filtra por 'ThinkPad'
[31/54] [chromium] › e2e\catalog.spec.ts:57:5 › filtro por categoría 'Portátiles' devuelve solo portátiles
[32/54] [chromium] › e2e\catalog.spec.ts:80:5 › estado vacío permite limpiar filtros
[33/54] [chromium] › e2e\consoles.spec.ts:31:7 › listado › navegar a /consoles muestra h1 con 'Consolas' y 10 cards, cero errores de consola
[34/54] [chromium] › e2e\consoles.spec.ts:68:7 › header y navegación › link 'Consolas' del header navega desde / a /consoles
[35/54] [chromium] › e2e\consoles.spec.ts:87:7 › buscador › buscar 'Nintendo' filtra a cards cuyo name lo contenga
[36/54] [chromium] › e2e\consoles.spec.ts:136:7 › chips de generación › chip Gen 5 deja solo cards con data-generation='5' y aria-pressed correcto
[37/54] [chromium] › e2e\consoles.spec.ts:174:7 › chips de generación › click otra vez en chip Gen 5 lo deselecciona y vuelven 10 cards
[38/54] [chromium] › e2e\consoles.spec.ts:217:7 › ficha de consola › /consoles/nintendo-64 muestra h1, breadcrumb, dl con 5 metadatos y >=3 juegos icónicos
[39/54] [chromium] › e2e\consoles.spec.ts:261:7 › ficha de consola › click en una card lleva a /consoles/<id> y muestra ficha completa
[40/54] [chromium] › e2e\consoles.spec.ts:301:7 › 404 › /consoles/unknown-id-xxx renderiza not-found con link a /consoles
[41/54] [chromium] › e2e\games.spec.ts:45:7 › header y navegación › entrada 'Games' en el header navega a /games y muestra 10 cards
[42/54] [chromium] › e2e\games.spec.ts:65:7 › buscador › buscador 'knight' filtra a 1 card (Knight Lore)
[43/54] [chromium] › e2e\games.spec.ts:89:7 › chips de género › chip 'Aventura isométrica' deja solo cards con data-genre='Aventura isométrica'
[44/54] [chromium] › e2e\games.spec.ts:119:7 › chips de género › click otra vez en el mismo chip lo deselecciona y vuelve a 10 cards
[45/54] [chromium] › e2e\games.spec.ts:154:7 › chips de género › combinar género 'Aventura isométrica' + buscador 'knight' devuelve solo Knight Lore
[46/54] [chromium] › e2e\games.spec.ts:190:7 › limpiar filtros › 'Limpiar filtros' resetea género + búsqueda y vuelve a 10 cards
[47/54] [chromium] › e2e\games.spec.ts:237:7 › ficha de juego › click en una card lleva a la ficha con h1, dl con 5 metadatos y descripción
[48/54] [chromium] › e2e\games.spec.ts:268:7 › ficha de juego › ficha de /games/knight-lore muestra quotes con figure/blockquote/cite y enlaces seguros
[49/54] [chromium] › e2e\games.spec.ts:305:7 › ficha de juego › ficha de /games/la-abadia-del-crimen también renderiza estructura completa
[50/54] [chromium] › e2e\games.spec.ts:337:7 › 404 › /games/unknown-id-123 muestra not-found con link a /games
[51/54] [chromium] › e2e\home.spec.ts:12:5 › home carga sin errores de consola
[52/54] [chromium] › e2e\product-detail.spec.ts:7:5 › navegar de catálogo a ficha muestra nombre, precio, specs y botón
[53/54] [chromium] › e2e\product-detail.spec.ts:42:5 › producto inexistente renderiza página not-found
[54/54] [chromium] › e2e\responsive.spec.ts:8:5 › header accesible en viewport móvil (375px)
  54 passed (1.1m)
```

## Gaps rojos

Ninguno. Los 8 tests del nuevo spec pasaron al primer intento contra el Docker stack. La suite global pasó completa (54/54, 1.1 min) confirmando no-regresión.

## Cobertura vs criterios funcionales pedidos

| Criterio funcional | Test que lo valida | Estado |
|---|---|---|
| Listado: navegar `/consoles`, ≥1 card | consoles.spec.ts:31 (10 cards) | verde |
| Listado: h1 con "Consolas" o "Consoles" | consoles.spec.ts:31 (`toContainText(/consolas/i)`) | verde |
| Listado: 10 cards con `data-testid="console-card"` | consoles.spec.ts:31 (`count()===10`) | verde |
| Listado: 0 errores de consola | consoles.spec.ts:31 (`collectConsoleErrors` cero) | verde |
| Header: link Consolas desde `/` navega a `/consoles` | consoles.spec.ts:68 | verde |
| Buscador: "Nintendo" filtra, borrar input → 10 | consoles.spec.ts:87 | verde |
| Chip Gen 5: `aria-pressed="true"` + solo cards `data-generation="5"` | consoles.spec.ts:136 | verde |
| Chip Gen 5 toggle: `aria-pressed="false"` + 10 cards | consoles.spec.ts:174 | verde |
| Ficha: `/consoles/nintendo-64` con h1, breadcrumb, dl 5 dt, ul ≥3 li | consoles.spec.ts:217 | verde |
| 404: `/consoles/unknown-id-xxx` con link "Volver a Consolas" a `/consoles` | consoles.spec.ts:301 | verde |
