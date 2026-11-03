# Tareas — rename-brand-master-of-the-deck (iter-13)

Slug: rename-brand-master-of-the-deck
Iteración: iter-13

Fuentes: [[adlc-prd]], [[adlc-criterios]], `specs/rename-brand-master-of-the-deck-prd.md`, `openspec/changes/rename-brand-master-of-the-deck/specs/catalog-viewer/spec.md`.

## Tareas

```yaml
tasks:
  - id: T-01
    title: 'Renombrar la marca visible en header, footer, hero, About, metadatos y textos de apps/web (frontend-engineer, skill create-catalog-ui)'
    covers:
      - RF-01
      - RF-02
      - RF-03
      - RF-04
      - RF-06
      - RNF-01
      - RNF-03
    depends_on: []
  - id: T-02
    title: 'Actualizar los tests E2E about, responsive y home para la nueva marca y ejecutar la suite completa (qa-engineer, skill generate-tests)'
    covers:
      - RF-05
      - RF-07
      - RNF-02
    depends_on:
      - T-01
  - id: T-03
    title: 'Smoke funcional en / y /about con Chrome DevTools MCP: sin errores de consola ni 4xx/5xx (qa-engineer)'
    covers:
      - RF-06
      - RNF-04
    depends_on:
      - T-02
  - id: T-04
    title: 'Security gate Fase 7: scope, headers, dependencias sin cambios, sin secretos (security-engineer, skill security-review)'
    covers:
      - RNF-01
      - RNF-03
    depends_on:
      - T-03
  - id: T-05
    title: 'Auditoría Fase 10 independiente con veredicto APROBAR o CAMBIOS REQUERIDOS (reviewer, skill review-pr)'
    covers:
      - RF-01
      - RF-02
      - RF-03
      - RF-04
      - RF-05
      - RF-06
      - RF-07
    depends_on:
      - T-04
  - id: T-06
    title: 'Decisión humana G2: confirmar casing por superficie y alcance del footer y de home.spec antes de T-01 (persona, no agente)'
    covers:
      - RF-02
      - RF-03
    depends_on: []
```

## Tabla de tareas

| ID | Tarea | Agente | Skill | Depende de | Entregable | Validación |
|---|---|---|---|---|---|---|
| T-06 | Confirmar casing y alcance del footer / home.spec | Persona | — | — | Respuesta registrada en G2 | Decisión documentada en el proposal |
| T-01 | Renombrar marca visible en apps/web | frontend-engineer | create-catalog-ui | T-06 | Cambios en `iron-deck-header.tsx`, `iron-deck-footer.tsx`, `hero.tsx`, `app/about/page.tsx`, `app/layout.tsx`, layouts de sección | `grep -rn "IRON DECK" apps/web` sin hits de texto visible (AC-01..AC-05, AC-08) |
| T-02 | Actualizar E2E y ejecutar suite | qa-engineer | generate-tests | T-01 | `apps/web/e2e/about.spec.ts`, `responsive.spec.ts`, `home.spec.ts` | `cd apps/web && npm run test:e2e` en verde (AC-06, AC-07) |
| T-03 | Smoke con Chrome DevTools MCP | qa-engineer | — | T-02 | `reports/iter-13/qa-engineer.md` con capturas `smoke-*.png` | Consola y network sin errores en `/` y `/about` (AC-09) |
| T-04 | Security gate | security-engineer | security-review | T-03 | `reports/iter-13/security-engineer.md` | Sin findings CRITICAL/HIGH abiertos (AC-10) |
| T-05 | Auditoría independiente | reviewer | review-pr | T-04 | `reports/iter-13/reviewer.md` | Veredicto APROBAR |

## Diagrama de dependencias

```
T-06 (G2 humano) → T-01 (frontend) → T-02 (qa E2E) → T-03 (qa smoke) → T-04 (security) → T-05 (reviewer)
```

## Gates

- **G2 (humano)**: casing y alcance antes de T-01.
- **G3 (humano)**: aprobación de este plan antes de tocar código (DEC-002).
- **Gate Fase 7**: T-04. CRITICAL/HIGH bloquean; tras el fix se relanza security-engineer.
- **Gate Fase 10**: T-05. Veredicto APROBAR obligatorio; si pide cambios, se crean tareas y se relanza el reviewer.

## Agentes no necesarios

`backend-engineer`, `terraform-engineer`, `cloud-architect`, `cicd-engineer` y `observability-engineer` no participan: el PRD excluye `apps/api/**`, infraestructura, CI/CD y observabilidad, y el cambio es solo de texto y tests.

## Bucles de corrección

- Si T-02 o T-03 fallan: vuelve a T-01 con el error exacto.
- Si T-04 da CRITICAL/HIGH: crea tarea de fix, delega y relanza security-engineer.
- Si T-05 pide cambios: crea tareas con sus recomendaciones y relanza reviewer.
