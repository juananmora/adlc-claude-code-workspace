# Iteración 5 — Backlog (post-mortem iteración 4)

Cuatro frentes acordados al cerrar iteración 4. Cada uno es su propio ciclo ADLC:
spec → plan → ejecución → validación → cierre.

## 1. Auditoría de permisos de los agentes `.claude/agents/*.md`

**Problema observado**: `adlc-orchestrator`, `reviewer` y `security-engineer` arrancaban con
`permissionMode: plan`, lo que les bloqueaba Bash sin que lo detectaran. Además el orquestador
no tenía `Task` ni `WebFetch` en su lista de tools, así que no podía orquestar de verdad.
Arreglo parcial en commit `9439dec`; falta revisar los 7 agentes restantes.

**Tareas**:
- Revisar `backend-engineer`, `frontend-engineer`, `qa-engineer`, `cicd-engineer`,
  `cloud-architect`, `observability-engineer`, `terraform-engineer`.
- Normalizar `permissionMode` por rol:
  - Orquestadores (`adlc-orchestrator`): `acceptEdits` + `Task` + `WebFetch`.
  - Ejecutores (engineers, qa, security, reviewer): `acceptEdits`, sin `Task` ni `plan`.
- Documentar la convención en `.claude/agents/README.md` (no existe — crear).
- Test de humo: hacer que el orquestador lance backend+frontend+qa en un proyecto trivial
  y verificar que ninguno se bloquea por permisos.

## 2. Deudas técnicas de iteración 4

Origen: `reports/iter-4/reviewer.md`.

**2.1. Diversidad de outlets por álbum**.
19 de 20 álbumes solo tienen AllMusic + Wikipedia. Cumple `>=2 outlets globalmente` pero
es frágil. Añadir un 3er outlet por entrada (Pitchfork, Metal Hammer, Encyclopaedia Metallum,
Kerrang!) y endurecer el test vitest a `>=2 outlets distintos por álbum`.

**2.2. Playwright `--workers=1` documentado**.
La API es single-threaded en dev y se ahoga con workers default. Forzar `workers: 1` en
`playwright.config.ts` con comentario explicativo, o levantar pool de instancias API en
puertos rotatorios para los E2E.

**2.3. Script `scripts/check-review-urls.ts`**.
AllMusic devuelve 403 a WebFetch (Cloudflare bot block). Un futuro job CI de validación
HTTP necesitará User-Agent realista y allowlist por outlet. Implementar script Node que:
- Lee `apps/api/src/data/album-reviews.ts`.
- Hace GET con UA Chrome real a cada URL.
- Reporta tabla OK/FALLO + códigos HTTP.
- Falla CI si hay nuevos 404 (no si hay 403 desde dominios known-bot-blocked).

## 3. Visibilidad de subagentes en background

**Problema observado**: cuando se lanza un subagente con `run_in_background: true`, el
usuario solo ve el reporte final, no qué hace en el medio. Para tareas largas (iteración 4
duró ~10 minutos de wall-clock) es opaco y genera ansiedad legítima.

**Tareas**:
- Slash command `/peek <agentId>` o `/peek` (último agente) que volcase las últimas 30
  líneas del archivo de output del subagente.
- Alternativa: hook `notification` que cada N segundos imprima un breve heartbeat con
  el último mensaje del subagente.
- Decisión sobre cuándo lanzar en foreground vs background: por defecto foreground
  cuando hay un solo subagente activo; background solo si son ≥2 en paralelo.

## 4. Documentar flujo real en `CLAUDE.md`

**Problema observado**: hoy hubo doble planificación. Claude principal planificó, luego
el orquestador volvió a planificar, luego se bloqueó en plan mode, y al final Claude
principal tomó el relevo. Eso es desperdicio.

**Tareas**:
- Añadir sección "## Cuándo invocar `adlc-orchestrator` vs cuándo no" a `CLAUDE.md`.
  Criterio propuesto:
  - **Invocar orquestador**: trabajos >3 subagentes en paralelo, o cuando la spec aún
    no existe y hay que crearla con `create-prd`.
  - **NO invocar orquestador**: cambios <3 archivos, o cuando la spec ya existe y solo
    falta ejecución (Claude principal puede coordinar directamente con `Agent`).
- Aclarar que el orquestador NO debe re-planificar lo que Claude principal ya planificó;
  su trabajo es delegar + auditar, no re-pensar.

---

**Cuándo arrancar**: ninguna de las cuatro es urgente. Iteración 4 está cerrada y la app
funciona. Arrancar cuando el usuario quiera, en el orden que prefiera. Mi recomendación
si solo se aborda una: la #4 (documentar el flujo), porque previene la fricción de hoy
en futuras iteraciones.
