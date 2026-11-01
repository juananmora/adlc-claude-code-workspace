# Convergencia — API local startup verification

**Estado: gaps.** El código y `apps/api/README.md` cubren FR-001–FR-007 y US1–US3 dentro del alcance local del API, con eventos controlados `completed` para T001–T007. T008 no tiene evento `completed`; los documentos de diseño que esa tarea debía reconciliar conservan contradicciones con la aclaración aprobada de `PORT=""` y con la evidencia de ejecución. No se afirma aprobación de release.

## Método y límites

Se contrastaron `.specify/memory/constitution.md`, `CLAUDE.md`, `spec.md`, `plan.md`, `tasks.md`, checklists, `task-trace.jsonl`, documentos de diseño, `apps/api/README.md`, el manifiesto, configuración TypeScript, `src/config.ts`, `src/server.ts`, `src/app.ts` y el test de `/health`. No ejecuté comandos en esta fase: uso los resultados únicamente como están registrados en eventos controlados de `task-trace.jsonl`. El inventario del checkout no contiene `apps/api/dist`; no fue posible inspeccionar directamente la salida compilada. T004 registra que el build produjo `apps/api/dist/server.js` y que el servidor compilado respondió HTTP 200 con el cuerpo esperado.

La constitución del checkout todavía se declara propuesta y pendiente de ratificación. El contexto registra una decisión humana aprobatoria, pero esa decisión no cambia por sí sola el contenido versionado ni autoriza publicación; no modifiqué el documento. Los checklists humanos conservan sus casillas de revisión sin marcar. No hay evidencia en estos artefactos de gate de seguridad o veredicto independiente de reviewer; no los doy por aprobados.

## Cobertura de requisitos y escenarios

| Requisito/escenario | Contraste con código y documentación | Evidencia controlada | Estado |
|---|---|---|---|
| FR-001, SC-002 — comandos existentes y ámbito API | `apps/api/package.json` declara `dev`, `build`, `start` y `test`; README usa `--prefix apps/api` y la instalación configurada. | T002 cotejó README con configuración y manifest; T004 registra build y emisión de `apps/api/dist/server.js`. | cubierto según evidencia registrada |
| FR-002, US1/US2, SC-001 — readiness HTTP | `src/app.ts` devuelve `{ status: "ok" }` en `/health`; README exige HTTP 200 y cuerpo esperado en ambos modos. | T003 y T004 registran HTTP 200 y `{"status":"ok"}` para desarrollo y compilado. El trace indica Node `fetch` porque el entorno no tenía `curl`; el comando documentado con curl no fue ejecutado allí. | cubierto según trace; limitación de herramienta documentada |
| FR-003, SC-003 — build/tests no equivalen a listener | `tests/products.test.ts` usa `app.inject()`; README separa tests/build de una request HTTP a proceso standalone. | T005 verifica la distinción; T006 registra `npm test --prefix apps/api`: 6 archivos, 511 tests, por separado de T003/T004. | cubierto según evidencia registrada |
| FR-004 — defaults, overrides y `.env.example` | `src/config.ts` establece HOST `0.0.0.0`, PORT `4000`, y fallback para PORT vacío. `spec.md` y README reflejan la aclaración; README no depende del archivo ausente. | T001 registra decisión y revisión autorizada de la spec; T002 registra documentación cotejada. | cubierto en spec/README; inconsistencias SDD bajo T008 |
| FR-005, US2 — fallo de bind/configuración y apagado | `src/config.ts` valida el puerto; `src/server.ts` falla al escuchar y registra cierre SIGINT/SIGTERM. README documenta fallos y Ctrl+C. | T003/T004 registran startup y cierre normales. El trace no registra pruebas con puerto ocupado/inválido; esos casos tienen inspección estática/documental, no evidencia adversarial en vivo. | cobertura documental; escenarios adversariales no ejecutados |
| FR-006, SC-004 — frontera de validación | README limita las afirmaciones a `apps/api` y excluye web, Docker Compose, Terraform y harnesses Python. | T005/T006 registran la separación de resultados API. | cubierto; esas otras capas no se validaron |
| FR-007, SC-005 — sin cambios funcionales | La feature limita el cambio al README y la inspección estática confirma las superficies de runtime consultadas. | T007 registra `git diff --check` satisfactorio y ausencia de cambios en código, tests, manifiestos, configuración runtime e infraestructura. | cubierto por el evento controlado; no repetido aquí |
| US1 — arranque desarrollo, health y cierre | `README` describe `npm run dev`, request HTTP y Ctrl+C. | T003 registra HTTP 200 con cuerpo esperado y mensaje `shutting down`. | cubierto según trace |
| US2 — arranque compilado | `README` separa build, `npm start` y request HTTP. | T004 registra build/artefacto y smoke HTTP por separado. | cubierto según trace |
| US3 — interpretar resultados | README distingue listener, build y tests in-process. | T005 y T006. | cubierto según trace |
| SC-005 — preservar funcionalidad | Sin requisito de cambio de código. | T007 registra revisión de rutas cambiadas. | cubierto según trace |

## Tareas canónicas y estado de artefactos

| Tarea | Estado según eventos controlados | Observación |
|---|---|---|
| T001 | completed | Aprobación humana registrada y aclaración de spec reflejada; un evento anterior fallido no invalida el evento terminal `completed`. |
| T002–T007 | completed | Cada tarea tiene evento controlado `completed`, con evidencia de documentación, smoke, pruebas API o revisión de diff según corresponda. |
| T008 | **failed, sin completed posterior** | La edición de `plan.md`, `research.md`, `analysis.md`, `quickstart.md` y `contracts/README.md` fue bloqueada por protección del artefacto. Los archivos aún declaran que `PORT=""` está sin resolver y/o que build/tests/startup están pendientes. |

El hallazgo de coherencia documental ya está cubierto por la tarea incompleta T008, por lo que no se añade una tarea duplicada. Para cerrarla, el controller debe reabrir los cinco documentos permitidos y actualizar solo los pasajes obsoletos, usando la spec aprobada, `apps/api/README.md` y los eventos T001–T007 como fuente. Evidencia de aceptación requerida: el texto de cada documento refleja que el puerto vacío cae a 4000 y solo atribuye resultados concretos sustentados por el trace; `git diff --check` pasa; los checklists humanos permanecen sin cambios. T008 debe obtener un evento controlado `completed` tras esa evidencia.

Además, `issues.json` conserva `pending` para T001–T007, pese a los eventos `completed` del trace y las tareas marcadas `[x]`. Esta discrepancia se señala al controller para reconciliación operativa; no cambié el mapa de issues. No altera la evaluación de eventos controlados, pero debe tenerse presente en la coordinación del flujo.

## Hallazgo de convergencia

**FR-004 / consistencia de artefactos SDD — MEDIUM, bloquea `pass`.** `plan.md`, `research.md`, `analysis.md`, `quickstart.md` y `contracts/README.md` mantienen enunciados incompatibles con la spec ya aclarada para `PORT=""` y/o con los resultados controlados T001–T007. T008 ya identifica esos archivos, las fuentes de conciliación y la evidencia requerida, pero su último evento es `failed`. La tarea debe reabrirse y completarse; no se debe modificar código ni especificación para resolver un gap documental.

## Resultado

La cobertura de requisitos funcionales del API está respaldada por documentación, inspección de código y evidencia controlada, con los límites indicados. La convergencia global queda en `gaps` únicamente porque T008 no está completada y sus documentos siguen desactualizados. No se afirma validación de `apps/web`, Docker Compose, Terraform ni harnesses Python; tampoco aprobación humana de checklist, gate de seguridad, reviewer o release.
