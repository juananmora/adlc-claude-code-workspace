# Tareas: front-estado-verificacion

Slug: front-estado-verificacion
Iteración: iter-14

Trazabilidad: issue #61 de juananmora/adlc-claude-code-workspace. Cada tarea es una sub-issue.

## Tabla de tareas

| ID | Tarea | Agente | Skill | Depende de | Entregable | Validación |
|---|---|---|---|---|---|---|
| T-01 | Arranque dev/prod, build y lint de `apps/web` | frontend-engineer | `Skill(skill: "create-catalog-ui")` | — | `reports/iter-14/frontend-engineer.md` | `npm run dev` + curl 200; `npm run build` exit 0; `npm start` + curl 200; `npm run lint` exit y resumen |
| T-02 | Inventario de tests y ejecución E2E | qa-engineer | `Skill(skill: "generate-tests")` | T-01 | `reports/iter-14/qa-engineer.md` | `npm run test:e2e` con resumen de pasados/fallados/omitidos; `grep -n '"test' apps/web/package.json` |
| T-03 | Consola y red de `/` en Chromium | qa-engineer | `Skill(skill: "generate-tests")` | T-01 | `reports/iter-14/qa-test-plan.md` | `playwright-browser_console_messages` (level error) y `playwright-browser_network_requests` |
| T-04 | Security gate (Fase 7) | security-engineer | `Skill(skill: "security-review")` | T-01, T-02, T-03 | `reports/iter-14/security-engineer.md` | `npm audit --audit-level=high` en `apps/web`; veredicto sin CRITICAL/HIGH abiertos |
| T-05 | Reviewer independiente (Fase 10) | reviewer | `Skill(skill: "review-pr")` | T-04 | `reports/iter-14/reviewer.md` | Veredicto APROBAR contra criterios AC-01..AC-08 |

Serialización: T-01 y T-02/T-03 comparten `apps/web/node_modules` y el servidor en `:3000`, así que se ejecutan en serie, no en paralelo.

## Tareas en formato de trazabilidad

```yaml
tasks:
  - id: T-01
    title: 'Arranque dev/prod, build y lint de apps/web'
    covers: [RF-01, RF-02, RF-03, RF-06, RNF-01, RNF-02]
    depends_on: []
    verification: 'npm run dev + curl 200; npm run build exit 0; npm start + curl 200; npm run lint exit'
  - id: T-02
    title: 'Inventario de tests y ejecucion E2E de apps/web'
    covers: [RF-04, RF-05, RNF-02]
    depends_on: [T-01]
    verification: 'npm run test:e2e resumen; grep de scripts test en apps/web/package.json'
  - id: T-03
    title: 'Consola y red de / en Chromium'
    covers: [RNF-04]
    depends_on: [T-01]
    verification: 'playwright-browser_console_messages level error; playwright-browser_network_requests'
  - id: T-04
    title: 'Security gate Fase 7 sobre apps/web y el reporte'
    covers: [RNF-03]
    depends_on: [T-01, T-02, T-03]
    verification: 'npm audit --audit-level=high; veredicto sin CRITICAL/HIGH abiertos'
  - id: T-05
    title: 'Reviewer independiente Fase 10'
    covers: [RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RNF-01, RNF-02, RNF-03, RNF-04]
    depends_on: [T-04]
    verification: 'Veredicto APROBAR contra AC-01..AC-08'
```

## Cobertura de requisitos

| Requisito | Tareas |
|---|---|
| RF-01 | T-01, T-05 |
| RF-02 | T-01, T-05 |
| RF-03 | T-01, T-05 |
| RF-04 | T-02, T-05 |
| RF-05 | T-02, T-05 |
| RF-06 | T-01, T-05 |
| RNF-01 | T-01, T-05 |
| RNF-02 | T-01, T-02, T-05 |
| RNF-03 | T-04, T-05 |
| RNF-04 | T-03, T-05 |

Ningún requisito queda sin tarea.

## Agentes no necesarios

`cloud-architect`, `terraform-engineer`, `backend-engineer`, `cicd-engineer` y `observability-engineer` se saltan porque el alcance es solo diagnóstico de `apps/web`. Sus stages se omiten.
