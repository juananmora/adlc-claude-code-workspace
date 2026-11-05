# PRD — Renombrar la marca del site "IRON DECK" a "Master of the Puppets"

> **Tipo**: propuesta de cambio (change)
> **Iteración**: iter-13
> **Fecha**: pendiente de fijar al aprobar la spec
> **Estado**: borrador — en revisión
> **Slug**: master-of-the-puppets-rename
> **Intent**: "Master of puppets 3" — fuente de la solicitud: `adlc-solicitud` (su contenido no era legible por la herramienta en esta stage; se usa el texto literal del intent).

## 1. Objetivo

Sustituir la marca visible del site "IRON DECK" por "Master of the Puppets" en todas las superficies que el usuario ve (título de página, metadatos, header, footer, hero, página About, textos de copyright y `aria-label`), sin cambiar el comportamiento funcional de ninguna ruta.

## 2. Alcance

- Texto visible y metadatos en `apps/web`: `title`, `description`, `h1`, cabecera, pie, hero, página `/about`, copyright del footer.
- `aria-label` del logo/enlace de inicio y los selectores e2e que dependen de esos textos (`apps/web/e2e/*.spec.ts`).
- Comentarios JSDoc que describen la marca en `apps/web` y `apps/api` (solo cuando describan la marca visible).
- Documentación de usuario del site (`README.md` si menciona la marca visible).

## 3. Fuera de alcance

- Renombrar ficheros o identificadores internos (`iron-deck-header.tsx`, `IronDeckHeader`, `IronDeckFooter`, `iron-deck-footer.tsx`). Son internos y su renombrado no cambia lo que ve el usuario. **Supuesto**: se mantienen; ver punto 10.
- Renombrar clases CSS/tokens de paleta (`--brand-*`, comentarios de `globals.css` que hablan de la paleta). La paleta visual no cambia.
- Cambiar rutas, APIs, datos de catálogo, URLs o despliegues.
- Cambiar la línea gráfica (colores, tipografías, logo). Solo cambia el texto de marca.
- Modificar `specs/acceptance-criteria-archive.md` (inmutable) y las specs históricas de iteraciones cerradas (`specs/iter-*`, `reports/iter-*`).
- Despliegue a producción (lo decide una persona).

## 4. Usuarios o actores

- Visitante anónimo del site (lee la nueva marca).
- Equipo ADLC (verifica los criterios y las evidencias).

## 5. Requisitos funcionales

- **RF-01**: El `<title>` de la home SHALL ser "Master of the Puppets — Catálogo" y la `description` SHALL no mencionar "IRON DECK".
- **RF-02**: El header global SHALL mostrar "Master of the Puppets" como wordmark y su enlace de inicio SHALL tener `aria-label="Inicio Master of the Puppets"`.
- **RF-03**: El footer global SHALL mostrar "© <año> Master of the Puppets — No es una tienda real."
- **RF-04**: El hero de la home SHALL mostrar "Catálogo · Master of the Puppets".
- **RF-05**: La página `/about` SHALL tener `<h1>` "About Master of the Puppets" y su texto SHALL referirse a "Master of the Puppets" en lugar de "IRON DECK".
- **RF-06**: Los títulos de las secciones `/albums`, `/consoles`, `/games`, `/tours` y de la ficha de producto SHALL usar "Master of the Puppets" como sufijo (`| Master of the Puppets` o `— Master of the Puppets`) en lugar de "IRON DECK".
- **RF-07**: Los tests e2e SHALL buscar los nuevos textos (`Inicio Master of the Puppets`, `About Master of the Puppets`) y pasar.

## 6. Requisitos no funcionales

- **RNF-01**: Cero apariciones de la cadena "IRON DECK" (sin distinguir mayúsculas) en el texto visible de `apps/web/app` y `apps/web/components`, excepto en comentarios de código internos que el reviewer acepte explícitamente.
- **RNF-02**: 0 errores de consola del navegador en `/`, `/about`, `/albums`, `/consoles`, `/games`, `/tours` y una ficha de producto tras el cambio.
- **RNF-03**: Los tests existentes (vitest backend, Playwright) SHALL seguir verdes tras actualizar las aserciones de marca. No se elimina ningún test para hacerlo pasar.
- **RNF-04**: `npm run build` y `tsc --noEmit` en `apps/web` SHALL terminar con exit 0.
- **RNF-05**: No se introducen dependencias nuevas.

## 7. Arquitectura esperada

Cambio de texto en componentes y layouts existentes. No hay cambios en `infra/`, `apps/api` (salvo comentarios), ni en el modelo de datos.

Ficheros afectados (según búsqueda en el repo):

- `apps/web/app/layout.tsx` (title, description, comentario).
- `apps/web/app/(main)/layout.tsx`, `apps/web/app/about/layout.tsx`, `apps/web/app/about/page.tsx`, `apps/web/app/albums/layout.tsx`, `apps/web/app/consoles/layout.tsx`, `apps/web/app/games/layout.tsx`, `apps/web/app/tours/layout.tsx`, `apps/web/app/(main)/products/[id]/page.tsx`, `apps/web/app/(main)/cart/page.tsx` (títulos y comentarios).
- `apps/web/components/iron-deck-header.tsx`, `apps/web/components/iron-deck-footer.tsx`, `apps/web/components/hero.tsx` (texto visible y `aria-label`).
- `apps/web/e2e/responsive.spec.ts`, `apps/web/e2e/about.spec.ts`, `apps/web/e2e/home.spec.ts` (selectores de texto).
- `apps/api/src/data/tours.ts`, `apps/web/lib/credits.ts` (solo comentarios JSDoc de marca).

## 8. Criterios de aceptación G/W/T + RFC 2119 (CORE)

- [ ] Given el site con la marca actual, when se carga `/`, then el `<title>` MUST ser "Master of the Puppets — Catálogo" y la metadata `description` MUST no contener "IRON DECK".
  - Validación: `apps/web/app/layout.tsx` (metadata) + `grep -ri "iron deck" apps/web/app/layout.tsx` sin resultados.

- [ ] Given la home `/`, when el usuario mira el header, then el wordmark MUST ser "Master of the Puppets" y el enlace de inicio MUST tener `aria-label="Inicio Master of the Puppets"`.
  - Validación: `apps/web/components/iron-deck-header.tsx` + `apps/web/e2e/responsive.spec.ts` (aserción `getByLabel("Inicio Master of the Puppets")`).

- [ ] Given cualquier ruta del site con footer global, when se renderiza el pie, then el texto MUST contener "Master of the Puppets" y "No es una tienda real".
  - Validación: `apps/web/components/iron-deck-footer.tsx` (inspección) + `npx playwright test` sobre `home.spec.ts`.

- [ ] Given la home `/`, when se renderiza el hero, then el texto de la etiqueta MUST ser "Catálogo · Master of the Puppets".
  - Validación: `apps/web/components/hero.tsx:34` + `apps/web/e2e/home.spec.ts`.

- [ ] Given la ruta `/about`, when carga, then el `<h1>` MUST ser "About Master of the Puppets".
  - Validación: `apps/web/e2e/about.spec.ts:25` (aserción actualizada).

- [ ] Given las rutas `/albums`, `/consoles`, `/games`, `/tours`, when se lee el `<title>`, then MUST terminar en "| Master of the Puppets".
  - Validación: `apps/web/app/{albums,consoles,games,tours}/layout.tsx` (metadata) + inspección del `<title>` en smoke MCP.

- [ ] Given el código de `apps/web/app` y `apps/web/components`, when se busca la cadena "IRON DECK" en texto visible, then el resultado MUST ser vacío.
  - Validación: `grep -rn "IRON DECK" apps/web/app apps/web/components --include=*.tsx | grep -v "^\s*\*"` → 0 líneas.

- [ ] Given el site modificado, when se navega `/`, `/about`, `/albums`, `/consoles`, `/games`, `/tours` y una ficha `/products/[id]` con el navegador, then la consola MUST tener 0 errores.
  - Validación: smoke Chrome DevTools MCP (`list_console_messages`) con capturas en `reports/iter-13/`.

- [ ] Given la suite de tests, when se ejecuta tras el cambio, then vitest backend y Playwright E2E MUST pasar con el mismo número de tests que antes (sin borrar casos).
  - Validación: `cd apps/api && npx vitest run` y `cd apps/web && npx playwright test`.

- [ ] Given `apps/web`, when se ejecuta el build, then el comando MUST terminar con exit 0.
  - Validación: `cd apps/web && npm run build` y `npx tsc --noEmit`.

- [ ] Given `README.md` y `apps/web/README.md`, when mencionan la marca visible, then SHOULD usar "Master of the Puppets".
  - Validación: inspección de `README.md` y `apps/web/README.md`.

## 9. Riesgos y supuestos

| riesgo | impacto | mitigación |
|---|---|---|
| "Master of the Puppets" es el título de un álbum de Metallica (marca registrada/derechos). | Posible problema legal o de marca si el site se publica. | Aprobación humana explícita antes de desplegar (punto 10). Incluir disclaimer "No es una tienda real" ya existente. |
| Identificadores internos (`IronDeckHeader`, ficheros `iron-deck-*`) siguen con el nombre antiguo. | Confusión para desarrolladores; no afecta al usuario. | Se documenta como deuda. Renombrado en una iteración separada si se aprueba. |
| Aserciones e2e dependen del texto antiguo. | Tests rojos si no se actualizan. | Actualizar selectores junto al cambio de texto (RF-07). |
| Cadena "IRON DECK" en comentarios JSDoc. | Ruido en la búsqueda de RNF-01. | Se permiten comentarios internos solo si el reviewer lo acepta explícitamente. |
| Supuesto: el "site Iron Deck" es el `apps/web` de este repo. | Si hay otro site, el alcance cambia. | Confirmar en la revisión humana de la spec. |

## 10. Puntos de aprobación humana

- Aprobar la spec y los criterios antes de planificar (gate de spec).
- Confirmar que el uso del nombre "Master of the Puppets" es aceptable (marca/derechos de la obra homónima).
- Decidir si los identificadores internos `iron-deck-*` / `IronDeck*` se renombran en esta iteración o en una posterior.
- Deploy a producción (fase 11). No se hace en este flujo.
- Findings de seguridad CRITICAL/HIGH abiertos al cierre.

## 11. Trazabilidad

- Extiende el site vivo descrito en `specs/areas/platform/spec.md` y las áreas `albums`, `consoles`, `games`, `tours`, que hoy citan la marca "IRON DECK" en sus criterios. Esos criterios se actualizarán en el cierre de la iteración.
- Intent de origen: "Master of puppets 3" (`adlc-solicitud`).
- Decisión arquitectónica: ninguna nueva. Si se aprueba, se registra `DEC-NNN` en `openspec/config.yaml § history.decisions[]` al cerrar.

## 12. Requisitos (bloque machine-parsed)

```yaml
requirements:
  - id: RF-01
    title: 'Title and description of the home page'
    category: functional
    priority: must-have
    description: 'La home muestra el título Master of the Puppets — Catálogo y su description no menciona IRON DECK.'
    acceptance_criteria:
      - 'El title de / es Master of the Puppets — Catálogo'
      - 'La metadata description no contiene IRON DECK'
  - id: RF-02
    title: 'Header wordmark and home link'
    category: functional
    priority: must-have
    description: 'El header global muestra el wordmark Master of the Puppets y su enlace de inicio tiene aria-label nuevo.'
    acceptance_criteria:
      - 'El wordmark es Master of the Puppets'
      - 'aria-label es Inicio Master of the Puppets'
  - id: RF-03
    title: 'Footer copyright line'
    category: functional
    priority: must-have
    description: 'El footer global muestra la línea de copyright con la nueva marca.'
    acceptance_criteria:
      - 'El pie contiene Master of the Puppets y No es una tienda real'
  - id: RF-04
    title: 'Hero label'
    category: functional
    priority: must-have
    description: 'El hero de la home muestra la etiqueta con la nueva marca.'
    acceptance_criteria:
      - 'La etiqueta es Catálogo · Master of the Puppets'
  - id: RF-05
    title: 'About page heading and copy'
    category: functional
    priority: must-have
    description: 'La página /about usa la nueva marca en h1 y en el texto.'
    acceptance_criteria:
      - 'El h1 es About Master of the Puppets'
      - 'El texto no menciona IRON DECK'
  - id: RF-06
    title: 'Section titles'
    category: functional
    priority: must-have
    description: 'Las secciones albums, consoles, games, tours y la ficha de producto usan la nueva marca en el title.'
    acceptance_criteria:
      - 'Cada title termina en | Master of the Puppets o — Master of the Puppets'
  - id: RF-07
    title: 'E2E selectors updated'
    category: functional
    priority: must-have
    description: 'Los tests e2e buscan los nuevos textos y pasan.'
    acceptance_criteria:
      - 'Playwright pasa con los nuevos selectores'
  - id: RNF-01
    title: 'No visible IRON DECK left'
    category: non-functional
    priority: must-have
    description: 'No queda la cadena IRON DECK en texto visible de apps/web.'
    acceptance_criteria:
      - 'grep de IRON DECK en apps/web/app y apps/web/components no devuelve texto visible'
  - id: RNF-02
    title: 'Zero console errors'
    category: non-functional
    priority: must-have
    description: 'Las rutas principales no generan errores de consola tras el cambio.'
    acceptance_criteria:
      - '0 errores de consola en las rutas listadas'
  - id: RNF-03
    title: 'Existing tests stay green'
    category: non-functional
    priority: must-have
    description: 'La suite existente sigue verde sin borrar casos.'
    acceptance_criteria:
      - 'vitest y Playwright pasan con el mismo número de casos'
  - id: RNF-04
    title: 'Build and typecheck'
    category: non-functional
    priority: must-have
    description: 'El build y el type-check de apps/web terminan con exit 0.'
    acceptance_criteria:
      - 'npm run build exit 0'
      - 'tsc --noEmit exit 0'
  - id: RNF-05
    title: 'No new dependencies'
    category: constraint
    priority: must-have
    description: 'El cambio no añade dependencias.'
    acceptance_criteria:
      - 'package.json sin cambios de dependencias'
```
