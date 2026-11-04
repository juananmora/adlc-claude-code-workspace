# PRD — Renombrar la marca «IRON DECK» a «Master of the Puppets»

Slug: rename-brand-master-of-puppets

Fuentes: [[adlc-solicitud]] (intent: renombrar IRON DECK a Master of the Puppets). Alcance confirmado por la persona: **solo el nombre visible**.

## Objetivo

Sustituir el nombre de marca visible del portal «IRON DECK» por «Master of the Puppets» en la experiencia de usuario (cabecera, pie, títulos de página, hero y About, accesibilidad), sin cambiar funcionalidad, paleta ni estética.

## Alcance

- Wordmark y textos visibles en cabecera, pie y hero.
- Metadatos `<title>` y `description` de las rutas que citan la marca.
- Título y textos de `/about`.
- `aria-label` de la marca en cabecera.
- Tests E2E que afirman el texto de la marca.

## Fuera de alcance

- Renombrar ficheros o componentes internos (`iron-deck-header.tsx`, `iron-deck-footer.tsx`).
- Cambiar paleta, tipografía, logo (`app/icon.svg`) o assets.
- Reescribir el histórico: `specs/acceptance-criteria-archive.md`, `openspec/changes/*` archivados y `specs/areas/*` de otras áreas se mantienen.
- Cambios de API, datos de catálogo o despliegue. Ningún despliegue a producción.

## Requisitos

| id | Tipo | Prioridad | Descripción |
|---|---|---|---|
| RF-01 | Funcional | must-have | La cabecera MUST mostrar «Master of the Puppets» como marca y su `aria-label` MUST leer «Inicio Master of the Puppets». |
| RF-02 | Funcional | must-have | El pie MUST mostrar el copyright con «Master of the Puppets». |
| RF-03 | Funcional | must-have | El hero MUST usar «Master of the Puppets» en su eyebrow. |
| RF-04 | Funcional | must-have | El `<title>` y la `description` de la raíz y de las páginas que citan la marca MUST usar el nuevo nombre. |
| RF-05 | Funcional | must-have | La página `/about` MUST mostrar «Master of the Puppets» en título, H1 y cuerpo. |
| RF-06 | Funcional | should-have | La UI renderizada SHOULD NOT contener «IRON DECK» como texto visible. |
| RNF-01 | No funcional | must-have | El cambio MUST NOT alterar paleta, layout ni navegación. |
| RNF-02 | No funcional | must-have | Los tests unitarios y E2E MUST seguir pasando tras actualizar las aserciones. |
| RNF-03 | No funcional | should-have | Las rutas `/`, `/about` y una ficha SHOULD cargar sin errores de consola. |

```yaml
requirements:
  - id: RF-01
    title: Marca en cabecera
    category: functional
    priority: must-have
    description: 'La cabecera muestra Master of the Puppets y su aria-label usa el mismo nombre.'
    acceptance_criteria:
      - 'Given la home, when se carga, then la marca visible es Master of the Puppets.'
  - id: RF-02
    title: Copyright en pie
    category: functional
    priority: must-have
    description: 'El pie muestra el copyright con Master of the Puppets.'
    acceptance_criteria:
      - 'Given cualquier ruta, when se renderiza el pie, then el texto contiene Master of the Puppets.'
  - id: RF-03
    title: Eyebrow del hero
    category: functional
    priority: must-have
    description: 'El hero usa Master of the Puppets en su eyebrow.'
    acceptance_criteria:
      - 'Given la home, when se renderiza el hero, then el eyebrow contiene Master of the Puppets.'
  - id: RF-04
    title: Metadatos
    category: functional
    priority: must-have
    description: 'title y description de raiz y rutas citan el nuevo nombre.'
    acceptance_criteria:
      - 'Given una ruta con metadata de marca, when se genera el head, then title no contiene IRON DECK.'
  - id: RF-05
    title: Pagina About
    category: functional
    priority: must-have
    description: 'About muestra el nuevo nombre en titulo, H1 y cuerpo.'
    acceptance_criteria:
      - 'Given /about, when se carga, then el H1 contiene Master of the Puppets.'
  - id: RF-06
    title: Sin texto legado en UI
    category: functional
    priority: should-have
    description: 'No queda IRON DECK en texto renderizado de la UI.'
    acceptance_criteria:
      - 'Given la UI, when se busca IRON DECK en apps/web/app y apps/web/components, then no hay coincidencias de texto visible.'
  - id: RNF-01
    title: Sin cambio visual ni de comportamiento
    category: non-functional
    priority: must-have
    description: 'Paleta, layout y navegacion no cambian.'
    acceptance_criteria:
      - 'Given el diff, when se revisa, then no hay cambios de estilos ni de rutas.'
  - id: RNF-02
    title: Tests en verde
    category: non-functional
    priority: must-have
    description: 'Unit y E2E pasan con las aserciones actualizadas.'
    acceptance_criteria:
      - 'Given la suite, when se ejecuta, then pasa sin fallos.'
  - id: RNF-03
    title: Sin errores de consola
    category: non-functional
    priority: should-have
    description: 'Las rutas principales no producen errores de consola.'
    acceptance_criteria:
      - 'Given /, /about y una ficha, when se cargan, then la consola no muestra errores.'
```

## Criterios de aceptación (G/W/T + RFC 2119)

- [ ] Given la home cargada, when el usuario mira la cabecera, then la marca MUST leer «Master of the Puppets».
  - Validación: `apps/web/e2e/home.spec.ts` y `apps/web/components/iron-deck-header.tsx`.
- [ ] Given la cabecera, when se inspecciona el enlace de inicio, then su `aria-label` MUST ser «Inicio Master of the Puppets».
  - Validación: `apps/web/e2e/responsive.spec.ts:12`.
- [ ] Given cualquier ruta, when se renderiza el pie, then el copyright MUST contener «Master of the Puppets».
  - Validación: `apps/web/components/iron-deck-footer.tsx:23`.
- [ ] Given la home, when se renderiza el hero, then el eyebrow MUST contener «Master of the Puppets».
  - Validación: `apps/web/components/hero.tsx:34`.
- [ ] Given la raíz y las rutas con metadata, when se genera el `<title>`, then MUST NOT contener «IRON DECK».
  - Validación: `grep -rn "IRON DECK" apps/web/app` sin coincidencias en `<title>`.
- [ ] Given `/about`, when se carga, then el H1 MUST contener «Master of the Puppets».
  - Validación: `apps/web/e2e/about.spec.ts:25`.
- [ ] Given el código de UI, when se busca «IRON DECK» en `apps/web/app` y `apps/web/components`, then SHOULD NOT quedar texto visible.
  - Validación: `grep -rn "IRON DECK" apps/web/app apps/web/components`.
- [ ] Given el diff, when se revisa, then MUST NOT haber cambios de paleta, layout ni rutas.
  - Validación: inspección del diff de `apps/web/app/globals.css` y del tema (sin cambios de color).
- [ ] Given la suite de tests, when se ejecuta `npm test` (unit) y `npx playwright test` (E2E) desde `apps/web`, then MUST pasar.
  - Validación: comando reproducible.
- [ ] Given /, /about y una ficha, when se cargan con Chrome DevTools, then la consola MUST NOT mostrar errores.
  - Validación: smoke MCP de Fase 9.
- [ ] Given el histórico `specs/acceptance-criteria-archive.md` y `openspec/changes/*` archivados, when se revisa, then MUST NOT modificarse.
  - Validación: `git diff --stat` sin esos ficheros.

## Supuestos

- Los componentes `iron-deck-*` se conservan por ser internos.
- «No es una tienda real» del pie se mantiene; solo cambia la marca.
- Las referencias históricas en `specs/areas/*` pueden quedar; no bloquean el cierre.
