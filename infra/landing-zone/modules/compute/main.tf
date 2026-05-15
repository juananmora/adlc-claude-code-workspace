# Modulo compute - Azure Container Apps.
# Despliega:
#   - azurerm_user_assigned_identity (la UAMI consume secrets de Key Vault).
#   - azurerm_container_app_environment internal-only o externo segun entorno,
#     anclado a subnet-cae y enviando logs al Log Analytics Workspace.
#   - azurerm_container_app con revision_mode = "Single", ingress configurado.
#
# La imagen por defecto es un placeholder publico; el pipeline CI/CD sustituira
# por la imagen real de la API (ACR + tag inmutable).

locals {
  name_prefix      = "${var.project_name}-${var.environment}"
  ingress_internal = var.environment == "prod"
}

resource "azurerm_user_assigned_identity" "api" {
  name                = "${local.name_prefix}-api-uami"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_container_app_environment" "this" {
  name                           = "${local.name_prefix}-cae"
  location                       = var.location
  resource_group_name            = var.resource_group_name
  log_analytics_workspace_id     = var.log_analytics_workspace_id
  infrastructure_subnet_id       = var.subnet_cae_id
  internal_load_balancer_enabled = local.ingress_internal
  tags                           = var.tags
}

resource "azurerm_container_app" "api" {
  name                         = "${local.name_prefix}-api"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags                         = var.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.api.id]
  }

  # Referencia al secret de Key Vault. La identidad UAMI debe tener
  # rol "Key Vault Secrets User" sobre el KV (lo asigna el modulo secrets).
  secret {
    name                = "sql-admin-password"
    key_vault_secret_id = var.sql_password_kv_secret_id
    identity            = azurerm_user_assigned_identity.api.id
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = "api"
      image  = var.container_image
      cpu    = var.cpu
      memory = var.memory

      env {
        name  = "NODE_ENV"
        value = var.environment
      }

      env {
        name  = "SQL_SERVER_FQDN"
        value = var.sql_server_fqdn
      }

      env {
        name  = "SQL_DATABASE"
        value = var.sql_database_name
      }

      env {
        name  = "SQL_ADMIN_LOGIN"
        value = var.sql_admin_login
      }

      env {
        name        = "SQL_ADMIN_PASSWORD"
        secret_name = "sql-admin-password"
      }

      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = var.app_insights_connection_string
      }
    }

    http_scale_rule {
      name                = "http-concurrency"
      concurrent_requests = var.scale_concurrent_requests
    }
  }

  ingress {
    external_enabled = !local.ingress_internal
    target_port      = var.target_port
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}
