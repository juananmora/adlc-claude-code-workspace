# Criterios de aceptación

## Plataforma

- [x] Entornos dev, pre y prod definidos.
- [x] Red pública y privada documentada.
- [x] Base de datos privada.
- [x] Gestión de secretos definida.
- [x] Producción requiere aprobación humana.

## IaC

- [ ] `terraform fmt` pasa. (pendiente: Terraform no instalado en la máquina del usuario)
- [ ] `terraform validate` pasa. (pendiente: Terraform no instalado en la máquina del usuario)
- [x] Variables y outputs documentados.
- [x] No hay secretos hardcodeados.
- [x] Checkov/TFLint sin críticos, si están disponibles.

## Backend

- [x] API arranca.
- [x] `GET /products` funciona.
- [x] `GET /products/{id}` funciona.
- [x] Filtros por categoría funcionan.
- [x] Tests pasan.

## Frontend

- [x] La landing carga.
- [x] Se muestran productos.
- [x] Buscador funciona.
- [x] Filtros funcionan.
- [x] Diseño responsive básico.
- [x] Identidad Accenture aplicada (paleta #A100FF + negro, logo wordmark, tipografía Inter). Verificado por captura.
- [x] Consola del navegador sin errores (verificado con Chrome DevTools, 0 errores reales en DOM).

## Carrito

- [x] Botón "Añadir al carrito" en card y ficha actualiza el estado. Test E2E cart.spec.ts:30.
- [x] Drawer/sheet del carrito abre desde el header y muestra líneas + totales. Test cart.spec.ts:38.
- [x] Página `/cart` lista productos con cantidad editable y permite eliminar líneas. Tests cart.spec.ts:49, :70.
- [x] Contador visible en el header refleja el total de unidades. Test cart.spec.ts:30.
- [x] El carrito persiste tras recargar la página (localStorage). Test cart.spec.ts:81.
- [x] Tests E2E (Playwright) cubren añadir, modificar cantidad, eliminar y persistencia. 5 tests verdes.

## IaC Azure

- [x] Provider `azurerm` añadido y configurado (`~> 4.0` en todos los módulos y entornos).
- [x] Recursos: Resource Group, VNet con 3 subredes, Azure Container Apps Environment, Container App para API, Static Web App, Azure SQL privado, Key Vault, Log Analytics, Application Insights.
- [x] BD privada (Private Endpoint en `subnet-sql`, `public_network_access_enabled = false`).
- [x] Secretos vía Key Vault (`azurerm_key_vault_secret` + `random_password`), no en variables ni en código.
- [ ] `terraform fmt -check -recursive` pasa. (pendiente: Terraform no instalado; `winget install --id HashiCorp.Terraform -e` y reintentar)
- [ ] `terraform validate` pasa en `envs/dev`, `envs/pre`, `envs/prod`. (pendiente: misma causa)
- [x] Diferencias por entorno mantenidas (SKU, retención, HA, ingress internal en prod).
- [x] Producción mantiene gate humano en `.github/workflows/deploy.yml`.

## CI/CD

- [x] PR ejecuta validaciones.
- [x] Build automatizado.
- [x] Tests automatizados.
- [x] Escaneo seguridad.
- [x] Deploy prod bloqueado por aprobación.

## Observabilidad

- [x] Logs definidos.
- [x] Métricas mínimas definidas.
- [x] Alertas básicas definidas.
- [x] Runbook inicial.

## Discos heavy metal (iteración 3)

- [x] API `GET /albums` devuelve dataset (>=12 discos). 14 discos en `apps/api/src/data/albums.ts`.
- [x] API `GET /albums/:id` devuelve ficha o 404. Test `albums.test.ts` cubre ambos.
- [x] Filtro `?band=` funciona. Test "filter by Iron Maiden" verde.
- [x] Tests vitest cubren los endpoints. 6/6 nuevos verdes (15/15 totales).
- [x] Entrada "Discos" en el menú del header enlaza a `/albums`. Verificado en snapshot Chrome DevTools.
- [x] Página `/albums` lista discos con grid responsive. Captura `smoke-albums.png` con 14 cards.
- [x] Filtro por banda funciona en UI. Test E2E `albums.spec.ts:40` verde.
- [x] Ficha `/albums/[id]` muestra título, banda, año, tracks. Captura `smoke-album-detail.png` (Master of Puppets con tracklist).
- [x] Tests Playwright cubren menú, listado, filtro, ficha. 4/4 nuevos verdes (17/17 totales).
- [x] Consola del navegador sin errores en `/albums`. Verificado: 0 mensajes.
- [x] Security gate sin findings CRITICAL/HIGH. 0/0 (solo 2 LOW como deuda).
- [x] Reviewer veredicto APROBAR. Skill `review-pr` aplicada, sin cambios requeridos.
