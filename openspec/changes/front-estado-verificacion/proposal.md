# Propuesta: verificación del estado del front (`apps/web`)

Slug: front-estado-verificacion
Iteración: iter-13

Fuentes: [[adlc-prd]] (`specs/front-estado-verificacion-prd.md`), [[adlc-criterios]], [[adlc-solicitud]].

## Objetivo

Comprobar con evidencia reproducible si `apps/web` (Next.js 15 + React 19) arranca en dev y en producción, si el lint y el build pasan y si la suite de tests puede ejecutarse. Es un diagnóstico: no corrige código ni añade dependencias.

## Hallazgos previos

- `apps/web` no tiene runner de tests unitarios. Sus scripts de test son `test:e2e` y `test:e2e:headed` (Playwright, 10 ficheros en `apps/web/e2e/`).
- "Tests unitarios" se interpreta como lint (`next lint`) y build (`next build`) según la decisión confirmada en [[adlc-solicitud]].
- `CLAUDE.md` cita `claude-catalog-viewer/`, que no existe. Es un gap documentado, no se corrige aquí.

## Agentes

| Agente | Participa | Motivo |
|---|---|---|
| `frontend-engineer` | Sí | Arranque dev/prod, lint y build de `apps/web`. |
| `qa-engineer` | Sí (obligatorio) | Inventario de tests, E2E y consola del navegador. |
| `security-engineer` | Sí (obligatorio, Fase 7) | Gate de seguridad sobre `apps/web` y el reporte. |
| `reviewer` | Sí (obligatorio, Fase 10) | Auditoría independiente antes de la aprobación humana. |
| `cloud-architect` | No | Sin decisiones cloud. |
| `terraform-engineer` | No | Sin cambios en `infra/`. |
| `backend-engineer` | No | Sin cambios en `apps/api`. |
| `cicd-engineer` | No | Sin cambios en `.github/workflows/`. |
| `observability-engineer` | No | Sin métricas ni alertas en alcance. |

Nota de catálogo: el agente `frontend-engineer` declara la skill `create-catalog-ui`, que describe construcción de UI y no diagnóstico. Se usa tal cual; si el catálogo debe ampliarse, es decisión humana.

## Fuera de alcance

- Añadir Vitest/Jest o escribir tests nuevos.
- Corregir bugs del front encontrados.
- Tocar `apps/api`, Docker, infraestructura o despliegues.
- Corregir la referencia a `claude-catalog-viewer/` en `CLAUDE.md`.

## Gates

- Fase 7 (`security-engineer`): bloquea si hay CRITICAL o HIGH abiertos.
- Fase 10 (`reviewer`): bloquea si el veredicto no es APROBAR.
- Fase 11: aprobación humana del PRD, de los criterios y del plan antes de ejecutar código.

## Decisiones pendientes para una persona

- Si se añade un runner unitario (Vitest/Jest) a `apps/web`.
- Si se corrige la referencia a `claude-catalog-viewer/` en `CLAUDE.md`.
- Confirmar el área de dominio (`catalog-products` u otra), porque `catalog-viewer` no existe en `specs/areas/`.
