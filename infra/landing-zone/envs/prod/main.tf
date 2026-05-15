# Entorno: prod
#
# REQUIERE APROBACION HUMANA. El gate vive en .github/workflows/deploy.yml
# job deploy-prod (environment: production con required reviewers).
#
# Caracteristicas:
#   - Azure SQL S3 con retencion 30d, zone_redundant, storage Geo.
#   - Container App con ingress internal-only (sin acceso desde Internet).
#     El trafico publico entra por Application Gateway / Front Door (FUERA DE ALCANCE).
#   - Key Vault con Private Endpoint y purge_protection_enabled.
#   - Proteccion contra borrado del SQL Server y del Key Vault en prod:
#     los modulos `database` y `secrets` crean un `azurerm_management_lock`
#     con `lock_level = "CanNotDelete"` cuando `var.environment == "prod"`.
#     No se usa `lifecycle { prevent_destroy }` porque no admite expresiones
#     dinamicas y bloquearia destroys legitimos en dev/pre.

locals {
  tags = {
    project     = var.project_name
    environment = var.environment
    owner       = "platform-team"
    managed_by  = "terraform"
    criticality = "high"
  }
}

module "network" {
  source = "../../modules/network"

  project_name    = var.project_name
  environment     = var.environment
  location        = var.location
  vnet_cidr       = "10.30.0.0/16"
  subnet_cae_cidr = "10.30.0.0/23"
  subnet_sql_cidr = "10.30.2.0/28"
  subnet_pe_cidr  = "10.30.2.16/28"
  tags            = local.tags
}

module "observability" {
  source = "../../modules/observability"

  project_name              = var.project_name
  environment               = var.environment
  location                  = var.location
  resource_group_name       = module.network.resource_group_name
  log_retention_days        = 90
  alarm_5xx_threshold_pct   = 1
  alarm_latency_p95_ms      = 500
  alarm_db_errors_threshold = 3
  alert_webhook_url         = "https://example.com/ops-webhook-prod"
  tags                      = local.tags
}

module "compute" {
  source = "../../modules/compute"

  project_name                   = var.project_name
  environment                    = var.environment
  location                       = var.location
  resource_group_name            = module.network.resource_group_name
  subnet_cae_id                  = module.network.subnet_cae_id
  log_analytics_workspace_id     = module.observability.log_analytics_workspace_id
  container_image                = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
  target_port                    = 80
  cpu                            = 2.0
  memory                         = "4Gi"
  min_replicas                   = 2
  max_replicas                   = 10
  scale_concurrent_requests      = 50
  sql_server_fqdn                = module.database.sql_server_fqdn
  sql_database_name              = module.database.sql_database_name
  sql_admin_login                = module.database.administrator_login
  sql_password_kv_secret_id      = module.secrets.sql_admin_password_secret_id
  app_insights_connection_string = module.observability.application_insights_connection_string
  tags                           = local.tags
}

module "secrets" {
  source = "../../modules/secrets"

  project_name                   = var.project_name
  environment                    = var.environment
  location                       = var.location
  resource_group_name            = module.network.resource_group_name
  vnet_id                        = module.network.vnet_id
  subnet_pe_id                   = module.network.subnet_pe_id
  secrets_user_principal_ids     = [module.compute.api_uami_principal_id]
  app_insights_connection_string = module.observability.application_insights_connection_string
  tags                           = local.tags
}

module "database" {
  source = "../../modules/database"

  project_name                 = var.project_name
  environment                  = var.environment
  location                     = var.location
  resource_group_name          = module.network.resource_group_name
  vnet_id                      = module.network.vnet_id
  subnet_sql_id                = module.network.subnet_sql_id
  administrator_login          = "sqladmin"
  administrator_login_password = module.secrets.sql_admin_password
  azuread_admin_login          = var.azuread_admin_login
  azuread_admin_object_id      = var.azuread_admin_object_id
  sku_name                     = "S3"
  backup_retention_days        = 30
  high_availability            = true
  tags                         = local.tags
}

module "frontend" {
  source = "../../modules/frontend"

  project_name         = var.project_name
  environment          = var.environment
  location             = var.location
  resource_group_name  = module.network.resource_group_name
  sku_tier             = "Standard"
  api_container_app_id = module.compute.container_app_id
  tags                 = local.tags
}

module "iam" {
  source = "../../modules/iam"

  project_name             = var.project_name
  environment              = var.environment
  resource_group_name      = module.network.resource_group_name
  ops_group_object_id      = var.ops_group_object_id
  readonly_group_object_id = var.readonly_group_object_id
  ci_principal_object_id   = var.ci_principal_object_id
}
