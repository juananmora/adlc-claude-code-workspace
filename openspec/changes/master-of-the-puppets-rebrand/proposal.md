# Propuesta — Cambio de marca IRON DECK → MASTER OF THE PUPPETS

Slug: master-of-the-puppets-rebrand
Iteración: iter-13

PRD: [[adlc-prd]] (`specs/master-of-the-puppets-rebrand-prd.md`).
Criterios: [[adlc-criterios]] (`openspec/changes/master-of-the-puppets-rebrand/specs/catalog-viewer/spec.md`).
Trazabilidad: issue #31 de juananmora/adlc-claude-code-workspace.

## Resumen

Sustituir «IRON DECK» por «MASTER OF THE PUPPETS» en el texto visible de `apps/web`. Cambio solo textual: paleta, rutas, nombres de archivo `iron-deck-*` y `apps/api` no cambian. Se cierra con la suite Playwright en Docker, el security gate (Fase 7) y el reviewer (Fase 10).

## Agentes del plan

| ID | Tarea | Agente | Skill | Depende de | Entregable | Validación |
|---|---|---|---|---|---|---|
| T-01 | Sustituir el texto visible IRON DECK por MASTER OF THE PUPPETS en layouts, componentes y páginas de apps/web | frontend-engineer | create-catalog-ui | — | `apps/web/components/{iron-deck-header,iron-deck-footer,hero}.tsx`, `apps/web/app/{layout,about/page,consoles/layout,tours/layout,(main)/products/[id]/page}.tsx` | `npm run build` en apps/web; grep de IRON DECK sin resultados visibles (AC-09) |
| T-02 | Actualizar selectores e2e de home, about y responsive, y ejecutar la suite contra Docker | qa-engineer | generate-tests | T-01 | `apps/web/e2e/{home,about,responsive}.spec.ts` | `npx playwright test` contra `docker compose up` (AC-07) |
| T-03 | Security gate (Fase 7) sobre el delta | security-engineer | security-review | T-01, T-02 | `reports/iter-13/security-engineer.md` | Veredicto sin CRITICAL/HIGH abiertos |
| T-04 | Reviewer independiente (Fase 10) | reviewer | review-pr | T-03 | `reports/iter-13/reviewer.md` | Veredicto APROBAR |
| T-05 | Auditoría de criterios y DEC-NNN | (orquestador) | — | T-04 | `openspec/changes/master-of-the-puppets-rebrand/verify-report.md`, `openspec/config.yaml` | Tabla criterio/evidencia/estado completa |

Agentes no necesarios (sus stages se saltan):
- `backend-engineer`: `apps/api` no cambia (RNF-03).
- `terraform-engineer`, `cloud-architect`: sin infraestructura (RNF-05).
- `cicd-engineer`: sin cambios en `.github/workflows/**`.
- `observability-engineer`: sin cambios de métricas, logs ni alertas.

Obligatorios en toda iteración y presentes en el plan: `qa-engineer` (T-02), `security-engineer` (T-03), `reviewer` (T-04).

## Diagrama de dependencias

```mermaid
flowchart TD
  T1[frontend-engineer] --> T2[qa-engineer]
  T1 --> T3[security-engineer]
  T2 --> T3
  T3 --> T4[reviewer]
  T4 --> T5[orquestador: verify-report + DEC]
  T5 --> SHIP[/ship]
```

## Gates

- Fase 7 (security-engineer): bloquea si hay CRITICAL o HIGH abiertos. APROBADO o APROBADO CON OBSERVACIONES = pasa.
- Fase 10 (reviewer): bloquea si el veredicto no es APROBAR.
- Fase 11 (humano): aprobación explícita antes de `/ship`.
- Aprobación humana del plan antes de tocar código (DEC-002).

## Bucles de corrección

- Security con CRITICAL/HIGH → tarea de fix a frontend-engineer → relanzar security-engineer.
- Reviewer con CAMBIOS REQUERIDOS → tareas nuevas, relanzar agentes afectados, relanzar reviewer.
- Playwright falla tras el fix → relanzar qa-engineer antes de cerrar.

## Supuestos

- S-01: el CLAUDE.md nombra `catalog-viewer` y `claude-catalog-viewer/`, pero el repo usa `apps/web` y `apps/api`. El plan sigue el repo real.
- S-02: el aria-label del header pasa a «Inicio MASTER OF THE PUPPETS», tal como indica el PRD. Pendiente de confirmar en la aprobación del plan.
- Los comentarios de código con «IRON DECK» se quedan (RNF-01).

## Artefactos esperados

```
reports/iter-13/
├─ frontend-engineer.md
├─ qa-engineer.md
├─ security-engineer.md
└─ reviewer.md

openspec/changes/master-of-the-puppets-rebrand/
├─ proposal.md
├─ tasks.md
├─ verify-report.md
└─ specs/catalog-viewer/spec.md
```

## Pendientes humanos

- Aprobación del plan y confirmación de S-02.
- Aprobación de la iteración (Fase 11) antes de `/ship`.
