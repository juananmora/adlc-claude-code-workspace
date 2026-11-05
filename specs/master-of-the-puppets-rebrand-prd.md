# PRD — Cambio de marca IRON DECK → MASTER OF THE PUPPETS

Slug: master-of-the-puppets-rebrand
Fuente: [[adlc-solicitud]] (intent «Master of puppets»).
Fase: 2 (Spec / PRD) del flujo ADLC de `CLAUDE.md`.

## 1. Objetivo

Sustituir el nombre de marca «IRON DECK» por «MASTER OF THE PUPPETS» en todo el texto visible de la web del catálogo (`apps/web`). El cambio es solo textual: la paleta, la línea gráfica, las rutas y la estructura de la aplicación no cambian.

## 2. Alcance

Dentro del alcance (solo lo visible en la web):

- Wordmark del header y su `aria-label` (`apps/web/components/iron-deck-header.tsx`).
- Copyright del footer (`apps/web/components/iron-deck-footer.tsx`).
- Etiqueta del hero «Catálogo · IRON DECK» (`apps/web/components/hero.tsx`).
- Metadatos y título raíz (`apps/web/app/layout.tsx`).
- Títulos de layouts y páginas: `apps/web/app/consoles/layout.tsx`, `apps/web/app/tours/layout.tsx`, `apps/web/app/(main)/products/[id]/page.tsx`, `apps/web/app/about/page.tsx`.
- Textos de `/about` (h1, `<title>`, description y el párrafo que se refiere a la marca).
- Selectores e2e que comprueban esos textos: `apps/web/e2e/about.spec.ts`, `apps/web/e2e/home.spec.ts`, `apps/web/e2e/responsive.spec.ts`.

Formato: «MASTER OF THE PUPPETS» en mayúsculas, igual que el formato actual de la marca.

Fuera de alcance:

- Paleta, tipografía y línea gráfica (`globals.css`, tokens de color).
- Rutas y estructura de navegación.
- Nombres de archivo (`iron-deck-header.tsx`, `iron-deck-footer.tsx`, etc.) y nombres de símbolos/componentes internos.
- Comentarios de código que no son visibles al usuario.
- Docs de agentes y skills (`.claude`, `.claude-portable`, `.agents`, `.github/skills`), reportes históricos (`reports/`), specs vivas de otras áreas y archivos de iteraciones (`specs/acceptance-criteria-archive.md`, `specs/iter-*`).
- Contenido o imágenes del álbum «Master of Puppets» (copyright de Metallica): no se añade material nuevo.
- Cambios en `apps/api`: el nombre de marca no aparece en respuestas de la API.

## 3. Supuestos y decisiones

- Decisión de la persona (solicitud): alcance limitado a lo visible; formato en mayúsculas; paleta y textos de `/about` se mantienen salvo el nombre.
- Supuesto (pendiente de confirmación, marcado en la solicitud): el `aria-label` del header pasa también a «Inicio MASTER OF THE PUPPETS». Se aplica tal cual; si la persona prefiere otra cosa, se ajusta en la fase de revisión.
- Los textos de `/about` que hablan de la «plantilla viva» y de la demo educativa del ciclo ADLC se conservan; solo cambia el nombre.

## 4. Requisitos funcionales

| id | Requisito |
|---|---|
| RF-01 | El wordmark del header global y su `aria-label` muestran «MASTER OF THE PUPPETS» (enlace a `/`). |
| RF-02 | El copyright del footer muestra «MASTER OF THE PUPPETS» y conserva la leyenda «No es una tienda real». |
| RF-03 | La etiqueta del hero muestra «Catálogo · MASTER OF THE PUPPETS». |
| RF-04 | El `<title>` raíz y la `description` de metadatos usan «MASTER OF THE PUPPETS» en lugar de «IRON DECK». |
| RF-05 | Los títulos de `consoles`, `tours` y la ficha de producto (`products/[id]`) usan «MASTER OF THE PUPPETS» como sufijo de marca. |
| RF-06 | `/about` muestra h1 «About MASTER OF THE PUPPETS», `<title>` y `description` con el nuevo nombre, y el párrafo que describe la marca lo cita con el nuevo nombre. |
| RF-07 | Los selectores e2e que buscan la marca (`home`, `about`, `responsive`) buscan el nuevo texto y pasan. |
| RF-08 | Paleta, rutas, datos del catálogo y nombres de archivo permanecen sin cambios. |

## 5. Requisitos no funcionales

| id | Requisito |
|---|---|
| RNF-01 | Ningún texto visible de `apps/web` contiene «IRON DECK» (en mayúsculas o en cualquier capitalización) salvo comentarios de código. |
| RNF-02 | La aplicación compila (`npm run build` en `apps/web`) y la suite e2e de Playwright pasa contra el entorno de Docker, no solo contra el host de desarrollo (lección DEC-005). |
| RNF-03 | `apps/api` no cambia su comportamiento: `node --test` / vitest existentes siguen en verde. |
| RNF-04 | Ningún fichero fuera de alcance (sección 2) se modifica. |
| RNF-05 | No se introducen secretos, dependencias nuevas ni cambios de infraestructura. |

## 6. Criterios de aceptación

Formato canónico del `CLAUDE.md` (Given/When/Then + RFC 2119). Cada criterio tiene validación reproducible.

- [ ] Given la home `/` cargada, when se inspecciona el header, then el wordmark y el `aria-label` del enlace de inicio MUST contener «MASTER OF THE PUPPETS» y MUST NOT contener «IRON DECK».
  - Validación: `apps/web/e2e/responsive.spec.ts` (selector `getByLabel("Inicio MASTER OF THE PUPPETS")`) y `apps/web/components/iron-deck-header.tsx`.
- [ ] Given cualquier página con footer global, when se lee el copyright, then MUST mostrar «MASTER OF THE PUPPETS» y SHOULD conservar «No es una tienda real».
  - Validación: `grep -n "MASTER OF THE PUPPETS" apps/web/components/iron-deck-footer.tsx`.
- [ ] Given la home `/`, when se lee el hero, then la etiqueta MUST ser «Catálogo · MASTER OF THE PUPPETS».
  - Validación: `apps/web/e2e/home.spec.ts` y `apps/web/components/hero.tsx`.
- [ ] Given la home `/`, when se lee `<title>` y `<meta name="description">`, then MUST contener «MASTER OF THE PUPPETS» y MUST NOT contener «IRON DECK».
  - Validación: `apps/web/app/layout.tsx` (bloque `metadata`) y `curl -s http://localhost:3000/ | grep -c "IRON DECK"` → 0.
- [ ] Given las rutas `/consoles`, `/tours` y una ficha `/products/<id>`, when se lee el `<title>`, then MUST terminar en «— MASTER OF THE PUPPETS» o «| MASTER OF THE PUPPETS».
  - Validación: `apps/web/app/consoles/layout.tsx`, `apps/web/app/tours/layout.tsx`, `apps/web/app/(main)/products/[id]/page.tsx`.
- [ ] Given la ruta `/about`, when se carga, then el h1 MUST ser «About MASTER OF THE PUPPETS» y el `<title>` MUST contener «MASTER OF THE PUPPETS».
  - Validación: `apps/web/e2e/about.spec.ts` (`getByRole("heading", { level: 1, name: /About MASTER OF THE PUPPETS/i })`).
- [ ] Given la suite e2e, when se ejecuta, then MUST pasar en `home.spec.ts`, `about.spec.ts` y `responsive.spec.ts` sin cambiar el número de tests.
  - Validación: `npx playwright test` en `apps/web` contra Docker (`docker compose up`).
- [ ] Given el árbol `apps/web` (excluyendo `node_modules`, `.next` y comentarios), when se busca «IRON DECK», then el resultado MUST ser vacío.
  - Validación: `grep -rn "IRON DECK" apps/web --exclude-dir=node_modules --exclude-dir=.next | grep -v "^\S*:\s*\(//\|\*\|/\*\)"` → sin salida.
- [ ] Given `apps/api`, when se ejecutan sus tests, then MUST seguir en verde sin cambios de código.
  - Validación: `npm test` en `apps/api`; `git diff --stat -- apps/api` vacío.
- [ ] Given el cambio completo, when se revisa el diff, then MUST NOT tocar ficheros fuera de la sección 2.
  - Validación: `git diff --name-only` contra la lista de la tabla de tareas de `openspec/changes/master-of-the-puppets-rebrand/tasks.md` (fase 5).
- [ ] Given la home, when se compara con la versión anterior, then la paleta y las rutas MUST ser idénticas.
  - Validación: `git diff -- apps/web/app/globals.css apps/web/app/*/page.tsx` sin cambios de color ni de ruta; inspección visual con `smoke-*.png` de la fase 9.

## 7. Requisitos de trazabilidad

- Los criterios de este PRD se trasladan al delta `openspec/changes/master-of-the-puppets-rebrand/specs/catalog-viewer/spec.md` en la fase 3, y el estado vivo se actualiza en `specs/areas/catalog-viewer/spec.md` al cierre.
- Las tareas del plan citan los ids RF-xx / RNF-xx.

## 8. Pendientes

- Confirmar que el `aria-label` del header pasa a «Inicio MASTER OF THE PUPPETS» (supuesto aplicado).

```yaml
requirements:
  - id: RF-01
    title: Header wordmark y aria-label con el nuevo nombre
    category: functional
    priority: must-have
    description: El wordmark del header global y su aria-label muestran MASTER OF THE PUPPETS en el enlace a la home.
    acceptance_criteria:
      - El wordmark muestra MASTER OF THE PUPPETS
      - El aria-label es Inicio MASTER OF THE PUPPETS
  - id: RF-02
    title: Copyright del footer con el nuevo nombre
    category: functional
    priority: must-have
    description: El copyright del footer global muestra MASTER OF THE PUPPETS y conserva la leyenda No es una tienda real.
    acceptance_criteria:
      - El copyright contiene MASTER OF THE PUPPETS
      - La leyenda No es una tienda real se mantiene
  - id: RF-03
    title: Etiqueta del hero con el nuevo nombre
    category: functional
    priority: must-have
    description: La etiqueta del hero muestra Catálogo · MASTER OF THE PUPPETS.
    acceptance_criteria:
      - La etiqueta del hero es Catálogo · MASTER OF THE PUPPETS
  - id: RF-04
    title: Metadatos raíz con el nuevo nombre
    category: functional
    priority: must-have
    description: El title y la description raíz usan MASTER OF THE PUPPETS en lugar de IRON DECK.
    acceptance_criteria:
      - El title raíz contiene MASTER OF THE PUPPETS
      - La description raíz no contiene IRON DECK
  - id: RF-05
    title: Títulos de consoles, tours y ficha de producto
    category: functional
    priority: must-have
    description: Los títulos de las rutas consoles, tours y products/[id] usan MASTER OF THE PUPPETS como sufijo de marca.
    acceptance_criteria:
      - El title de consoles termina en MASTER OF THE PUPPETS
      - El title de tours termina en MASTER OF THE PUPPETS
      - El title de la ficha de producto termina en MASTER OF THE PUPPETS
  - id: RF-06
    title: Página /about con el nuevo nombre
    category: functional
    priority: must-have
    description: La página /about muestra h1 About MASTER OF THE PUPPETS, title y description con el nuevo nombre, y el párrafo de marca lo cita.
    acceptance_criteria:
      - El h1 es About MASTER OF THE PUPPETS
      - El title y la description contienen MASTER OF THE PUPPETS
      - El párrafo sobre la marca cita MASTER OF THE PUPPETS
  - id: RF-07
    title: Selectores e2e alineados con el nuevo texto
    category: functional
    priority: must-have
    description: Los selectores e2e de home, about y responsive buscan el nuevo texto y siguen pasando sin cambiar el número de tests.
    acceptance_criteria:
      - about.spec.ts busca About MASTER OF THE PUPPETS
      - responsive.spec.ts busca Inicio MASTER OF THE PUPPETS
      - El número de tests e2e no cambia
  - id: RF-08
    title: Paleta, rutas y nombres de archivo sin cambios
    category: constraint
    priority: must-have
    description: El cambio es solo textual. Paleta, rutas, datos del catálogo y nombres de archivo permanecen igual.
    acceptance_criteria:
      - globals.css no cambia sus tokens de color
      - Las rutas de app/ no cambian
      - Los nombres de archivo iron-deck-* no cambian
  - id: RNF-01
    title: Ningún texto visible con el nombre antiguo
    category: non-functional
    priority: must-have
    description: Ningún texto visible de apps/web contiene IRON DECK. Los comentarios de código pueden quedarse.
    acceptance_criteria:
      - La búsqueda de IRON DECK en apps/web no devuelve texto visible
  - id: RNF-02
    title: Build y e2e contra Docker
    category: non-functional
    priority: must-have
    description: La aplicación compila y la suite e2e pasa contra el entorno Docker, no solo en el host.
    acceptance_criteria:
      - npm run build en apps/web termina sin error
      - Playwright pasa contra docker compose up
  - id: RNF-03
    title: API sin cambios de comportamiento
    category: non-functional
    priority: must-have
    description: apps/api no cambia comportamiento ni código; sus tests siguen en verde.
    acceptance_criteria:
      - Los tests de apps/api pasan
      - git diff de apps/api está vacío
  - id: RNF-04
    title: Ficheros fuera de alcance intactos
    category: constraint
    priority: must-have
    description: No se modifica ningún fichero fuera del alcance de la sección 2 (docs de agentes, reports, specs vivas de otras áreas, archivos de iteraciones).
    acceptance_criteria:
      - El diff solo toca ficheros listados en el alcance
  - id: RNF-05
    title: Sin secretos ni dependencias nuevas
    category: constraint
    priority: must-have
    description: El cambio no introduce secretos, dependencias ni cambios de infraestructura.
    acceptance_criteria:
      - package.json no cambia
      - No hay secretos añadidos
```

## Skills ejecutadas
- Skill(skill: "create-prd") → aplicada
