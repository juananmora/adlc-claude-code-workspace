# `openspec/` — contrato estructurado del workspace

Inspirado en el modelo [openspec de gentle-ai](https://github.com/Gentleman-Programming/gentle-ai/tree/main/openspec), adaptado a este repo.

## Qué hay aquí

- **`config.yaml`** — Contrato declarativo y parseable: tech stack, reglas por fase del flujo ADLC, estrategia de testing, decisiones históricas. Convive con `CLAUDE.md` (manual en prosa) sin duplicar contenido.

## Qué NO hay aquí (y por qué)

A diferencia de gentle-ai, no usamos:

- **`openspec/specs/<area>/spec.md`** — Nuestros specs por área viven en `specs/` (raíz del repo): `acceptance-criteria.md` como log vivo, `<slug>-prd.md` por iniciativa. Migrar a la convención por área es un refactor mayor que no se ha hecho.
- **`openspec/changes/<slug>/`** — Lo equivalente nuestro es `specs/<slug>-prd.md` + `reports/iter-<N>/`. La granularidad por iteración (con reportes co-localizados por subagente) es superior para auditoría agéntica; la mantenemos.

## Cuándo leer `config.yaml`

- Al planificar una iteración nueva (Fase 1-5 de CLAUDE.md): para confirmar qué tests, qué linters y qué gates están disponibles.
- Al auditar trabajo de un subagente: para validar que las "reglas duras" de su fase están en el config.
- Cuando una decisión arquitectónica se tome: añadirla a `history.decisions[]` con commit hash.

## Cuándo NO modificarlo

- Para descripciones de proceso narrativas largas → `CLAUDE.md`.
- Para estado de la iteración en curso → `specs/acceptance-criteria.md`.
- Para reportes de subagente → `reports/iter-<N>/`.

## Sincronización con CLAUDE.md

Si una regla cambia, **se edita en ambos sitios** y se anota en `history.decisions[]` con commit hash. La regla de oro:

> `CLAUDE.md` es lo que Claude principal aplica turno a turno (prosa rica con anti-patrones y output esperado). `config.yaml` es lo que una máquina o un humano nuevo puede auditar de un vistazo (estructura mínima).
