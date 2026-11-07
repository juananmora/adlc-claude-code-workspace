# Delta de criterios: front-estado-verificacion

Slug: `front-estado-verificacion`
PRD: `specs/front-estado-verificacion-prd.md`
Área: `catalog-viewer` (la indicada por la stage; ver nota de gap al final)

Formato: `Given <contexto>, when <acción>, then <resultado>`. Nivel RFC 2119 en la línea siguiente. Cada criterio se verifica con un comando reproducible desde `apps/web/`.

## Requisitos verificados

- AC-01 verifica RF-01 (dev server).
- AC-02 verifica RF-02 (build de producción).
- AC-03 verifica RF-03 (arranque de producción).
- AC-04 verifica RF-04 (inventario de tests unitarios).
- AC-05 verifica RF-05 (suite E2E).
- AC-06 verifica RNF-04 (consola sin errores).
- AC-07 verifica RNF-01 y RNF-02 (entorno y comandos reproducibles).

## Criterios

- [ ] AC-01 — Given `apps/web` con dependencias instaladas, when se ejecuta `npm run dev` en `apps/web/`, then `GET http://localhost:3000/` MUST responder HTTP 200.
  - MUST
  - Validación: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` devuelve `200` con el dev server activo (`apps/web/package.json`, script `dev`).

- [ ] AC-02 — Given `apps/web` con dependencias instaladas, when se ejecuta `npm run build` en `apps/web/`, then el comando MUST terminar con código de salida 0.
  - MUST
  - Validación: `cd apps/web && npm run build; echo $?` imprime `0` (script `build`, `apps/web/package.json`).

- [ ] AC-03 — Given un build de producción generado por AC-02, when se ejecuta `npm run start`, then `GET http://localhost:3000/` MUST responder HTTP 200.
  - MUST
  - Validación: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` devuelve `200` con `next start` activo (script `start`, `apps/web/package.json`).

- [ ] AC-04 — Given el `package.json` de `apps/web`, when se inspeccionan sus scripts, then el reporte MUST documentar qué scripts de test existen (`test:e2e`, `test:e2e:headed`) y que no existe ningún script de tests unitarios, con su línea de evidencia.
  - MUST
  - Validación: `grep -n '"test' apps/web/package.json` lista exactamente `test:e2e` y `test:e2e:headed`; el reporte cita esas líneas.

- [ ] AC-05 — Given la suite Playwright en `apps/web/e2e/` (10 ficheros `*.spec.ts`) y el servidor arrancado, when se ejecuta `npm run test:e2e`, then el reporte MUST registrar el resultado (pasa, falla o se omite) con el número de tests por estado, sin ocultar fallos.
  - MUST
  - Validación: `cd apps/web && npm run test:e2e` produce salida del reporter `list` con totales por estado; el reporte incluye esos totales.

- [ ] AC-06 — Given la página `/` cargada en Chromium, when se leen los mensajes de consola y las peticiones de red, then SHOULD no haber errores de consola ni respuestas 4xx/5xx; cada error encontrado MUST listarse con su texto exacto.
  - SHOULD (listado MUST)
  - Validación: `playwright-browser_console_messages` (level `error`) y `playwright-browser_network_requests` sobre `http://localhost:3000/`; el reporte contiene la lista literal.

- [ ] AC-07 — Given el entorno de la máquina, when se ejecuta la verificación, then el reporte MUST registrar la versión de Node y los comandos exactos usados, de modo que cualquiera pueda repetirlos.
  - MUST
  - Validación: `node --version` aparece en el reporte junto a la lista de comandos ejecutados.

## Nota de gap

- El `CLAUDE.md` del repo cita `claude-catalog-viewer/` y `node --test scripts/`, que no existen en el repositorio. El área `catalog-viewer` tampoco existe en `specs/areas/`. Se ha usado el nombre que pide la stage. Queda pendiente que una persona confirme si el área debe ser `catalog-products` o una nueva.
- No hay runner de tests unitarios en `apps/web`. AC-04 verifica esa ausencia en lugar de exigir una suite inexistente.
