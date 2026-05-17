# Tasks — consoles

## Phase 1 — Backend

- [ ] 1.1 `apps/api/src/types/console.ts` con interface `Console`.
- [ ] 1.2 `apps/api/src/data/consoles.ts` con 10 entradas, `CONSOLE_MANUFACTURERS`, `CONSOLE_GENERATIONS`, `findConsoles`, `findConsoleById`.
- [ ] 1.3 `apps/api/src/routes/consoles.ts` con `GET /consoles` y `GET /consoles/:id`.
- [ ] 1.4 `apps/api/src/app.ts`: registrar `consolesRoutes`.
- [ ] 1.5 `apps/api/tests/consoles.test.ts` con describe.each + tests de rutas.
- [ ] 1.6 `npm test` desde apps/api → suite completa verde.

## Phase 2 — Portadas

- [ ] 2.1 Descargar 10 portadas Wikipedia a `apps/web/public/covers/consoles/<slug>.jpg` con User-Agent realista. Inspeccionar visualmente al menos 2.

## Phase 3 — Frontend

- [ ] 3.1 `apps/web/lib/console-types.ts` mirror.
- [ ] 3.2 `apps/web/lib/consoles-api.ts` usando `resolveApiBase()`.
- [ ] 3.3 `apps/web/app/consoles/layout.tsx` con `IronDeckHeader` + footer.
- [ ] 3.4 `apps/web/app/consoles/page.tsx` server component + `ConsolesGrid` cliente.
- [ ] 3.5 `apps/web/components/consoles-grid.tsx` con buscador + chips de generación.
- [ ] 3.6 `apps/web/components/console-card.tsx`.
- [ ] 3.7 `apps/web/app/consoles/[id]/page.tsx` ficha.
- [ ] 3.8 `apps/web/app/consoles/[id]/not-found.tsx`.
- [ ] 3.9 `apps/web/components/iron-deck-header.tsx`: insertar Link "Consolas" entre "Games" y "About".
- [ ] 3.10 `npx tsc --noEmit -p tsconfig.json` desde apps/web → sin errores.

## Phase 4 — qa-engineer gate (Fase 6 ADLC)

- [ ] 4.1 Lanzar `qa-engineer` para escribir `apps/web/e2e/consoles.spec.ts` con los casos del design.
- [ ] 4.2 Rebuild Docker: `docker compose up -d --build --wait`.
- [ ] 4.3 Ejecutar Playwright contra Docker: `npx playwright test --workers=1`. Esperado: suite previa 46/46 + nuevos consoles verdes.

## Phase 5 — Smoke MCP

- [ ] 5.1 Navegar con Chrome DevTools MCP a `/consoles`, `/consoles/nintendo-64`, `/consoles/playstation`, `/consoles/unknown-id-xxx`.
- [ ] 5.2 0 errores consola, 0 4xx/5xx en network. Capturas en `reports/iter-10/`.

## Phase 6 — Security gate

- [ ] 6.1 Lanzar `security-engineer` con preverificación (`npm audit`, grep secretos).
- [ ] 6.2 Reporte en `reports/iter-10/security-engineer.md`. Esperado APROBADO o APROBADO CON OBSERVACIONES.

## Phase 7 — Reviewer

- [ ] 7.1 Lanzar `reviewer` independiente.
- [ ] 7.2 Veredicto APROBAR obligatorio. Reporte en `reports/iter-10/reviewer.md`.

## Phase 8 — Cierre

- [ ] 8.1 `verify-report.md` con tabla criterio | evidencia | estado.
- [ ] 8.2 Registrar `DEC-006` en `openspec/config.yaml`.
- [ ] 8.3 Commit + push directo a main.
- [ ] 8.4 Tras merge, mover delta a `specs/areas/consoles/spec.md`.
