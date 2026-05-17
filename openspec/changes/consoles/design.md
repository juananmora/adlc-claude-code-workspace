# Design — Consoles section

## 1. Tipo `Console`

`apps/api/src/types/console.ts`:

```ts
export interface Console {
  id: string;            // slug kebab-case (p.ej. "nintendo-64")
  name: string;          // "Nintendo 64"
  manufacturer: string;  // "Nintendo" / "Sony" / "Sega" / "Microsoft"
  year: number;          // año de lanzamiento original (Japón si difiere)
  generation: number;    // 3, 4, 5, 6, 7
  description: string;   // >=200 chars con contexto histórico
  unitsSoldM: number;    // millones de unidades (redondeado, fuente Wikipedia)
  iconicGames: string[]; // 3-5 títulos representativos
  media: string;         // "Cartucho" / "CD" / "DVD" / "Disco propietario" / "Cartucho + Game Pak"
  coverUrl: string;      // "/covers/consoles/<id>.jpg"
}

export type ConsoleManufacturer = (typeof CONSOLE_MANUFACTURERS)[number];
```

## 2. Dataset

`apps/api/src/data/consoles.ts` con 10 entradas + helpers:

```ts
export const CONSOLES: readonly Console[] = [ ... ];

export const CONSOLE_MANUFACTURERS = Array.from(
  new Set(CONSOLES.map(c => c.manufacturer))
).sort();

export const CONSOLE_GENERATIONS = Array.from(
  new Set(CONSOLES.map(c => c.generation))
).sort((a, b) => a - b);

export function findConsoles(opts: { q?: string; manufacturer?: string; generation?: string }): Console[]
export function findConsoleById(id: string): Console | undefined
```

## 3. Rutas

`apps/api/src/routes/consoles.ts` con mismo patrón que `routes/games.ts`:

- `GET /consoles` con querystring `{ q?: maxLength 200, manufacturer?: maxLength 50, generation?: maxLength 3 }`, `additionalProperties: false`.
- `GET /consoles/:id` con params `{ id: pattern "^[A-Za-z0-9_.-]+$", minLength 1, maxLength 128 }`, 404 con shape estándar.
- Registrar en `app.ts` junto a `gamesRoutes` y `albumsRoutes`.

## 4. Frontend

```
apps/web/
├── lib/
│   ├── console-types.ts            (nuevo, mirror tipos + CONSOLE_GENERATIONS as const)
│   └── consoles-api.ts             (nuevo, usa resolveApiBase())
├── app/consoles/
│   ├── layout.tsx                  (nuevo, IronDeckHeader + footer, grano, vars metaleras)
│   ├── page.tsx                    (server component, SSR fetchConsoles)
│   └── [id]/
│       ├── page.tsx                (server component, fetchConsole + notFound)
│       └── not-found.tsx
└── components/
    ├── consoles-grid.tsx           (client, buscador + chips de generación)
    └── console-card.tsx            (client/server, card con cover + meta)
```

Reuso de patrón visual de games: `border-2` cards, paleta metalera, mayúsculas tracking. Chips de generación numérica (3ª, 4ª, 5ª, 6ª, 7ª).

## 5. Header

Insertar `<Link href="/consoles">Consolas</Link>` en `iron-deck-header.tsx` entre "Games" y "About". Una sola inserción.

## 6. Tests vitest

`apps/api/tests/consoles.test.ts` con `describe.each` dinámico sobre `CONSOLES`:
- length === 10.
- Cada item: id kebab-case, year en [1970, 2010], generation en [3, 7], description >=200 chars, unitsSoldM > 0, iconicGames.length >=3, coverUrl prefijo `/covers/consoles/`.
- Tests de routes: GET sin filtro = 10, filtro `?manufacturer=Nintendo` devuelve 4 (NES, Game Boy, SNES, N64, Wii=5 en realidad), filtro `?generation=6` devuelve 3 (Dreamcast, PS2, Xbox).
- GET /consoles/:id existente → 200; inexistente → 404.

## 7. Tests E2E

`apps/web/e2e/consoles.spec.ts`:
- Link "Consolas" en header navega a /consoles, muestra 10 cards.
- Buscador "Nintendo" filtra.
- Chip generación "5" deja PlayStation + N64.
- Ficha /consoles/nintendo-64 muestra h1, manufacturer, year, iconic games.
- 404 en id inexistente.

Ejecutados contra Docker (no contra host).

## 8. Layout y estilo

Layout `app/consoles/layout.tsx` igual que `app/games/layout.tsx`: `IronDeckHeader` + grano SVG + `IronDeckFooter`, CSS vars metaleras inline.

## 9. Verificación REQ-CONSOLES contra DEC-005

- Cliente HTTP usa `resolveApiBase()` desde el primer momento.
- Compose: `API_BASE_URL_INTERNAL=http://api:4000` ya está en `web` (iter-9). Nada nuevo en compose.
- qa-engineer obligatorio.
- Smoke MCP en listado + 2 fichas distintas.
