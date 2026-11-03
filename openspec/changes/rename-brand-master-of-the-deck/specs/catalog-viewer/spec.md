# Delta de criterios: rename-brand-master-of-the-deck

Slug: `rename-brand-master-of-the-deck`
PRD: `specs/rename-brand-master-of-the-deck-prd.md`
Área: `catalog-viewer` (`apps/web`)

## ADDED Requirements

- [ ] **AC-01** (RF-01, RF-02): Given la home `/` cargada, when se inspecciona el header, then el wordmark visible y el `aria-label` del enlace de inicio MUST contener "MASTER OF THE DECK" y MUST NOT contener "IRON DECK".
  - MUST
  - Validación: `apps/web/components/iron-deck-header.tsx:23` y `:26-31` + `apps/web/e2e/responsive.spec.ts:13` (actualizado a `getByLabel("Inicio MASTER OF THE DECK")`).

- [ ] **AC-02** (RF-03): Given cualquier página del sitio, when se lee `<title>` y `<meta name="description">`, then MUST NOT aparecer "IRON DECK" y MUST aparecer "Master of the Deck".
  - MUST
  - Validación: `grep -rn "IRON DECK" apps/web/app` sin coincidencias en `title`/`description` + test e2e que lee `document.title` en `/`, `/about`, `/tours`, `/consoles` y `/products/<id>`.

- [ ] **AC-03** (RF-03): Given el footer de cualquier página, when se lee el wordmark y la línea de copyright, then MUST NOT contener "IRON DECK" y el copyright MUST referenciar "Master of the Deck".
  - MUST
  - Validación: `apps/web/components/iron-deck-footer.tsx:16-19` y `:23` + inspección visual con Chrome DevTools MCP.

- [ ] **AC-04** (RF-04): Given la página `/about` cargada, when se lee el h1 y el párrafo de presentación, then el h1 MUST ser "About Master of the Deck" y el párrafo MUST decir "Master of the Deck es una plantilla viva".
  - MUST
  - Validación: `apps/web/e2e/about.spec.ts:25` actualizado a `/About Master of the Deck/i` (pasa) + `apps/web/app/about/page.tsx:28,31,54`.

- [ ] **AC-05** (RF-05): Given el hero de la home, when se lee la etiqueta superior, then MUST contener "Catálogo · Master of the Deck" y MUST NOT contener "IRON DECK".
  - MUST
  - Validación: `apps/web/components/hero.tsx:34`.

- [ ] **AC-06** (RF-06): Given el repositorio, when se busca el texto visible de la marca, then no MUST quedar coincidencias de "IRON DECK" en `apps/web` fuera de comentarios de código, identificadores y clases CSS listados como fuera de alcance.
  - MUST
  - Validación: `grep -rn "IRON DECK" apps/web --include=*.tsx --include=*.ts` (sin salida salvo comentarios).

- [ ] **AC-07** (RF-07): Given la suite de tests, when se ejecuta `npm run test:e2e` en `apps/web`, then MUST pasar en su totalidad sin cambios de comportamiento distintos del rename.
  - MUST
  - Validación: `cd apps/web && npm run test:e2e` (0 fallos).

- [ ] **AC-08** (RNF-01): Given el cambio, when se revisa el diff, then los identificadores (`IronDeckHeader`, `iron-deck-*.tsx`) y las clases CSS MUST permanecer sin renombrar.
  - MUST
  - Validación: inspección del diff (sin renombrados de archivo ni de símbolos).

- [ ] **AC-09** (RNF-02): Given la home y `/about` renderizadas, when se inspeccionan con Chrome DevTools MCP, then la consola MUST NOT mostrar errores nuevos respecto al estado previo al cambio.
  - SHOULD
  - Validación: smoke test con Chrome DevTools MCP (`list_console_messages`) en `/` y `/about`.

- [ ] **AC-10** (RNF-03): Given el texto de marca, when se compara con la identidad acordada, then el casing MUST ser "Master of the Deck" en metadatos y "MASTER OF THE DECK" solo donde el diseño ya usa mayúsculas.
  - SHOULD
  - Validación: decisión de casing confirmada en G2 (ver preguntas abiertas).

## Preguntas abiertas para G2

1. El PRD no incluye el footer en su alcance explícito; AC-03 lo incluye porque el wordmark visible es la marca. Confirmar.
2. Casing del `<title>` (pregunta abierta del PRD): AC-10 asume "Master of the Deck" en metadatos.
3. El criterio de `home.spec.ts` del PRD no aplica: ese test no comprueba la marca, solo tiene un comentario. Se excluye.
4. `.claude-portable/**` (pregunta abierta del PRD): fuera de alcance hasta confirmación.
