---
name: plan-agentic-work
description: Descompone una spec/change en agentes ejecutores, skills, tareas, dependencias, gates Fase 7+10 y bucles de corrección. Output formateado como tabla de tareas + diagrama de dependencias + gates explícitos.
when_to_use: Cuando ya hay PRD/spec aprobada y hace falta crear el plan de ejecución de la iteración antes de delegar a subagentes.
allowed-tools: Read Write Edit Grep Glob
---

# Skill: Plan Agentic Work

Skill prescriptiva para producir el plan que el orquestador ejecuta delegando a subagentes.

## Catálogo de agentes (canónico)

| Agente | Skill | Cuándo |
|---|---|---|
| `cloud-architect` | `design-landing-zone` | Decisiones cloud antes de IaC |
| `terraform-engineer` | `generate-terraform-modules` | Crear/modificar `infra/landing-zone/**` |
| `backend-engineer` | `generate-product-api` | Crear/modificar `apps/api/**` |
| `frontend-engineer` | `create-catalog-ui` | Crear/modificar `apps/web/**` |
| `cicd-engineer` | `ci-cd-pipeline` | Crear/modificar `.github/workflows/**` |
| `qa-engineer` | `generate-tests` | Tests + smoke + validación contra Docker (OBLIGATORIO en TODA iter) |
| `security-engineer` | `security-review` | Fase 7 (OBLIGATORIO) |
| `observability-engineer` | `observability-design` | Métricas/logs/alertas/SLOs |
| `reviewer` | `review-pr` | Fase 10 (OBLIGATORIO) |

## Estructura del plan

### 1. Resumen ejecutivo (3-5 líneas)

Qué se va a entregar y los gates principales.

### 2. Tabla de tareas

```markdown
| ID | Tarea | Agente | Skill | Depende de | Entregable | Validación |
|---|---|---|---|---|---|---|
| T1 | Diseñar topología nueva consola | cloud-architect | design-landing-zone | — | reports/iter-N/cloud-architect.md | Diagrama + tabla decisiones |
| T2 | Implementar módulos infra | terraform-engineer | generate-terraform-modules | T1 | infra/landing-zone/modules/X | terraform fmt+validate+plan |
| T3 | Crear área backend /<area> | backend-engineer | generate-product-api | — | apps/api/src/{types,data,routes}/<area>.ts | vitest verde + tsc |
| T4 | Crear UI área /<area> | frontend-engineer | create-catalog-ui | T3 | apps/web/{lib,app,components} | tsc + lint + build |
| T5 | Test plan + tests | qa-engineer | generate-tests | T3, T4 | reports/iter-N/qa-test-plan.md + specs/tests | vitest + playwright contra Docker |
| T6 | CI/CD si workflows tocados | cicd-engineer | ci-cd-pipeline | — | .github/workflows/* | gh run validating |
| T7 | Observabilidad si aplica | observability-engineer | observability-design | T1, T2 | reports/iter-N/observability-engineer.md | Variables del módulo TF |
| T8 | Security gate (Fase 7) | security-engineer | security-review | T2..T7 | reports/iter-N/security-engineer.md | Veredicto APROBADO |
| T9 | Reviewer (Fase 10) | reviewer | review-pr | T8 | reports/iter-N/reviewer.md | Veredicto APROBAR |
| T10 | /ship (cierre) | (humano + orquestador) | — | T9 | PR abierto | URL del PR |
```

### 3. Gates explícitos

```markdown
## Gates

- **Fase 7 (security-engineer)**: bloquea si hay CRITICAL/HIGH abiertos. APROBADO o APROBADO CON OBSERVACIONES = pass.
- **Fase 10 (reviewer)**: bloquea si veredicto != APROBAR.
- **Fase 11 (humano)**: aprobación explícita antes de `/ship`.

## Bucles de corrección

- Si security devuelve CRITICAL/HIGH → tarea de fix al agente responsable → re-ejecutar security.
- Si reviewer devuelve CAMBIOS REQUERIDOS → crear tareas, re-ejecutar agentes, re-lanzar reviewer.
- Si tests fallan post-fix → qa-engineer recheck antes de cerrar.
```

### 4. Diagrama de dependencias (Mermaid)

```mermaid
flowchart TD
  T1[cloud-architect] --> T2[terraform-engineer]
  T3[backend-engineer] --> T4[frontend-engineer]
  T3 --> T5[qa-engineer]
  T4 --> T5
  T1 --> T7[observability-engineer]
  T2 --> T8[security-engineer]
  T3 --> T8
  T4 --> T8
  T6[cicd-engineer] --> T8
  T7 --> T8
  T5 --> T8
  T8 --> T9[reviewer]
  T9 --> T10[/ship]
```

### 5. Reglas de paralelización (agentes aislados)

> Los agentes corren en modo aislado (sin team). **No se ven entre sí**. Implicaciones:

- Si dos agentes tocan el mismo archivo → **serializarlos**, no lanzarlos en paralelo.
- Si tocan archivos distintos → lanzar en paralelo desde el orquestador (única llamada con varios `Agent`).
- Quien orquesta es el único punto de coordinación.
- Cuando hay handoffs (backend → frontend), incluir el shape del contrato en el prompt del receptor.

### 6. Artefactos esperados

Lista completa de archivos/reports que la iter producirá:

```
reports/iter-<N>/
├─ cloud-architect.md
├─ terraform-engineer.md
├─ backend-engineer.md
├─ frontend-engineer.md
├─ cicd-engineer.md
├─ qa-test-plan.md
├─ qa-engineer.md
├─ observability-engineer.md
├─ security-engineer.md
└─ reviewer.md

openspec/changes/<slug>/verify-report.md   (si va por change)
specs/areas/<area>/spec.md                   (movida al cerrar el change)
```

### 7. Pendientes humanos

- Aprobación de la iter (Fase 11).
- Configuración GitHub UI: Environments + Required reviewers.
- Decisiones de cloud target / costes.
- Validación legal si hay imágenes / contenido fair use.

## Reglas duras

- `qa-engineer`, `security-engineer`, `reviewer` son **obligatorios en TODA iter**. No se omiten ni por "es solo infra" ni por "es solo docs".
- Cada tarea cita la skill exacta que el agente debe invocar (`Skill(skill: "X")`).
- Cada tarea declara entregable y validación citables.
- El reviewer no puede ser quien orquesta. Es instancia independiente.
- Bucles de corrección no son opcionales — si el gate dice rojo, se vuelve atrás.

## Anti-patrones

- Plan sin gates explícitos → cierras sin pasar security/reviewer.
- Lanzar agentes en paralelo sobre el mismo archivo → conflictos en disk.
- Saltarse el qa-engineer en iters "puramente de infra" → los bugs SSR/DNS interno se escapan precisamente ahí; aprendido en producción.
- Plan sin diagrama de dependencias → orden ambiguo en reanudaciones.
- Plan que asume que los agentes "se hablan" entre sí → falso, son aislados.
