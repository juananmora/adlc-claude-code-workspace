# Plan de implementación: verificación de arranque local del API

## Entradas aprobadas

- Feature: `specs/001-startup-verification/spec.md` (US1–US3, FR-001–FR-007, SC-001–SC-005).
- Constitución: `.specify/memory/constitution.md` v1.0.0, aprobada según la decisión humana de la etapa previa incluida en el contexto de esta ejecución. Su encabezado local aún conserva el estado «propuesta»; este plan no modifica ese archivo ni interpreta la aprobación como permiso de publicación externa.
- Decisión humana de alcance registrada en la especificación: solo arranque local de `apps/api`, en modos desarrollo y compilado; Docker Compose fuera de alcance.
- Decisión de esta planificación: reflejar el comportamiento observado de `PORT=""` y exigir aclarar la especificación aprobada antes de implementar, sin cambiar el código ni reescribir la especificación por cuenta propia.

## Contexto técnico

El repositorio es un monorepo. Esta feature afecta únicamente la documentación de `apps/api`, un servicio Node.js + TypeScript + Fastify 5, en ESM. Los scripts reales están en `apps/api/package.json`: `dev` (`tsx watch src/server.ts`), `build` (`tsc -p tsconfig.json`), `start` (`node dist/server.js`) y `test` (`vitest run`). Los tests de salud actuales usan `Fastify app.inject()` en `apps/api/tests/products.test.ts`; no prueban un listener independiente.

`apps/api/src/config.ts` define `HOST=0.0.0.0` y `PORT=4000` por defecto. El handler existente `GET /health` responde `{ "status": "ok" }`. TypeScript emite en `apps/api/dist` (`outDir: dist`, `sourceMap: true`). El manifiesto no fija una versión local de Node.js. El Dockerfile usa Node 22, pero no es una política del runtime local y Docker está excluido. El README del API menciona copiar `.env.example`, que no aparece en el checkout; las instrucciones nuevas no dependerán de él.

## Comprobación de la constitución

### Antes del diseño

- **Principios 1 y 3 — especificación y evidencia:** se parte de la especificación aprobada; se diferenciará el smoke HTTP de compilación y tests in-process. No se afirmará que un comando pasó sin ejecutarlo.
- **Principio 2 — alcance mínimo:** solo se actualizará documentación del API. No se cambiarán funcionalidad, endpoints, dependencias, configuración ni infraestructura.
- **Principio 4 — secretos:** no se requieren valores sensibles ni se añadirán ejemplos de credenciales.
- **Principio 5 — aprobación humana:** no se publicarán artefactos, crearán issues, abrirán PRs ni desplegará nada desde esta fase.
- **Principio 6 — documentación fiel:** comandos y defaults se contrastan con manifiesto y código actuales; la referencia a `.env.example` ausente se evita.
- **Resultado:** compatible, con una discrepancia pendiente de aclaración entre el requisito de `PORT` vacío y el comportamiento actual del código (detallada en `research.md`).

### Después del diseño

La propuesta mantiene la separación entre documentación, prueba HTTP real y pruebas/build del API; limita la edición a `apps/api/README.md`; y deja comandos pendientes hasta la ejecución de la etapa de implementación. No propone ninguna excepción constitucional. **Bloqueo previo a la implementación:** obtener una aclaración humana sobre la especificación aprobada para `PORT=""`; la decisión de planificación es documentar el comportamiento actual (fallback a 4000), no cambiar la aplicación.

## Diseño y límites

La implementación actualizará la guía existente de `apps/api/README.md` para incluir:

1. Prerrequisitos: Node.js y npm compatibles con el paquete actual, sin prometer una versión local fijada; instalación con el comando reproducible del repositorio.
2. Comandos API ejecutados desde la raíz: instalación, build, tests, inicio de desarrollo e inicio compilado.
3. Verificación en vivo de `GET http://127.0.0.1:4000/health` mientras un modo está ejecutándose; resultado exigido: HTTP 200 y JSON exacto `{ "status": "ok" }`.
4. Parada normal del proceso en primer plano con Ctrl+C y explicación del mensaje de apagado existente (`shutting down`), sin prometer cambios de comportamiento.
5. Fallos de arranque: puerto ocupado, puerto inválido, incompatibilidad/ausencia de Node o npm y errores de bind. Un build o un `app.inject()` satisfactorio no se reportará como listener disponible.
6. Límites: los resultados de esta guía solo verifican `apps/api`; no implican validación de `apps/web`, Docker Compose, Terraform ni harnesses Python.

No se añadirá automatización ni endpoint: el test `health` actual es in-process y no sustituye el smoke manual de un servidor independiente. Las dos modalidades de inicio se probarán en secuencia, reutilizando el puerto por defecto después de detener el primer proceso. Para la modalidad compilada se ejecutará primero el build. No se cambiará el código para satisfacer una contradicción de requisitos.

### Mapeo de requisitos a diseño y validación prevista

| Requisito | Elemento de diseño | Evidencia prevista en implementación |
|---|---|---|
| FR-001 | Instrucciones con scripts y prefijo `--prefix apps/api`; instalación configurada exacta | Inspección del manifest y `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund` |
| FR-002 | Procedimiento HTTP `/health`, estado y cuerpo exactos | Smoke en vivo para dev y compilado, inspección de estado y JSON |
| FR-003 | Sección que distingue listener de build y `app.inject()` | Inspección de README y resultados separados de build/test/smoke |
| FR-004 | Defaults desde `src/config.ts`, sin depender de `.env.example` | Inspección del README contra código y árbol del checkout |
| FR-005 | Fallos de bind, puerto inválido/ocupado y parada normal | Inspección del procedimiento y comprobaciones de arranque; aclarar antes el caso `PORT` vacío |
| FR-006 | Frontera explícita de validación solo API | Inspección del README y del informe de validación |
| FR-007 | Solo documentación, sin cambios de código ni manifiestos | Revisión del diff; build/tests no alteran archivos fuente |

## Archivos

- **Modificar:** `apps/api/README.md` (instrucciones operativas existentes, integradas sin duplicar ni contradecir información útil).
- **No modificar:** `apps/api/src/**`, `apps/api/tests/**`, `apps/api/package.json`, lockfile, `apps/api/Dockerfile`, configuración, `specs/001-startup-verification/spec.md` sin aclaración/aprobación humana, `.specify/memory/constitution.md`, la web, Terraform, Docker Compose y harness Python.
- **Artefactos persistidos en esta etapa:** `plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `quickstart.md`, `checklists/design.md`.
- **Artefactos no persistidos:** `tasks.md` y `analysis.md`. La herramienta de escritura bloqueó ambos como artefactos gestionados/controlados; no se intentó eludir esa restricción. El mapeo de cobertura y el hallazgo de PORT permanecen documentados en este plan y `research.md`.

## Contratos, datos y recuperación

No hay modelo de dominio nuevo, persistencia, migraciones ni lifecycle de datos para esta feature. El modelo es **N/A**; ver `data-model.md`. Tampoco se cambia el contrato del API; `/health` es un contrato existente usado como señal observable, documentado en `contracts/README.md`. La recuperación consiste en detener el proceso fallido, resolver el puerto/configuración o incompatibilidad del entorno y repetir el procedimiento; no se agregarán retry, fallback ni manejadores nuevos.

## Contrato de validación

Comandos configurados y reproducibles desde la raíz del repositorio:

- Instalar dependencias del API: `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`.
- Compilar: `npm run build --prefix apps/api`.
- Ejecutar tests: `npm test --prefix apps/api`.
- Arranque de desarrollo: `npm run dev --prefix apps/api`.
- Arranque compilado (después del build): `npm start --prefix apps/api`.
- Comprobación HTTP mientras el servidor está activo: `curl --fail --show-error --include http://127.0.0.1:4000/health`; inspeccionar HTTP 200 y cuerpo JSON exacto `{ "status": "ok" }`.
- Artefacto de build esperado: `apps/api/dist/` (JavaScript compilado y mapas fuente según `tsconfig.json`).

Requisitos de runtime: Node.js y npm instalados y compatibles con lockfile y dependencias; el paquete no declara `engines`, por lo que este plan no asigna una versión local mínima/máxima. Se necesita `curl` o un cliente HTTP equivalente para la verificación en vivo. Los comandos de npm son API-scoped. No se declara evidencia de ejecución en esta etapa; web, Terraform, Docker Compose y harnesses Python permanecen sin validar por esta feature.

## Complejidad y decisiones pendientes

Complejidad baja: actualización de una guía existente y comprobación manual de dos formas de inicio. No se justifican nuevas abstracciones, dependencias, scripts, modelos, contratos versionados ni infraestructura.

| Decisión | Rationale | Alternativa descartada / decisión humana |
|---|---|---|
| Usar el smoke HTTP además de build/tests | Los tests existentes llaman `app.inject()` y no prueban el proceso standalone | Tratar build o tests in-process como readiness (no cubre SC-001/003) |
| No declarar versión local de Node | `package.json` no fija `engines`; Dockerfile no determina el runtime local | Copiar Node 22 del Dockerfile como requisito del host (no autorizado por la spec) |
| No requerir `.env.example` | La ruta no existe en el checkout | Mantener el paso del README actual, que falla en este checkout |
| Aclarar el requisito de `PORT` vacío | Código trata la cadena vacía como ausencia y usa 4000; la spec aprobada afirma fallo | Cambiar código o reescribir el requisito sin autorización (ambos fuera de alcance) |

## Gates humanos

La decisión de planificación recibida es documentar el comportamiento actual de `PORT=""`, pero solicita aclarar la especificación aprobada antes de implementar. No se considera aprobada una modificación de la especificación ni un cambio de código. La persona responsable debe resolver ese conflicto y revisar cualquier cambio documental conforme al flujo ADLC. No publicar, abrir PR, crear issues, fusionar ni desplegar en esta etapa.