Slug: master-of-the-puppets-rename
Iteración: iter-13

# Propuesta: renombrar IRON DECK a Master of the Puppets

PRD: `specs/master-of-the-puppets-rename-prd.md`. Criterios: `openspec/changes/master-of-the-puppets-rename/specs/catalog-viewer/spec.md` (AC-01..AC-14). Intent trazado en la issue #32.

## Resumen

Sustituir el nombre visible de la marca "IRON DECK" por "Master of the Puppets" en `apps/web`: título y descripción meta, wordmark del header, footer, hero, página About, títulos de sección y ficha de producto, y los selectores e2e que dependen de ellos. Solo cambia texto visible y metadatos.

## Alcance

- Dentro: `apps/web/app/layout.tsx`, `apps/web/app/about/page.tsx`, `apps/web/app/consoles/layout.tsx`, `apps/web/app/tours/layout.tsx`, `apps/web/app/(main)/products/[id]/page.tsx`, los layouts de `albums` y `games`, `apps/web/components/hero.tsx`, `apps/web/components/iron-deck-header.tsx`, `apps/web/components/iron-deck-footer.tsx`, `apps/web/e2e/about.spec.ts` y `apps/web/e2e/responsive.spec.ts`.
- Fuera: renombrar identificadores (`IronDeck*`, ficheros `iron-deck-*.tsx`, `IRON_DECK`), tokens CSS y copy descriptivo que no sea la marca. Quedan como deuda técnica (AC-13).
- Revisar si el README menciona la marca visible y, en ese caso, actualizarlo.

## Agentes

| Agente | Participa | Motivo |
|---|---|---|
| `frontend-engineer` | Sí | Cambia layouts, componentes y páginas de `apps/web`. |
| `qa-engineer` | Sí (obligatorio) | Tests unitarios y e2e, smoke de consola y regresión. |
| `security-engineer` | Sí (obligatorio) | Fase 7 gate. |
| `reviewer` | Sí (obligatorio) | Fase 10 gate independiente. |
| `backend-engineer` | No | No hay cambios de API. |
| `cloud-architect` | No | No hay decisiones de cloud. |
| `terraform-engineer` | No | No hay cambios de infraestructura. |
| `cicd-engineer` | No | No se tocan workflows. |
| `observability-engineer` | No | No hay cambios de métricas, logs ni alertas. |

## Riesgos y decisiones humanas

- "Master of the Puppets" es el título de un álbum de Metallica. AC-14 exige aprobación humana explícita de la marca antes del despliegue.
- Ninguna acción de despliegue está en este cambio.

## Gates

- Gate del plan: aprobación humana antes de tocar código (DEC-002).
- Fase 7 (security-engineer) y Fase 10 (reviewer) bloquean el cierre si hay hallazgos CRITICAL o HIGH.
