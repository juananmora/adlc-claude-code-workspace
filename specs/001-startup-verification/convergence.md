# Convergencia — API local startup verification

**Resultado: gaps.** La spec aprobada, `apps/api/README.md`, el código existente y los eventos controlados cubren los requisitos FR-001–FR-007 y las historias US1–US3. T001–T007 tienen eventos controlados `completed`. Sin embargo, varios artefactos de diseño aún describen como irresuelta la discrepancia de `PORT=""` y afirman que no se ejecutaron validaciones, en contradicción con la spec actual y el trace. Añadí T008 al final de `tasks.md` para reconciliar esos documentos; al quedar sin evento de finalización, la convergencia no puede pasar.

## Fuentes contrastadas y límites de método

Leí `.specify/memory/constitution.md`, `CLAUDE.md`, la spec, `plan.md`, `research.md`, `analysis.md`, `quickstart.md`, `data-model.md`, `contracts/README.md`, `tasks.md`, `issues.json`, ambos checklists, `task-trace.jsonl`, `openspec/config.yaml`, y la guía, manifest, código de configuración/bootstrap/handler y tests de `apps/api`. Comparé las afirmaciones con las evidencias controladas registradas por tarea.

La lectura del checkout confirma que `.specify/memory/constitution.md` conserva encabezado “propuesta” y “pendiente de aprobación”; el contexto de la ejecución contiene decisión humana aprobada. No actualicé el documento ni interpreté la decisión como autorización para otras escrituras externas. Los checklists mantienen sin marcar sus casillas de revisión humana; no se modificaron.

No ejecuté comandos en esta fase. El `task-trace.jsonl` registra build, tests y los dos smokes; T003 anota que el entorno no tenía `curl` y que la petición HTTP se verificó con `fetch` de Node, mientras el README conserva el comando `curl` pedido. La herramienta de lectura rechazó las rutas `apps/api/dist/*.js`, por lo que no inspeccioné directamente los archivos compilados; T004 registra que el build pasó y emitió `apps/api/dist/server.js`. No atribuyo ejecución independiente ni inspección de bytecode a esta convergencia.

## Cobertura requisito → código, documentación y evidencia

| Requisito / criterio | Código y documentación observados | Evidencia controlada | Estado |
|---|---|---|---|
| Principios de constitución 1 y 6; FR-001; SC-002 — comandos reales, scope y prerequisitos | `apps/api/package.json` declara `dev`, `build`, `start` y `test`; `src/config.ts` da los defaults. `apps/api/README.md` contiene el `npm ci` configurado, scripts con `--prefix apps/api`, y deja abierta compatibilidad de Node/npm sin inferirla del Dockerfile. | T002 completed confirma los cambios contra manifest/configuración. T004 registra build y artefacto `apps/api/dist/server.js`. | cubierto |
| Principio 2; FR-007; SC-005 — no cambiar funcionalidad | Los cambios operativos reflejados en la documentación no requieren cambios de aplicación. El handler está en `src/app.ts`, config en `src/config.ts`, bootstrap y cierre en `src/server.ts`; las pruebas existentes incluyen `app.inject()`. | T007 completed registra `git diff --check` satisfactorio e inspección del delta, sin cambios de código, tests, manifests, configuración runtime o infraestructura. El evento menciona README, enmienda humana de spec y actualizaciones controladas. | cubierto por evidencia controlada T007; sin repetición independiente del diff en converge |
| FR-002; US1/US2; SC-001 — readiness HTTP real | `src/app.ts` responde `GET /health` con `{ status: "ok" }`. README exige HTTP 200 y ese JSON en dev y compiled, con servidor vivo. | T003 completed: HTTP 200 + `{"status":"ok"}` en dev, petición con Node fetch equivalente al curl documentado; SIGINT y `shutting down`. T004 completed: build separado y HTTP 200 + cuerpo exacto con `npm start`; SIGINT y shutdown. | cubierto por trace; curl no disponible en el entorno de ejecución registrado |
| FR-003; US3; SC-003 — build/test no prueban listener | `tests/products.test.ts` usa `app.inject()`. README distingue build, tests y solicitud contra el server standalone. | T005 completed confirma la delimitación documental. T006 completed registra 6 archivos y 511 tests, separado de smokes T003/T004. | cubierto |
| FR-004 — defaults, overrides y `.env.example` | `src/config.ts` establece `HOST=0.0.0.0`, `PORT=4000`; trata una cadena vacía como no especificada. El README documenta esos defaults, overrides, caveat de loopback y que no existe `.env.example`. `spec.md` refleja el fallback aprobado y validación de valores no vacíos. | T001 completed registra la aprobación humana y actualización de spec sin cambiar código; T002 completed registra la documentación cotejada con config/manifest. | cubierto; los artefactos de diseño obsoletos quedan abiertos en T008 |
| FR-005 — errores de startup, bind y apagado normal | `src/config.ts` valida el puerto parseado; `src/server.ts` captura fallos de listen, sale con error y gestiona SIGINT/SIGTERM. README documenta puerto ocupado/ inválido, errores de bind y Ctrl+C sin prometer cambios funcionales. | T003/T004 completados registran arranques y apagados observados; T002 documenta defaults/configuración. No hay evento que afirme haber provocado deliberadamente un puerto inválido u ocupado. | cubierto según alcance documental; casos de fallo descritos por inspección estática |
| FR-006; SC-004 — límites de validación | README afirma explícitamente que resultados API no validan `apps/web`, Docker Compose, Terraform ni harnesses Python. | T005 completed confirma la guía; T006 es evidencia exclusiva de tests API. | cubierto; las otras capas no se validaron ni se reclaman |

## Escenarios y criterios de éxito

| Escenario | Evidencia | Estado |
|---|---|---|
| US1 — desarrollo + health HTTP + apagado | T003: dev respondió 200 y `{"status":"ok"}`; SIGINT registró `shutting down`. | cubierto |
| US2 — build + server compilado + health HTTP + fallos de arranque descritos | T004: build pasó y emitió `dist/server.js`; luego el proceso `npm start` respondió 200 y JSON esperado; README describe fallo como no readiness. No hay prueba adversarial de puerto ocupado/inválido. | cubierto para aceptación documentada y smoke; pruebas adversariales no reportadas |
| US3 — interpretar resultados sin ampliar alcance | T005 README y T006: 6 archivos / 511 tests; resultados diferenciados de HTTP. | cubierto |
| SC-001 — resultado unívoco en ambos modos | T003 y T004 registran HTTP 200 y cuerpo esperado en cada modalidad. | cubierto |
| SC-002 — comandos existentes y API-only | Manifest + README y confirmación de T002/T005/T007. | cubierto |
| SC-003 — build/tests separados del listener | README, test in-process y evidencias separadas T003/T004/T006. | cubierto |
| SC-004 — no atribuir validación a otras capas | Límite explícito del README; la convergencia no afirma pruebas web, Docker, Terraform o Python. | cubierto |
| SC-005 — preservar funcionalidad | Evidencia controlada del diff en T007; no se ejecutó una comparación nueva desde converge. | cubierto por evidencia controlada |

## Auditoría de tareas controladas

| Tarea | Evento controlado en `task-trace.jsonl` | Resultado |
|---|---|---|
| T001 | `completed`, revisión aprobada de la spec para `PORT=""` fallback a 4000. | completa |
| T002 | `completed`, README cotejado con config/package y prerequisitos. | completa |
| T003 | `completed`, smoke de desarrollo HTTP 200 + JSON y SIGINT. | completa |
| T004 | `completed`, build/artefacto y smoke del server compilado HTTP 200 + JSON. | completa |
| T005 | `completed`, documentación de scope API-only y límites. | completa |
| T006 | `completed`, `npm test --prefix apps/api`: 6 archivos, 511 tests. | completa |
| T007 | `completed`, `git diff --check` y revisión del delta; límites de cambio registrados. | completa |
| T008 | añadida en esta convergencia, sin evento `completed`. | abierta |

El archivo `issues.json` aún muestra T001–T007 como `pending`, pese a los eventos `completed` y al estado completado proporcionado en el contexto de la ejecución. No edité el mapa de issues; la reconciliación operativa corresponde al controller y no es una nueva validación de requisitos.

## Hallazgo y tarea añadida

- **FR-004 / coherencia de los artefactos SDD — MEDIUM:** `plan.md`, `research.md`, `analysis.md`, `quickstart.md` y `contracts/README.md` conservan textos previos a la aclaración aprobada: dicen que `PORT=""` contradice la spec o que T001 sigue pendiente, y/o que build/tests/smokes no se ejecutaron. Eso contradice `spec.md`, `apps/api/README.md` y los eventos controlados actuales T001–T007. No hay tarea incompleta existente que cubra la sincronización de estos artefactos. **Añadí T008**, dependiente de T007, con archivos, acción y evidencia de aceptación concretos. No añadí otra tarea para los requisitos FR-001–FR-007 porque los siete tienen evidencia y tareas completadas.

## Gates y límites

- La aprobación registrada para la constitución no cambia su encabezado local ni autoriza a este agente a publicar, crear issues, abrir PR, fusionar o desplegar. No se realizó ninguna acción externa.
- Los checklists de revisión humana permanecen intactos y sin marcar. Esta convergencia no emite una aprobación de reviewer ni de release.
- Solo hay evidencia de `apps/api`; `apps/web`, Docker Compose, Terraform y harnesses Python permanecen fuera de validación.
- No se ejecutó aquí build, test, smoke, ni `git diff`. Los resultados atribuidos a T001–T007 proceden únicamente de eventos controlados de `task-trace.jsonl`; el código fuente actual fue contrastado estáticamente.
- **Conclusión:** requisitos del feature cubiertos por evidencia disponible, pero la convergencia global es `gaps` porque T008 queda abierta y los documentos SDD citados continúan desactualizados. No se declara entrega aprobada.
