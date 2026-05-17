# verify-report — `about-credits` (iter-8)

> Reporte de cierre del change. Equivalente a la "tabla criterio | evidencia | estado" del manual CLAUDE.md § Fase 12.

## Resumen

Iter-8 entrega:
- **Fase A** (refactor estructural, commit `e4d5787`): adopta `specs/areas/<area>/` + `openspec/changes/<slug>/` inspirado en gentle-ai. 5 áreas vivas creadas. Archivo histórico iter-1..iter-7 intacto.
- **Fase B** (feature `/about`, sin commit aún): 32 créditos públicos con atribución a publishers originales, mitiga SEC-07-01 heredado de iter-7.

## Tabla criterio | evidencia | estado

Ver `openspec/changes/about-credits/specs/credits.md § Auditoría iter-8 (cierre)` para la tabla REQ-CREDITS-1..10 completa. **10/10 verde**.

## Gates

| Gate | Estado | Reporte |
|---|---|---|
| Fase 7 — security-engineer | APROBADO. 0 CRITICAL, 0 HIGH, 0 MEDIUM, 0 LOW. SEC-07-01 heredado: MEDIUM → LOW (mitigación parcial, sigue abierto hasta visado legal previo a release público). | `reports/iter-8/security-engineer.md` |
| Fase 9 — smoke MCP | 11/11 network 200, 0 errores consola. | `reports/iter-8/smoke-about.png` |
| Fase 10 — reviewer | APROBAR con observaciones no bloqueantes (excepto rec #1, ya resuelta). | `reports/iter-8/reviewer.md` |

## Aprobación humana (Fase 11)

- Usuario aprobó implícitamente al pedir "incluyelo, y de paso haz una prueba lanzando algún requisito nuevo sobre nuestro portal".
- SEC-07-01 heredado: Opción A de iter-7 sigue vigente (visado legal pendiente antes de release público). Esta iter MITIGA, no cierra.

## Recomendaciones para iter-9

Del reviewer:
- REC iter-9.1: añadir `apps/web/lib/credits.test.ts` con vitest validando shape + conteos.
- REC iter-9.2 (nice-to-have): eliminar `export const dynamic = "force-dynamic"` en `/about` (página estática).
- REC iter-9.3 (post-/ship): migrar `openspec/changes/about-credits/specs/credits.md § ADDED Requirements` a `specs/areas/credits/spec.md` (nuevo) y mover el change a `openspec/changes/archive/about-credits/`.
- REC iter-9.4 (nice-to-have): test E2E adicional de accesibilidad sobre `/about`.

Backlog heredado de iter-7 (sigue vigente):
- REC-4 hardening CSP/HSTS.
- REC-5 muestreo archive.org para URLs de citas en games.
- REC-6 renombrar 5 PNG a extensión real.
- REC-7 consolidar `buildUrl` en `lib/api.ts`.
- REC-8 sustituir flyers arcade por inlays CPC.
- REC-9 smoke automatizado `HEAD /covers/games/<slug>.jpg`.

## Comandos para reproducir

```powershell
# Validar specs:
py.exe scripts/validate_claude_workspace.py

# Backend:
cd apps/api; npm test           # 233/233 verde
cd apps/api; npx tsc --noEmit   # sin errores

# Frontend:
cd apps/web; npx tsc --noEmit -p tsconfig.json   # sin errores
cd apps/web; npx playwright test --workers=1     # 46/46 verde

# Audit:
cd apps/api; npm audit --audit-level=high       # 0 vulnerabilities
cd apps/web; npm audit --audit-level=high       # 0 vulnerabilities
```

## Próximos pasos

1. Commit + push de Fase B (este reporte + delta de spec + código + tests + reportes de subagentes).
2. Tras merge, ejecutar REC iter-9.3 (migrar delta a `specs/areas/credits/spec.md` + mover change a archive).
3. Planificar iter-9 con el resto de recomendaciones.
