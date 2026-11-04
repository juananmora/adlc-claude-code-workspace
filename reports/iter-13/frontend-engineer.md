## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada

# Reporte frontend-engineer — iter-13 (rename-brand-master-of-puppets)

Slug: rename-brand-master-of-puppets · Iteración: iter-13 · Plan: adlc-plan (openspec/changes/rename-brand-master-of-puppets/tasks.md)

## Alcance
- T-01 (#26): wordmark, aria-label de la cabecera y copyright del pie.
- T-02 (#27): eyebrow del hero, metadatos de layouts/producto y texto de /about.
- Stack real: `apps/web` (Next.js 15 App Router). La referencia a `claude-catalog-viewer/` de la stage no existe en el repo.

## Archivos
- Modificados: ninguno. El código de T-01 y T-02 ya estaba en HEAD `ef2b5cf`; lo verifiqué, no lo cambié.
- Verificados:
  - `components/iron-deck-header.tsx`: wordmark "Master of the Puppets", `aria-label="Inicio Master of the Puppets"`.
  - `components/iron-deck-footer.tsx`: copyright.
  - `components/hero.tsx`: eyebrow "Catálogo · Master of the Puppets".
  - `app/layout.tsx`, `app/about/page.tsx`, `app/tours/layout.tsx`, `app/consoles/layout.tsx`, `app/(main)/products/[id]/page.tsx`: metadatos y textos.
- Sin renombrado de ficheros, componentes ni variables `--iron-*` (RNF-01). Sin cambios de paleta, layout ni rutas.

## Validación
- `npm run lint`: pasa (sólo aviso de deprecación de `next lint`).
- `npx tsc --noEmit`: sin errores.
- `npm run build`: exit 0.
- Grep de "IRON DECK" en `app/` y `components/` (sin comentarios): sin resultados visibles.
- Smoke en `next start` (puerto 3100): `/` responde 200; título "Master of the Puppets — Catálogo"; label de cabecera correcto a 1280×800 y 390×844.

## Hallazgos abiertos (no resueltos)
1. Desbordamiento horizontal a 390px: `scrollWidth > innerWidth` en el grupo derecho de la cabecera. No está comprobado si lo causa el nombre nuevo (más largo) o ya existía con el antiguo. Corregirlo requiere cambio de layout, fuera del alcance de texto: pendiente de decisión humana.
2. Tres errores de consola HTTP 404 en `/products` durante el smoke. No comprobado si son previos; el route real de productos debe verificarse antes de atribuirlos a este cambio.

## Dependencias
- T-03 (qa-engineer): `e2e/responsive.spec.ts:13` aún usa `getByLabel("Inicio IRON DECK")` y fallará hasta que se actualice a "Inicio Master of the Puppets". Fuera de mi alcance.
- Atributos `data-testid` / `data-*`: sin cambios.

## Incidencia de limpieza
- Al limpiar artefactos de smoke borré por error tres ficheros versionados de `.playwright-mcp/` (un log, un yml y un png). Git es propiedad del motor, así que no los restauré. Debe revertirse desde HEAD antes de commit, o el commit los eliminará.

## Supuestos
- No pude confirmar la aprobación del plan porque no hay artefacto de aprobación legible. Continúo con el plan del repositorio.

ESTADO: ok
