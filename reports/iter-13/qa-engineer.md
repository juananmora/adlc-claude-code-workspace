## Skills ejecutadas
- Skill(skill: "generate-tests") → aplicada

# QA engineer — iter-13 (rename-brand-master-of-the-deck)

Plan: `reports/iter-13/qa-test-plan.md`.

## Criterios

| criterio | archivo:línea | estado |
|---|---|---|
| AC-01 Home con marca nueva | apps/web/e2e/home.spec.ts:19 | verde |
| AC-02 Header wordmark (375px) | apps/web/e2e/responsive.spec.ts:12-13 | verde |
| AC-03 Footer copyright | apps/web/e2e/about.spec.ts:25 | verde |
| AC-04 About h1/eyebrow | apps/web/e2e/about.spec.ts:25 | verde |
| AC-05 Ficha producto title | apps/web/e2e/product-detail.spec.ts:7 | verde (cubre navegación a ficha; no valida el `<title>` directamente) |
| AC-06 Títulos tours/consoles | apps/web/e2e/tours.spec.ts:32, apps/web/e2e/consoles.spec.ts | verde |
| AC-07 Hero | apps/web/e2e/home.spec.ts:12 | verde |
| AC-08 Cero errores de consola | todos los specs | verde |
| AC-09 Sin "Iron Deck" visible | grep + smoke MCP | verde (solo comentarios y nombres de fichero internos) |
| AC-10 `<title>` casing (SHOULD) | — | pendiente: decisión de casing sin test |

## Output de la suite

Salida literal de la última ejecución completa:

```
  63 passed (4.8m)
```

Comando: `cd apps/web && npx playwright test --config=playwright.system.config.ts --workers=1`
(Chromium del sistema `/usr/bin/chromium`; el Chromium de Playwright no está instalado.)

## Calidad estática

- `npx tsc --noEmit -p tsconfig.json` → exit 0.
- `npm run lint` → "No ESLint warnings or errors".

## Smoke (Chrome DevTools MCP + curl)

- `/`: título "MASTER OF THE DECK — Catálogo"; consola sin errores ni warnings; red todo 200 (incluye `GET localhost:4000/products` 200).
- `/about`: título "About — MASTER OF THE DECK"; h1 "About MASTER OF THE DECK"; footer "© 2026 MASTER OF THE DECK — No es una tienda real."; consola limpia; red 200.
- Fichas: `/tours/world-slavery-tour` 200, `/games/knight-lore` 200, `/products/<id>` 200.
- 404: `/consoles/unknown-id-xxx`, `/games/unknown-id-123`, `/tours/unknown-xxx`, `/albums/unknown-xxx` → 404.
- API: `/products` 200; `/products/nope` 404 con `{"statusCode":404,"error":"Not Found","message":"Producto 'nope' no encontrado"}`.

## Gaps y motivos

- **Docker no probado**: `docker` no está en PATH. CLAUDE.md exige validar contra Docker: no se cumple, bloqueo de entorno.
- **Mobile 375px del wordmark**: cubierto por `responsive.spec.ts`; no revisado visualmente.
- **AC-10 `<title>` casing**: decisión humana pendiente (SHOULD, no bloquea).
- **Hallazgo preexistente**: `/products/unknown-xxx` devuelve HTTP 200 (renderiza not-found) en vez de 404. No causado por el rename; abrir issue aparte.
- **Entorno**: `NEXT_PUBLIC_API_BASE_URL` debe definirse al arrancar `next dev`; si no, el grid de `/tours` queda vacío sin error visible.

ESTADO: ok
