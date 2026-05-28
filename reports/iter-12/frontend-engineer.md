# Frontend Engineer — iter-12 (TOURS)

## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada

## Resumen

Portal IRON DECK para el área `/tours` implementado siguiendo línea a línea
el patrón canónico de `/consoles` (cambiando `consoles → tours`,
`generation → decade`). El backend de tours (`apps/api/src/routes/tours.ts`)
ya estaba listo; el frontend ahora consume `GET /tours` y `GET /tours/:id`,
expone listado, ficha y `not-found`, y añade el enlace de navegación al
header global.

## Archivos creados

- `apps/web/lib/tour-types.ts` — Mirror manual de `apps/api/src/types/tour.ts`.
  Exporta `Tour`, `TourDecade` y la constante `TOUR_DECADES = [1980, 1990, 2000] as const`.
- `apps/web/lib/tours-api.ts` — Cliente HTTP que usa `resolveApiBase()`
  desde `./api` y `encodeURIComponent(id)` en el path param de la ficha.
  `cache: "no-store"`, soporta `AbortController` y normaliza `q` trimmed.
- `apps/web/app/tours/layout.tsx` — Layout específico con `IronDeckHeader`
  + `IronDeckFooter`, grain SVG y CSS vars `--metal-*` re-declaradas inline
  (mismo patrón que `consoles/layout.tsx`).
- `apps/web/app/tours/page.tsx` — Server component con `dynamic = "force-dynamic"`.
  Hero: etiqueta "Catálogo · Giras", título "TOURS" y subtítulo "1980 — 2010".
  Fallback `[]` si la API no responde (el grid reintenta en cliente).
- `apps/web/app/tours/[id]/page.tsx` — Ficha server-side con `<dl>` de 5
  metadatos: `Banda`, `Año`, `Década`, `Álbum promocionado`, `Fechas`.
  Sección `aria-labelledby="countries-title"` con `<ul>` de `t.countries`
  (paralelo a "Juegos icónicos" de consolas).
- `apps/web/app/tours/[id]/not-found.tsx` — H1 "Tour no encontrado" con link
  "Volver a Tours" → `/tours`.
- `apps/web/components/tour-card.tsx` — Card con atributos OBLIGATORIOS:
  `data-testid="tour-card"`, `data-tour-id={t.id}`, `data-decade={t.decade}`.
  Cinta superior izquierda con `${String(t.decade).slice(2)}s` → "80s",
  "90s", "00s". Link `aria-label={\`Ver detalle de ${t.name}\`}` con href
  `/tours/${encodeURIComponent(t.id)}`.
- `apps/web/components/tours-grid.tsx` — Client component con buscador
  (debounce 250ms + AbortController) y chips de década exclusivos. Click
  sobre chip activado → vuelve a `"all"`.
- `apps/web/public/covers/tours/*.jpg` — 10 placeholders JPG mínimos (286B
  cada uno) generados con el script `scripts/create-tour-covers.ps1`.
- `scripts/create-tour-covers.ps1` — Script auxiliar para regenerar los
  placeholders si se purga el directorio.

## Archivos modificados

- `apps/web/components/iron-deck-header.tsx` — Añadido `<Link href="/tours">Tours</Link>`
  entre el de "Consolas" y el de "About", con las mismas clases que los otros
  nav links.
- `apps/web/lib/credits.ts` — Ampliado `kind` a `"album" | "game" | "tour"`
  y añadidas 10 entradas (una por cada id del dataset). Notas indican que
  los carteles son placeholders iter-12; las fuentes apuntan a las entradas
  canónicas de Wikipedia de cada gira. El `app/about/page.tsx` filtra por
  `kind === "album"` y `kind === "game"`, así que los nuevos tours no
  alteran el render de la página About ni rompen el test e2e existente
  (`apps/web/e2e/about.spec.ts`).

## data-testid expuestos

- `tour-card` (en `tour-card.tsx`)
- `tour-search-input` (input del grid)
- `tour-decade-chip-todas`, `tour-decade-chip-1980`, `tour-decade-chip-1990`,
  `tour-decade-chip-2000` (con `aria-pressed` reflejando el estado activo)
- `tour-clear-filters` (botón visible solo cuando hay filtros activos)

Atributos adicionales en la card para queries de Playwright:
- `data-tour-id="<id>"`
- `data-decade="<1980|1990|2000>"`

## Confirmaciones

- `resolveApiBase()`: importado desde `./api` y usado en `buildUrl()` dentro
  de `tours-api.ts` (líneas 19-22). Cubre SSR en Docker (DEC-005) y CSR.
- `encodeURIComponent()`: aplicado en `tours-api.ts:60` (ficha) y en
  `tour-card.tsx:33` (href del `<Link>`).
- Debounce 250ms: `tours-grid.tsx:59-76`.
- `aria-pressed` correcto en chips: `tours-grid.tsx:165, 175`.
- Click sobre chip activado → vuelve a "todas": `setDecade(decade === d ? "all" : d)`.

## Validación ejecutada

### `npx tsc --noEmit -p tsconfig.json`
Sin output (exit 0) → 0 errores de tipos.

### `npm run lint`
```
> web@0.1.0 lint
> next lint

`next lint` is deprecated and will be removed in Next.js 16.
[...]
✔ No ESLint warnings or errors
```

### `npm run build`
```
> web@0.1.0 build
> next build

   ▲ Next.js 15.5.18
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 7.0s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/5) ...
 ✓ Generating static pages (5/5)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ƒ /                                       5 kB         158 kB
├ ○ /_not-found                            989 B         103 kB
├ ƒ /about                                 127 B         103 kB
├ ƒ /albums                              4.42 kB         145 kB
├ ƒ /albums/[id]                           176 B         106 kB
├ ○ /cart                                3.13 kB         128 kB
├ ƒ /consoles                            3.87 kB         115 kB
├ ƒ /consoles/[id]                         176 B         111 kB
├ ƒ /games                               3.65 kB         109 kB
├ ƒ /games/[id]                            176 B         106 kB
├ ○ /icon.svg                                0 B            0 B
├ ƒ /products/[id]                       1.79 kB         127 kB
├ ƒ /tours                               3.89 kB         115 kB
└ ƒ /tours/[id]                            176 B         111 kB
+ First Load JS shared by all             102 kB
```

Las rutas `/tours` (3.89 kB) y `/tours/[id]` (176 B) están registradas como
server-rendered on demand (`ƒ`), tal como `/consoles` y `/games`.

## Notas

- Los carteles JPG son placeholders mínimos (286 bytes cada uno). Producen
  imagen renderizable sin warnings de Next/Image, pero un humano puede
  reemplazarlos por carteles editoriales reales en una iteración futura.
- El test e2e `about.spec.ts` sigue pasando: `data-kind` mantiene los
  valores `album | game` en el DOM porque `app/about/page.tsx` solo
  renderiza esas dos categorías. Las entradas de tour en `CREDITS` están
  disponibles para futuras secciones que las consuman.
