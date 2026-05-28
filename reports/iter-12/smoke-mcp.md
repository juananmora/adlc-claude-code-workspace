# Smoke MCP — iter-12 `/tours`

> Fase 9 del flujo ADLC. Ejecutado por el orquestador con Chrome DevTools MCP contra el stack dockerizado (`docker compose up -d` con `ironheart-api` y `ironheart-web` ambos healthy en puertos 4000 y 3000).

## Rutas smokeadas

| # | Ruta | HTTP | Consola | Network | Captura |
|---|---|---|---|---|---|
| 1 | `/tours` (listado) | 200 | 0 errores | 41 requests todas 2xx; `GET http://localhost:4000/tours → 200`; 10 `_next/image` para covers → 200 | `reports/iter-12/smoke-tours-listado.png` |
| 2 | `/tours/world-slavery-tour` (ficha SSR) | 200 | 0 errores | `GET /tours/world-slavery-tour → 200`; portada `_next/image?url=/covers/tours/world-slavery-tour.jpg → 200` | `reports/iter-12/smoke-tours-ficha-world-slavery.png` |
| 3 | `/tours/black-album-tour` (ficha SSR) | 200 | 0 errores | render OK | `reports/iter-12/smoke-tours-ficha-black-album.png` |
| 4 | `/tours/unknown-xxx` (404) | 404 | 0 errores | `GET /tours/unknown-xxx → 404`; resto son prefetches `?_rsc=...` para el header (200) | `reports/iter-12/smoke-tours-404.png` |

## Verificación de SSR + Docker (DEC-005)

Las dos fichas (`world-slavery-tour`, `black-album-tour`) son server components. Su render OK contra el contenedor `ironheart-web` confirma que `resolveApiBase()` está resolviendo correctamente a `http://api:4000` (DNS interno de compose). Sin el helper, fallaría con `ECONNREFUSED` igual que el bug original de iter-9.

## Tolerancia cero a errores

`mcp__chrome-devtools-mcp__list_console_messages` devolvió `<no console messages found>` en las 4 rutas. Sin warnings de hidratación, sin pageerror, sin failed fetches.

## Conclusión

Fase 9 SMOKE → PASS. Sin bugs detectados que requieran volver a backend o frontend.
