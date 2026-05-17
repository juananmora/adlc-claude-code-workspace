# `openspec/` — datos operativos y propuestas de cambio

Inspirado en el modelo [openspec de gentle-ai](https://github.com/Gentleman-Programming/gentle-ai/tree/main/openspec), adaptado a las necesidades reales de este repo.

## Qué hay aquí

| Archivo / directorio | Qué contiene | Quién lo lee |
|---|---|---|
| **`config.yaml`** | Tech stack del repo + comandos exactos por capa de testing + log auditable de decisiones arquitectónicas (`history.decisions[]`). | Humanos al hacer onboarding; Claude principal si se lo pides explícitamente. |
| **`changes/<slug>/`** | Propuestas de cambio activas (`proposal.md` + `design.md` + `tasks.md` + delta de spec en `specs/<area>.md` + `verify-report.md` tras cerrar). | Claude principal al planificar e iterar una feature; humanos al revisar. |
| **`changes/archive/<slug>/`** | Propuestas ya cerradas y mergeadas al spec vivo. | Auditoría retrospectiva. |
| **`changes/README.md`** | Ciclo de vida de un change con el formato exacto de los archivos. | Cualquiera que vaya a crear un change nuevo. |

## Qué NO hay aquí (deliberadamente)

- **Reglas por fase del flujo ADLC.** Viven solo en `CLAUDE.md` (DEC-004). Tener una sección `rules.*` duplicaba CLAUDE.md sin que nadie la consumiera automáticamente.
- **Specs vivos del producto.** Esos están en `specs/areas/<area>/spec.md` en la raíz del repo (DEC-002).
- **Reportes de subagentes.** Esos están en `reports/iter-<N>/<agente>.md`.

## Cuándo leer `config.yaml`

Tres casos reales:

1. **Onboarding rápido**: un humano nuevo (o yo en una sesión fresca) lee `context` para entender el tech stack en 20 líneas.
2. **Necesito recordar un comando exacto**: `testing.layers.*.command` tiene los comandos canónicos (`npx playwright test --workers=1`, `npm audit --audit-level=high`, etc.) con su `cwd` correcto.
3. **Auditoría retrospectiva**: `history.decisions[]` registra cada decisión arquitectónica (DEC-001/002/003/004) con rationale y commit hash. Útil cuando alguien pregunta "¿por qué eliminamos el orquestador?".

## Cuándo NO modificarlo

- Para reglas del proceso ADLC → `CLAUDE.md`.
- Para estado vivo del producto → `specs/areas/<area>/spec.md`.
- Para una propuesta de cambio nueva → `openspec/changes/<slug>/`.
- Para reportes de subagente → `reports/iter-<N>/`.

## Sincronización con `CLAUDE.md`

Mínima por diseño. El único punto de contacto es que ambos referencian las 12 fases ADLC, pero solo `CLAUDE.md` las describe en detalle. `config.yaml` deja al lector que vaya a `CLAUDE.md` cuando necesite las reglas.

Si una decisión arquitectónica cambia algo que afecta a ambos archivos, se edita lo necesario y se registra en `config.yaml § history.decisions[]` con commit hash.
