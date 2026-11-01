# Investigación técnica: verificación de arranque local del API

## Alcance y fuentes consultadas

Investigación de checkout local, sin ejecutar comandos ni consultar fuentes externas. Se leyeron la constitución, la especificación aprobada y su checklist, instrucciones del workspace, manifiesto y README del API, `src/config.ts`, `src/server.ts`, `src/app.ts`, configuración TypeScript/Vitest, test de productos y Dockerfile. Los resultados son inspección estática, no evidencia de build, tests o startup.

## Hallazgos confirmados

| Tema | Hallazgo del checkout | Consecuencia de diseño |
|---|---|---|
| Stack API | Node.js, TypeScript, Fastify 5, ESM; scripts npm `dev`, `build`, `start`, `test` en `apps/api/package.json` | Usar scripts existentes y `--prefix apps/api`, sin herramientas/framework nuevos |
| Build | `tsc -p tsconfig.json`, `outDir: dist`, `sourceMap: true` | Esperar salida en `apps/api/dist/`; no afirmar que existe hasta correr build |
| Test | Vitest; el test `health` usa `app.inject()` | Es prueba del handler en proceso, no de bind/listener HTTP independiente |
| Server | `server.ts` llama `app.listen`, registra SIGINT/SIGTERM y reporta `API ready` / `shutting down` | Documentar proceso foreground, health HTTP y parada normal, sin prometer más |
| Configuración | `HOST` default `0.0.0.0`; `PORT` default `4000`; valor numérico inválido si parseado <=0, NaN o >65535 | El smoke por defecto puede dirigirse a `127.0.0.1:4000`; un override de HOST puede cambiar la dirección alcanzable |
| PORT vacío | `parsePort` retorna fallback con `if (!value)`, por lo que `PORT=""` usa 4000 en el código inspeccionado | Conflicto con la edge case de la spec que exige que vacío falle; requiere aclaración antes de implementar. No se propone modificar código |
| Archivo de entorno | El README menciona `apps/api/.env.example`, pero no está presente en el inventario del checkout; `.env` está en ignore | No hacer que copiar un archivo ausente sea prerrequisito ni introducir archivos con secretos |
| Versión runtime | El paquete no declara `engines`; el Dockerfile usa Node 22 | Indicar Node/npm compatibles como prerrequisito, sin inferir versión local garantizada del Dockerfile |
| Validación de workspace | `openspec/config.yaml` dispone comandos de test/build para API y el contexto de ejecución SDD da install/build/test y artefacto exactos | Mantener exactos `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`, `npm run build --prefix apps/api`, `npm test --prefix apps/api`; el artefacto configurado es `apps/api/dist` |

## Decisiones, rationale y alternativas

1. **Documentar scripts locales existentes, no crear scripts nuevos.** Los cuatro scripts necesarios ya están en el manifest. Añadir wrappers aumentaría el alcance y podría divergir de comandos canónicos.
2. **Verificar con HTTP real además de build/tests.** `app.inject()` prueba una instancia Fastify sin demostrar que `server.ts` haya enlazado un puerto. Solo la petición al proceso independiente satisface el objetivo de readiness.
3. **Mantener Node local como requisito abierto de compatibilidad.** No hay campo `engines`; fijar Node 22 desde el contenedor sería extrapolar y está excluido por la especificación. No se realizó una investigación de compatibilidad externa.
4. **No requerir `.env.example`.** El archivo está ausente; la configuración por defecto se puede describir desde el código inspeccionado.
5. **No cambiar comportamiento para `PORT=""`.** La persona eligió reflejar el comportamiento existente y aclarar la spec antes de implementar. La decisión deja un bloqueo: mientras la spec aprobada exija que vacío falle, README que documente el fallback no puede satisfacerla literalmente. Una persona debe aprobar la aclaración/revisión de la spec antes de cerrar esa discrepancia.

## Límites

No se verificó la instalación, versión actual de Node/npm/curl, estado de puerto, permisos del checkout, disponibilidad de red, build, tests, salida HTTP ni manejo de shutdown en ejecución. No se afirma que `apps/web`, Docker Compose, Terraform ni harnesses Python hayan sido validados. Los resultados no autorizan publicación externa.