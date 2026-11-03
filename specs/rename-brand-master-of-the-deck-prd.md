# PRD — Cambio de marca: IRON DECK → MASTER OF THE DECK

Slug: rename-brand-master-of-the-deck

Fuente: [[adlc-solicitud]] ("Neceisto que cambies en el site Iron Deck por Master of the Deck").

## Objetivo

Sustituir la marca visible del sitio `apps/web` "IRON DECK" por "MASTER OF THE DECK" (mayúsculas, igual que el estilo actual), manteniendo la paleta y la estética metálica.

## Alcance

- Textos visibles: wordmark de cabecera, copyright del pie, h1 y copy de la página About, hero, títulos de página y metadatos (title, description, aria-label, alt).
- Tests E2E que comprueban esos textos.
- Comentarios de código dentro de `apps/web` que mencionen la marca.

## Fuera de alcance

- Identificadores técnicos: `IronDeckHeader`, `iron-deck-header.tsx`, `iron-deck-footer.tsx`, clases CSS. Se mantienen.
- Paleta, tipografía y estilo visual.
- Historia del proyecto: `specs/**` (salvo este PRD), `openspec/**`, `reports/**`, `docs/**`, `specs/acceptance-criteria-archive.md`, `.claude-portable/**`.
- Cambios fuera de `apps/web`, salvo el comentario de `apps/api/src/data/tours.ts`, que se deja tal cual.

## Requisitos funcionales

- **RF-01**: La cabecera del sitio MUST mostrar "MASTER OF THE DECK" como wordmark en lugar de "IRON DECK".
- **RF-02**: El pie de página MUST mostrar el copyright con "MASTER OF THE DECK".
- **RF-03**: Los metadatos `title` y `description` de `app/layout.tsx` y de todos los `layout.tsx` de sección MUST usar "MASTER OF THE DECK".
- **RF-04**: La página `/about` MUST mostrar "MASTER OF THE DECK" en su h1 y en el cuerpo de texto.
- **RF-05**: El `aria-label` de la cabecera (enlace de inicio) MUST leerse "Inicio MASTER OF THE DECK".
- **RF-06**: El hero de la home MUST mostrar "Catálogo · MASTER OF THE DECK".
- **RF-07**: Los tests E2E (`e2e/about.spec.ts`, `e2e/responsive.spec.ts`, `e2e/home.spec.ts`) MUST esperar el nuevo texto.

## Requisitos no funcionales

- **RNF-01**: La paleta de colores y la tipografía MUST permanecer sin cambios.
- **RNF-02**: No se MUST modificar ningún fichero fuera de `apps/web` salvo este PRD y su entrada en `openspec/config.yaml` si la iteración la requiere.
- **RNF-03**: Tras el cambio, `grep -ri "iron deck" apps/web --include=*.tsx --include=*.ts --include=*.css` SHOULD devolver solo identificadores técnicos (nombres de fichero y componentes).
- **RNF-04**: Los tests E2E de `apps/web` MUST pasar contra el nuevo texto.

## Criterios de aceptación

- [ ] Given la home cargada, when se inspecciona la cabecera, then el wordmark MUST contener "MASTER OF THE DECK" y no "IRON DECK". Validación: `apps/web/e2e/home.spec.ts`.
- [ ] Given cualquier página de `apps/web`, when se lee el `<title>`, then MUST contener "MASTER OF THE DECK". Validación: inspección de `apps/web/app/**/layout.tsx`.
- [ ] Given `/about`, when se carga, then el h1 MUST ser "About MASTER OF THE DECK". Validación: `apps/web/e2e/about.spec.ts:25`.
- [ ] Given la cabecera en viewport móvil, when se busca el enlace de inicio, then su nombre accesible MUST ser "Inicio MASTER OF THE DECK". Validación: `apps/web/e2e/responsive.spec.ts:12-13`.
- [ ] Given el pie de página, when se lee el copyright, then MUST contener "MASTER OF THE DECK". Validación: inspección de `apps/web/components/iron-deck-footer.tsx`.
- [ ] Given el repositorio tras el cambio, when se ejecuta `grep -ri "iron deck" apps/web`, then SHOULD no aparecer ninguna cadena visible al usuario. Validación: comando indicado en RNF-03.
- [ ] Given la suite de tests de `apps/web`, when se ejecuta, then MUST pasar en su totalidad. Validación: comando de test de `apps/web`.

## Preguntas abiertas para la persona

- Si `.claude-portable/agents/` y `.claude-portable/skills/` (que citan "IRON DECK" como línea gráfica) deben actualizarse en una iteración posterior.
- Si la forma "MASTER OF THE DECK" en mayúsculas es definitiva en metadatos y `<title>` o si se prefiere capitalización de título.

## Requisitos (YAML)

```yaml
requirements:
  - id: RF-01
    title: 'Cabecera con nueva marca'
    category: functional
    priority: must-have
    description: 'El wordmark de la cabecera muestra MASTER OF THE DECK.'
    acceptance_criteria:
      - 'El wordmark contiene MASTER OF THE DECK y no IRON DECK'
  - id: RF-02
    title: 'Copyright del pie con nueva marca'
    category: functional
    priority: must-have
    description: 'El copyright del pie usa MASTER OF THE DECK.'
    acceptance_criteria:
      - 'El copyright contiene MASTER OF THE DECK'
  - id: RF-03
    title: 'Metadatos con nueva marca'
    category: functional
    priority: must-have
    description: 'Los title y description de los layouts usan MASTER OF THE DECK.'
    acceptance_criteria:
      - 'Todos los layouts de apps/web usan MASTER OF THE DECK en title y description'
  - id: RF-04
    title: 'About con nueva marca'
    category: functional
    priority: must-have
    description: 'La página /about muestra MASTER OF THE DECK en h1 y cuerpo.'
    acceptance_criteria:
      - 'El h1 de /about es About MASTER OF THE DECK'
  - id: RF-05
    title: 'Aria-label de inicio'
    category: functional
    priority: must-have
    description: 'El enlace de inicio de la cabecera tiene nombre accesible con la nueva marca.'
    acceptance_criteria:
      - 'El nombre accesible es Inicio MASTER OF THE DECK'
  - id: RF-06
    title: 'Hero con nueva marca'
    category: functional
    priority: must-have
    description: 'El hero de la home muestra Catálogo · MASTER OF THE DECK.'
    acceptance_criteria:
      - 'El texto del hero contiene MASTER OF THE DECK'
  - id: RF-07
    title: 'Tests E2E actualizados'
    category: functional
    priority: must-have
    description: 'Los tests E2E que comprobaban el nombre antiguo esperan el nuevo.'
    acceptance_criteria:
      - 'about.spec.ts, responsive.spec.ts y home.spec.ts usan el nuevo texto'
  - id: RNF-01
    title: 'Paleta y tipografía sin cambios'
    category: non-functional
    priority: must-have
    description: 'El cambio de marca no modifica colores ni tipografía.'
    acceptance_criteria:
      - 'El diff de CSS sólo toca comentarios, si los hay'
  - id: RNF-02
    title: 'Alcance limitado a apps/web'
    category: constraint
    priority: must-have
    description: 'Sólo se modifican ficheros de apps/web y este PRD.'
    acceptance_criteria:
      - 'Ningún fichero fuera de apps/web cambia salvo este PRD'
  - id: RNF-03
    title: 'Sin residuos del nombre antiguo'
    category: non-functional
    priority: should-have
    description: 'No quedan cadenas visibles con IRON DECK en apps/web.'
    acceptance_criteria:
      - 'grep -ri iron deck apps/web no devuelve textos visibles'
  - id: RNF-04
    title: 'Suite de tests verde'
    category: non-functional
    priority: must-have
    description: 'La suite de apps/web pasa tras el cambio.'
    acceptance_criteria:
      - 'Los tests de apps/web pasan'
```

## Notas de trazabilidad

Este intent se traza en juananmora/adlc-claude-code-workspace. La issue de trazabilidad se abre con este PRD.
