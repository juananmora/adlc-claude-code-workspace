# QA Strategy — Catálogo de ordenadores

## Pirámide de pruebas

```
        E2E (Playwright, apps/web/e2e)        ← pocos, lentos, alta confianza
       ─────────────────────────────────
      Integration (Fastify inject, apps/api)  ← API contract end-to-end in-process
     ───────────────────────────────────────
    Unit (futuro, lib/* y utils)              ← rápidos, baratos (gap conocido)
```

Hoy el repositorio cubre con solidez la franja media (API integration, 9 tests vía `fastify.inject`) y se incorpora la cúspide (E2E navegador con Playwright). La base unitaria (componentes React aislados, utilidades como `formatPrice`) queda identificada como gap, no como bloqueante: la lógica relevante se ejerce indirectamente desde E2E e integración.

## Mapeo criterio de aceptación → test

| Criterio | Capa | Test |
|---|---|---|
| Backend — API arranca | Integration | `health > returns 200 with status ok` |
| Backend — `GET /products` funciona | Integration | `GET /products > returns the full catalog` |
| Backend — `GET /products/{id}` funciona | Integration | `GET /products/:id > returns a product by id` + `404 when the product does not exist` |
| Backend — Filtros por categoría funcionan | Integration | `GET /products > filters by category=Portatiles` + `rejects unknown categories with 400` |
| Backend — Búsqueda por texto | Integration | `GET /products > filters by q=ThinkPad` + alias `search` |
| Backend — Tests pasan | CI | Job `api` en `ci.yml` ejecuta `npm test` |
| Frontend — La landing carga | E2E | `home > carga sin errores de consola` |
| Frontend — Se muestran productos | E2E | `catalog > muestra al menos 10 productos` |
| Frontend — Buscador funciona | E2E | `search > filtra por "ThinkPad"` |
| Frontend — Filtros funcionan | E2E | `category-filter > selecciona "Portátiles"` + `empty-state > limpiar filtros` |
| Frontend — Diseño responsive básico | E2E | `responsive > header accesible en 375px` |
| Frontend — Ficha individual | E2E | `product-detail > navegación y campos clave` + `product-detail > 404 en id inexistente` |
| CORS API consumida por frontend | Integration | `CORS > emits CORS headers for allowed origins` |
| CI ejecuta tests | CI | Workflow `e2e.yml` levanta API+Web y corre Playwright |

## Pruebas negativas incluidas

- API: categoría desconocida → 400; producto inexistente → 404.
- Frontend: `/products/no-existe` → 404; estado "sin resultados" + botón "Limpiar filtros".
- Frontend: detección de `console.error` y `pageerror` en home (regresión del caso `.next` corrupto reportado por el usuario).

## Fuera de alcance (gaps documentados)

- **Accesibilidad avanzada (axe, lectores)**: solo verificamos contraste/role básicos vía selectores. Auditoría WCAG completa queda para una iteración posterior; el PRD no la lista como requisito.
- **Performance / carga**: no hay Lighthouse CI ni k6. El PRD no fija SLOs concretos; se añadirá cuando exista entorno pre con tráfico representativo.
- **Visual regression (Percy/Chromatic)**: el diseño está aún en evolución; introducir snapshots ahora generaría falsos positivos.
- **Unit tests de componentes React**: gap conocido. Los componentes son mayormente presentacionales y se ejercen vía E2E. Se priorizarán si aparecen utilidades con lógica no trivial (p.ej. parsers, hooks de filtrado).
- **Contract testing (Pact) entre web y api**: hoy ambos viven en el mismo repo y el tipo `Product` está duplicado; un cambio rompedor lo detecta E2E. Cuando se separen repos, se introducirá Pact.
- **Seguridad runtime (DAST)**: cubierta por escaneos estáticos (gitleaks, trivy, npm audit) en CI; DAST llegará con entorno desplegado.

## Reglas operativas

- Ningún test fallido se elimina para hacer pasar el pipeline. Se documenta como bug y se abre incidencia.
- E2E corre contra servicios reales (API :4000, Web :3001) — sin mocks de red — para detectar regresiones de integración como la del caché `.next` corrupto.
- En CI, el job E2E sube `playwright-report/` como artifact siempre que falle, para diagnóstico humano.
