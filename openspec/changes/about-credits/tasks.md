# Tasks — `about-credits`

## Phase 1 — Dataset

- [ ] 1.1 Crear `apps/web/lib/credits.ts` con interface `CreditEntry` y array `CREDITS: readonly CreditEntry[]`.
- [ ] 1.2 Rellenar las 22 entradas de álbumes (id, title, kind="album", author=band, publisher, year, sourceUrl, note?). Reusar los `id` y `coverUrl` ya existentes en `apps/api/src/data/albums.ts` como fuente de verdad.
- [ ] 1.3 Rellenar las 10 entradas de juegos (id, title, kind="game", author=developer, publisher, year, sourceUrl, note?). Reusar `apps/api/src/data/games.ts`.
- [ ] 1.4 Verificar con un test unitario simple (opcional) que `CREDITS.length === 32` y todas las URLs son `https://`.

## Phase 2 — Página /about

- [ ] 2.1 Crear `apps/web/app/about/page.tsx` server component con `metadata` y `export const dynamic = "force-dynamic"` (consistente con `/albums` y `/games`).
- [ ] 2.2 Hero con `<h1>About IRON DECK</h1>` + tagline.
- [ ] 2.3 Sección "Sobre este proyecto" con 2-3 párrafos en `<p>`.
- [ ] 2.4 Sección "Créditos de portadas" con `<table>` o grid `<article>` por credit-entry. Cada entry expone `data-testid="credit-entry"`, `data-id`, `data-kind`.
- [ ] 2.5 Cada entry incluye `<a href={sourceUrl} target="_blank" rel="noopener noreferrer">` para la fuente.
- [ ] 2.6 Sección "Stack" con bullets (Next.js 15, React 19, Tailwind 3.4, Fastify 5, TypeScript 5.6, Vitest 4, Playwright 1.60).
- [ ] 2.7 Sección "Agradecimientos" mencionando gentle-ai como inspiración del modelo openspec.
- [ ] 2.8 Estilo coherente con paleta metalera. No introducir nuevos colores ni assets.

## Phase 3 — Header

- [ ] 3.1 Editar `apps/web/components/iron-deck-header.tsx`. Añadir UN `<Link href="/about">About</Link>` entre "Games" y "Contacto".
- [ ] 3.2 No tocar nada más del archivo.

## Phase 4 — Tests E2E

- [ ] 4.1 Crear `apps/web/e2e/about.spec.ts` con casos:
  - 4.1.a "entrada 'About' en el header navega a /about y muestra h1".
  - 4.1.b "/about muestra >=32 credit-entry, cada uno con data-id y data-kind".
  - 4.1.c "credit-entry con kind='album' tiene 22 ocurrencias y con kind='game' 10".
  - 4.1.d "cada credit-entry con sourceUrl renderiza un `<a target=_blank rel=noopener>`".
  - 4.1.e "/about contiene sección 'Stack' con `<h2>` que incluye 'Stack'".
- [ ] 4.2 Mantener el patrón de `albums.spec.ts` (workers=1, beforeEach, waitForResponse si aplica). Las pages de /about NO consumen API, así que no necesita waitForResponse — usa `page.waitForLoadState`.

## Phase 5 — Validación

- [ ] 5.1 `cd apps/web && npx tsc --noEmit -p tsconfig.json` debe pasar sin errores.
- [ ] 5.2 `cd apps/web && npx playwright test --workers=1` debe pasar entera. Esperado: 38 previos + N nuevos = ~42-44 verde.
- [ ] 5.3 Arrancar API + web. Smoke MCP en `/about`: 0 errores consola, 0 4xx/5xx network. Captura en `reports/iter-8/smoke-about.png`.

## Phase 6 — Gates

- [ ] 6.1 Lanzar `security-engineer` (skill `security-review`) sobre el delta de iter-8. Esperado: 0 HIGH/CRITICAL, MEDIUM legal (SEC-07-01) ahora **resuelto parcialmente** por la atribución pública. Reporte en `reports/iter-8/security-engineer.md`.
- [ ] 6.2 Lanzar `reviewer` (skill `review-pr`) auditando contra `openspec/changes/about-credits/specs/credits.md`. Reporte en `reports/iter-8/reviewer.md`. Veredicto APROBAR obligatorio.

## Phase 7 — Cierre

- [ ] 7.1 Auditoría criterio por criterio en `openspec/changes/about-credits/specs/credits.md`. Marcar cada REQ-CREDITS-* con su evidencia.
- [ ] 7.2 Crear `openspec/changes/about-credits/verify-report.md` con la tabla completa.
- [ ] 7.3 Mover el spec delta al spec vivo: `cat openspec/changes/about-credits/specs/credits.md` → consolidar en `specs/areas/credits/spec.md` (crear nuevo).
- [ ] 7.4 Commit + push siguiendo el patrón `feat(about): ...` + Co-Authored-By.
- [ ] 7.5 Tras merge, anotar `DEC-003` en `openspec/config.yaml § history.decisions[]` con el commit hash final.
