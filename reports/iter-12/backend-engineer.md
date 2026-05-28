# Backend engineer — iter-12 (área `tours`)

## Skills ejecutadas
- Skill(skill: "generate-product-api") → aplicada

Se siguió íntegramente el patrón canónico de la skill: tipo en `types/`, dataset + helpers en `data/`, route con JSON Schema (`additionalProperties: false`, `pattern` en el `idParamSchema`, `maxLength` en todo string del querystring), error con shape `{ statusCode, error, message }`, registro en `app.ts` tras `consolesRoutes`, tests con `buildApp() + app.inject()`. No se usó `any`, ni `as unknown as`, ni `@ts-ignore`. No se añadieron dependencias.

## Archivos creados / modificados

| Archivo | Acción |
|---|---|
| `apps/api/src/types/tour.ts` | Creado — interface `Tour` con JSDoc por campo. |
| `apps/api/src/data/tours.ts` | Creado — `TOURS` (10 entradas exactas del design.md, ordenadas cronológicamente en el array y devueltas sorted ASC por `year` en el helper), `TOUR_BANDS`, `TOUR_DECADES` y helpers `findTours` / `findTourById`. |
| `apps/api/src/routes/tours.ts` | Creado — `toursRoutes` con `GET /tours` y `GET /tours/:id`. |
| `apps/api/src/app.ts` | Modificado — `import { toursRoutes }` + `await app.register(toursRoutes)` tras `consolesRoutes`. |
| `apps/api/tests/tours.test.ts` | Creado — 75 tests cubriendo los 9 casos del spec + invariantes de dataset. |

## Validación obligatoria — outputs literales

### `cd apps/api && npm test`

```
> api@0.1.0 test
> vitest run


 RUN  v4.1.6 C:/02 - Accenture/03 - Repositorios/adlc-claude-code-workspace/apps/api

 ✓ tests/tours.test.ts (75 tests) 554ms
 ✓ tests/products.test.ts (9 tests) 566ms
 ✓ tests/albums.test.ts (11 tests) 569ms
 ✓ tests/consoles.test.ts (127 tests) 563ms
 ✓ tests/games.test.ts (190 tests) 579ms
 ✓ tests/albums-review.test.ts (99 tests) 588ms

 Test Files  6 passed (6)
      Tests  511 passed (511)
   Start at  07:05:50
   Duration  3.13s (transform 1.23s, setup 0ms, import 4.65s, tests 3.42s, environment 1ms)
```

### `cd apps/api && npx tsc --noEmit`

```
EXIT_CODE=0
```

Sin output, exit 0. Compilación estricta TS limpia.

## Endpoints expuestos y ejemplos de respuesta

### `GET /tours`

Devuelve `Tour[]` (10 entradas) ordenado por `year` ASC. Filtros opcionales: `q` (substring CI sobre `name`, `maxLength 200`), `decade` (igualdad numérica, `maxLength 4`), `band` (igualdad estricta, `maxLength 80`). Schema con `additionalProperties: false`.

Ejemplo de primer elemento del array (mismos campos para los otros nueve):

```json
{
  "id": "world-slavery-tour",
  "name": "World Slavery Tour",
  "band": "Iron Maiden",
  "year": 1984,
  "decade": 1980,
  "albumPromoted": "Powerslave",
  "showsCount": 187,
  "countries": [
    "Reino Unido",
    "Estados Unidos",
    "Canadá",
    "Japón",
    "Polonia",
    "Yugoslavia",
    "Hungría"
  ],
  "description": "Iniciada en agosto de 1984 tras la publicación de Powerslave, la World Slavery Tour fue una de las primeras giras del metal en cruzar el telón de acero, con conciertos en Polonia, Hungría y Yugoslavia. La producción —incluida la imponente escenografía egipcia con sarcófago animatrónico de Eddie— y la duración extenuante (más de 180 fechas en 13 meses) marcaron tanto a la banda que motivaron el descanso prolongado posterior a Somewhere in Time (1986). El doble en directo Live After Death, grabado durante esta gira, está considerado uno de los mejores discos en vivo del heavy metal.",
  "coverUrl": "/covers/tours/world-slavery-tour.jpg"
}
```

### `GET /tours/:id`

- `200 OK` con `Tour` si existe.
- `404 Not Found` con shape exacto:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Tour 'unknown-xxx' no encontrado"
}
```

- `400` (Fastify automático) si el `id` no cumple `^[A-Za-z0-9_.-]+$` o supera 128 chars.

### Trazabilidad criterios → tests

| Criterio del spec | Test que lo cubre |
|---|---|
| returns all (10) ordered by year ASC | `GET /tours > returns all (10) ordered by year ASC` |
| filters by decade=1990 | `GET /tours > filters by decade=1990` |
| filter q substring case-insensitive on name | `GET /tours > filter q substring case-insensitive on name` |
| filters by band exact match (Iron Maiden) | `GET /tours > filters by band exact match (Iron Maiden)` |
| GET /tours/:id existing | `GET /tours/:id > GET /tours/:id existing` |
| GET /tours/:id 404 with error shape | `GET /tours/:id > GET /tours/:id 404 with error shape` |
| rejects invalid id pattern | `GET /tours/:id > rejects invalid id pattern (../etc/passwd)` |
| dataset invariants (ids únicos + slug ascii) | `dataset invariants > ids son únicos y kebab-case ascii` |
| descriptions >=200 chars | `dataset entry $id > descriptions >=200 chars` (10 instancias parametrizadas) |

## Desviaciones del design.md

Una sola, justificada y compatible con el spec:

- **Test del filtro `q`**: el spec literal sugiere "filter q substring case-insensitive on name" con un ejemplo informal `q=metallica`. Sin embargo, ninguna entrada del catálogo lleva literalmente "Metallica" en su `name` comercial (los nombres son "Damaged Justice Tour" y "Wherever I May Roam", no "Metallica Tour"). Para que el test sea realmente verificable contra el dataset acordado en el design (`band: "Metallica"` pero `name` distinto), el caso usa `q=TOUR` como token que demuestra el comportamiento case-insensitive substring sobre `name`. El filtro `q=metallica` seguiría funcionando a nivel API (devolvería 0 resultados como cualquier substring no presente), pero un test sobre eso no demostraría que el filtro funciona. Esta decisión preserva la semántica RFC 2119 "at least one result" del criterio.

No hay otras desviaciones: ids/decadas/álbumes/bandas coinciden 1:1 con la tabla del design.md.

## Notas para el frontend-engineer (no son cambios míos)

- Las portadas que el frontend debe colocar en `apps/web/public/covers/tours/` son exactamente: `world-slavery-tour.jpg`, `monsters-of-rock-86.jpg`, `damaged-justice-tour.jpg`, `clash-of-the-titans.jpg`, `cowboys-from-hell-tour.jpg`, `use-your-illusion-tour.jpg`, `black-album-tour.jpg`, `ozzfest-1996.jpg`, `iowa-world-tour.jpg`, `judas-priest-redeemer.jpg`.
- El listado de la API ya devuelve ordenado por `year` ASC, así que el frontend no tiene que re-ordenar.
- Los festivales llevan `band` con sufijo `(festival)` (p.ej. `Van Halen / Scorpions / Ozzy (festival)`). Si el chip de filtro `band` se construye desde `TOUR_BANDS`, el sufijo viene incluido — coherente con la decisión del design.md.
