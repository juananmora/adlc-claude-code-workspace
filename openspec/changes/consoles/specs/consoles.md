# Delta — `consoles` (nueva área)

> Tras `/ship` y merge, los `## ADDED Requirements` se mueven a `specs/areas/consoles/spec.md`.

## ADDED Requirements

### REQ-CONSOLES-1: Tipos backend

Given el código backend,
when se importa desde `apps/api/src/types/console.ts`,
then SHALL exportar `interface Console { id, name, manufacturer, year, generation, description, unitsSoldM, iconicGames, media, coverUrl }`.

**Validación:** `npx tsc --noEmit` + uso en routes/data.

### REQ-CONSOLES-2: Dataset de 10 consolas

Given `apps/api/src/data/consoles.ts`,
when se importa `CONSOLES`,
then MUST contener exactamente 10 entradas. Cada entrada cumple:

- `id` kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`),
- `year` en `[1970, 2010]`,
- `generation` integer en `[3, 7]`,
- `description.length >= 200`,
- `unitsSoldM > 0`,
- `iconicGames.length >= 3`,
- `media` no vacío,
- `coverUrl` empieza por `/covers/consoles/`.

**Validación:** suite dinámica `apps/api/tests/consoles.test.ts`.

### REQ-CONSOLES-3: Constantes derivadas

Given el dataset,
when se exportan `CONSOLE_MANUFACTURERS` y `CONSOLE_GENERATIONS`,
then ambas SHALL ser arrays ordenados (manufacturers alfabéticamente, generations ascendente) con los valores únicos del dataset.

**Validación:** tests vitest.

### REQ-CONSOLES-4: GET /consoles con filtros

Given el dataset,
when un cliente hace `GET /consoles`,
then SHALL devolver los 10 consoles. Querystring soporta:
- `q` (case-insensitive substring sobre name) maxLength 200,
- `manufacturer` (exact match) maxLength 50,
- `generation` (exact match, como string del número) maxLength 3.

Combinables. `additionalProperties: false`.

**Validación:** `consoles.test.ts` cubre los 4 casos (sin filtro, q, manufacturer, generation, combinaciones, 400 por overlong).

### REQ-CONSOLES-5: GET /consoles/:id

Given un id de consola,
when un cliente hace `GET /consoles/:id`,
then SHALL devolver la consola (200) o 404 con shape `{statusCode, error, message}`. Schema id: `pattern "^[A-Za-z0-9_.-]+$"`, `minLength 1`, `maxLength 128`.

**Validación:** tests.

### REQ-CONSOLES-6: Frontend mirror + cliente HTTP

Given el frontend,
when se importa desde `apps/web/lib/console-types.ts`,
then SHALL exportar `Console`, `CONSOLE_GENERATIONS` (`as const`) y `ConsoleGeneration`.

`apps/web/lib/consoles-api.ts` SHALL exponer `fetchConsoles({ q?, manufacturer?, generation? })` y `fetchConsole(id)`, **usando `resolveApiBase()` de `lib/api.ts`** (compatible SSR/CSR/Docker).

**Validación:** `tsc --noEmit` + uso en componentes.

### REQ-CONSOLES-7: Listado /consoles

Given el navegador en `/consoles`,
when la página carga,
then MUST mostrar:
- header global IRON DECK con link "Consolas" pressed/highlight (no obligatorio, depende del diseño),
- `<h1>` con texto que incluya "Consolas" o "Consoles",
- 10 cards en grid responsive con cover + nombre + manufacturer + año + generation badge,
- buscador con `data-testid="console-search-input"` y `aria-label="Buscar consolas"`,
- fila de chips con `role="group" aria-label="Filtrar por generación"`, chips con `data-testid="console-gen-chip-<n>"` y `aria-pressed`,
- 0 errores consola.

**Validación:** smoke MCP + `e2e/consoles.spec.ts`.

### REQ-CONSOLES-8: Buscador y chips funcionales

Given el listado,
when el usuario teclea "Nintendo" en el buscador,
then el grid SHALL mostrar solo cards con name conteniendo "Nintendo" (case-insensitive).
when el usuario clica el chip "5",
then SHALL mostrar solo cards con `data-generation="5"`.
when clica de nuevo el mismo chip,
then SHALL deseleccionarlo (vuelve a "all").

**Validación:** `e2e/consoles.spec.ts`.

### REQ-CONSOLES-9: Ficha /consoles/:id

Given un id existente,
when el usuario navega a `/consoles/<id>`,
then MUST renderizar:
- breadcrumb con link a `/consoles`,
- `<h1>` con `console.name`,
- portada grande (sin lazy, above the fold),
- `<dl>` con metadatos: FABRICANTE, AÑO, GENERACIÓN, MEDIA, UNIDADES VENDIDAS,
- descripción ≥200 chars,
- lista de iconic games con `<ul>`/`<li>`.

**Validación:** `e2e/consoles.spec.ts` + smoke MCP.

### REQ-CONSOLES-10: 404, header entry, sin regresiones

Given un id inexistente,
when el usuario navega a `/consoles/<unknown>`,
then SHALL renderizar el not-found específico con link a `/consoles`.

Header global SHALL contener link "Consolas" entre "Games" y "About".

Suite Playwright completa SHALL seguir verde **contra Docker** (no solo contra host). Esperado: 46 previos + N nuevos consoles, 0 regresiones.

**Validación:** test E2E + ejecución completa de la suite contra `docker compose up`.
