# Analysis: API local startup verification

## Alcance y método

Análisis de consistencia de solo lectura entre `.specify/memory/constitution.md`, la especificación aprobada, `plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `quickstart.md`, los checklists y el backlog `tasks.md`. Se contrastaron además los contratos con `apps/api/package.json`, `apps/api/README.md`, `src/config.ts`, `src/server.ts`, `src/app.ts` y el test existente `tests/products.test.ts`. No se editaron esos insumos en esta fase. No se ejecutaron build, tests, instalación ni servidores; esta matriz define evidencia esperada, no resultados observados.

## Matriz de cobertura de requisitos funcionales

| Requisito | Tareas | Evidencia de aceptación que debe obtenerse al ejecutar las tareas | Cobertura / estado |
|---|---|---|---|
| FR-001 — comandos existentes y alcance API; instalación exacta | T002, T003, T004, T005 | Inspección de `apps/api/package.json` para `dev`, `build`, `start` y `test`; README contiene `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund` y comandos con `--prefix apps/api`. | Cubierto por el backlog; pendiente de ejecución. |
| FR-002 — readiness HTTP real de `/health`, HTTP 200 y JSON exacto | T003, T004 | Para ambos procesos independientes, salida de `curl --fail --show-error --include http://127.0.0.1:4000/health` que muestre HTTP 200 y el cuerpo JSON `{ "status": "ok" }`. | Cubierto por el backlog; pendiente de ejecución. |
| FR-003 — build/tests no sustituyen listener | T003, T004, T005, T006 | README diferencia build, `app.inject()`/tests y request al servidor independiente; resultado de `npm test --prefix apps/api` queda separado de las dos comprobaciones HTTP. | Cubierto por el backlog; pendiente de documentación y ejecución. |
| FR-004 — defaults, overrides y ausencia de `.env.example` | T001, T002 | Inspección de `src/config.ts` y README que indique `HOST=0.0.0.0`, `PORT=4000`, overrides válidos, caveat de interfaz/destino y que no requiera copiar un archivo inexistente. La resolución de `PORT=""` debe coincidir con una spec revisada y aprobada. | Parcial hasta aprobar la revisión de spec en T001; la documentación y la comprobación quedan pendientes. |
| FR-005 — fallos de bind/configuración y parada normal | T001, T003, T004 | README clasifica como fallos el puerto ocupado, el valor de puerto inválido y errores de bind; describe Ctrl+C y el significado de `shutting down` sin prometer comportamiento distinto al código. Inspección contra `src/config.ts` y `src/server.ts`; no basta un build exitoso. | Cubierto condicionado a T001; documentación y verificación de startup pendientes. |
| FR-006 — límites explícitos API-only | T005, T006 | README e informe separan resultados del API y declaran sin validar `apps/web`, Docker Compose, Terraform y harnesses Python. | Cubierto por el backlog; pendiente de ejecución. |
| FR-007 — no cambiar funcionalidad, dependencias o infraestructura | T002–T007 | `git diff --name-only` e inspección del diff confirman que el cambio de esta feature se limita a `apps/api/README.md`; no hay cambios en código, tests, manifests, configuración o infraestructura. | Cubierto por T007; pendiente de inspección final. |

## Matriz de cobertura de escenarios y criterios de éxito

| Escenario / criterio | Tareas | Evidencia reproducible requerida | Estado |
|---|---|---|---|
| US1 — arranque de desarrollo y cierre normal | T002, T003 | Arranque con `npm run dev --prefix apps/api`; request en vivo con curl; HTTP 200, cuerpo exacto; procedimiento Ctrl+C y significado del mensaje `shutting down` documentados. | Pendiente. |
| US2 — arranque compilado y fallo de startup | T004 | Ejecutar `npm run build --prefix apps/api` y conservar su resultado; iniciar `npm start --prefix apps/api`, observar `/health` mientras el proceso vive y conservar status/body; documentar fallos de bind/puerto. | Pendiente. |
| US3 — interpretar build y tests por separado | T005, T006 | README nombra comandos API exactos; salida observada de `npm test --prefix apps/api`; evidencia HTTP separada. | Pendiente. |
| SC-001 — ambas modalidades responden igual | T003, T004 | Evidencia de los dos requests HTTP con status y JSON exactos. | Pendiente de smoke. |
| SC-002 — comandos reproducibles y API-scoped | T002–T006 | Comparación de cada comando documentado con configuración suministrada y scripts del manifest. Artefacto de build esperado: `apps/api/dist/`. | Pendiente de inspección/ejecución. |
| SC-003 — ningún build/test se confunde con startup | T003–T006 | Inspección del texto y evidencia separada de build, test y listener. | Pendiente. |
| SC-004 — límites web/Docker/Terraform/Python inequívocos | T005, T006 | Inspección del disclaimer explícito y ausencia de afirmaciones de validación ajenas al API. | Pendiente. |
| SC-005 — no cambiar funcionalidad | T007 | Inspección reproducible de rutas y contenido del diff; solo README modificado por esta feature. | Pendiente. |

## Consistencia del grafo de tareas

- IDs únicos y canónicos: T001–T007 (tres dígitos); todas las tareas empiezan sin marcar.
- Dependencias: T002 depende de T001; cada tarea posterior depende de la inmediatamente anterior. No hay dependencias inexistentes ni ciclos.
- No se marca `[P]`: las ediciones comparten `apps/api/README.md` y los dos smokes comparten el puerto predeterminado, por lo que la serialización es apropiada.
- El backlog separa preparación, historias US1–US3 e integración/pulido. T001 es una puerta humana, no autorización para que el agente modifique la spec o la funcionalidad.

## Hallazgos, ambigüedades y severidad

| ID | Severidad | Hallazgo | Resolución / impacto |
|---|---|---|---|
| A-001 | HIGH — bloquea implementación | La spec aprobada afirma que `PORT=""` debe fallar; `src/config.ts` usa `if (!value)` y, por tanto, aplica el fallback 4000. Cambiar la aplicación incumpliría el alcance de no modificar comportamiento. | Se preguntó al usuario. Eligió conservar el alcance y solicitar revisión humana de la spec para aceptar el fallback actual. T001 registra esa aprobación pendiente como gate; no se reescribió la spec ni se inicia implementación hasta que la revisión se apruebe. La matriz marca FR-004/FR-005 condicionados a esa resolución. |
| A-002 | MEDIUM — no bloquea el trabajo local; gate externo conservado | El contenido de la constitución conserva el encabezado «propuesta» y «pendiente de aprobación», mientras el contexto de etapa reporta una aprobación humana registrada y `plan.md` la describe como aprobada. | Se registra la divergencia sin editar la constitución ni reinterpretar su estado. No se solicita ni ejecuta publicación externa; cualquier acción de publicación sigue sujeta al gate humano y a sincronizar el estado del artefacto. |
| A-003 | LOW — inconsistencia documental heredada | `plan.md` indica que `tasks.md` y `analysis.md` no se persistieron porque la escritura fue bloqueada en la fase de plan. Ambos artefactos se han creado en esta fase con las herramientas disponibles. | No se modifica el plan aprobado; el estado actual se expresa en este análisis y en los archivos presentes. |
| A-004 | LOW — límite de evidencia, no gap de requisitos | El smoke en vivo usa `curl` y depende de un proceso local, puerto libre y runtime compatible; esas condiciones no se han comprobado en esta fase. | Las tareas exigen conservar salida y respuesta HTTP reales. Si falta runtime o `curl`, informar el bloqueo explícitamente; no convertir build/test en sustituto ni afirmar que el startup fue validado. |

## Duplicación, cobertura y límites

- La información operativa de comandos y defaults aparece en `plan.md` y `quickstart.md` por diseño. `apps/api/README.md` será la guía que se actualizará; los tres textos deben cotejarse para evitar instrucciones divergentes, pero no se amplía el conjunto de archivos a modificar.
- `T004` ejecuta el build como precondición del modo compilado; `T005` documenta build y test como checks API-only, y `T006` ejecuta el test. No se requiere duplicar el build en otra tarea.
- `tests/products.test.ts` prueba `/health` con `app.inject()`; no prueba un socket del proceso standalone. Por eso T003 y T004 requieren una petición HTTP real.
- El comando de instalación queda documentado como requisito exacto, pero no se añade una tarea de instalación redundante: el contrato operativo configurado para esta feature exige build/tests y el skill indica restaurar dependencias solo si la validación falla por paquetes ausentes o se cambia el manifest.
- No hay cobertura requerida para `apps/web`, Docker Compose, Terraform, despliegues o harnesses Python. Afirmar validación de esas capas sería un gap de constitución y de la spec, no una tarea que deba añadirse.

## Resultado del análisis

El backlog cubre todos los FR y SC con evidencia futura identificable, pero no está listo para iniciar implementación hasta satisfacer T001. No se han ejecutado comandos ni smoke tests y no se marca ningún criterio como validado. El gate de aprobación humana de la constitución y los límites de no publicación, no creación de issues/PR y no despliegue permanecen intactos.
