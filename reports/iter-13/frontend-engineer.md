## Skills ejecutadas
- Skill(skill: "create-catalog-ui") → aplicada

## Resumen
Rebranding de texto visible en apps/web: IRON DECK → MASTER OF THE PUPPETS (T-01, sub-issue #47). Sin cambios en paleta, rutas, nombres de fichero, tokens CSS ni apps/api.

## Archivos modificados
- apps/web/components/iron-deck-header.tsx (aria-label y wordmark)
- apps/web/components/iron-deck-footer.tsx (wordmark y copyright)
- apps/web/components/hero.tsx (etiqueta)
- apps/web/app/layout.tsx (title/description)
- apps/web/app/consoles/layout.tsx, apps/web/app/tours/layout.tsx (titles)
- apps/web/app/(main)/products/[id]/page.tsx (title template)
- apps/web/app/about/page.tsx (title, description, eyebrow, H1, párrafo)
- apps/web/e2e/responsive.spec.ts, apps/web/e2e/about.spec.ts, apps/web/e2e/home.spec.ts (selectores; T-02 es de qa-engineer)

## Validación
- `npx tsc --noEmit -p tsconfig.json` → exit 0 (tras `npm install` en apps/web)
- `npm run lint` → "No ESLint warnings or errors", exit 0
- `grep "IRON DECK"` en código de app (.ts/.tsx, sin comentarios) → sin coincidencias. Quedan coincidencias solo en comentarios, palette de globals.css y lib/credits.ts.
- No ejecutado: `npm run build` (disco de 1 GB), Playwright E2E y Docker (T-02 / qa-engineer).

## Data-testid expuestos
Sin cambios. Se mantienen los existentes (`*-card`, `*-search-input`, `*-chip-*`).

## Avisos
AVISO: `claude-catalog-viewer/` (citado en la stage y en CLAUDE.md) no existe; se usa `apps/web` según proposal S-01.
AVISO: el artefacto `adlc-plan` no se pudo recuperar por id; se usaron openspec/changes/master-of-the-puppets-rebrand/ y specs/master-of-the-puppets-rebrand-prd.md.
Supuesto S-02 (PRD): aria-label "Inicio MASTER OF THE PUPPETS" pendiente de confirmación humana.
