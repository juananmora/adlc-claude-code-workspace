## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada

La skill cubre el corazón de esta iteración (landing/listado, tarjetas,
búsqueda, filtros, ficha de producto, estados de carga/error/vacío y
diseño responsive). Todos los puntos del checklist canónico se han
aplicado:

| Punto skill | Cómo se cumple en T6-T8 |
| --- | --- |
| landing inicial | hero retro en `app/games/page.tsx` con `<h1>` `GAMES — AMSTRAD CPC 464/6128`, scanlines sutiles, subtítulo monoespaciado |
| listado de productos | `<GamesGrid>` cliente que renderiza 10 cards (o las que filtre la API) |
| tarjetas de producto | `components/game-card.tsx` con portada, cinta de género, título y año |
| filtro por categoría | fila de chips de género con `aria-pressed`, exclusivos clic a clic |
| búsqueda por texto | input nativo `data-testid="game-search-input"` con debounce 250ms + AbortController |
| ficha de producto | `app/games/[id]/page.tsx` con `<dl>` de metadatos, descripción y bloque de citas (`<figure>`/`<blockquote>`/`<cite>`) |
| estados de carga/error | spinner Lucide `Loader2` durante loading; div `role="alert"` rojo en error; vacío "Sin coincidencias" |
| diseño responsive | grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; ficha `md:grid-cols-[1.05fr_1fr]`; controles `flex-col md:flex-row` |
| No hardcodear URLs prod | API base se lee de `process.env.NEXT_PUBLIC_API_BASE_URL` (en `lib/games-api.ts`, ya entregado en T4) |
| Variables de entorno para API | misma vía, sin literales hardcodeados |
| Accesibilidad básica | `<h1>` único por página, `aria-label` en search/region/breadcrumb/chip-group, `aria-pressed` en chips, `<cite>` dentro de `<figcaption>`, `<a target="_blank">` siempre con `rel="noopener noreferrer"` |
| Tests si el stack lo permite | tests E2E Playwright los entrega T9 (qa-engineer) según orquestación; no se añaden aquí para no invadir su scope |

## Resumen

Implementadas las tareas T6, T7 y T8 de la iteración 7:

- **T6** — Página listado `/games` con hero retro 8-bit (paleta metalera
  mantenida + scanlines sutiles + tipografía monoespaciada selectiva) y
  grid de juegos con buscador, chips de género y "Limpiar filtros".
- **T7** — Ficha `/games/[id]` con breadcrumb, layout dos columnas
  (portada grande + metadatos en `<dl>` monoespaciado), descripción y
  bloque de quotes con cite + enlaces seguros opcionales. `not-found.tsx`
  espeja al de álbumes.
- **T8** — Entrada "Games" insertada en `iron-deck-header.tsx` entre
  "Discos" y "Contacto" (un solo `<Link>` nuevo, sin tocar nada más).

No se han añadido dependencias, no se ha tocado el backend, ni
`apps/web/lib/games-api.ts`, ni `game-types.ts`, ni los datos del
catálogo, ni las portadas.

## Archivos creados

- `apps/web/app/games/page.tsx`
- `apps/web/app/games/[id]/page.tsx`
- `apps/web/app/games/[id]/not-found.tsx`
- `apps/web/components/games-grid.tsx`
- `apps/web/components/game-card.tsx`

## Archivos modificados

- `apps/web/components/iron-deck-header.tsx` — insertado un solo `<Link
  href="/games">Games</Link>` entre Discos y Contacto. Sin tocar logo,
  search button, cart slot, header sticky ni classes wrapper.

## Salida literal de `tsc --noEmit`

NO EJECUTADO: Bash denegado en este entorno. El orquestador deberá
ejecutar desde `apps/web`:

```
npx tsc --noEmit
```

He revisado manualmente los tipos clave:

- `fetchGames(...)` y `fetchGame(id)` ya existen en `lib/games-api.ts`
  con la firma esperada.
- `GAME_GENRES` (`as const`) y `GameGenre` se importan desde
  `lib/game-types.ts`.
- `genre` se tipa como `GameGenre | "all"`; al llamar a `fetchGames` se
  pasa `genre === "all" ? undefined : genre` para que el cliente no
  envíe `genre=all` (`buildUrl` ya lo excluiría de todos modos, pero
  prefiero ser explícito y mantener `genre: string | undefined` en la
  signatura de `fetchGames`).
- En la ficha, `params` es `Promise<{ id: string }>` (patrón Next 15
  espejado de `app/albums/[id]/page.tsx`).
- En GameCard se usa `<img>` con
  `eslint-disable-next-line @next/next/no-img-element` igual que en
  album-card.

## Decisiones tomadas

1. **Estética retro 8-bit aplicada con moderación.**
   - Hero: `<h1>` partido en dos `<span>` — `GAMES` enorme arriba y
     `AMSTRAD CPC 464/6128` debajo en menor tamaño con
     `[font-family:ui-monospace,...]`. El criterio de aceptación pide
     que el texto literal "AMSTRAD CPC 464/6128" esté en H1; al ponerlo
     dentro de un `<span>` del mismo `<h1>` cumple la regla sin
     introducir un h1 duplicado.
   - Scanlines: `repeating-linear-gradient(0deg, ..., 1px, transparent
     1px, transparent 3px)` con opacidad `0.07`. Sólo en el hero, no
     globales (no quería entorpecer la lectura de la grid).
   - Fuente monoespaciada selectiva: labels uppercase del hero, contador
     de resultados, label "Género", input search (en el bloque
     `<dl>` de metadatos de la ficha completa), breadcrumb, año en la
     tarjeta. Los párrafos largos (descripción, quote text) siguen en
     `[font-family:Inter,system-ui,sans-serif]` para legibilidad.
   - `border-2` en card wrappers (game-card, portada de ficha y wrapper
     del input) para evocar pixelado, en lugar del `border` simple de
     albums.

2. **Copy del hero honesto.**
   - `Catálogo · 8-bit`
   - `GAMES` + `AMSTRAD CPC 464/6128`
   - `10 clásicos icónicos · 1984-1995`
   - Párrafo descriptivo: menciona Ultimate, Ocean/Imagine y Opera Soft
     como hitos verificables, sin inventar rankings.

3. **Implementación de `slug()`.**
   Hecha en `games-grid.tsx` con `normalize("NFD") + regex
   diacrítica + filtrado `[^a-z0-9\s-]` + colapso de espacios a `-`. Esto
   produce exactamente los 8 valores enumerados en el brief
   (`beat-em-up`, `aventura-isometrica`, `shooter-sobre-railes`, etc.).

   El chip "Todos" recibe `data-testid="game-genre-chip-todos"` literal
   (no se pasa por la función `slug` para que el testid sea estable).

4. **Manejo de params async en Next 15.**
   `params: Promise<{ id: string }>` con `const { id } = await params;`
   tanto en `generateMetadata` como en el componente. Esto espeja
   literalmente `app/albums/[id]/page.tsx`, que ya está en este patrón
   (líneas 8-13 y 36-37). No invento un patrón distinto.

5. **`fetchGames`: filtrado de `genre === "all"`.**
   En el `useEffect` de `GamesGrid` paso `genre: genre === "all" ?
   undefined : genre`. Aunque `buildUrl` en `games-api.ts` ya excluiría
   `"all"` por su check `if (value && value !== "all")`, prefiero ser
   explícito en el call-site para que el tipo en la lib sea `string |
   undefined` puro y el filtro server-side reciba siempre un género
   válido o nada.

6. **Ficha sin review larga.**
   No copio la estructura de tres secciones + highlights + rating de
   `/albums/[id]`. `Game` no tiene esos campos. La ficha tiene:
   breadcrumb, layout 2 columnas con portada + metadatos `<dl>` +
   descripción, y una sección separada `Prensa de la época` con grid
   de figuras. Defensa para `quotes.length === 0` aunque la suite
   dinámica de backend garantiza ≥1.

7. **Imagen de la ficha sin `loading="lazy"`.**
   La portada es la imagen principal de la página (above the fold),
   por lo que no la marco como lazy. En la card del listado sí.

8. **Edit en el header mínimo.**
   Un solo `<Link href="/games">` añadido entre el de Discos y el de
   Contacto, con las mismas classes que el resto de entradas para
   mantener consistencia visual. No toco logo, search button, cart
   slot ni wrappers.

9. **No instalé `next/image` ni cambié el patrón existente.**
   Mantengo `<img>` + eslint-disable como hacen `album-card.tsx` y
   `app/albums/[id]/page.tsx`. La criticidad de la consistencia visual
   y de evitar configuración de loader pesa más que el lint warning.

## Gaps rojos

- **`tsc --noEmit` no ejecutado** (Bash denegado). El orquestador debe
  correrlo desde `apps/web` y confirmar 0 errores.
- **Tests E2E no añadidos** en esta sesión. Es responsabilidad de T9
  (qa-engineer) según orquestación. Los `data-testid` y `aria-label`
  exigidos están todos colocados.
- **Smoke MCP no ejecutado** (no debe ejecutarlo este agente según
  brief). El orquestador en Fase 9 navegará a `/games`, `/games/<id>` y
  `/games/unknown-id` con Chrome DevTools MCP.
- **Validación visual del scanlines en /games** pendiente: la opacidad
  `0.07` la elegí sin smoke. Si en la captura el efecto se ve
  exagerado o ilegible, ajustar a `0.05`/`0.04` es trivial; si no se
  ve nada, subir a `0.10`.

## Próximos pasos para el orquestador

1. Ejecutar `npx tsc --noEmit` desde `apps/web`. Salida esperada: vacía
   (0 errores).
2. Pasar el testigo a T9 (qa-engineer) para añadir
   `apps/web/e2e/games.spec.ts` con los casos:
   - entrada Games en header → `/games`,
   - 10 cards visibles,
   - buscador filtra por título (debounce 250ms),
   - chip de género exclusivo + deselección,
   - "Limpiar filtros" resetea ambos,
   - ficha muestra metadatos + ≥1 quote con cite,
   - quote URL (cuando exista) abre con `target="_blank"
     rel="noopener noreferrer"`,
   - `/games/unknown-id` muestra el not-found.
3. Fase 9 (smoke MCP): capturar `reports/iter-7/smoke-games-list.png` y
   `reports/iter-7/smoke-game-detail.png`. Confirmar 0 errores
   consola/network y 10 portadas con 200/304.
4. Revisar la opacidad del scanlines del hero. Si distrae, bajar a
   `opacity-[0.05]` en `app/games/page.tsx`.

Reporte en reports/iter-7/frontend-engineer-t6-t8.md.
