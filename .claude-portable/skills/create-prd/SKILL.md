---
name: create-prd
description: Crea PRD/spec verificable con criterios G/W/T + RFC 2119 (MUST/SHOULD/MAY) y validación por test:línea o comando reproducible. Si el área no existe, crea specs/areas/<area>/spec.md. Si es un change activo, crea openspec/changes/<slug>/.
when_to_use: Antes de planificar ejecución o generar código. Cuando el usuario describe un objetivo de alto nivel y no hay especificación clara.
allowed-tools: Read Write Edit Grep Glob
---

# Skill: Create PRD

Skill prescriptiva para producir spec verificable.

## Modelo del repo

- **Estado vivo por dominio**: `specs/areas/<area>/spec.md` (declarativo, G/W/T + RFC 2119).
- **Propuestas de cambio activas**: `openspec/changes/<slug>/`:
  ```
  openspec/changes/<slug>/
  ├─ proposal.md       # qué se cambia, por qué
  ├─ design.md         # cómo, decisiones
  ├─ tasks.md          # plan ejecutable
  ├─ specs/<area>.md   # delta a aplicar a specs/areas/<area>/spec.md al cerrar
  └─ verify-report.md  # evidencias al cerrar (se rellena durante la iter)
  ```
- **Archivo histórico** (opcional): `specs/acceptance-criteria-archive.md` para criterios legacy que precedan al modelo G/W/T. Inmutable.
- **PRD raíz por iteración** (opcional): `specs/iter-<N>-prd.md` solo para objetivos transversales que no encajen en un único área.

## Estructura del PRD/Spec

### 1. Cabecera

```markdown
# <Nombre del área o change>

> **Tipo**: spec viva del área | propuesta de cambio (change)
> **Iteración**: iter-<N>
> **Fecha**: YYYY-MM-DD
> **Estado**: borrador | en revisión | aprobado | cerrado
```

### 2. Objetivo (1-2 frases)

Qué se construye y para quién. Sin verbos vagos ("mejorar", "optimizar").

### 3. Alcance / Fuera de alcance

Bullets concretos. Lo "fuera de alcance" tiene que estar enunciado explícitamente para evitar scope creep.

### 4. Usuarios o actores

Quién consume esto. (Para el catálogo: visitante anónimo del portal IRON DECK; futuro: humano admin si llega `POST /<area>`.)

### 5. Requisitos funcionales (lista breve, sin G/W/T todavía)

```
- RF-01: La API SHALL exponer GET /consoles devolviendo 10 entradas.
- RF-02: El portal SHALL renderizar la ficha de consola con metadata SEO completa.
- ...
```

### 6. Requisitos no funcionales

```
- RNF-01: Latencia p95 GET /<area> < 500ms en prod.
- RNF-02: 0 errores de consola del navegador en cualquier ruta del portal.
- RNF-03: Cobertura unit + integración API >= criterio del qa-engineer.
- RNF-04: npm audit --audit-level=high → 0 vulns.
```

### 7. Arquitectura esperada

Diagrama Mermaid o ASCII + referencias a `specs/areas/` y `infra/landing-zone/` que cambian.

### 8. Criterios de aceptación G/W/T + RFC 2119 (CORE)

Sección obligatoria. Por cada criterio:

```markdown
- [ ] Given <contexto inicial>, when <acción/evento>, then <resultado verificable>.
  - **MUST** | **SHALL** → obligatorio. Su fallo bloquea cierre.
  - **SHOULD** → recomendado. Fallo = deuda documentada.
  - **MAY** → opcional.
  - Validación: <archivo:línea | comando | inspección>.
```

Ejemplos canónicos del repo:

```markdown
- [ ] Given el catálogo /consoles con 10 entradas, when el usuario hace
      click en el chip "Gen 5", then el listado MUST mostrar exactamente
      las cards con data-generation="5".
      Validación: apps/web/e2e/consoles.spec.ts:138.

- [ ] Given una request GET /consoles/<id>, when el id no existe,
      then la API SHALL responder 404 con shape {statusCode, error, message}.
      Validación: apps/api/tests/consoles.test.ts (caso 404).

- [ ] Given un enlace externo en /about, when se renderiza,
      then el <a> MUST tener target="_blank" y rel="noopener noreferrer".
      Validación: apps/web/e2e/about.spec.ts.
```

### 9. Riesgos y supuestos

Tabla `riesgo | impacto | mitigación`.

### 10. Puntos de aprobación humana

- Deploy a prod (Fase 11).
- Cambios de marca / línea gráfica fuera de IRON DECK.
- Inclusión de datos sensibles o nombres reales no notorios.
- Findings de seguridad CRITICAL/HIGH abiertos al cierre.

### 11. Trazabilidad

- Spec previa que esta extiende (link).
- Decisión arquitectónica de `openspec/config.yaml § history.decisions[]` si aplica.

## Reglas duras

- Cada criterio debe llevar `MUST/SHALL/SHOULD/MAY` y validación citada.
- Sin verbos vagos ("funcionan", "queda bien", "es robusto").
- Si la validación no existe todavía, marca el criterio `[ ]` y crea tarea de QA para generarla.
- Convención **no retroactiva**: los criterios escritos antes de adoptar G/W/T pueden quedarse en `specs/acceptance-criteria-archive.md` con su formato anterior. Solo aplica G/W/T a criterios nuevos.
- Si la propuesta es un change explícito, **crea el directorio completo** `openspec/changes/<slug>/` con todos los archivos (proposal, design, tasks, specs/, verify-report stub).

## Anti-patrones

- Criterio "Filtros funcionan" → inverificable. Reescribir como G/W/T.
- PRD sin tabla de aprobación humana → permite deploys sin gate.
- Mezclar funcionales con no-funcionales en la misma lista → confunde al QA.
- Reescribir specs históricas para "modernizarlas" → la archive es inmutable.
- PRD sin enlace a `specs/areas/<area>/` → sin trazabilidad.
