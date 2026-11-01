# Convergencia — API local startup verification

**Estado: pass (convergencia de la feature; no aprobación de release).** Revisión de solo lectura realizada el 2026-11-01, mediante la skill registrada `speckit-delivery`, fase `converge`, metodología fijada a `7370e592f3cd9c06e5b698983957e227c75b30e2`. FR-001–FR-007, US1–US3 y SC-001–SC-005 tienen cobertura documental, de código y de evidencia controlada apropiada a sus requisitos. Las ocho tareas canónicas tienen eventos terminales `completed`. El hallazgo anterior de reconciliación documental está resuelto por T008; no se añaden tareas duplicadas ni se modifican las existentes.

## Entradas y método

Se leyeron `.specify/memory/constitution.md`, `CLAUDE.md`, `openspec/config.yaml`, y los artefactos de `specs/001-startup-verification/`: spec, plan, research, analysis, quickstart, data-model, contracts, ambas checklists, tasks, task-trace e issues. Se contrastaron con `apps/api/README.md`, `package.json`, `tsconfig.json`, `src/config.ts`, `src/server.ts`, `src/app.ts` y el test de health en `tests/products.test.ts`.

También se inspeccionó el inventario del build recibido, montado en solo lectura, y `apps/api/dist/config.js`, `server.js` y `app.js`. El contexto identifica ese input como revisión `a164165c8b758ed338324068f780fc325714ec22`, SHA-256 `dd534a08c2536ef49f9e2371ab093de33964fa98dda0593f091998e9548519a7`. Estos identificadores proceden del controller; no se recalculó el hash. Los archivos compilados consultados reflejan la configuración, health, listener y cierre del TypeScript correspondiente; la presencia de dist no se confunde con disponibilidad HTTP.

Esta sesión no ejecutó instalación, build, tests, servidor, curl ni comandos git: las herramientas disponibles permiten inspección y persistencia de reportes, no ejecución de comandos. Los resultados de ejecución que siguen se atribuyen exclusivamente a eventos controlados del trace, con tarea, sesión, fecha y revisión. No se presenta esta inspección como una nueva certificación ejecutable de la revisión final. La validación independiente posterior pertenece al controller.

## Auditoría de requisitos

| Criterio | Código/documentación y evidencia | Estado |
|---|---|---|
| FR-001 — comandos existentes y scope API | `package.json` define dev=`tsx watch src/server.ts`, build=`tsc -p tsconfig.json`, start=`node dist/server.js`, test=`vitest run`. README usa `--prefix apps/api` y el comando de instalación coincide con `sdd.validationCommands.install`. T002 registra el cotejo. | cubierto |
| FR-002 — HTTP 200 y JSON exacto en `/health` | `src/app.ts` y `dist/app.js` implementan `GET /health` con `{ status: "ok" }`. README exige estado 200 y cuerpo exacto en ambos modos. T003/T004 registran requests reales con 200 y `{"status":"ok"}`. | cubierto |
| FR-003 — build/tests no prueban listener | README, quickstart y contracts separan build, tests y request a servidor independiente. `tests/products.test.ts`, test `health / returns 200 with status ok`, usa `app.inject()` sin listen. T005/T006 registran resultados separados. | cubierto |
| FR-004 — defaults, overrides y archivo ausente | `src/config.ts` y `dist/config.js`: HOST `0.0.0.0`, PORT 4000; vacío cae al fallback, no vacío se analiza con `Number.parseInt` y se valida 1–65535. Spec/README explican HOST alcanzable y no exigen copiar `.env.example`, ausente del inventario. T001/T002 y reconciliación T008. | cubierto |
| FR-005 — fallos de bind/configuración y cierre normal | `src/server.ts`/`dist/server.js` capturan error de listen, lo registran y salen con 1; configuración rechaza valores no vacíos inválidos. README clasifica puerto ocupado/inválido y bind como fallo, no readiness. Documenta Ctrl+C y significado de `shutting down`; T003/T004 registran SIGINT y cierre normal. El requisito exige instrucciones de fallo; no se atribuye prueba dinámica de esos fallos. | cubierto documental/estáticamente; cierre registrado |
| FR-006 — resultados limitados a lo comprobado | README y documentos reconciliados excluyen explícitamente web, Docker Compose, Terraform y Python. T005/T006 separan checks API de HTTP. T008 mantiene instalación no ejecutada, curl ausente y fallos no inducidos como límites reales. | cubierto |
| FR-007 — preservar funcionalidad | La feature no añade endpoint, dependencia, runtime ni infraestructura. T007 registra revisión del delta sin cambios API source/tests/manifests/lockfiles/runtime/infra; T008 registra solo reconciliación documental sin source/spec/checklists. La inspección de entradas compiladas es consistente con las superficies de source leídas, no sustituye una comparación git completa. | cubierto por evidencia controlada |
| SC-001 — ambas modalidades con éxito inequívoco | README/quickstart especifican 200 + JSON exacto. T003 (dev) y T004 (start compilado) registran ambos resultados. | cubierto |
| SC-002 — comandos reproducibles y API-only | README y quickstart coinciden con manifest y contrato SDD. La instalación se documenta, no se afirma ejecutada. | cubierto |
| SC-003 — no confundir build/inject con listener | Distinción explícita en README y documentos, más resultados separados T003/T004/T006. | cubierto |
| SC-004 — frontera explícita de capas | README, plan, research, quickstart, analysis y contracts mantienen API-only y las exclusiones. | cubierto |
| SC-005 — sin cambios funcionales | Evidencia controlada T007 y T008; no se pide ni realiza cambio funcional en esta revisión. | cubierto |

Conteo: 7/7 requisitos funcionales y 5/5 criterios de éxito cubiertos; 0 gaps de convergencia abiertos. Cobertura no equivale a ejecución dinámica de todos los casos límite.

## Escenarios de aceptación y casos límite

| Escenario | Evidencia | Estado |
|---|---|---|
| US1 — desarrollo responde a health | T003: `npm run dev --prefix apps/api`, HTTP 200 + `{"status":"ok"}` en `127.0.0.1:4000/health`. | cubierto según evento controlado |
| US1 — procedimiento de parada | README describe Ctrl+C y mensaje; T003 registra SIGINT, proceso detenido y `shutting down`. | cubierto |
| US2 — compilado responde a health | T004: build satisfactorio y `dist/server.js`; por separado `npm start --prefix apps/api` y HTTP 200 + JSON esperado. Dist recibido inspeccionado. | cubierto según evento controlado e inspección |
| US2 — instrucciones ante fallo de startup | README identifica fallo de puerto/bind y no lo transforma en readiness por build/tests. Config/server y compilado respaldan esa descripción. | cubierto por inspección reproducible; fallos no inducidos |
| US3 — reportar comando, scope y resultado por separado | T004/T006 registran build/tests aparte de HTTP; documentos nombran los comandos exactos y límites. | cubierto |
| US3 — no atribuir validación de otras capas | README y documentos excluyen las capas no comprobadas; esta revisión también. | cubierto |
| PORT vacío, no numérico o fuera de rango | Spec, README, `parsePort` source/compilado y T001: vacío usa 4000; validación aplica al entero analizado no vacío. | inspección estática; no prueba dinámica atribuida |
| HOST distinto o puerto ocupado | README exige destino alcanzable y puerto libre/alternativo válido; server registra error de listen. | inspección documental/estática |
| Proceso ausente, error de conexión, non-200 o JSON inesperado | README define explícitamente que estos resultados no verifican el arranque aunque build/tests pasen. | inspección documental |
| Runtime ausente/incompatible; `.env.example` ausente | README declara Node/npm compatibles sin pin local ni inferencia desde Docker; no exige archivo ausente. | inspección documental/manifest/inventario |

## Evidencia de tareas canónicas

Todos los eventos indicados pertenecen a `specs/001-startup-verification/task-trace.jsonl`; se respetó el orden serial de dependencias T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008.

| Tarea | Último evento | Fecha UTC y revisión de evidencia | Resultado registrado |
|---|---|---|---|
| T001 | completed | 19:53:52.239; `0b713c1638e1212d3cbe5022d2472057bf84f5c5` | Aclaración aprobada de PORT vacío en spec, sin cambio runtime. |
| T002 | completed | 19:54:29.416; `35bea4988661ad522cfc08a3f2b388c5f74268da` | Prerequisitos/configuración/comandos en README cotejados. |
| T003 | completed | 19:55:29.408; `7bbe4399bdfb4bf26e1a84f1c46091b71011a97e` | Smoke dev HTTP 200 + JSON exacto, SIGINT/cierre. |
| T004 | completed | 19:55:44.790; `8aec963e18eeeb664e9ae98ba54e670043b7ffb9` | Build/artefacto y smoke compilado HTTP por separado, cierre. |
| T005 | completed | 19:55:49.361; `cec20b72fa1a8e0f8f8fdd95b2c45a7b82db6072` | Distinción listener/build/tests y límites API. |
| T006 | completed | 19:56:00.808; `a95898a3c5f35c26e23eade2f780b9ee8bc3a976` | `npm test --prefix apps/api`: 6 archivos, 511 tests. |
| T007 | completed | 19:57:08.516; `dc9e905c43872cf5fab671129f810560238caf65` | `git diff --check 9f59792..HEAD` pasó; delta README, enmienda spec aprobada y metadatos controlados, no runtime. |
| T008 | completed | 20:25:42.539; `52090676552b562a1774d2e210569edda0ab7a9e` | Cinco documentos reconciliados; checklists/source/spec sin editar; diff check y build pasaron; tests 6 archivos/511 tests. |

Fechas: 2026-11-01. T001–T007: sesión `aad07f69-b128-495a-8fa0-445067e08cd2`; T008: sesión `5bee27eb-d574-411f-8073-d68305d9195a`. Los eventos previos `failed` de T001/T008 no se borran; los `completed` posteriores son el estado terminal actual. El contexto anidado que todavía describe T008 como fallida es anterior a este último evento y no prevalece sobre el trace leído.

## Cierre del hallazgo anterior

El informe anterior decía que T008 carecía de completion y que los documentos mantenían PORT sin resolver/resultados pendientes. Ahora `plan.md`, `research.md`, `analysis.md`, `quickstart.md` y `contracts/README.md` reflejan el fallback aprobado y los resultados exactos T001–T007. T008 completada registra cotejo, preservación de checklists y validación API posterior a la reconciliación. `analysis.md` conserva la referencia temporal a T008 como tarea actual, pero no declara que siga fallida ni contradice el evento posterior. No hay gap pendiente que justifique duplicar T008.

## Límites y gates preservados

- El comando de instalación configurado está documentado; los eventos citados no acreditan su ejecución. Curl no estaba instalado: T003/T004 acreditan HTTP mediante Node `fetch`, no la ejecución literal del comando curl. README admite cliente HTTP equivalente. Los escenarios de fallo requieren instrucciones, satisfechas por inspección; puertos inválidos/ocupados no se reportan como inducidos.
- El build/tests posterior de T008 está registrado como resultado resumido controlado, no como stdout completo disponible aquí. No se reejecutó ni se comprobó un listener actual en esta sesión; los smokes son históricos, no una afirmación de servidor actualmente vivo.
- `issues.json` conserva `pending` para T001–T007 y no incluye T008. Es un mapa operativo desactualizado, no evidencia de ejecución; prevalece el trace para la convergencia. Su reconciliación corresponde al controller en el gate final autorizado, no a tareas nuevas de implementación ni a una edición del mapa desde este agente.
- La constitución sigue con encabezado de propuesta/ratificación pendiente, aunque el contexto registra aprobación humana de constitución el 2026-11-01. Se conserva y se declara la divergencia editorial, sin inferir autorización externa ni modificarla. Los principios de especificación, comportamiento preservado, evidencia acotada, secretos, autoridad humana y documentación fiel se respetan en el alcance de esta revisión.
- Checklists humanos permanecen intactos; las casillas pendientes son gates, no tareas de implementación que un agente deba marcar. Los textos históricos de evaluación de diseño no se reinterpretan como resultados runtime actuales.
- No hay reporte de seguridad ni veredicto de reviewer independiente específico de esta feature entre las entradas examinadas. No se afirma que esos gates hayan pasado ni que hallazgos de seguridad sean cero. Esta etapa limitada de convergencia documental no sustituye QA, security-engineer ni reviewer del cierre ADLC. No existen herramientas de delegación o ejecución para lanzarlos aquí; el controller conserva esos controles antes de cualquier cierre/publicación.
- No se validaron `apps/web`, Docker Compose, Terraform ni harnesses Python. No se creó PR/issue, no se publicó, fusionó ni desplegó, no se ejecutó CLI nativa specify, y no se alteraron código, spec, plan, constitución, checklists, tareas, trace ni issues en esta revisión. Solo se persistieron estos dos reportes.

## Reproducción y continuación controlada

Desde la raíz, el contrato API para la validación independiente es:

```bash
npm run build --prefix apps/api
npm test --prefix apps/api
```

Artefacto esperado: `apps/api/dist`. Para reproducir cada smoke, ejecutar secuencialmente `npm run dev --prefix apps/api` y, tras build, `npm start --prefix apps/api`; con cada proceso activo, en otra terminal:

```bash
curl --fail --show-error --include http://127.0.0.1:4000/health
```

Exigir HTTP 200 y `{"status":"ok"}`, detener cada proceso con Ctrl+C antes del siguiente. Son instrucciones de reproducción, no nuevos comandos ejecutados aquí. Instalación si corresponde: `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`.

La convergencia no solicita otra corrección ni un bucle de implementación: el gap previo se cerró. El controller puede realizar sus checks independientes y mantener los gates humanos finales para entrega create-only y reconciliación de issues. El resultado `pass` no autoriza publicación ni sustituye aprobación humana de release.
