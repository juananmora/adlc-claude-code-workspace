Slug: rename-brand-master-of-puppets
Iteración: iter-13

# Proposal — iter-13: rebrand visible «IRON DECK» → «Master of the Puppets»

> **Estado**: borrador pendiente de aprobación humana (gate de plan, DEC-002)
> **Tipo**: change (propuesta activa) → al cerrar pasa a `specs/areas/catalog-viewer/spec.md`
> **PRD**: `specs/rename-brand-master-of-puppets-prd.md` (RF-01..RF-06, RNF-01..RNF-03)
> **Criterios**: `openspec/changes/rename-brand-master-of-puppets/specs/catalog-viewer/spec.md` (AC-01..AC-13)

## Objetivo

Sustituir el nombre de marca visible «IRON DECK» por «Master of the Puppets» en la cabecera, el pie, el eyebrow del hero, los metadatos (`<title>`, `description`) y la página /about, sin cambiar diseño, paleta, navegación ni comportamiento (RNF-01).

## Alcance

- Cabecera global: texto del wordmark y `aria-label` del enlace de inicio (`apps/web/components/iron-deck-header.tsx`).
- Pie global: copyright (`apps/web/components/iron-deck-footer.tsx`).
- Hero de la home: eyebrow (`apps/web/components/hero.tsx`).
- Metadatos: `apps/web/app/layout.tsx`, `apps/web/app/tours/layout.tsx`, `apps/web/app/consoles/layout.tsx`, `apps/web/app/products/[id]/page.tsx`, `apps/web/app/about/page.tsx`.
- Página /about: título visible, H1 duplicado y texto de presentación.
- Tests e2e que localizan la marca por nombre: `apps/web/e2e/responsive.spec.ts`, `apps/web/e2e/about.spec.ts`.

## Fuera de alcance

- Renombrar ficheros, componentes o clases técnicas (`iron-deck-*`, `IronDeckHeader`, variables `--iron-*`): RNF-01 lo prohíbe.
- Cambios de diseño, paleta, layout o navegación.
- Cambios de backend (`apps/api`): la marca no aparece en la API.
- Cambios de infra, CI/CD o despliegue.

## Decisiones y supuestos

1. El wordmark está partido en dos `<span>` (inicial roja + resto en hueso). La división visual se conserva con las mismas clases; cómo repartir «Master of the Puppets» entre spans es una decisión de implementación que debe revisar la persona en la captura.
2. Los criterios añadieron títulos de layouts, metadatos de producto y el H1/eyebrow de /about que el PRD no listaba. Se mantienen porque son texto visible o metadatos de la marca.
3. Se usa `apps/web` como ruta real de la aplicación (es donde están los componentes citados en los criterios).
4. Los puntos de decisión humana son el gate G2 (PRD y criterios) y la aprobación de este plan antes de tocar código.

## Agentes seleccionados

| Agente | Participa | Motivo |
|---|---|---|
| `frontend-engineer` | Sí (T-01, T-02) | Cambia componentes, layouts, metadatos y /about. |
| `qa-engineer` | Sí (T-03) | Obligatorio en toda iteración; actualiza los e2e y valida la marca. |
| `security-engineer` | Sí (T-04) | Gate de Fase 7 obligatorio. |
| `reviewer` | Sí (T-05) | Auditoría final independiente obligatoria (Fase 10). |
| `backend-engineer` | No | La marca no aparece en `apps/api`; no hay cambio de contrato. |
| `cloud-architect` | No | Sin decisiones de arquitectura cloud. |
| `terraform-engineer` | No | Sin cambios de IaC. |
| `cicd-engineer` | No | Sin cambios de pipelines ni despliegue. |
| `observability-engineer` | No | Sin cambios de logs, métricas ni trazas. |

## Riesgos

- Cambio de longitud del wordmark: «Master of the Puppets» es más largo que «IRON DECK» y puede desbordar la cabecera en 390 px. Se valida con captura en 1280×800 y 390×844 (AC-01).
- Quedan textos «IRON DECK» fuera de las superficies listadas (p. ej. comentarios de código). No son visibles; no se tocan.
