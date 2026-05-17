# iter-10 — frontend-engineer (UI /consoles)

## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada

Checklist canónico de la skill cubierto:
- Landing inicial de la sección (`/consoles` con hero metalero).
- Listado de productos (10 consolas en grid responsive).
- Tarjetas de producto (`console-card.tsx`).
- Filtro por categoría (chips por generación 3-7).
- Búsqueda por texto (input con debounce 250ms + `AbortController`).
- Ficha de producto (`/consoles/[id]` con metadatos, descripción y biblioteca).
- Estados de carga/error (loader + `role="alert"` + empty state).
- Diseño responsive (1/2/3/4 columnas según breakpoint).
- API por entorno: nada hardcodeado, usa `resolveApiBase()`.
- Accesibilidad: `aria-label`, `aria-pressed`, `role="group"`, breadcrumb con `aria-label="Migas"`.

## Archivos creados

| Archivo | Propósito |
|---|---|
| `apps/web/lib/console-types.ts` | Mirror del tipo `Console` + `CONSOLE_GENERATIONS` (literal `[3,4,5,6,7]`). |
| `apps/web/lib/consoles-api.ts` | Cliente HTTP `fetchConsoles` + `fetchConsole` usando `resolveApiBase()`. |
| `apps/web/app/consoles/layout.tsx` | Layout con header global + grain + paleta `--metal-*`. |
| `apps/web/app/consoles/page.tsx` | Server component listado con hero CRT. |
| `apps/web/components/consoles-grid.tsx` | Client component: buscador + chips de generación. |
| `apps/web/components/console-card.tsx` | Card con `next/image`, badge "Gen N" y hover sangre. |
| `apps/web/app/consoles/[id]/page.tsx` | Server component ficha con `<dl>` de metadatos y lista de juegos icónicos. |
| `apps/web/app/consoles/[id]/not-found.tsx` | 404 con CTA "Volver a Consolas". |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `apps/web/components/iron-deck-header.tsx` | Inserción del `<Link href="/consoles">Consolas</Link>` entre "Games" y "About". Misma clase Tailwind que los demás links. Una sola inserción, sin tocar otra cosa. |

## Validación final

Comando ejecutado desde `apps/web`:

```
npx tsc --noEmit -p tsconfig.json
EXIT_CODE=0
```

Salida literal: **sin output, exit code 0**. Type-check verde en todo el árbol de la app.

## Decisiones tomadas

1. **Chips de generación con etiqueta "Gen N"**: usar sólo el número como label (`3`, `4`, ...) era ambiguo. Se renderiza como `Gen 3 / Gen 4 / Gen 5 / Gen 6 / Gen 7` para que el usuario sin contexto entienda qué representa el filtro. El `data-testid` mantiene el formato pedido por el prompt: `console-gen-chip-<n>` con `n ∈ {3,4,5,6,7}` y `console-gen-chip-todas` para "Todas".
2. **Toggle del chip**: clic en el mismo chip activo lo desactiva y vuelve a `"all"`, como pidió el prompt (mismo patrón que el chip de género en `games-grid`).
3. **Filtrado server-side**: igual que `games-grid`, el filtrado por `q` y `generation` se delega al backend vía `fetchConsoles({ q, generation })`. Mantiene una sola fuente de verdad y respeta el contrato `additionalProperties: false` del schema.
4. **`generation` se envía como string** al construir la URL (`String(options.generation)`). El backend `/consoles?generation=5` ya espera string en query y normaliza; mantengo la forma natural del query param.
5. **Layout de la ficha (`/consoles/[id]`)**: clon literal de `/games/[id]` con tres ajustes:
   - Bloque `<dl>` con FABRICANTE / AÑO / GENERACIÓN / MEDIA / UNIDADES VENDIDAS (en lugar de AÑO / DESARROLLADOR / EDITOR / GÉNERO / SISTEMA).
   - En lugar del bloque de citas de prensa (no existe en `Console`), se muestra una rejilla `<ul>` con los `iconicGames` (mismo estilo monoespaciado, viñetas en rojo sangre).
   - `unitsSoldM` formateado con `toLocaleString("es-ES")` y sufijo "M".
6. **Portadas con `next/image`**:
   - En la card: `fill` + `sizes` responsive + `object-cover`. No usa `priority` (lazy por defecto, correcto para una grid).
   - En la ficha: `fill` + `priority` (above the fold, sin lazy) + contenedor `aspect-square` para evitar layout shift. Decisión coherente con el prompt: "Portada grande (sin lazy, above the fold, `priority`)".
7. **Header**: una sola inserción de `<Link href="/consoles">Consolas</Link>` entre "Games" y "About", reutilizando exactamente la misma clase Tailwind que los demás links. No toqué el comentario doc del componente (el cambio se mantiene puramente funcional, según restricción del prompt).
8. **Metadata**:
   - `app/consoles/layout.tsx` exporta `title: "Consolas | IRON DECK"`.
   - `app/consoles/page.tsx` sobrescribe con `"Consolas — Generaciones 3 a 7"` (más descriptivo en el tab).
   - `app/consoles/[id]/page.tsx` usa `generateMetadata` con `name — year (manufacturer)` para SEO y para que el reviewer pueda comprobar la coherencia con `/games/[id]`.

## Gaps / pendientes

Ninguno bloqueante.

- **Variable `console` en server component**: usé el nombre de prop `console: c` en `ConsoleCard` (renombrado en la destructuración) y `c` en `app/consoles/[id]/page.tsx` para evitar shadowing del global `console`. tsc no se queja, pero documentado por si el reviewer prefiere otro alias.
- **No se añadieron tests E2E** (no estaban en el alcance del prompt). Los `data-testid` siguen la nomenclatura `console-search-input`, `console-gen-chip-<n>`, `console-clear-filters`, `console-card`, `data-console-id`, `data-generation` para que el `qa-engineer` los pueda enganchar sin retoques.
- **No se actualizó el comentario doc** de `iron-deck-header.tsx` (sigue mencionando "CATÁLOGO, DISCOS, CONTACTO"). El prompt pedía "Una sola inserción", así que mantuve el cambio mínimo. Si el reviewer lo señala, basta con añadir "Games / Consolas / About" al comentario.

## Cómo verificar manualmente

```powershell
# 1. Type-check (ya validado verde):
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web"
npx tsc --noEmit -p tsconfig.json

# 2. Arrancar la app (asume API en :4000):
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\apps\web"
npm run dev

# 3. Rutas a probar en navegador:
#    http://localhost:3000/consoles
#    http://localhost:3000/consoles/nes
#    http://localhost:3000/consoles/playstation-2
#    http://localhost:3000/consoles/no-existe   (debe pintar 404)
```
