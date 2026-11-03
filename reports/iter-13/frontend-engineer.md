## Skills ejecutadas
- Skill(skill: "aidlc--create-catalog-ui") → aplicada (sin rutas, componentes ni `data-*` nuevos; se mantienen `resolveApiBase()`, la paleta IRON-tipo y los atributos E2E; solo cambia texto visible)

# Frontend — renombrar la marca a MASTER OF THE DECK

Intent: Cambio titulo (issue #17). Sub-issue T-01 (#18). Stack real: `apps/web` (Next.js 15 App Router). La ruta `claude-catalog-viewer/` que cita la stage no existe; se usa `apps/web`.

## Decisiones humanas (G2)
- Casing: `MASTER OF THE DECK` en mayúsculas en todas las superficies.
- Alcance: incluye el footer.

## Archivos modificados (solo texto visible, metadatos y aria-label)
- `apps/web/app/layout.tsx`: `<title>` y `description`.
- `apps/web/app/about/page.tsx`: metadata, eyebrow "About MASTER OF THE DECK", h1 y `<strong>`.
- `apps/web/app/(main)/products/[id]/page.tsx`: plantilla de título.
- `apps/web/app/tours/layout.tsx`, `apps/web/app/consoles/layout.tsx`: título.
- `apps/web/components/hero.tsx`: etiqueta "Catálogo · MASTER OF THE DECK".
- `apps/web/components/iron-deck-header.tsx`: aria-label y wordmark (M en rojo + "ASTER OF THE DECK" en hueso, con `&nbsp;`).
- `apps/web/components/iron-deck-footer.tsx`: wordmark y copyright.

No cambian identificadores, nombres de fichero, clases CSS, paleta ni tipografía. Los comentarios con "IRON DECK" se dejan.

## Validación
- `npm run lint` (apps/web): "No ESLint warnings or errors".
- `npx tsc --noEmit` (apps/web): exit 0.
- Búsqueda de la marca antigua en `apps/web/app`, `components`, `lib`: solo comentarios.
- No verificado: render visual del header con el wordmark más largo en móvil (sin captura en navegador) y la suite Playwright (fuera de mi paso).

## data-testid
Sin cambios en `data-testid`, `data-*` ni `aria-*` salvo el `aria-label` del header.

## Impacto para QA (T-02, #19)
- `e2e/about.spec.ts:25` espera `/About IRON DECK/i`: fallará hasta actualizarlo.
- `e2e/responsive.spec.ts:12-13` espera "Inicio IRON DECK": fallará hasta actualizarlo.
- `e2e/home.spec.ts:19` es solo un comentario.

## Avisos
- AVISO: `claude-catalog-viewer/` no existe; el cambio se aplica a `apps/web`.
- Se ejecutó `npm install` en `apps/web` para lint y tsc.

ESTADO: ok
