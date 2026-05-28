# Spec delta — `tours` (iter-12)

Al cerrar el change, este delta se mueve a `specs/areas/tours/spec.md`.

## Criterios de aceptación (G/W/T + RFC 2119)

### Backend — apps/api

- [ ] Given el endpoint `GET /tours`, when no se envían filtros, then la API **MUST** responder 200 con un array de exactamente 10 entradas ordenadas por `year` ascendente.
  - Validación: `apps/api/tests/tours.test.ts` (caso "returns all (10) ordered by year ASC").

- [ ] Given `GET /tours?decade=1990`, when el filtro está definido, then la API **MUST** devolver únicamente entradas con `decade === 1990`.
  - Validación: `apps/api/tests/tours.test.ts` (caso "filters by decade=1990").

- [ ] Given `GET /tours?q=metallica`, when `q` se interpreta como substring case-insensitive sobre `name`, then la API **MUST** devolver al menos un resultado y todos contienen "metallica" en `name` (lowercase).
  - Validación: `apps/api/tests/tours.test.ts` (caso "filter q substring case-insensitive on name").

- [ ] Given `GET /tours?band=Iron%20Maiden`, when el filtro está definido, then la API **MUST** devolver únicamente entradas con `band === "Iron Maiden"` exacto.
  - Validación: `apps/api/tests/tours.test.ts` (caso "filters by band exact match").

- [ ] Given `GET /tours/:id` con id existente, when la entidad se encuentra, then la API **MUST** responder 200 con shape `Tour`.
  - Validación: `apps/api/tests/tours.test.ts` (caso "GET /tours/:id existing").

- [ ] Given `GET /tours/:id` con id inexistente, when no hay coincidencia, then la API **MUST** responder 404 con shape exacto `{ statusCode: 404, error: "Not Found", message: <texto incluyendo el id> }`.
  - Validación: `apps/api/tests/tours.test.ts` (caso "GET /tours/:id 404 with error shape").

- [ ] Given `GET /tours/../etc/passwd`, when el id no cumple `pattern: "^[A-Za-z0-9_.-]+$"`, then la API **MUST** responder 400 o 404 (path no resuelve a la ruta), nunca leak de archivos del servidor.
  - Validación: `apps/api/tests/tours.test.ts` (caso "rejects invalid id pattern").

- [ ] Given el dataset `TOURS`, when se enumeran sus `id`, then **SHALL** ser únicos y todos cumplen `^[a-z0-9]+(-[a-z0-9]+)*$`.
  - Validación: `apps/api/tests/tours.test.ts` (caso "dataset invariants").

- [ ] Given cada entrada `Tour`, when se inspecciona `description`, then **MUST** tener `>=200` chars.
  - Validación: `apps/api/tests/tours.test.ts` (caso "descriptions >=200 chars").

### Frontend — apps/web

- [ ] Given el portal IRON DECK, when el usuario carga `/`, then el header **MUST** contener un link `<a href="/tours">Tours</a>` situado entre "Consolas" y "About".
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "header link Tours navega a /tours").

- [ ] Given la ruta `/tours`, when la página renderiza, then **MUST** mostrar un `<h1>` con texto que contenga "Tours" (case-insensitive) y exactamente 10 cards con `data-testid="tour-card"`.
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "listado /tours renderiza 10 cards").

- [ ] Given el listado `/tours`, when la página termina de cargar, then **MUST** haber 0 errores en `console.error` y 0 `pageerror` (con filtro de ruido del helper).
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "0 errores de consola").

- [ ] Given el listado `/tours`, when el usuario hace click en el chip `Tours · 90s`, then **MUST** quedar `aria-pressed="true"` y todas las cards visibles deben tener `data-decade="1990"`.
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "chip 90s filtra a decade=1990").

- [ ] Given el listado `/tours`, when el usuario teclea "metallica" en el buscador, then tras el debounce de 250ms **MUST** la lista contener solo cards cuyo `<h3>` (case-insensitive) contenga "metallica".
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "buscador filtra por name").

- [ ] Given una card de tour, when el usuario hace click en el `<Link aria-label="Ver detalle de ...">`, then **MUST** navegar a `/tours/<id>` y mostrar `<h1>` con el `name` exacto, breadcrumb con link a `/tours`, y `<dl>` con exactamente 5 `<dt>` (BANDA, AÑO, DÉCADA, ÁLBUM PROMOCIONADO, FECHAS).
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "ficha de tour").

- [ ] Given la ficha de cualquier tour, when se inspecciona el `<p>` bajo `section[aria-labelledby='description-title']`, then su contenido **MUST** tener `>= 200` chars.
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "descripción >= 200 chars").

- [ ] Given `/tours/unknown-xxx`, when la ruta no existe, then **MUST** renderizar `not-found.tsx` con `<h1>` que contenga "no encontrado" y un link "Volver a Tours" con `href="/tours"`.
  - Validación: `apps/web/e2e/tours.spec.ts` (caso "404 renderiza not-found").

- [ ] Given el cliente `apps/web/lib/tours-api.ts`, when se inspecciona la implementación, then **MUST** usar `resolveApiBase()` y `encodeURIComponent(id)` en path params.
  - Validación: inspección estática (security-engineer + reviewer).

### Calidad transversal

- [ ] Given `apps/api`, when se ejecuta `npm test`, then **MUST** pasar el 100% de tests vitest sin warnings.
  - Validación: output literal en `reports/iter-12/qa-engineer.md`.

- [ ] Given `apps/web`, when se ejecuta `npx playwright test --workers=1` contra `docker compose up -d`, then **MUST** pasar el 100% de la suite incluyendo `tours.spec.ts`.
  - Validación: output literal en `reports/iter-12/qa-engineer.md`.

- [ ] Given `apps/api` y `apps/web`, when se ejecuta `npm audit --audit-level=high`, then **MUST** retornar 0 vulnerabilidades.
  - Validación: `reports/iter-12/security-engineer.md`.

- [ ] Given `apps/web/lib/credits.ts`, when se renderiza `/about`, then **MUST** aparecer las 10 entradas de tours con `author`, `publisher`, `year`, `url`.
  - Validación: `apps/web/e2e/about.spec.ts` (test existente) + inspección manual del security-engineer.

### Smoke MCP (Fase 9)

- [ ] Given el stack dockerizado, when se navega con Chrome DevTools MCP a `/tours`, then **MUST** 0 errores de consola y todas las network requests devolver 2xx.
- [ ] Given el stack dockerizado, when se navega a `/tours/world-slavery-tour` y `/tours/black-album-tour`, then **MUST** 0 errores consola y SSR renderizar la ficha completa.
- [ ] Given el stack dockerizado, when se navega a `/tours/unknown-xxx`, then **MUST** renderizar la página not-found.
