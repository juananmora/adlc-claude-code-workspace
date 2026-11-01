# Convergencia — API local startup verification

**Resultado: gaps.** La especificación define criterios verificables y el código existente aporta varias piezas del contrato, pero las tareas de implementación/documentación/verificación siguen sin completarse mediante eventos controlados. La guía actual de `apps/api` no incorpora el procedimiento de arranque que exige la feature, y no hay evidencia del smoke HTTP en ninguno de los dos modos.

## Alcance y fuentes comparadas

Inspeccioné `.specify/memory/constitution.md`, `CLAUDE.md`, la especificación, `plan.md`, `research.md`, `analysis.md`, `quickstart.md`, `contracts/README.md`, `data-model.md`, `tasks.md`, ambos checklists, `task-trace.jsonl`, `issues.json`, el README y los scripts/código/tests/configuración TypeScript de `apps/api`, `openspec/config.yaml`, y los artefactos compilados de `apps/api/dist` recibidos en modo solo lectura. El contexto del run registra aprobación humana de constitución, spec, plan y tareas; no infiero de ello aprobación de publicación, cierre o release.

La comparación de fuentes es estática. No ejecuté npm, build, tests, servidor ni petición HTTP: las herramientas disponibles para esta fase solo permiten leer/escribir archivos. No pude ejecutar `git diff --check` ni `git diff --name-only`; por tanto, no certifico el delta total del checkout.

## Cobertura requisito → código y evidencia

| Requisito / criterio | Código y evidencia existente | Resultado de convergencia |
|---|---|---|
| Principio constitucional 1; FR-001; SC-002 — comandos reproducibles y requisitos previos | `apps/api/package.json` declara `dev`, `build`, `start` y `test`; `openspec/config.yaml` identifica la capa API. La instalación configurada figura en la spec y los artefactos SDD. `apps/api/README.md` aún presenta comandos sin `--prefix apps/api`, propone `npm install` y no documenta el contrato solicitado. No se ejecutó instalación ni comandos. | **Gap:** README requiere la actualización de T002. No hay evento controlado de terminación para esa tarea. |
| FR-002; US1/US2; SC-001 — readiness real | `apps/api/src/app.ts` define `GET /health` con `{ status: "ok" }`; `apps/api/tests/products.test.ts` comprueba status/body mediante `app.inject()`. El test no valida un listener independiente. Los archivos compilados `dist/app.js` y `dist/server.js` contienen el handler y el bootstrap equivalentes. No hubo proceso vivo ni respuesta curl. | **Gap:** falta documentar y ejecutar los dos smokes; T003 y T004 los cubren. El build compilado no prueba startup. |
| FR-003; US3; SC-003 — separar build/tests de escucha | `tests/products.test.ts` usa `app.inject()` y `package.json` separa build, test y start. El README aún no aclara que build y test no prueban el socket standalone. El quickstart SDD sí lo explica como diseño, pero no es la guía operativa target ni evidencia de ejecución. | **Gap:** README y evidencia de test/smokes pendientes en T003–T006. |
| FR-004 — defaults, overrides y `.env.example` | `src/config.ts` define `HOST` default `0.0.0.0`, `PORT` default `4000`; el README se refiere a `.env.example`, que no está en el inventario del checkout. No fija `engines` en el manifest. La spec requiere declarar defaults/overrides sin inferir versión desde Docker. | **Gap:** la guía no cumple aún; T002 lo cubre. |
| FR-004 / FR-005 — comportamiento de `PORT=""` | `src/config.ts` implementa `if (!value) return fallback`, por lo que cadena vacía cae en `4000`; `apps/api/dist/config.js` muestra la misma lógica. La spec todavía dice que valor vacío falla. El evento de T001 en `task-trace.jsonl` consta como `running` y después `failed` por rechazo de edición de la spec; el registro de tareas lo mantiene sin completar. | **Gap bloqueante de consistencia:** la discrepancia permanece; T001 la cubre. No cambiaré spec ni código durante converge. |
| FR-005 — errores de bind/configuración y terminación | `src/server.ts` espera `app.listen`, registra error y sale con estado 1 ante fallo; instala manejadores SIGINT/SIGTERM, escribe `shutting down` e intenta cerrar Fastify. `src/config.ts` rechaza valores numéricos fuera de 1–65535 y no numéricos; la cadena vacía es excepción porque usa el default. Los artefactos compilados contienen el mismo flujo. No se observó en ejecución ningún error ni shutdown. | **Gap:** falta documentar límites y ejecutar las verificaciones; T003/T004 cubren startup/shutdown y T001 cubre la discrepancia vacía. |
| FR-006; SC-004 — límite de validación | La spec, plan y quickstart acotan esta feature a `apps/api`; el README actual no declara los límites requeridos sobre `apps/web`, Docker Compose, Terraform y harness Python. No se ejecutaron validaciones de esas capas. | **Gap:** disclaimer operativo y resultado API-scoped pendientes en T005/T006. No afirmo validación de otras capas. |
| FR-007; SC-005 — no cambiar funcionalidad | Los archivos fuente inspeccionados implementan los comportamientos existentes y el build recibido refleja esos puntos relevantes. No tengo comparación de diff del checkout ni evento completo para la revisión final. | **No demostrado para el delta completo:** T007 exige `git diff --check`, `git diff --name-only` e inspección de exclusividad del README. No puedo declarar que el conjunto de cambios del feature sea solo documental sin esa evidencia. |

## Trazabilidad de tareas controladas

| Tarea | Estado y evidencia controlada | Convergencia |
|---|---|---|
| T001 | `task-trace.jsonl`: registrada, luego `running`, después `failed`; causa: edición de spec protegida. No existe evento `completed`. | Abierta; puerta sobre discrepancia `PORT=""`. |
| T002 | Backlog sin marcar; trace solo contiene registro inicial `pending`; sin evento `completed`. | Pendiente: README/prerrequisitos/defaults. |
| T003 | Backlog sin marcar; sin evento `completed`. | Pendiente: arranque dev y smoke HTTP. |
| T004 | Backlog sin marcar; sin evento `completed`. | Pendiente: build y arranque compilado con smoke HTTP. |
| T005 | Backlog sin marcar; sin evento `completed`. | Pendiente: límites API-only en README. |
| T006 | Backlog sin marcar; sin evento `completed`. | Pendiente: ejecución/resultados de test API separados de los smokes. |
| T007 | Backlog sin marcar; sin evento `completed`. | Pendiente: inspección final del diff. |

El reporte del implementador anterior menciona build y 511 tests aprobados en un checkout previo, pero el artefacto suministrado no aporta salida controlada de esos comandos ni eventos `completed` por tarea. Aun aceptando ese reporte como contexto, no demostraría startup HTTP en dev/compilado, actualización del README, ni revisión del diff en la revisión actual. El build recibido contiene `apps/api/dist`; esto confirma presencia de archivos compilados y coherencia estática de los puntos inspeccionados, pero no atribuyo origen/verificación reproducible adicional a dichos archivos.

## Hallazgos y tareas existentes

1. **FR-004/FR-005 — discrepancia de puerto vacío, bloqueante.** La spec espera fallo pero la implementación fuente y compilada aplica el default. **Tarea existente: T001**. La decisión humana previa descrita en el contexto no cambia el hecho de que la edición quedó fallida y la spec de checkout continúa sin aclararse. No dupliqué tarea.
2. **FR-001 a FR-006, US1–US3 y SC-001 a SC-004 — falta la guía terminada y la evidencia de ejecución.** `apps/api/README.md` sigue siendo la guía anterior y no contiene los pasos solicitados; no hay resultados de los smokes de desarrollo/compilado. **Tareas existentes: T002–T006**. No dupliqué tareas.
3. **FR-007 / SC-005 — no hay evidencia del delta final.** No se ejecutó la inspección de diff requerida. **Tarea existente: T007**. No dupliqué tarea.
4. **Gate humano de la constitución.** El contexto del run registra decisión de aprobación, mientras el encabezado del archivo mantiene “propuesta” y “pendiente de aprobación”. No edité el documento ni trato esta convergencia como ratificación/publicación. Esta limitación de estado no sustituye ni elimina el gate humano.

Todos los gaps de requisitos encontrados están cubiertos por tareas canónicas incompletas T001–T007. **No añadí tareas nuevas** para evitar duplicados. No edité código, especificaciones, checklists de reviewer, `tasks.md`, `task-trace.jsonl` ni `issues.json`.

## Límites y decisión

- La evidencia de `apps/api` no verifica `apps/web`, Docker Compose, Terraform ni harnesses Python; quedan expresamente fuera de esta afirmación.
- No se ejecutaron `npm run build --prefix apps/api`, `npm test --prefix apps/api`, `npm run dev --prefix apps/api`, `npm start --prefix apps/api` ni `curl --fail --show-error --include http://127.0.0.1:4000/health` en esta fase.
- No hubo análisis de seguridad ni revisión independiente; esta convergencia no aprueba esos gates, los checklists, ni el release.
- La convergencia queda en **gaps** hasta que se resuelva T001, se obtenga evidencia verificable para T002–T006, se cierre la inspección T007 y cada tarea canónica tenga evento controlado `completed`.
