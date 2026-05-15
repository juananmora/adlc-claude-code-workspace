# Modulo database - Azure SQL.
# Despliega:
#   - azurerm_mssql_server con password de admin tomada de Key Vault.
#   - azurerm_mssql_database con SKU segun entorno.
#   - Private Endpoint en subnet-sql + Private DNS Zone privatelink.database.windows.net.
#   - public_network_access_enabled = false (BD privada, sin IP publica).
#
# Notas:
#   - La password viaja como variable sensitive desde el modulo secrets.
#   - Proteccion de borrado en prod: dado que el bloque `lifecycle { prevent_destroy }`
#     NO acepta expresiones dinamicas (debe ser literal y aplicaria a todos los entornos,
#     bloqueando destroys legitimos en dev/pre), la proteccion se materializa via
#     `azurerm_management_lock` a nivel de SQL Server cuando `var.environment == "prod"`.
#     El lock con `lock_level = "CanNotDelete"` impide la eliminacion del recurso desde
#     cualquier cliente (Terraform incluido) hasta que el lock sea removido manualmente
#     por un operador autorizado. Cumple CLAUDE.md (proteccion de prod).

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

resource "azurerm_mssql_server" "this" {
  name                          = "${local.name_prefix}-sql"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = "12.0"
  administrator_login           = var.administrator_login
  administrator_login_password  = var.administrator_login_password
  minimum_tls_version           = "1.2"
  public_network_access_enabled = false
  tags                          = var.tags

  azuread_administrator {
    login_username              = var.azuread_admin_login
    object_id                   = var.azuread_admin_object_id
    azuread_authentication_only = false
  }
}

resource "azurerm_mssql_database" "this" {
  name                 = "${local.name_prefix}-sqldb"
  server_id            = azurerm_mssql_server.this.id
  sku_name             = var.sku_name
  zone_redundant       = var.high_availability
  storage_account_type = var.high_availability ? "Geo" : "Local"
  tags                 = var.tags

  short_term_retention_policy {
    retention_days = var.backup_retention_days
  }
}

# Private DNS Zone para Azure SQL.
resource "azurerm_private_dns_zone" "sql" {
  name                = "privatelink.database.windows.net"
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "sql" {
  name                  = "${local.name_prefix}-sql-pdz-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.sql.name
  virtual_network_id    = var.vnet_id
  tags                  = var.tags
}

# Management lock CanNotDelete sobre el SQL Server en prod.
# Se aplica al Server (no al RG) para no bloquear el ciclo de vida de otros recursos.
# El lock arrastra la proteccion a la `azurerm_mssql_database` hija, evitando
# eliminaciones accidentales de la base de datos productiva.
resource "azurerm_management_lock" "sql_server_prod" {
  count      = var.environment == "prod" ? 1 : 0
  name       = "${local.name_prefix}-sql-cannotdelete"
  scope      = azurerm_mssql_server.this.id
  lock_level = "CanNotDelete"
  notes      = "Proteccion contra borrado accidental del SQL Server de produccion. Gestionado por Terraform (modulo database)."
}

resource "azurerm_private_endpoint" "sql" {
  name                = "${local.name_prefix}-sql-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_sql_id
  tags                = var.tags

  private_service_connection {
    name                           = "${local.name_prefix}-sql-psc"
    private_connection_resource_id = azurerm_mssql_server.this.id
    is_manual_connection           = false
    subresource_names              = ["sqlServer"]
  }

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [azurerm_private_dns_zone.sql.id]
  }
}
