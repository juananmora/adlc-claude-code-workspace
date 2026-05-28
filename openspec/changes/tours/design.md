# Design — iter-12 `/tours`

## Modelo de datos

```ts
// apps/api/src/types/tour.ts
export interface Tour {
  /** Slug kebab-case ascii (^[a-z0-9]+(-[a-z0-9]+)*$). */
  id: string;
  /** Nombre comercial de la gira (p.ej. "World Slavery Tour"). */
  name: string;
  /** Banda principal (p.ej. "Iron Maiden"). */
  band: string;
  /** Año de inicio (1980..2010 en este catálogo). */
  year: number;
  /** Década normalizada (1980 | 1990 | 2000). */
  decade: 1980 | 1990 | 2000;
  /** Álbum que promocionó la gira. */
  albumPromoted: string;
  /** Número de fechas confirmadas (lifetime de la gira). */
  showsCount: number;
  /** Países visitados (>=3, derivados de fuentes públicas). */
  countries: string[];
  /** Descripción larga >=200 chars con contexto histórico. */
  description: string;
  /** Ruta de la portada en /covers/tours/<id>.jpg */
  coverUrl: string;
}
```

## 10 giras canónicas (decisión editorial)

| id | name | band | year | decade | album |
|---|---|---|---|---|---|
| `world-slavery-tour` | World Slavery Tour | Iron Maiden | 1984 | 1980 | Powerslave |
| `monsters-of-rock-86` | Monsters of Rock 1986 | Van Halen / Scorpions / Ozzy | 1986 | 1980 | (festival) |
| `damaged-justice-tour` | Damaged Justice Tour | Metallica | 1988 | 1980 | ...And Justice for All |
| `clash-of-the-titans` | Clash of the Titans | Slayer / Megadeth / Anthrax | 1990 | 1990 | Seasons in the Abyss |
| `cowboys-from-hell-tour` | Cowboys From Hell Tour | Pantera | 1990 | 1990 | Cowboys From Hell |
| `use-your-illusion-tour` | Use Your Illusion Tour | Guns N' Roses | 1991 | 1990 | Use Your Illusion I & II |
| `black-album-tour` | Wherever I May Roam | Metallica | 1991 | 1990 | Metallica (Black Album) |
| `ozzfest-1996` | Ozzfest 1996 | Ozzy Osbourne (festival) | 1996 | 1990 | (festival) |
| `iowa-world-tour` | Iowa World Tour | Slipknot | 2001 | 2000 | Iowa |
| `judas-priest-redeemer` | Redeemer of Souls World Tour | Judas Priest | 2008 | 2000 | Nostradamus |

> Selección editorial: prioriza giras con identidad propia (no greatest-hits anónimos) y diversidad de subgénero/década. Los festivales (Monsters, Ozzfest) llevan `band` con la cabeza de cartel + sufijo "(festival)" para evitar romper el filtro de banda.

## Endpoints API

### `GET /tours`

Querystring:
- `q?: string` (substring case-insensitive sobre `name`, maxLength 200).
- `decade?: "1980" | "1990" | "2000"` (maxLength 4).
- `band?: string` (igualdad estricta sobre `band`, maxLength 80).

Respuesta: `200 OK` con `Tour[]` (ordenado por `year` ASC).

### `GET /tours/:id`

Path param `id` validado por `pattern: "^[A-Za-z0-9_.-]+$"`, maxLength 128.

- `200 OK` con `Tour` si existe.
- `404 Not Found` con `{ statusCode: 404, error: "Not Found", message: "Tour '<id>' no encontrado" }`.
- `400 Bad Request` si el `id` no cumple el pattern (manejado por Fastify automáticamente).

## Estructura de archivos

```
apps/api/
├─ src/
│  ├─ types/tour.ts
│  ├─ data/tours.ts
│  ├─ routes/tours.ts
│  └─ app.ts                 # registrar toursRoutes
└─ tests/tours.test.ts

apps/web/
├─ lib/
│  ├─ tour-types.ts
│  └─ tours-api.ts           # con resolveApiBase + encodeURIComponent
├─ app/
│  └─ tours/
│     ├─ layout.tsx
│     ├─ page.tsx            # server component, SSR con fallback []
│     └─ [id]/
│        ├─ page.tsx         # server component, notFound() si null
│        └─ not-found.tsx
├─ components/
│  ├─ tour-card.tsx          # data-testid="tour-card", data-tour-id, data-decade
│  ├─ tours-grid.tsx         # "use client", buscador + chips por década
│  └─ iron-deck-header.tsx   # añadir link "Tours" entre "Consolas" y "About"
├─ public/covers/tours/      # 10 jpg, fair use, formato 800x800 aprox
└─ e2e/tours.spec.ts

apps/web/lib/credits.ts      # añadir 10 entradas con author/publisher/year/url
```

## Línea gráfica

- Hero `/tours`: misma estructura que `/consoles` — etiqueta `Catálogo · Giras`, h1 grande "TOURS" + subtítulo "1980 — 2010", separador `--metal-blood`, scanlines CRT al 7%, resplandor radial.
- Cards: cinta superior izquierda con `data-decade` en formato "80s" / "90s" / "00s" (paralelo a `Gen N` de consolas).
- Ficha: `<dl>` con 5 `<dt>`: **BANDA**, **AÑO**, **DÉCADA**, **ÁLBUM PROMOCIONADO**, **FECHAS**. Luego sección "Países visitados" con `<ul>` (paralelo a "Juegos icónicos" de consolas).

## SSR + Docker

`apps/web/lib/tours-api.ts` importa y usa `resolveApiBase()` desde el primer minuto. Las fichas son server components con `dynamic = "force-dynamic"`, `generateMetadata`, `notFound()`.

## Decisiones

| Decisión | Rationale | Alternativa descartada |
|---|---|---|
| `decade` como número (1980/1990/2000) en data, string "1980" en querystring | Permite chips deterministas y ordering por década. Querystring siempre string en Fastify. | Strings "80s"/"90s" — confunde la coerción. |
| 3 chips de década (no >3) | El catálogo cubre 1984-2008 → solo 3 décadas. Mantiene la UI limpia. | Chip por año — demasiado granular. |
| Festivales con sufijo "(festival)" | Mantiene un único campo `band` sin romper el filtro. | Campo opcional `isFestival` — añade complejidad sin beneficio visible. |
| Ordering por `year` ASC en la API | Coherente con la línea editorial cronológica. | Por nombre alfabético — pierde la narrativa. |
| 5 `<dt>` en la ficha (no 6) | `countries` se renderiza en su propia sección, no como dt único. | Meter countries como dt — string largo, rompe la grid. |
