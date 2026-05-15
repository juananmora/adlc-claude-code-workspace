# Modulo secrets - Azure Key Vault.
# Aloja:
#   - sql-admin-password : password aleatoria generada con random_password.
#   - api-app-insights-key : connection string de Application Insights (inyectado por modulo observability).
#
# Reglas:
#   - RBAC habilitado (no access policies clasicas).
#   - Soft delete obligatorio. purge_protection en pre/prod.
#   - Acceso de la red publica deshabilitado en pre/prod, con Private Endpoint en subnet-pe.
#   - Proteccion de borrado en prod: el bloque `lifecycle { prevent_destroy }` NO acepta
#     expresiones dinamicas, por lo que la proteccion se aplica via `azurerm_management_lock`
#     con `lock_level = "CanNotDelete"` sobre el Key Vault cuando `var.environment == "prod"`.
#     Combinado con `purge_protection_enabled = true` (pre/prod), garantiza que el KV no
#     pueda ser eliminado ni purgado accidentalmente. Cumple CLAUDE.md (proteccion de prod).

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  # Key Vault name limit: 3-24 chars, alfanumericos y guion.
  kv_name        = substr(replace("${local.name_prefix}-kv", "-", ""), 0, 24)
  enable_pe      = var.environment != "dev"
  purge_protect  = var.environment != "dev"
  public_network = var.environment == "dev" ? "Enabled" : "Disabled"
}

data "azurerm_client_config" "current" {}

resource "random_password" "sql_admin" {
  length           = 32
  special          = true
  override_special = "!@#$%^&*()-_=+"
  min_lower        = 2
  min_upper        = 2
  min_numeric      = 2
  min_special      = 2
}

resource "azurerm_key_vault" "this" {
  name                          = local.kv_name
  location                      = var.location
  resource_group_name           = var.resource_group_name
  tenant_id                     = data.azurerm_client_config.current.tenant_id
  sku_name                      = "standard"
  enable_rbac_authorization     = true
  soft_delete_retention_days    = 7
  purge_protection_enabled      = local.purge_protect
  public_network_access_enabled = local.public_network == "Enabled"

  network_acls {
    default_action = local.public_network == "Enabled" ? "Allow" : "Deny"
    bypass         = "AzureServices"
  }

  tags = var.tags
}

# Permitir al principal que ejecuta Terraform escribir secretos.
# En CI/CD, este principal sera la identidad federada GitHub -> Azure.
resource "azurerm_role_assignment" "deployer_secrets_officer" {
  scope                = azurerm_key_vault.this.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_key_vault_secret" "sql_admin_password" {
  name         = "sql-admin-password"
  value        = random_password.sql_admin.result
  key_vault_id = azurerm_key_vault.this.id
  content_type = "password"

  depends_on = [azurerm_role_assignment.deployer_secrets_officer]
}

resource "azurerm_key_vault_secret" "api_app_insights_key" {
  count        = var.app_insights_connection_string == "" ? 0 : 1
  name         = "api-app-insights-key"
  value        = var.app_insights_connection_string
  key_vault_id = azurerm_key_vault.this.id
  content_type = "connection-string"

  depends_on = [azurerm_role_assignment.deployer_secrets_officer]
}

# Management lock CanNotDelete sobre el Key Vault en prod.
# Se aplica al recurso (no al RG) para no bloquear el ciclo de vida de otros recursos
# del entorno. Combinado con `purge_protection_enabled`, evita borrados accidentales
# y purges destructivos del KV productivo.
resource "azurerm_management_lock" "kv_prod" {
  count      = var.environment == "prod" ? 1 : 0
  name       = "${local.name_prefix}-kv-cannotdelete"
  scope      = azurerm_key_vault.this.id
  lock_level = "CanNotDelete"
  notes      = "Proteccion contra borrado accidental del Key Vault de produccion. Gestionado por Terraform (modulo secrets)."
}

# Private Endpoint del Key Vault (pre/prod).
resource "azurerm_private_dns_zone" "kv" {
  count               = local.enable_pe ? 1 : 0
  name                = "privatelink.vaultcore.azure.net"
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "kv" {
  count                 = local.enable_pe ? 1 : 0
  name                  = "${local.name_prefix}-kv-pdz-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.kv[0].name
  virtual_network_id    = var.vnet_id
  tags                  = var.tags
}

resource "azurerm_private_endpoint" "kv" {
  count               = local.enable_pe ? 1 : 0
  name                = "${local.name_prefix}-kv-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_pe_id
  tags                = var.tags

  private_service_connection {
    name                           = "${local.name_prefix}-kv-psc"
    private_connection_resource_id = azurerm_key_vault.this.id
    is_manual_connection           = false
    subresource_names              = ["vault"]
  }

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [azurerm_private_dns_zone.kv[0].id]
  }
}

# Acceso RBAC para identidades consumidoras (p.ej. Managed Identity de la API).
resource "azurerm_role_assignment" "secrets_user" {
  for_each             = toset(var.secrets_user_principal_ids)
  scope                = azurerm_key_vault.this.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = each.value
}
