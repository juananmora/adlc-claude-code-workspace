# Cierre iter-13: estado del front (`apps/web`)

Slug: front-estado-verificacion · Iteración: iter-13 · Intent #54 · Stage: adlc-cierre

## Resumen

Iteración **no homologada**. Los criterios AC-01 a AC-08 y las tareas T-01 a T-05 (#55 a #59) siguen pendientes: no se ha arrancado `apps/web`, no se han ejecutado el build, el lint ni los tests, y no hay reportes de agentes para `iter-13`. El cierre registra el estado real y no marca nada como verificado.

## Criterios de aceptación (auditoría)

| Criterio | Evidencia | Estado |
|---|---|---|
| AC-01 Dev server responde 200 en `/` | No ejecutado (T-01 pendiente) | pendiente: T-01 sin ejecutar |
| AC-02 `npm run build` exit 0 | No ejecutado (T-01 pendiente) | pendiente: T-01 sin ejecutar |
| AC-03 `npm run start` responde 200 tras build | No ejecutado (T-01 pendiente) | pendiente: T-01 sin ejecutar |
| AC-04 Inventario de scripts de test documentado | No ejecutado (T-02 pendiente) | pendiente: T-02 sin ejecutar |
| AC-05 Resultados E2E registrados | No ejecutado (T-02 pendiente) | pendiente: T-02 sin ejecutar |
| AC-06 Consola y red de `/` sin errores | No ejecutado (T-03 pendiente) | pendiente: T-03 sin ejecutar |
| AC-07 Versión de Node y comandos registrados | No registrado | pendiente: sin evidencia |
| AC-08 `npm run lint` exit 0 | No ejecutado (T-01 pendiente) | pendiente: T-01 sin ejecutar |

Resultado: 0 verdes, 8 rojos. Gates de seguridad (T-04) y reviewer (T-05) tampoco ejecutados.

## Hallazgos ya conocidos (no verificados en ejecución)

- `apps/web` no declara runner de tests unitarios. Solo hay `test:e2e` y `test:e2e:headed` (Playwright, 10 specs en `apps/web/e2e/`). "Tests unitarios" hoy puede dar cero tests.
- `CLAUDE.md` referencia `claude-catalog-viewer/` y `node --test scripts/`, que no existen en el repo.
- El área `catalog-viewer` del change no existe en `specs/areas/`. Áreas actuales: albums, catalog-products, consoles, games, infra-azure, platform, tours.

## Gaps y pendientes humanos

1. Ejecutar T-01 a T-05 (sin esto no hay criterios verdes).
2. Decidir si se añade Vitest o Jest a `apps/web` para tener tests unitarios reales.
3. Corregir o no la referencia a `claude-catalog-viewer/` en `CLAUDE.md`.
4. Confirmar el área de dominio: usar `catalog-products` o crear un área nueva. No se ha creado `specs/areas/catalog-viewer/spec.md`.
5. Security gate (Fase 7) y reviewer (Fase 10): pendientes, obligatorios antes de homologar.

## Comandos para reproducir (pendientes de ejecutar)

```bash
cd apps/web
node --version          # esperado >= 18.18
npm ci
npm run lint
npm run build
npm run start           # tras build; comprobar 200 en /
npm run test:e2e
```

## Próximos pasos

- Relanzar la iteración con T-01 a T-05 ejecutados y evidencias en `reports/iter-13/`.
- Cuando existan evidencias, volver a esta stage para homologar.
