# Spec — Catálogo de productos (`/products` + carrito)

Aplicación demo de catálogo de ordenadores: landing, API REST, carrito persistente.

> **Estado vivo.** Última actualización: iter-2 (commit `73b5405`). Cubre lo que en `acceptance-criteria-archive.md` aparece como secciones "Backend", "Frontend", "Carrito", "CI/CD" y "Observabilidad".

## Requirements

### REQ-CAT-1: API arranca

Given el repositorio en estado limpio,
when ejecuto `npm --workspace apps/api run dev`,
then la API MUST arrancar en el puerto 4000 (o el indicado en `PORT`)
y responder a `GET /products` con HTTP 200.

**Validación:** `Get-NetTCPConnection -LocalPort 4000` + `Invoke-RestMethod http://localhost:4000/products`.

### REQ-CAT-2: GET /products

Given el dataset estático de productos,
when un cliente hace `GET /products`,
then la API SHALL devolver un array JSON con `>=10` productos, cada uno
con `id`, `name`, `category`, `price`, `description` y `specs` no vacíos.

**Validación:** `apps/api/tests/products.test.ts` (9/9 verde).

### REQ-CAT-3: GET /products/:id

Given un id de producto,
when un cliente hace `GET /products/:id`,
then la API MUST devolver el producto si existe (HTTP 200) o un 404
con shape `{statusCode, error, message}` si no existe.

**Validación:** `products.test.ts` con casos positivos y 404.

### REQ-CAT-4: Filtro por categoría

Given un valor de categoría (Portatiles, Monitores, etc.),
when un cliente hace `GET /products?category=<valor>`,
then la API SHALL devolver solo productos con `category` exacta.
Filtros desconocidos devuelven `[]`.

**Validación:** `products.test.ts`.

### REQ-CAT-5: Landing y catálogo en frontend

Given un navegador en `http://localhost:3000`,
when la página principal carga,
then MUST mostrar el catálogo con `>=10` cards de productos visibles,
identidad Accenture (paleta `#A100FF` + negro, logo wordmark, tipografía
Inter), 0 errores en consola.

**Validación:** smoke MCP captura + `e2e/catalog.spec.ts`.

### REQ-CAT-6: Buscador

Given el catálogo cargado con `>=10` productos,
when el usuario teclea "ThinkPad" en el buscador,
then la grid SHALL mostrar solo productos cuyo `name` contenga "ThinkPad"
case-insensitive, con debounce de 250ms.

**Validación:** `e2e/catalog.spec.ts:30`.

### REQ-CAT-7: Filtro por categoría en UI

Given el catálogo cargado,
when el usuario selecciona "Portátiles" en el filtro,
then SHALL mostrar solo productos con esa categoría. Limpiar filtros
restaura el listado completo.

**Validación:** `e2e/catalog.spec.ts:57` y `:80`.

### REQ-CAT-8: Diseño responsive

Given un viewport de 375px (móvil),
when la landing carga,
then el header SHALL ser accesible y la grid se reorganiza a 1 columna
sin desbordamiento horizontal.

**Validación:** `e2e/responsive.spec.ts:8`.

### REQ-CAT-9: Añadir al carrito

Given una card de producto en el listado,
when el usuario hace click en "Añadir al carrito",
then el estado del carrito MUST incrementar la cantidad de ese producto
y el contador del header SHALL reflejar el total de unidades.

**Validación:** `e2e/cart.spec.ts:30`.

### REQ-CAT-10: Drawer de carrito

Given el botón de carrito en el header,
when el usuario lo abre,
then SHALL mostrar las líneas añadidas con cantidad, subtotal por línea
y total global.

**Validación:** `e2e/cart.spec.ts:38`.

### REQ-CAT-11: Página /cart

Given productos añadidos al carrito,
when el usuario navega a `/cart`,
then la página MUST listar todas las líneas con cantidad editable y
botón de eliminar por línea.

**Validación:** `e2e/cart.spec.ts:49` y `:70`.

### REQ-CAT-12: Persistencia del carrito

Given un carrito con productos,
when el usuario recarga la página,
then el contenido del carrito MUST persistir (localStorage) y reflejarse
en el contador del header al cargar.

**Validación:** `e2e/cart.spec.ts:81`.

### REQ-CAT-13: CI/CD

Given un push a una rama no-main,
when el workflow de CI corre,
then SHALL ejecutar build, lint, type-check, tests unitarios e
integración, y un escaneo de seguridad (`npm audit --audit-level=high`).

**Validación:** `.github/workflows/ci.yml`.

### REQ-CAT-14: Deploy bloqueado a producción

Given un workflow de deploy,
when alguien intenta desplegar a `prod`,
then MUST requerir aprobación manual en GitHub Actions Environment.

**Validación:** `.github/workflows/deploy.yml` con `environment: production`.

## Observabilidad

### REQ-CAT-15: Logs estructurados

Given una request a cualquier endpoint,
when la API la procesa,
then SHALL emitir un log estructurado con `requestId`, `method`, `path`,
`statusCode`, `durationMs`. Errores 5xx llevan stack solo en server-side,
nunca en respuesta al cliente.

**Validación:** Fastify pino logger configurado en `apps/api/src/app.ts`.

### REQ-CAT-16: Métricas + alertas + runbook

Given la plataforma desplegada en Azure,
when ocurre una incidencia,
then Application Insights SHALL exponer métricas mínimas (latencia
P95, error rate, requests/min), tener al menos 1 alerta básica
configurada, y un runbook inicial en `docs/`.

**Validación:** `infra/modules/monitoring/` + `docs/runbook.md`.

## Evidencia histórica

Cumplido íntegramente en iter-1 e iter-2. Ver `specs/acceptance-criteria-archive.md` §§ "Backend", "Frontend", "Carrito", "CI/CD", "Observabilidad".
