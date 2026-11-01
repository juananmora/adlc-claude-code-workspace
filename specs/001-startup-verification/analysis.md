# Analysis: API local startup verification

## Alcance y método

Matriz de consistencia entre la spec aprobada, plan, documentación API y eventos controlados T001–T007 de `task-trace.jsonl`. El análisis reconcilia evidencia ya registrada; no sustituye ni inventa ejecuciones. Los checklists de requisitos/diseño y sus casillas de revisión humana se conservan sin cambios.

## Cobertura de requisitos funcionales

| Requisito | Evidencia controlada/documental | Estado |
|---|---|---|
| FR-001 — comandos existentes y alcance API; instalación exacta | T002 registra prerequisitos y comando `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`; README usa scripts con `--prefix apps/api`. La instalación está documentada, pero no figura como ejecutada en T001–T007. | Documentado; instalación no ejecutada. |
| FR-002 — readiness HTTP real de `/health`, HTTP 200 y JSON exacto | T003 registra modo desarrollo y T004 modo compilado: ambos respondieron HTTP 200 y `{"status":"ok"}`. El entorno usó Node `fetch` porque curl no estaba instalado. | Verificado en ambos modos mediante HTTP. |
| FR-003 — build/tests no sustituyen listener | README diferencia build/tests y `app.inject()` del request al proceso standalone. T003/T004 registran los smokes por separado; T006 registra tests. | Verificado/documentado. |
| FR-004 — defaults, overrides y ausencia de `.env.example` | T001 aprobó y actualizó la spec para `PORT=""` => default 4000; T002 registra README con HOST/PORT y sin dependencia de `.env.example`. | Verificado/documentado; sin cambio de runtime. |
| FR-005 — fallos de bind/configuración y parada normal | README describe puerto ocupado/invalidado, bind y Ctrl+C. T003/T004 registran `shutting down` tras SIGINT en ambos modos. No consta prueba de fallo forzado de puerto ocupado/inválido. | Documentado; manejo de errores no probado dinámicamente. |
| FR-006 — límites API-only | T005 registra exclusión explícita de web, Docker Compose, Terraform y harnesses Python. | Verificado/documentado. |
| FR-007 — no cambiar funcionalidad/dependencias/infra | T007 registra `git diff --check` pasado y que no hubo cambios de código API, tests, manifests/lockfiles, runtime ni infraestructura. | Verificado según el evento controlado. |

## Cobertura de escenarios y criterios de éxito

| Criterio | Evidencia | Estado |
|---|---|---|
| US1 — desarrollo y cierre normal | T003: `npm run dev --prefix apps/api`; HTTP 200 + JSON esperado; SIGINT y `shutting down`. | ok |
| US2 — compilado y fallo de startup | T004: build satisfactorio, luego `npm start --prefix apps/api`; HTTP 200 + JSON esperado; shutdown observado. README clasifica fallos de puerto/bind como fallos. No se simuló puerto ocupado/inválido. | Parcial: startup verificado; fallos documentados pero no inducidos. |
| US3 — interpretar build/tests por separado | T004 y T006 registran resultados separados; README establece diferencia con HTTP live. | ok |
| SC-001 — ambas modalidades responden igual | T003 y T004: status 200 y cuerpo `{"status":"ok"}`. | ok |
| SC-002 — comandos reproducibles y scope API | T002/T005 y README corresponden al manifest/configuración. T004 confirma build y artefacto; instalación solo documentada. | ok para comandos documentados; instalación no ejecutada. |
| SC-003 — build/tests no se confunden con startup | README y resultados separados T003/T004/T006. | ok |
| SC-004 — capas excluidas explícitamente | T005 y README nombran web, Docker Compose, Terraform y Python. | ok; dichas capas no se validaron. |
| SC-005 — no cambiar funcionalidad | T007 confirma no cambios en código, tests, dependencias, runtime o infraestructura. | ok |

## Estado del backlog y hallazgos

T001–T007 tienen eventos controlados completados y evidencia registrada. T008 es la tarea de reconciliación documental actual; no se modifican sus casillas ni `task-trace.jsonl` manualmente.

- **A-001 — `PORT=""`: resuelto.** T001 registra aprobación humana y actualización de la spec a comportamiento existente (fallback 4000). El código no se modificó.
- **A-002 — estado de constitución: divergencia editorial pendiente.** El contexto registra aprobación humana, pero el encabezado local mantiene «propuesta»/pendiente de ratificación. Esta tarea no edita la constitución ni asume autorización de publicación.
- **A-003 — afirmación anterior de artefactos ausentes: obsoleta.** `tasks.md` y `analysis.md` existen en el checkout; esa afirmación de una etapa anterior no describe el estado actual.
- **A-004 — herramienta curl no instalada.** La imagen no contenía curl; T003/T004 registran requests reales mediante Node `fetch`. La guía conserva el comando curl solicitado; no se afirma que dicho binario se ejecutara.
- **A-005 — instalación no ejecutada.** T002 documenta el comando, pero T001–T007 no registran una ejecución de `npm ci`. No presentarla como resultado de validación.
- **A-006 — fallos de puerto no inducidos.** La guía documenta los fallos configurados, pero la evidencia registrada verifica únicamente arranques exitosos y apagado normal.

## Límites

La evidencia disponible acredita build, tests y los dos smokes HTTP del API, con las limitaciones señaladas. No acredita web, Docker Compose, Terraform, harnesses Python, instalación de dependencias ni escenarios de fallo dinámico de puerto. No se aprueban checklists humanos, reviewer, publicación externa, issue reconciliation ni despliegue en este análisis.
