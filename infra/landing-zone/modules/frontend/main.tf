# Modulo frontend - Azure Static Web Apps.
#
# Decision: usamos azurerm_static_web_app (SWA) en lugar de Storage Account + CDN porque:
#   1. SWA integra build/deploy nativo desde GitHub Actions sin pipeline aparte.
#   2. Ofrece routing SPA y APIs serverless out-of-the-box.
#   3. TLS y dominio gestionado automaticamente (sin emitir certificados manualmente).
#   4. Menor superficie de gestion y coste para un Next.js estatico.
#
# Si en el futuro se requiere SSR completo o headers/edge logic muy custom,
# migrar a Container Apps (con Front Door delante) o a Storage+CDN+Functions.
#
# El binding con la API Container App se hace post-deploy via SWA CLI / portal:
#   az staticwebapp backends link --name <swa> --backend-resource-id <container-app-id>
# (no hay recurso declarativo estable en azurerm para esto a fecha de hoy).

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

resource "azurerm_static_web_app" "this" {
  name                = "${local.name_prefix}-web"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku_tier            = var.sku_tier
  sku_size            = var.sku_tier
  tags                = var.tags

  identity {
    type = "SystemAssigned"
  }
}
