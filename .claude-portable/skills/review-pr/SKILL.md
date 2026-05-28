---
name: review-pr
description: Audita el delta de una iteración contra specs/areas/, criterios G/W/T + RFC 2119 y reports/iter-N/ con ojos frescos. Tabla criterio | evidencia | estado. Veredicto APROBAR / CAMBIOS REQUERIDOS / RECHAZAR. Su output lo consume /ship para abrir el PR sin re-auditar.
when_to_use: Fase 10 de toda iteración. También como preparación de un PR concreto contra main.
allowed-tools: Read Write Edit Bash Grep Glob
---

# Skill: Review PR

Auditoría final independiente. Tu valor es traer ojos frescos. **No participas** en la implementación de la iter.

## Inputs

- `specs/areas/<area>/spec.md` de las áreas tocadas.
- `openspec/changes/<slug>/` si la iter va por modelo de change.
- `reports/iter-<N>/` de todos los demás agentes.
- Diff: `git diff main...HEAD`.
- `CLAUDE.md` (flujo ADLC).

## Pasos obligatorios

### 1. Auditoría criterio por criterio (G/W/T)

Para cada criterio en el área-spec:

```
- [ ] Given X, when Y, then Z. Validación: <archivo:línea>.
```

Verifica:
- Que `<archivo:línea>` existe y prueba la condición `then`.
- Que el test forma parte de la suite ejecutada por `qa-engineer`.
- Que el output del test está pegado en `reports/iter-<N>/qa-engineer.md`.

Tabla obligatoria en tu reporte:

```markdown
| Criterio (G/W/T) | RFC 2119 | Evidencia | Estado |
|---|---|---|---|
| Given /consoles, when GET, then 200 + 10 items | MUST | apps/api/tests/consoles.test.ts:37 + output 127/127 verde | OK |
| Given filtro Gen 5, when click chip, then 2 cards visibles | MUST | apps/web/e2e/consoles.spec.ts:138 + output Playwright 54/54 | OK |
| Given ficha en Docker, when SSR, then 200 + render OK | MUST | smoke MCP en reports/iter-N/orchestrator.md | OK |
| ... | SHOULD | (sin test, gap documentado) | PENDIENTE |
```

**MUST fallando = bloqueante.** SHOULD fallando = deuda documentada con tarea. MAY fallando = nice-to-have.

### 2. Gate Fase 7 (security)

Lee `reports/iter-<N>/security-engineer.md`:

- Veredicto: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO.
- Findings CRITICAL/HIGH abiertos: si hay alguno → tu veredicto es RECHAZAR.
- Findings heredados del iter anterior: confirma que están registrados como deuda activa.

### 3. Auditoría de delta

```powershell
git diff --name-only main...HEAD
```

Para cada archivo modificado:

#### Si modifica `apps/api/src/data/<area>.ts` o `apps/api/src/routes/<area>.ts`:
- ¿Existe `apps/api/tests/<area>.test.ts` actualizado?
- ¿Está registrado en `apps/api/src/app.ts`?
- ¿`npm test` pasa en el reporte de backend-engineer?

#### Si modifica `apps/web/components/<area>-*.tsx` o `apps/web/app/<area>/**`:
- ¿Existe `apps/web/e2e/<area>.spec.ts` actualizado?
- ¿`iron-deck-header.tsx` tiene link al área?
- ¿`lib/<area>-api.ts` usa `resolveApiBase()`?
- ¿Hay 0 errores de consola en el smoke MCP del listado y de 2 fichas?

#### Si modifica `infra/landing-zone/**`:
- ¿`terraform fmt -check -recursive` y `terraform validate` pasan?
- ¿Hay output del `terraform plan` en el reporte del terraform-engineer?
- ¿Security ha revisado con checkov/tfsec?

#### Si modifica `Dockerfile`, `docker-compose.yml`, `.github/workflows/**`:
- ¿qa-engineer ejecutó Playwright **contra Docker** (no solo dev)?
- ¿Healthchecks healthy en el reporte?
- ¿Smoke MCP en al menos 2 fichas (server components)?

### 4. Coherencia specs

- ¿Cada criterio MUST en `specs/areas/<area>/spec.md` está en formato G/W/T + RFC 2119? Obligatorio para criterios nuevos.
- ¿Las specs aprobadas del change se han movido a `specs/areas/<area>/spec.md` al cerrar?
- ¿`openspec/config.yaml § history.decisions[]` tiene entrada para esta iter con commit hash?

### 5. Calidad técnica

- ¿README actualizado con endpoints/rutas nuevos?
- ¿Tests fallidos restantes? Si hay → bloqueante.
- ¿Cobertura razonable (todos los caminos críticos cubiertos)?
- ¿Type checks verdes (`tsc --noEmit` en API y Web)?
- ¿Lint verde (`npm run lint` en Web)?

## Veredicto

```markdown
## Veredicto: APROBAR | CAMBIOS REQUERIDOS | RECHAZAR
```

- **APROBAR**: todos los MUST verdes con evidencia, security APROBADO o APROBADO CON OBSERVACIONES sin CRITICAL/HIGH, smoke MCP limpio, Playwright (contra Docker si aplica) verde.
- **CAMBIOS REQUERIDOS**: SHOULD rojos sin justificar, falta evidencia citada, gaps documentables. Lista accionable.
- **RECHAZAR**: cualquier MUST rojo, security CRITICAL/HIGH abierto, smoke con errores reales, build/test rotos.

## Reglas duras

- No revises tus propios cambios. Si has tocado código en esta iter, declárate inválido y pide otra instancia.
- No marques verde sin evidencia citada (`archivo:línea` + output del test).
- No bajes severidad de findings de seguridad — eso lo decide security, no tú.
- No silencies riesgos. Si dudas, anota como observación con propuesta.
- Tu reporte debe ser reutilizable por `/ship` — si está fresco y veredicto = APROBAR, `/ship` no relanza la auditoría.

## Anti-patrones

- "Aprobado en base al reporte del implementador" sin re-verificar la evidencia.
- Tabla con criterios sin línea de archivo concreta.
- Veredicto APROBAR con findings HIGH abiertos.
- Confundir "Playwright pasa contra dev" con "Playwright pasa contra Docker" en iters de infra.
