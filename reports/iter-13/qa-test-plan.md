# QA test plan — iter-13 (rename-brand-master-of-the-deck)

Issue #17. Renombrar la marca visible "Iron Deck" → "Master of the Deck" (ALL CAPS en superficies visibles, según G2 / T-06).

## Mapping criterio → test

| Criterio | Archivo de test | Cobertura |
|---|---|---|
| AC-01 Título/metadatos de la home | `apps/web/e2e/home.spec.ts:19` | Marca visible en home |
| AC-02 Header con wordmark | `apps/web/e2e/responsive.spec.ts:12-13` | Wordmark en viewport 375px |
| AC-03 Footer con copyright | `apps/web/e2e/about.spec.ts:25` | Texto de footer/copyright |
| AC-04 Página About | `apps/web/e2e/about.spec.ts:25` | h1 y eyebrow de About |
| AC-05 Ficha de producto (title template) | `apps/web/e2e/product-detail.spec.ts:7` | Navegación a ficha (no valida `<title>`) |
| AC-06 Layouts tours/consoles (title) | `apps/web/e2e/tours.spec.ts:32`, `consoles.spec.ts` | Título de listado |
| AC-07 Hero | `apps/web/e2e/home.spec.ts:12` | Carga sin errores de consola |
| AC-08 Sin errores de consola | todos los specs (`collectConsoleErrors`) | Cero errores |
| AC-09 Sin "Iron Deck" visible | inspección (grep) + smoke MCP | Solo comentarios/nombres de fichero internos |
| AC-10 `<title>` casing (SHOULD) | pendiente de decisión | Sin test de casing; ver riesgos |

## Rutas y endpoints cubiertos

- Listados: `/`, `/about`, `/tours`, `/consoles`, `/games`, `/albums`, `/products`.
- Fichas: `/tours/world-slavery-tour`, `/tours/black-album-tour`, `/games/knight-lore`, `/games/la-abadia-del-crimen`, `/products/<id>`.
- 404: `/consoles/unknown-id-xxx`, `/games/unknown-id-123`, `/tours/unknown-xxx`, `/albums/unknown-xxx`, `/products/unknown-xxx`.
- API: `GET /products` (200), `GET /products/nope` (404 `{statusCode,error,message}`).

## Datos de prueba

Datasets existentes en la API y en los specs (no se han añadido datos nuevos).

## Riesgos

1. Docker no está disponible en esta máquina (`docker` no está en PATH): no se ha validado contra el stack dockerizado.
2. `NEXT_PUBLIC_API_BASE_URL` no definida al arrancar el dev server → grid vacío sin error visible (SSR cae a `[]`). Entorno, no regresión.
3. `/products/unknown-xxx` responde HTTP 200 en vez de 404 (la página renderiza not-found). Preexistente, no causado por el rename.
4. Casing del `<title>` (AC-10, SHOULD) sin decidir.
5. Nombres de fichero `iron-deck-header.tsx` / `iron-deck-footer.tsx` conservan el nombre antiguo (no visible al usuario).

## Comandos por capa

```
# Servidores
cd apps/api && npm run dev                       # :4000
cd apps/web && NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 PORT=3000 npm run dev

# E2E (sistema chromium)
cd apps/web && npx playwright test --config=playwright.system.config.ts --workers=1

# Tipos y lint
cd apps/web && npx tsc --noEmit -p tsconfig.json
cd apps/web && npm run lint
```
