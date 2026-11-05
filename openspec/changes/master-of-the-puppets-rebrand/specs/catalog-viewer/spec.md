# Delta de criterios — Cambio de marca IRON DECK → MASTER OF THE PUPPETS

Slug: `master-of-the-puppets-rebrand`
PRD: `specs/master-of-the-puppets-rebrand-prd.md`
Área: `catalog-viewer` (ver supuesto S-01 en la nota final).

Formato: `Given <contexto>, when <acción>, then <resultado>.` con nivel RFC 2119 y `Validación:`.

## Requisitos funcionales

- [ ] **AC-01** (verifica RF-01). Given la home `/` cargada, when el usuario mira el header global, then el texto visible del wordmark MUST ser `MASTER OF THE PUPPETS` y el enlace de inicio MUST tener `aria-label="Inicio MASTER OF THE PUPPETS"`.
  - MUST
  - Validación: `apps/web/components/iron-deck-header.tsx:23` (aria-label) y `apps/web/e2e/responsive.spec.ts:13` (getByLabel), más inspección del wordmark en el header.

- [ ] **AC-02** (verifica RF-02). Given cualquier página con el footer global, when se renderiza el pie, then el copyright MUST leer `© <año> MASTER OF THE PUPPETS — No es una tienda real.`
  - MUST
  - Validación: `apps/web/components/iron-deck-footer.tsx:23`.

- [ ] **AC-03** (verifica RF-03). Given la home `/`, when se renderiza el hero, then el texto de marca MUST ser `Catálogo · MASTER OF THE PUPPETS` y el H1 del hero MUST contener `MASTER OF THE PUPPETS`.
  - MUST
  - Validación: `apps/web/components/hero.tsx:34`; `apps/web/e2e/home.spec.ts:19` (selector del H1 actualizado).

- [ ] **AC-04** (verifica RF-04). Given cualquier ruta de la app, when se lee el `<title>` y la meta `description` del documento, then el título raíz MUST ser `MASTER OF THE PUPPETS — Catálogo` y la descripción MUST mencionar `MASTER OF THE PUPPETS` y no `IRON DECK`.
  - MUST
  - Validación: `apps/web/app/layout.tsx:25-27`.

- [ ] **AC-05** (verifica RF-05). Given las rutas `/consoles`, `/tours` y la ficha `/products/[id]`, when se lee el `<title>` de cada una, then MUST terminar en `| MASTER OF THE PUPPETS` (consolas y tours) o `— MASTER OF THE PUPPETS` (ficha de producto).
  - MUST
  - Validación: `apps/web/app/consoles/layout.tsx:5`; `apps/web/app/tours/layout.tsx:5`; `apps/web/app/(main)/products/[id]/page.tsx:24`.

- [ ] **AC-06** (verifica RF-06). Given la página `/about`, when se renderiza, then el `<title>`, la meta `description` y el H1 MUST usar `MASTER OF THE PUPPETS` (sin `IRON DECK`), y el párrafo de presentación MUST describir la marca nueva.
  - MUST
  - Validación: `apps/web/app/about/page.tsx:7`, `:9`, `:28`, `:31`, `:54`; `apps/web/e2e/about.spec.ts:25` (regex del H1 actualizada).

- [ ] **AC-07** (verifica RF-07 y RNF-02). Given el stack levantado con `docker compose up`, when se ejecuta la suite E2E de `apps/web`, then MUST pasar en su totalidad, sin tests desactivados ni selectores eliminados para forzar el paso.
  - MUST
  - Validación: `docker compose up -d` y `npx playwright test` desde `apps/web` (salida con 0 fallos).

- [ ] **AC-08** (verifica RF-08). Given el cambio de texto, when se compara la paleta CSS, las rutas y los nombres de componentes antes y después, then MUST quedar igual: `apps/web/app/globals.css` sin cambios de tokens y rutas sin renombrar.
  - MUST
  - Validación: `git diff --stat -- apps/web/app/globals.css` vacío; cambios en `apps/web/app/**` solo de texto.

## Requisitos no funcionales

- [ ] **AC-09** (verifica RNF-01). Given el código de `apps/web`, when se busca la cadena de marca antigua, then MUST NOT quedar ninguna ocurrencia visible al usuario de `IRON DECK` (comentarios de código excluidos).
  - MUST
  - Validación: `grep -rn "IRON DECK" apps/web --exclude-dir=node_modules --exclude-dir=.next` filtrado a textos visibles; 0 coincidencias en JSX, metadata y e2e.

- [ ] **AC-10** (verifica RNF-03). Given el cambio, when se revisa el diff, then `apps/api/` MUST NOT tener cambios de código, salvo que el PRD lo autorice.
  - MUST
  - Validación: `git diff --stat -- apps/api` vacío.

- [ ] **AC-11** (verifica RNF-04). Given el cambio, when se revisa el alcance, then los nombres de fichero `iron-deck-*.tsx` MUST conservarse sin renombrar.
  - MUST
  - Validación: `ls apps/web/components/iron-deck-*.tsx` devuelve los dos ficheros.

- [ ] **AC-12** (verifica RNF-05). Given el cambio, when se comprueba la documentación, then SHOULD quedar registrado en `openspec/config.yaml § history.decisions[]` con un nuevo `DEC-NNN` en la Fase 12.
  - SHOULD
  - Validación: inspección de `openspec/config.yaml` en el cierre.

## Notas

- **S-01.** El `CLAUDE.md` nombra el área `catalog-viewer` y la app `claude-catalog-viewer/`, pero el repo real usa `apps/web` y `apps/api`. Este delta usa `catalog-viewer` porque así lo fija el PRD; no es un cambio de alcance.
- **S-02.** El `aria-label` del header pasa a `Inicio MASTER OF THE PUPPETS` (PRD §8). Queda pendiente de confirmación humana en G2.
- **Ámbito de texto.** Los comentarios de código con `IRON DECK` (JSDoc y comentarios `//`) no son visibles al usuario y quedan fuera de AC-09.
