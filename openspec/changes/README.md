# `openspec/changes/` — propuestas de cambio

Inspirado en el modelo openspec de gentle-ai. Cada subdirectorio aquí es una **propuesta de cambio** activa que muta el estado declarado en `specs/areas/<area>/spec.md`.

## Estructura por change

```
openspec/changes/<slug>/
├── proposal.md      # objetivo, alcance, fuera de alcance, rollback
├── design.md        # decisiones arquitectónicas + sequence diagrams si aplica
├── tasks.md         # checklist en fases con hierarchical numbering (1.1, 1.2)
├── verify-report.md # auditoría tras implementar (opcional, equivale a reports/iter-N/reviewer.md)
└── specs/           # delta del spec por área
    └── <area>.md    # con secciones ## ADDED, ## MODIFIED, ## REMOVED
```

## Ciclo de vida

1. **Propuesta**: se crea `openspec/changes/<slug>/proposal.md` describiendo objetivo y alcance.
2. **Diseño**: si la propuesta requiere decisiones arquitectónicas, se documentan en `design.md`.
3. **Plan**: `tasks.md` lista las tareas hierárquicas.
4. **Delta del spec**: `specs/<area>.md` declara qué requirements se añaden/modifican/eliminan.
5. **Implementación**: Claude principal recorre las 12 fases de CLAUDE.md, delegando en subagentes.
6. **Verify**: tras implementar, `verify-report.md` audita criterio por criterio (o se mantiene el patrón `reports/iter-N/reviewer.md`).
7. **Archive**: tras `/ship` y merge, el delta se merge al spec vivo en `specs/areas/<area>/spec.md` y el directorio se mueve a `openspec/changes/archive/<slug>/`.

## Formato de los deltas de spec

```markdown
# Delta — <area>

## ADDED Requirements

### REQ-<AREA>-<N>: Título corto

Given …,
when …,
then … MUST/SHALL/SHOULD/MAY ….

**Validación:** <comando/test/inspección>.

## MODIFIED Requirements

### REQ-<AREA>-<M> (modified): Título corto

**Antes:** Given … then SHOULD …
**Después:** Given … then MUST … (refuerza la severidad).

## REMOVED Requirements

### REQ-<AREA>-<K> (removed)

Razón: ya no aplica porque <justificación>.
```

## Relación con `reports/iter-N/`

`openspec/changes/<slug>/` y `reports/iter-N/` se complementan:

- `openspec/changes/<slug>/` mantiene el **contrato de la propuesta** (proposal, design, tasks, delta de specs, verify-report).
- `reports/iter-N/<agente>.md` mantiene los **reportes granulares por subagente** (backend-engineer.md, qa-engineer.md, security-engineer.md, reviewer.md, smoke captures). Esto es propio del flujo agéntico y no se sustituye.

Si una iteración corresponde 1:1 con un change, se enlazan mutuamente en sus respectivos archivos.
