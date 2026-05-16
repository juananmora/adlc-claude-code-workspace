# Backend engineer — iteración 7

## Skills ejecutadas
- Skill(skill: "generate-product-api") → aplicada (el patrón canónico real del repo es `routes/albums.ts` + `data/albums.ts`, no la plantilla teórica `/products` de la skill; la skill se honra en su intención —API REST tipada, validación de input, sin secretos, tests— pero los endpoints son `/games` no `/products`, según contrato de la iteración).

## Resumen
Implementado el backend del catálogo Games — Amstrad CPC (iteración 7) clonando estructuralmente el patrón de albums:
- `src/types/game.ts` con `Game`, `GameQuote`, `GameGenre` (sobrescrito íntegramente: el parcial previo usaba `coverImage` y se cambió a `coverUrl`).
- `src/data/games.ts` con 10 juegos exactos, `GAME_GENRES` ordenado, `findGames({ q, genre })` y `findGameById(id)` (sobrescrito; el parcial previo usaba `coverImage`).
- `src/routes/games.ts` con `GET /games` (schema `q maxLength 200`, `genre maxLength 50`, `additionalProperties: false`) y `GET /games/:id` (params con pattern de id, 404 con shape `{ statusCode, error, message }`) (sobrescrito; el parcial previo tenía `q maxLength 50`).
- `src/app.ts` añade `import` y `register` de `gamesRoutes` junto a `productsRoutes` y `albumsRoutes`. No se duplicó.
- `tests/games.test.ts` con bloques `GET /games`, `GET /games/:id`, suite dinámica `describe.each(GAMES)`, validaciones de `GAME_GENRES` y `dataset size`.

## Archivos creados
- `apps/api/tests/games.test.ts`

## Archivos modificados
- `apps/api/src/types/game.ts` (sobrescrito; reemplazado `coverImage` → `coverUrl`)
- `apps/api/src/data/games.ts` (sobrescrito; reemplazado `coverImage` → `coverUrl`, eliminado `as const` final por compatibilidad con `quotes: GameQuote[]` mutable, mismo patrón que `albums.ts`)
- `apps/api/src/routes/games.ts` (corregido `q maxLength` de 50 → 200, coherente con `albums.ts`)
- `apps/api/src/app.ts` (añadido `import { gamesRoutes } from "./routes/games.js";` y `await app.register(gamesRoutes);` justo después de `albumsRoutes`; ningún otro cambio)

## Salida literal de `npm test`
**NO EJECUTADO.** La sesión de este agente tiene la herramienta `Bash` denegada por la sandbox (intentos `npx tsc --noEmit` y variantes devuelven `Permission to use Bash has been denied`). No tengo manera de generar el output literal de `vitest` desde este agente.

Acción recomendada para el orquestador (PowerShell desde `apps/api`):
```
cd apps/api
npm test
```

Conteo esperado (estimación, no verificación):
- `tests/games.test.ts`: 8 tests en `GET /games` + `GET /games/:id` + 10×10 = 100 tests dinámicos (10 juegos × 10 `it` por entrada) + 3 en `GAME_GENRES` + 2 en `dataset size` = **113 tests nuevos**.
- Previos en iteración 6: 110 verdes (10 albums + 83 albums-review + 9 products + 8 motley × test dynamic ya estaban incluidos).
- Esperado total tras esta iteración: **223 tests** (110 previos + 113 nuevos).

Si el orquestador obtiene una salida distinta debe sustituir este bloque por la salida literal y, si hay rojos, reabrirme la tarea.

## Salida literal de `tsc --noEmit`
**NO EJECUTADO.** Mismo motivo: `Bash` denegado.

Comando esperado (PowerShell desde `apps/api`):
```
cd apps/api
npx tsc --noEmit
```

Auto-revisión estática realizada:
- `Game.coverUrl: string` (no `coverImage`) consistente entre `types/game.ts`, `data/games.ts`, criterio de aceptación y tests.
- `GAMES: readonly Game[] = [...]` sin `as const` final (el `as const` original creaba propiedades readonly incompatibles con `GameQuote[]` mutable; se eliminó para alinear con `albums.ts`).
- `findGames` y `findGameById` con firmas explícitas, mismo shape que `findAlbums`/`findAlbumById`.
- `routes/games.ts` no importa nada inexistente; `gamesRoutes` exportado como `FastifyPluginAsync`.
- `app.ts` orden de imports y `register` clonado de albums; no se tocó cors, sensible, error handler ni not-found.
- Tests: `import { GAMES, GAME_GENRES } from "../src/data/games.js"` resuelve a los exports recién añadidos. `describe.each(GAMES)` con callback `(game)` se infiere `Game` (Vitest acepta `ReadonlyArray<T>`).

## Decisiones tomadas

### Sobre el intento abortado previo
Encontré tres archivos parciales del intento anterior:
- `apps/api/src/types/game.ts` (~2.4 KB): estructura casi correcta pero usaba `coverImage` en lugar de `coverUrl`. **Sobrescrito íntegramente**.
- `apps/api/src/data/games.ts` (~11.8 KB): 10 juegos completos y `findGames`/`findGameById` ya presentes, pero campo `coverImage` y `as const` final problemático. **Sobrescrito íntegramente** (preservando datos/citas porque eran objetivamente correctos según fuentes; no se inventó nada nuevo).
- `apps/api/src/routes/games.ts` (~1.3 KB): estructura correcta pero `q maxLength: 50`. **Corregido a 200** vía `Edit` quirúrgico (no era necesario sobrescribir entero porque la única desviación era una constante).
- `apps/api/src/app.ts`: NO contenía import ni register de `gamesRoutes` (no había desviación). Se añadió el import y el register.
- No existía `apps/api/tests/games.test.ts` (creado nuevo).

### GameGenre
Declarado como `export type GameGenre = string` en `types/game.ts`. Razón: declarar `GameGenre = (typeof GAME_GENRES)[number]` en `types/` exigiría que `types/game.ts` importe `data/games.ts`, lo cual crea acoplamiento inverso (data depende de types, no al revés). El frontend, si quiere un tipo estricto literal, puede definirlo en `apps/web/lib/game-types.ts` derivándolo del `GAME_GENRES` que reciba.

### Eliminación de `as const` en `GAMES`
El parcial tenía `export const GAMES: readonly Game[] = [...] as const`. Con el tipo explícito `readonly Game[]`, el `as const` adicional vuelve `quotes` un `readonly { readonly outlet, readonly year, ... }[]` que no es asignable a `GameQuote[]` mutable. `albums.ts` no usa `as const`; se hace igual.

### Géneros únicos derivados
Como en `albums.ts`, `GAME_GENRES` se calcula con `Array.from(new Set(GAMES.map(...))).sort()`. Los 10 juegos producen estos géneros (esperados, ordenados alfabéticamente): `Arcade de aventura`, `Aventura isométrica`, `Beat 'em up`, `Conducción arcade`, `Puzle de acción`, `Shoot 'em up`, `Shooter sobre raíles`, `Simulador espacial`. 8 géneros únicos.

### Listado de juegos
Los 10 juegos del PRD se mantienen literalmente. No se sustituyó ninguno. Desarrolladores/publishers verificables en CPC-Power/Wikipedia/Mobygames:
- Renegade: Imagine Software (port de Technos arcade).
- Knight Lore: Ultimate Play the Game (Stamper bros).
- Chase H.Q.: Ocean Software (port arcade Taito).
- Operation Wolf: Ocean Software (port arcade Taito).
- Head Over Heels: Ocean Software (Jon Ritman / Bernie Drummond).
- Boulder Dash: First Star Software (Liepa & Gray) / Front Runner como publisher.
- Elite: David Braben & Ian Bell / Firebird.
- La Abadía del Crimen: Opera Soft (Paco Menéndez / Juan Delcán).
- Sorcery: Virgin Games (Gang of Five).
- R-Type: Electric Dreams Software (Bob Pape, port Irem).

## Gaps rojos

### Validación no ejecutada por este agente
- `tsc --noEmit` NO ejecutado (Bash denegado). El orquestador debe correrlo antes de cerrar.
- `npm test` NO ejecutado (Bash denegado). El orquestador debe correrlo antes de cerrar.
- Sin output literal de vitest no puedo afirmar "tests pasan". Mantengo este punto **rojo** hasta que el orquestador inyecte el output.

### Citas sin URL (10 juegos × 13 quotes totales, 0 con URL)
Ninguna cita lleva campo `url` porque no he podido verificar con WebFetch enlaces canónicos https para las reviews originales de Amstrad Action, Crash, MicroHobby, Computer & Video Games. Las citas se conservan como atribución de outlet+año (lo que sí es verificable contra los archivos digitalizados en archive.org/Internet Archive), pero el campo `url` se omite a propósito conforme a la regla "no fabriques URLs". Gap rojo a documentar; **no bloquea** los tests (el schema lo permite opcional) pero sí debilita la trazabilidad. Recomiendo que un pase posterior (no en esta iteración) muestree URLs reales en archive.org para Amstrad Action / Crash / MicroHobby y las añada.

### Sin gate de seguridad ni reviewer
No es mi responsabilidad en esta iteración (T1+T2+T3 son sólo backend). El orquestador debe invocar `security-engineer` y `reviewer` después del frontend.

### Criterios de aceptación
Los marcados como pendientes en `specs/acceptance-criteria.md` bajo "Catálogo Games — Amstrad CPC (iteración 7)" para Backend:
- `apps/api/src/types/game.ts` exporta `Game`, `GameQuote`, `GameGenre`. ✅ verificable por inspección (sin tsc ejecutado, pero el código exporta los tres).
- `GAMES` 10 entradas + `GAME_GENRES` ordenado. ✅ verificable por inspección (tests cubren ambos).
- Schema id `^[A-Za-z0-9_.-]+$`, maxLength 128. ✅ idéntico a albums.
- `q maxLength 200` + `genre maxLength 50` + test 400 para genre >50. ✅ test incluido.
- 404 con shape `{statusCode, error, message}`. ✅ test incluido.
- Suite vitest backend completa verde. ❌ pendiente de ejecución del orquestador.

## Próximos pasos para el orquestador
1. Ejecutar desde `apps/api`: `npx tsc --noEmit` y `npm test`. Pegar output literal en este reporte sustituyendo los bloques marcados como NO EJECUTADO.
2. Si vitest falla, reabrirme la tarea con el output completo. Sospechas conocidas: (a) inferencia de `describe.each` sobre `readonly Game[]` — si Vitest se queja, cambiar a `describe.each(GAMES.map((g) => [g]))` y ajustar callback a `(game)`; (b) `genre` con `%C3%A9` (é) en URLs — si Fastify normaliza distinto, usar `genre=Aventura+isom%C3%A9trica` o castear.
3. Tras tsc + vitest verdes, lanzar al `frontend-engineer` para T4–T5 (página `/games`, ficha, header link, 10 portadas en `apps/web/public/covers/games/`).
4. Tras frontend, smoke MCP + security-engineer + reviewer conforme acceptance-criteria.md.
5. NO marcar checkboxes en `specs/acceptance-criteria.md` hasta tener evidencia ejecutada (regla dura 5 de CLAUDE.md).

Reporte en reports/iter-7/backend-engineer.md.
