# Delta — catalog-viewer: rebrand «IRON DECK» → «Master of the Puppets»

Slug: `rename-brand-master-of-puppets`
PRD: `specs/rename-brand-master-of-puppets-prd.md` (RF-01..RF-06, RNF-01..RNF-03)

Alcance: solo nombre visible y metadatos. No se renombran ficheros, componentes ni clases (`iron-deck-*`, `IronDeckHeader`, variables `--iron-*`). Se mantiene paleta, layout y navegación (RNF-01).

## ADDED Requirements

### AC-01 — Marca en la cabecera (RF-01)

- [ ] Given la aplicación cargada en cualquier ruta que use `IronDeckHeader`, when el usuario mira la cabecera, then el texto visible de la marca MUST leer «Master of the Puppets» y MUST NOT contener «IRON DECK».
  - MUST
  - Validación: `apps/web/e2e/responsive.spec.ts` (aserción de la marca) y `grep -rn "IRON DECK" apps/web/components/iron-deck-header.tsx` sin resultados.

Nota de implementación: el wordmark actual se parte en dos `<span>` (`I` en rojo + `RON&nbsp;DECK` en hueso). El nuevo texto MUST conservar la misma jerarquía visual (mismas clases, mismo `font-metal`) y MUST renderizarse en una sola línea sin solapar la navegación en viewport ≥ 768px.
  - Validación adicional: inspección visual con captura en 1280×800 y 390×844 (Playwright).

### AC-02 — `aria-label` de la marca (RF-01)

- [ ] Given el enlace de la marca en la cabecera, when se consulta su nombre accesible, then el `aria-label` MUST ser exactamente «Inicio Master of the Puppets».
  - MUST
  - Validación: `apps/web/components/iron-deck-header.tsx:23` contiene `aria-label="Inicio Master of the Puppets"`; `apps/web/e2e/responsive.spec.ts:12-13` localiza el enlace con ese nombre.

### AC-03 — Copyright del pie (RF-02)

- [ ] Given la aplicación cargada, when el usuario llega al pie, then el copyright MUST contener «Master of the Puppets» y MUST NOT contener «IRON DECK».
  - MUST
  - Validación: `apps/web/components/iron-deck-footer.tsx:23` contiene «Master of the Puppets»; `grep -rn "IRON DECK" apps/web/components/iron-deck-footer.tsx` sin resultados.

### AC-04 — Eyebrow del hero (RF-03)

- [ ] Given la home `/` cargada, when se lee el eyebrow sobre el H1 del hero, then MUST leer «Catálogo · Master of the Puppets».
  - MUST
  - Validación: `apps/web/components/hero.tsx:34` contiene «Master of the Puppets»; `apps/web/e2e/home.spec.ts` sigue localizando el H1 «Equipos que rinden» (RNF-02).

### AC-05 — Título y descripción de la raíz (RF-04)

- [ ] Given la home `/`, when se lee `<title>` y `<meta name="description">`, then el `<title>` MUST ser «Master of the Puppets — Catálogo» y la `description` MUST contener «Master of the Puppets» y no «IRON DECK».
  - MUST
  - Validación: `apps/web/app/layout.tsx:25-27`; `curl -s http://localhost:3000/ | grep -o "<title>[^<]*</title>"` devuelve el nuevo título.

### AC-06 — Títulos de las rutas con layout propio (RF-04)

- [ ] Given las rutas `/tours` y `/consoles`, when se lee su `<title>`, then MUST terminar en «| Master of the Puppets» (`Tours | Master of the Puppets`, `Consolas | Master of the Puppets`).
  - MUST
  - Validación: `apps/web/app/tours/layout.tsx:5`; `apps/web/app/consoles/layout.tsx:5`; `curl` de ambas rutas y grep del `<title>`.

### AC-07 — Título dinámico de la ficha de producto (RF-04)

- [ ] Given una ficha `/products/<id>` existente, when se genera su `<title>`, then MUST seguir el patrón `<nombre del producto> — Master of the Puppets` y NO «IRON DECK».
  - MUST
  - Validación: `apps/web/app/(main)/products/[id]/page.tsx:24`; `curl -s http://localhost:3000/products/<id> | grep -o "<title>[^<]*</title>"`.

### AC-08 — `/about`: título, descripción, H1 y cuerpo (RF-05)

- [ ] Given la página `/about` cargada, when se leen el `<title>`, el eyebrow, el H1 y el párrafo de presentación, then cada uno MUST contener «Master of the Puppets» y NINGUNO MUST contener «IRON DECK».
  - MUST
  - Validación: `apps/web/app/about/page.tsx:7,9,28,31,54`; `apps/web/e2e/about.spec.ts:25` actualizado a `/About Master of the Puppets/i`; `curl -s http://localhost:3000/about | grep -c "IRON DECK"` devuelve `0`.

### AC-09 — Ausencia de «IRON DECK» en la UI renderizada (RF-06)

- [ ] Given el build de producción de `apps/web` servido, when se recorren `/`, `/about`, `/albums`, `/games`, `/tours`, `/consoles` y una ficha de producto, then el HTML renderizado MUST NOT contener la cadena «IRON DECK» (ni «Iron Deck» en texto visible).
  - MUST
  - Validación: `for p in / /about /albums /games /tours /consoles; do curl -s http://localhost:3000$p | grep -ci "iron deck"; done` → todos `0`.

Nota de alcance: la comprobación de AC-09 es más amplia que la validación de RF-06 en el PRD (que solo grepea `apps/web/app` y `apps/web/components`). Las rutas se verifican con el HTML servido, no solo con el código fuente.

### AC-10 — Aserciones E2E actualizadas (RNF-02)

- [ ] Given la suite E2E de `apps/web` tras el cambio, when se ejecuta `npm run test:e2e` (o el comando Playwright del proyecto), then MUST pasar sin modificar las expectativas de funcionalidad, solo las de texto de marca.
  - MUST
  - Validación: `apps/web/e2e/about.spec.ts:25`, `apps/web/e2e/responsive.spec.ts:12-13` actualizados; salida del comando con 0 fallos.

### AC-11 — Tests unitarios sin regresión (RNF-02)

- [ ] Given el cambio aplicado, when se ejecutan los tests unitarios de `apps/web` y `apps/api`, then MUST pasar todos.
  - MUST
  - Validación: comandos de test de cada workspace (`npm test`) con código de salida 0.

### AC-12 — Sin consola con errores (RNF-03)

- [ ] Given las rutas `/`, `/about` y una ficha `/products/<id>` cargadas en navegador, when se leen los mensajes de consola y las peticiones de red, then SHOULD NOT aparecer errores ni respuestas 4xx/5xx nuevas respecto a la línea base.
  - SHOULD
  - Validación: Chrome DevTools MCP `list_console_messages` (level error) y `list_network_requests`, comparado con el estado previo al cambio.

### AC-13 — Estructura y paleta intactas (RNF-01)

- [ ] Given el diff del cambio, when se revisan los ficheros modificados, then MUST NOT haber cambios de estilos, de rutas ni de nombres de ficheros o componentes (`iron-deck-*`).
  - MUST
  - Validación: `git diff --stat` (lectura) sin ficheros renombrados; `grep -rn "className=" ` en los ficheros tocados sin cambios; inspección del diff.

## Trazabilidad RF → AC

| Requisito PRD | Criterios |
|---|---|
| RF-01 | AC-01, AC-02 |
| RF-02 | AC-03 |
| RF-03 | AC-04 |
| RF-04 | AC-05, AC-06, AC-07 |
| RF-05 | AC-08 |
| RF-06 | AC-09 |
| RNF-01 | AC-13 |
| RNF-02 | AC-10, AC-11 |
| RNF-03 | AC-12 |

## Gaps y decisiones abiertas

- El PRD cita líneas que ya no coinciden con el código (`apps/web/app/tours/layout.tsx:5`, `consoles/layout.tsx:5` y `about/page.tsx:7-54` sí coinciden; los demás se verifican al implementar). Los criterios usan la referencia del código actual.
- El nombre de área del CLAUDE.md (`catalog-viewer`, `claude-catalog-viewer/`) no existe en este repo: `specs/areas/` tiene `albums`, `catalog-products`, `consoles`, `games`, `infra-azure`, `platform`, `tours`. El delta se escribe en `openspec/changes/rename-brand-master-of-puppets/specs/catalog-viewer/` según la ruta fijada por esta stage.
- El wordmark dividido en dos spans (AC-01) requiere decisión de diseño sobre cómo partir «Master of the Puppets» visualmente. Se deja a la stage de implementación; el criterio fija solo el texto visible y el layout.
- Gate G2 (PRD + criterios): aprobación humana, fuera de esta stage.
