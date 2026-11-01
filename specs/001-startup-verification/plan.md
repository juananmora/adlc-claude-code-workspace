# Plan de implementación: verificación de arranque local del API

## Entradas aprobadas

- Feature: `specs/001-startup-verification/spec.md` (US1–US3, FR-001–FR-007, SC-001–SC-005).
- Constitución: `.specify/memory/constitution.md` v1.0.0. El contexto registra aprobación humana, aunque el encabezado del archivo todavía lo presenta como propuesta pendiente de ratificación; esta tarea no modifica ni publica la constitución.
- Alcance humano registrado: solo arranque local de `apps/api`, en modos desarrollo y compilado; Docker Compose queda fuera.
- Aclaración aprobada en T001: `PORT=""` se trata como no especificado y usa el puerto predeterminado 4000; no se cambia comportamiento de la aplicación.

## Contexto técnico

El monorepo contiene un servicio Node.js + TypeScript + Fastify 5 en ESM. Los scripts existentes son `dev` (`tsx watch src/server.ts`), `build` (`tsc -p tsconfig.json`), `start` (`node dist/server.js`) y `test` (`vitest run`) en `apps/api/package.json`. TypeScript emite en `apps/api/dist/`. `src/config.ts` define `HOST=0.0.0.0` y `PORT=4000`; `src/app.ts` implementa `GET /health` con `{ "status": "ok" }`. Los tests usan `app.inject()` y no demuestran por sí mismos que un proceso standalone haya enlazado un puerto. El manifiesto no fija versión local de Node.js. El archivo `.env.example` no está presente en el checkout.

## Decisiones y límites de diseño

La implementación actualiza solo `apps/api/README.md` para documentar prerequisitos, instalación reproducible, defaults y overrides, arranque desarrollo/compilado, comprobación HTTP en vivo, parada y errores comunes. Se diferencia explícitamente la comprobación HTTP de build y tests in-process. La documentación no requiere copiar `.env.example` ni infiere una versión local de Node.js a partir del Dockerfile.

No se añade endpoint, automatización, dependencia o configuración, ni se cambian código, tests, infraestructura o comportamiento. Las afirmaciones de validación son API-only: no cubren `apps/web`, Docker Compose, Terraform ni harnesses Python. Las checklists de revisión humana permanecen intactas y sin aprobar por esta tarea.

## Evidencia de ejecución controlada

Los eventos controlados T001–T007 de `task-trace.jsonl` registran:

| Tarea | Evidencia registrada |
|---|---|
| T001 | Spec actualizada con aprobación humana: `PORT=""` usa el fallback 4000; el código de configuración se mantuvo sin cambios. |
| T002 | `apps/api/README.md` documenta prerequisitos, el comando de instalación configurado, HOST/PORT, alcance y ausencia de `.env.example`. |
| T003 | `npm run dev --prefix apps/api` respondió en vivo en `127.0.0.1:4000/health` con HTTP 200 y `{"status":"ok"}`; SIGINT terminó el proceso y registró `shutting down`. Se usó `fetch` de Node porque `curl` no está instalado en la imagen. |
| T004 | `npm run build --prefix apps/api` pasó y emitió `apps/api/dist/server.js`; `npm start --prefix apps/api` respondió por HTTP con 200 y `{"status":"ok"}`; SIGINT registró `shutting down`. La petición se comprobó con Node `fetch`. |
| T005 | El README separa build/tests de readiness HTTP y limita explícitamente el alcance a `apps/api`. |
| T006 | `npm test --prefix apps/api` pasó: 6 archivos de test, 511 tests. Resultado distinto de los dos smokes HTTP. |
| T007 | `git diff --check` pasó. La revisión registrada incluyó `apps/api/README.md`, la enmienda aprobada de la spec y cambios controlados de backlog/trace; no reportó cambios en código API, tests, manifests/lockfiles, configuración runtime o infraestructura. |

Estas evidencias no constituyen validación de otras capas ni aprobación para publicación externa. T008 reconcilia los artefactos documentales con estos resultados registrados; no vuelve a ejecutar ni amplía la validación.

## Contrato de validación

Comandos del API desde la raíz:

- Instalar: `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund` (documentado; no se registra ejecución en T001–T007).
- Build: `npm run build --prefix apps/api` (ejecutado; pasó; artefacto `apps/api/dist/server.js`).
- Tests: `npm test --prefix apps/api` (ejecutado; pasó: 6 archivos, 511 tests).
- Desarrollo: `npm run dev --prefix apps/api` (ejecutado; HTTP 200 y JSON esperado en `/health`).
- Compilado: `npm start --prefix apps/api` tras el build (ejecutado; HTTP 200 y JSON esperado en `/health`).
- Comando HTTP documentado: `curl --fail --show-error --include http://127.0.0.1:4000/health`. Como `curl` no estaba disponible, en ambos smokes la petición real se hizo con `fetch` integrado de Node.

Los smokes exigen un proceso vivo y verifican respuesta HTTP 200 con `{ "status": "ok" }`. Build y tests se reportan por separado y no prueban el listener standalone.

## Estado y gates humanos

La discrepancia de `PORT=""` está resuelta en la spec por la decisión humana registrada en T001; la implementación documenta el comportamiento existente sin modificarlo. La constitución conserva en su propio encabezado el estado de propuesta pese a la aprobación reportada en el contexto; no se altera esa fuente ni se interpreta esta tarea como autorización para publicarla. No se crean issues, PRs ni commits remotos, no se fusiona ni se despliega.
