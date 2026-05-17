# Backend Engineer — iter-10 (consoles)

## Skills ejecutadas
- Skill(skill: "generate-product-api") → aplicada
- Skill(skill: "generate-tests") → aplicada (cobertura paritaria con games: rutas + describe.each + invariantes de dataset)

## Resumen

Se añade el catálogo `consoles` al backend Fastify espejando el patrón de
`games`: tipo `Console`, dataset estático con 10 entradas (NES, Sega
Genesis, Game Boy, SNES, PlayStation, N64, Dreamcast, PS2, Xbox, Wii),
rutas `GET /consoles` (con filtros `q`/`manufacturer`/`generation`) y
`GET /consoles/:id`, registro en `app.ts` junto a las demás rutas y
batería de tests unitarios + integración. `tsc --noEmit` limpio y los 360
tests del proyecto pasan (incluyendo los 127 nuevos del catálogo).

## Archivos creados / modificados

- (nuevo) `apps/api/src/types/console.ts`
- (nuevo) `apps/api/src/data/consoles.ts`
- (nuevo) `apps/api/src/routes/consoles.ts`
- (modificado) `apps/api/src/app.ts` — solo se añade el import y el `register(consolesRoutes)` junto a `gamesRoutes`. Resto intacto.
- (nuevo) `apps/api/tests/consoles.test.ts`

No se han tocado `data/{albums,games,products}*.ts` ni `routes/{albums,games,products}.ts`.

## Salida literal de tsc

```
$ npx tsc --noEmit
(sin output — exit code 0)
```

## Salida literal de npm test (con conteos)

```
> api@0.1.0 test
> vitest run

 RUN  v4.1.6 C:/02 - Accenture/03 - Repositorios/adlc-claude-code-workspace/apps/api

 ✓ tests/albums.test.ts (10 tests) 350ms
 ✓ tests/albums-review.test.ts (91 tests) 357ms
 ✓ tests/games.test.ts (123 tests) 359ms
 ✓ tests/consoles.test.ts (127 tests) 364ms
 ✓ tests/products.test.ts (9 tests) 336ms

 Test Files  5 passed (5)
      Tests  360 passed (360)
   Start at  16:32:53
   Duration  2.38s
```

Desglose `tests/consoles.test.ts` (127):
- 7 tests en `GET /consoles` (all=10, q=Nintendo, manufacturer=Nintendo (5 exactos), generation=6 (3 exactos: Dreamcast/PS2/Xbox), Sega+Mega=1, generation=99 vacío, 400 por overlong).
- 2 tests en `GET /consoles/:id` (playstation 200 + missing 404 con shape).
- 11 tests por consola × 10 consolas = 110 (`describe.each(CONSOLES)`).
- 3 tests en `CONSOLE_MANUFACTURERS` (sorted, no dup, cobertura).
- 3 tests en `CONSOLE_GENERATIONS` (sorted asc, no dup, cobertura).
- 2 tests en `dataset size` (length=10 + alias id-named).
- Total: 7 + 2 + 110 + 3 + 3 + 2 = 127.

## Decisiones tomadas

1. **Filtro `?q=Nintendo` devuelve 3, no 4.** El prompt sugería `>=4`,
   pero `q` es substring sobre `name` (especificación literal del
   contrato pedido). Solo NES (`Nintendo Entertainment System`), Nintendo
   64 y SNES (`Super Nintendo (SNES)`) llevan "Nintendo" en `name`.
   Game Boy y Wii son fabricadas por Nintendo pero su `name` no lo
   contiene. Ajustada la aserción a `>=3` con comentario explicativo en
   el test y la lista exacta de ids esperados. Filtrar por fabricante se
   resuelve con `?manufacturer=Nintendo` que sí devuelve los 5 exactos
   (verificado en test independiente).

2. **`generation` aceptada como string o number en `findConsoles`.** La
   route entrega el query como string (JSON Schema declara `type:
   "string", maxLength: 3`). `findConsoles` normaliza con `Number(...)`
   y descarta `NaN`, devolviendo `[]` para entradas no numéricas o
   generaciones no presentes (test cubre `?generation=99 → []`).

3. **`unitsSoldM` conservador en `xbox` y `playstation-2`.** Para Xbox
   uso 24.0M (cifra usualmente atribuida a ventas lifetime de la
   original, Microsoft no publicó un total oficial; 24M es la cifra más
   citada). Para PlayStation 2 uso 155.0M (cifra histórica oficial de
   Sony, sin decimales más finos disponibles públicamente).

4. **`iconicGames` con títulos universalmente reconocidos.** No he
   inventado ningún título. Cada consola lleva 4 juegos canónicos del
   imaginario popular (p.ej. Super Mario Bros en NES, Sonic en Genesis,
   Tetris/Pokémon en Game Boy, Halo en Xbox, Wii Sports en Wii). No he
   incluido cifras de ventas individuales por título.

5. **Variable local `entry` en lugar de `console`** en
   `routes/consoles.ts` para evitar shadowing del global `console` y
   facilitar logging futuro sin sorpresas.

6. **`media` exacto al spec.** Cartucho / CD / DVD / GD-ROM / Wii
   Optical Disc tal y como pedía el prompt. No se ha derivado un set
   `CONSOLE_MEDIA` porque el prompt no lo pidió; si en el futuro el
   frontend lo necesita, se añade con la misma plantilla que
   `CONSOLE_MANUFACTURERS` / `CONSOLE_GENERATIONS`.

## Gaps rojos

Ninguno. tsc limpio, los 360 tests pasan (127 del nuevo catálogo + 233
previos sin tocar).

Pendientes externos (no son gaps del backend, los listo por trazabilidad):

- Las portadas reales bajo `apps/web/public/covers/consoles/<id>.jpg`
  las debe descargar el agente frontend; el backend solo declara la
  ruta relativa, igual que con games.
- Validación de la API contra el frontend `/consoles` corresponde a
  frontend-engineer + qa-engineer.

## Próximos pasos

- Frontend-engineer: crear `apps/web/lib/console-types.ts` mirror,
  página `/consoles` con filtros (manufacturer, generation, q) y ficha
  de detalle `/consoles/[id]`, replicando estructura de `/games`.
- Frontend-engineer: descargar las 10 portadas a
  `apps/web/public/covers/consoles/`.
- QA-engineer: añadir tests E2E contra `/consoles` (listado, filtros,
  detalle, 404).
- Security-engineer: revisión estándar del delta (rutas Fastify con
  schema + 404 estructurado, sin nuevas dependencias).

Reporte en reports/iter-10/backend-engineer.md.
