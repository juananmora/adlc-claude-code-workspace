# Verify report — change `consoles` (iter-10)

> Tabla de auditoría criterio por criterio para REQ-CONSOLES-1..10. Persistido por Claude principal en Fase 12 (cierre).

## Estado de gates

| Gate | Veredicto | Reporte |
|---|---|---|
| Backend (Fase 6) | Verde — 360/360 vitest, tsc 0 | `reports/iter-10/backend-engineer.md` |
| Frontend (Fase 6) | Verde — tsc 0, 8 archivos creados, header actualizado | `reports/iter-10/frontend-engineer.md` |
| QA (Fase 6) | Verde — 8/8 consoles + 54/54 suite contra Docker | `reports/iter-10/qa-engineer.md` |
| Security (Fase 7) | APROBADO CON OBSERVACIONES — 0 CRITICAL/HIGH/MEDIUM, 1 LOW cerrado | `reports/iter-10/security-engineer.md` |
| Smoke MCP (Fase 9) | Verde — 0 errores consola en /consoles, /consoles/nintendo-64, /consoles/playstation-2, 404 OK | `reports/iter-10/smoke-consoles-*.png` |
| Reviewer (Fase 10) | APROBAR | `reports/iter-10/reviewer.md` |

## Auditoría REQ-CONSOLES-*

| REQ | Validador | Estado |
|---|---|---|
| REQ-CONSOLES-1 (tipos backend) | `apps/api/src/types/console.ts` + `tsc --noEmit` exit 0 | ok |
| REQ-CONSOLES-2 (dataset 10 entradas) | `apps/api/tests/consoles.test.ts` describe.each (110 tests) + dataset size | ok |
| REQ-CONSOLES-3 (constantes derivadas) | tests sorted/no-dup en `consoles.test.ts` (6 tests) | ok |
| REQ-CONSOLES-4 (GET /consoles con filtros) | `consoles.test.ts` 7 tests rutas + smoke `curl http://localhost:4000/consoles` count=10 | ok |
| REQ-CONSOLES-5 (GET /consoles/:id) | `consoles.test.ts` 200 + 404 con shape | ok |
| REQ-CONSOLES-6 (frontend mirror + cliente HTTP) | `apps/web/lib/console-types.ts` + `consoles-api.ts` con `resolveApiBase()` + `encodeURIComponent` (cierre SEC-10-L1) | ok |
| REQ-CONSOLES-7 (listado /consoles) | `e2e/consoles.spec.ts` listado + smoke MCP `/consoles` 0 errores | ok |
| REQ-CONSOLES-8 (buscador y chips) | `e2e/consoles.spec.ts` test buscador "Nintendo" + chip gen 5 toggle | ok |
| REQ-CONSOLES-9 (ficha) | `e2e/consoles.spec.ts` ficha + smoke MCP `/consoles/nintendo-64` y `/consoles/playstation-2` 0 errores | ok |
| REQ-CONSOLES-10 (404 + header + no-regresión) | smoke MCP `/consoles/unknown-xxx` 404 + Playwright 54/54 contra Docker | ok |

## Hallazgos abiertos

- **SEC-10-L1** (LOW): `fetchConsole(id)` no encodeaba el id en URL — **CERRADO en iter-10** (`apps/web/lib/consoles-api.ts:55`).
- **SEC-9-M1** (MEDIUM heredado): imagen API 398MB > 300MB. Diferido a iter-11 (deps-prod stage con `npm ci --omit=dev`).

## Comandos para reproducir

```powershell
# Backend
cd apps/api; npm test

# Frontend type check
cd apps/web; npx tsc --noEmit -p tsconfig.json

# Stack Docker
docker compose up -d --build --wait

# Smoke API
curl -s http://localhost:4000/consoles | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const a=JSON.parse(d);console.log('count=',a.length);})"

# E2E contra Docker
cd apps/web; npx playwright test --workers=1
```

## Próximos pasos tras merge

- Mover `## ADDED Requirements` de `openspec/changes/consoles/specs/consoles.md` → `specs/areas/consoles/spec.md` (ya hecho en este mismo commit).
- Marcar este change como `archived` (mover carpeta a `openspec/changes/archive/` en una iteración futura de housekeeping si así se desea).
- iter-11 candidatos: deps-prod stage en API Dockerfile (cierra SEC-9-M1), filtro `manufacturer` UI explícito.
