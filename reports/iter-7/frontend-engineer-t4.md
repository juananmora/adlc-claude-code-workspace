# T4 — Frontend tipos y cliente HTTP (`/games`)

## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada parcialmente. La skill cubre
  el catálogo end-to-end (landing, tarjetas, filtros, ficha, estados). En
  T4 sólo se entregan los cimientos tipados del cliente HTTP que esos
  componentes consumirán en T6+. Se han respetado las reglas de la skill
  que son aplicables a este alcance: no se hardcodea ninguna URL de
  producción, la base se resuelve vía `process.env.NEXT_PUBLIC_API_BASE_URL`
  (variable de entorno), y los tipos se exportan listos para soportar
  accesibilidad/i18n en los componentes posteriores. Componentes,
  loading/error states y diseño responsive quedan fuera de T4 por diseño
  del orquestador (corresponden a T6+).

## Resumen
Se han creado los dos entregables de T4:

1. `apps/web/lib/game-types.ts`: mirror manual de `apps/api/src/types/game.ts`
   con `GameQuote`, `Game`, `GAME_GENRES` (8 géneros, `as const`) y
   `GameGenre = (typeof GAME_GENRES)[number]` (literal narrowing del lado
   frontend, justificado en comentario de cabecera).
2. `apps/web/lib/games-api.ts`: cliente HTTP con `fetchGames({ q?, genre?,
   signal? })` y `fetchGame(id)`. Reutiliza el patrón exacto de
   `albums-api.ts`/`api.ts` (variable `NEXT_PUBLIC_API_BASE_URL`, helper
   local `buildUrl` con `URLSearchParams`, `cache: "no-store"`, 404 →
   `null` en detalle, throw en >=400 en listado).

No se ha tocado `apps/api/**`, ni `album-types.ts`, ni `albums-api.ts`,
ni `app/**`, ni `components/**`.

## Archivos creados
- `apps/web/lib/game-types.ts`
- `apps/web/lib/games-api.ts`
- `reports/iter-7/frontend-engineer-t4.md` (este reporte)

## Archivos modificados
Ninguno. T4 no requiere modificar archivos preexistentes.

## Salida literal de `tsc --noEmit`
NO EJECUTADO: Bash denegado (sandbox bloqueó `npx tsc --noEmit`).

Auto-inspección estática realizada en lugar de ejecución:

- Comparados campo a campo `GameQuote` y `Game` contra
  `apps/api/src/types/game.ts`:
  - `GameQuote`: `outlet: string`, `year: number`, `quote: string`,
    `url?: string`, `author?: string` → coincide.
  - `Game`: `id, title, year, developer, publisher, genre, system,
    description, coverUrl, quotes` → coincide nombre por nombre y tipo
    por tipo. `coverUrl` (no `coverImage`), `year: number`, `quotes:
    GameQuote[]` confirmados.
- `GAME_GENRES` reproduce el orden alfabético JS default. Géneros únicos
  derivados del dataset `apps/api/src/data/games.ts`:
  Beat 'em up, Aventura isométrica, Conducción arcade, Shooter sobre
  raíles, Aventura isométrica (dup), Puzle de acción, Simulador
  espacial, Aventura isométrica (dup), Arcade de aventura, Shoot 'em up.
  Tras dedup y `sort()`:
  1. Arcade de aventura
  2. Aventura isométrica
  3. Beat 'em up
  4. Conducción arcade
  5. Puzle de acción
  6. Shoot 'em up
  7. Shooter sobre raíles
  8. Simulador espacial
  → coincide con la lista exportada en `game-types.ts`.
- `games-api.ts` sólo importa `type { Game } from "./game-types"`. El
  archivo `./game-types` existe y exporta `Game`. No hay otras
  importaciones no resueltas.

## Decisiones tomadas

- **`GameGenre` como literal en frontend, `string` en backend.**
  El backend mantiene `GameGenre = string` para evitar ciclo
  `types/` → `data/`. El frontend conoce el dataset cerrado y se
  permite estrechar a `(typeof GAME_GENRES)[number]`, lo que da
  literal narrowing en chips de filtro, validación de query params y
  exhaustividad en switches. Documentado en comentario de cabecera de
  `game-types.ts`.

- **No refactor de `buildUrl` a `lib/api.ts`.**
  `albums-api.ts` y `api.ts` ya tienen su propio `buildUrl` local
  idéntico. Levantarlo ahora obligaría a refactorizar tres archivos y
  arriesga regresiones en `/albums` y `/products`, que están fuera del
  alcance de T4. Se duplica el helper en `games-api.ts` y se documenta
  como deuda menor en comentario de cabecera para que el reviewer
  decida.

- **404 → `null` en detalle, throw en otros errores.**
  Espeja exactamente el contrato de `fetchAlbumById` (`albums-api.ts`):
  permite a la página de detalle delegar en `notFound()` de Next sin
  envolver en try/catch, mientras propaga 5xx como excepciones para los
  error boundaries.

- **Normalización de `q` antes de añadirlo a la query.**
  `q?.trim()` y se omite si queda vacío. El backend aceptaría una `q`
  vacía y devolvería el catálogo completo, pero ensucia la URL y
  complica los tests E2E con `data-q` snapshots. Coherente con el
  comportamiento implícito de `findGames` en el backend
  (`normalized = q?.trim().toLowerCase() ?? ""`).

- **No se añade el parámetro `genre` cuando vale `"all"`.**
  Reusa el sentinel que ya usan `albums-api.ts` y `api.ts` (`buildUrl`
  filtra `"all"`). El backend también trata `genre === "all"` como
  "sin filtro" en `findGames`, así que la equivalencia es exacta.

- **`Game` declarado como `interface` (no `type alias`).**
  Espeja el estilo de `apps/api/src/types/game.ts` y de
  `album-types.ts` (que también usa `interface Album`). Compatible
  estructuralmente con cualquier `type` que se quiera derivar.

## Gaps rojos

- `tsc --noEmit` no ejecutado (Bash denegado por sandbox). El
  orquestador debe ejecutarlo desde `apps/web/` antes de cerrar la
  tarea para confirmar que no hay regresión de tipos en el resto del
  proyecto.

- No hay tests unitarios para `fetchGames`/`fetchGame` en este entregable.
  El patrón existente (`albums-api.ts`) tampoco los tiene, así que se
  mantiene la misma convención. Si T7+ introduce tests de cliente HTTP
  con `msw` o similar, este archivo deberá cubrirse entonces.

## Próximos pasos para el orquestador

1. Ejecutar `npx tsc --noEmit` desde `apps/web/` para validar tipos.
   Esperado: 0 errores. Si aparecen, lo más probable es que sea código
   ajeno a T4 (no hay imports cross-package en estos dos archivos).
2. Pasar T4 a APROBADA y desbloquear T5 (descarga de portadas) y T6
   (páginas/componentes `/games` y `/games/[id]`).
3. T6 debe importar exclusivamente desde `apps/web/lib/game-types` y
   `apps/web/lib/games-api`, nunca desde `apps/api/**`.

Reporte en reports/iter-7/frontend-engineer-t4.md.
