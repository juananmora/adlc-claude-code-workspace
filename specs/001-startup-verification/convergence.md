# Convergencia — API local startup verification

**Resultado: gaps.** La especificación, el README del API, el código existente y los eventos controlados proporcionan cobertura para FR-001–FR-007 y US1–US3. T001–T007 cuentan con eventos `completed`, pero T008 permanece fallida y sin evento de finalización. Los artefactos que T008 debía reconciliar todavía contradicen la aclaración aprobada de `PORT=""` y la evidencia registrada. No afirmo entrega aprobada.

## Método y límites

Comparé `.specify/memory/constitution.md`, `CLAUDE.md`, `spec.md`, `plan.md`, `tasks.md`, ambos checklists, los documentos de diseño, `task-trace.jsonl`, `issues.json`, `apps/api/README.md`, el manifest y archivos fuente de configuración, servidor y handler. Para ejecución usé únicamente los eventos controlados existentes; no volví a ejecutar build, tests ni los procesos HTTP en esta fase de convergencia de solo lectura.

Intenté leer `apps/api/dist/server.js` y `apps/api/dist/app.js`, pero el lector rechazó ambas rutas. El inventario visible tampoco incluye `dist`. Por tanto, no inspeccioné directamente los artefactos compilados. El trace de T004 registra que `npm run build --prefix apps/api` emitió `apps/api/dist/server.js` y que `npm start --prefix apps/api` respondió HTTP 200 con `{"status":"ok"}`; esto se atribuye al evento controlado, no a una ejecución independiente de esta convergencia.

La constitución local aún dice “propuesta” y “pendiente de aprobación”, mientras la decisión humana transmitida para esta ejecución registra aprobación. No alteré su estado ni interpreté la decisión como autorización para publicación externa. Las casillas de revisión humana de los checklists permanecen sin marcar. No se afirma que se hayan ejecutado security review o reviewer independiente ni se emite aprobación de release.

## Principios constitucionales

| Principio | Contraste con la feature | Estado |
|---|---|---|
| 1 — especificación verificable antes de implementar | `spec.md` define alcance, FR, SC y escenarios observables; T001 registra la aclaración humana aprobada sobre `PORT=""`. | Cubierto por artefactos y evidencia registrada; sincronización de diseño aún abierta en T008. |
| 2 — alcance mínimo y comportamiento preservado | La feature pide documentación/arranque local y excluye cambios funcionales. El evento T007 registra que no se modificaron fuente, tests, manifiestos, configuración runtime ni infraestructura. | Cubierto por evento controlado T007. |
| 3 — evidencia acotada y reproducible | El README diferencia build/tests de la petición HTTP independiente y limita las afirmaciones a `apps/api`. T003/T004/T006 registran resultados separados. | Cubierto por evidencia controlada; los comandos no se repitieron aquí. |
| 4 — secretos y datos | El alcance no necesita credenciales y los ejemplos consultados no incluyen secretos. | Sin desviación observada en los artefactos revisados. |
| 5 — aprobación humana de alto impacto | No se realizó publicación, PR, issue, merge, despliegue ni cambio de infraestructura. Se conservaron los checklists humanos sin marcar. | Preservado; no implica aprobación de release. |
| 6 — documentación operativa fiel | El README coincide con los scripts y defaults observados y no requiere `.env.example`, que está ausente. | Cubierto en el README; los documentos enumerados por T008 siguen desactualizados. |

## Cobertura requisito → código, documentación y evidencia

| Requisito | Código/documentación contrastados | Evidencia controlada | Estado |
|---|---|---|---|
| FR-001; SC-002 — comandos reales, install exacto y ámbito API | `apps/api/package.json` declara `dev`, `build`, `start` y `test`; README usa `--prefix apps/api` y el comando exacto de instalación. | T002 completada cotejó instrucciones con manifest/configuración. T004 registra build y emisión de `apps/api/dist/server.js`. | cubierto |
| FR-002; US1/US2; SC-001 — readiness HTTP | `src/app.ts` implementa `/health` con `{ status: "ok" }`; README exige HTTP 200 y ese cuerpo tanto para dev como para compilado. | T003 registra HTTP 200 + JSON esperado en dev y SIGINT/shutdown. T004 registra el mismo resultado con `npm start` y shutdown. Ambos eventos indican que se usó Node `fetch` porque `curl` no estaba disponible en ese entorno. | cubierto por trace; curl no fue ejecutado según el trace |
| FR-003; SC-003 — build/tests no demuestran listener | `apps/api/tests/products.test.ts` usa `app.inject()`; README separa build, tests in-process y request al proceso standalone. | T005 confirma la delimitación documental. T006 registra `npm test --prefix apps/api`: 6 archivos, 511 tests, diferenciados de T003/T004. | cubierto |
| FR-004 — configuración y archivo de entorno | `src/config.ts` da `HOST=0.0.0.0`, `PORT=4000`, y trata `PORT=""` como default. README explica defaults, overrides, dirección alcanzable y ausencia de `.env.example`. `spec.md` incorpora la resolución aprobada para el puerto vacío. | T001 registra decisión humana y aclaración de spec; T002 registra README cotejado. | Requisito de producto cubierto; incoherencia en artefactos de diseño sigue abierta bajo T008. |
| FR-005; US2 — fallos de bind/config y parada | `src/config.ts` valida el puerto; `src/server.ts` registra fallos de `listen` y maneja SIGINT/SIGTERM. README trata puerto inválido/ocupado y bind como fallo, y describe Ctrl+C. | T003/T004 registran arranque y apagado normales. El trace no registra pruebas adversariales de puerto ocupado/inválido; la aceptación de esos casos es documental e inspeccionada estáticamente. | cubierto para el alcance declarado; sin prueba adversarial reportada |
| FR-006; SC-004 — límites de cobertura | README dice expresamente que la evidencia API no valida web, Docker Compose, Terraform ni harnesses Python. | T005/T006 son evidencia documental y de tests exclusivamente API. | cubierto; no se atribuye validación a esas otras capas |
| FR-007; SC-005 — sin cambios funcionales | Las superficies fuente relevantes fueron inspeccionadas; el delta autorizado de feature es documental. | T007 registra `git diff --check` satisfactorio y ausencia de cambios en código, tests, dependencias, configuración runtime e infraestructura. | cubierto por evidencia controlada; no se repitió el diff |

## Escenarios y criterios de éxito

| Escenario / criterio | Evidencia | Estado |
|---|---|---|
| US1 — modo desarrollo, health y cierre | T003: HTTP 200 y cuerpo esperado en `127.0.0.1:4000/health`; SIGINT y `shutting down`. | cubierto por trace |
| US2 — build, inicio compilado, health y fallos documentados | T004: build y artefacto informados separadamente del HTTP 200 en `npm start`; README documenta fallos. Puerto ocupado/inválido no fue provocado en ejecución. | cubierto según aceptación documental; escenarios adversariales no ejecutados |
| US3 — interpretar validación por separado | README distingue listener, build y tests; T006 informa 6 archivos / 511 tests. | cubierto |
| SC-001 — HTTP de éxito para ambos modos | T003 y T004 registran status/body esperados. | cubierto por trace |
| SC-002 — comandos presentes y API-scoped | Manifest, README y T002/T005/T007. | cubierto |
| SC-003 — no confundir build/tests con listener | README, test `app.inject()` y evidencias separadas T003/T004/T006. | cubierto |
| SC-004 — exclusiones de otras capas | Límite explícito del README; no se atribuye validación externa. | cubierto |
| SC-005 — preservar funcionalidad | T007 registra inspección final de rutas cambiadas. | cubierto por trace |

## Estado de tareas canónicas

| ID | Evidencia de `task-trace.jsonl` | Estado de convergencia |
|---|---|---|
| T001 | Evento controlado `completed`; incluye un intento anterior fallido y luego registra la aclaración aprobada de spec. | completo según evento terminal completado |
| T002 | Evento `completed`; README y configuración cotejados. | completo |
| T003 | Evento `completed`; smoke de desarrollo y apagado registrados. | completo |
| T004 | Evento `completed`; build, salida y smoke compilado registrados. | completo |
| T005 | Evento `completed`; límites y distinción documental confirmados. | completo |
| T006 | Evento `completed`; 511 tests API registrados. | completo |
| T007 | Evento `completed`; revisión de diff y alcance registrados. | completo |
| T008 | Eventos `pending`, `running` y luego `failed`; no hay evento posterior `completed`. La escritura de los cinco artefactos de diseño fue rechazada por protección de artefactos. | **abierto; bloquea pass** |

`issues.json` todavía muestra T001–T007 como `pending`, discrepando de los eventos controlados `completed` y del estado canónico indicado por el controller. No edité el mapa de issues: la reconciliación operativa corresponde al controller, no a esta convergencia.

## Hallazgo y tarea existente

**FR-004 / coherencia de los artefactos SDD — MEDIUM, bloquea convergencia.** `plan.md`, `research.md`, `analysis.md`, `quickstart.md` y `contracts/README.md` aún describen el requisito de `PORT=""` como conflicto sin resolver y/o dicen que las validaciones están pendientes/no ejecutadas. Esas afirmaciones contradicen la spec aclarada, el README y los eventos controlados T001–T007. La tarea canónica incompleta T008 ya solicita reconciliar exactamente esos archivos con la spec, README y trace, y preservar los checklists. T008 falló por protección de escritura; no añadí una tarea duplicada ni intenté eludir esa protección. El controller/humano debe reabrir el artefacto antes de poder completar la tarea.

## Conclusión

Los requisitos funcionales y escenarios tienen evidencia de código/documentación y eventos controlados dentro del alcance API. La convergencia global es **gaps** porque una tarea canónica está incompleta y quedan contradicciones en los documentos de diseño. `apps/web`, Docker Compose, Terraform y harnesses Python no fueron validados y no se reclaman como tales. Esta conclusión no aprueba los checklists humanos, el security gate, el reviewer ni el release.
