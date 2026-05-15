# Modulo observability - Azure.
# Despliega:
#   - azurerm_log_analytics_workspace con retencion por entorno.
#   - azurerm_application_insights workspace-based, vinculado al LAW.
#   - azurerm_monitor_action_group con webhook placeholder.
#   - azurerm_monitor_metric_alert: 5xx ratio, latencia p95, errores BD.
#
# Las alertas referencian el target (Container App, SQL DB) por ID.
# Si los IDs llegan vacios (validacion en envoltorio), las alertas no se crean.

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

resource "azurerm_log_analytics_workspace" "this" {
  name                = "${local.name_prefix}-law"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  tags                = var.tags
}

resource "azurerm_application_insights" "this" {
  name                = "${local.name_prefix}-appi"
  location            = var.location
  resource_group_name = var.resource_group_name
  workspace_id        = azurerm_log_analytics_workspace.this.id
  application_type    = "web"
  retention_in_days   = var.log_retention_days
  tags                = var.tags
}

resource "azurerm_monitor_action_group" "ops" {
  name                = "${local.name_prefix}-ag-ops"
  resource_group_name = var.resource_group_name
  short_name          = substr("ops${var.environment}", 0, 12)
  tags                = var.tags

  webhook_receiver {
    name        = "ops-webhook"
    service_uri = var.alert_webhook_url
  }
}

# Alerta 5xx ratio sobre el Container App de la API.
resource "azurerm_monitor_metric_alert" "api_5xx" {
  count               = var.container_app_id == "" ? 0 : 1
  name                = "${local.name_prefix}-alert-api-5xx"
  resource_group_name = var.resource_group_name
  scopes              = [var.container_app_id]
  description         = "Ratio de 5xx en la API por encima del umbral."
  severity            = 2
  frequency           = "PT1M"
  window_size         = "PT5M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.App/containerApps"
    metric_name      = "Requests"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = var.alarm_5xx_threshold_pct

    dimension {
      name     = "statusCodeCategory"
      operator = "Include"
      values   = ["5xx"]
    }
  }

  action {
    action_group_id = azurerm_monitor_action_group.ops.id
  }
}

# Alerta latencia p95 sobre el Container App.
resource "azurerm_monitor_metric_alert" "api_latency_p95" {
  count               = var.container_app_id == "" ? 0 : 1
  name                = "${local.name_prefix}-alert-api-latency-p95"
  resource_group_name = var.resource_group_name
  scopes              = [var.container_app_id]
  description         = "Latencia p95 de la API por encima del umbral."
  severity            = 3
  frequency           = "PT1M"
  window_size         = "PT5M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.App/containerApps"
    metric_name      = "RequestDuration"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = var.alarm_latency_p95_ms
  }

  action {
    action_group_id = azurerm_monitor_action_group.ops.id
  }
}

# Alerta errores BD (fallos de conexion).
resource "azurerm_monitor_metric_alert" "db_errors" {
  count               = var.sql_database_id == "" ? 0 : 1
  name                = "${local.name_prefix}-alert-db-errors"
  resource_group_name = var.resource_group_name
  scopes              = [var.sql_database_id]
  description         = "Errores de conexion contra la base de datos."
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"
  tags                = var.tags

  criteria {
    metric_namespace = "Microsoft.Sql/servers/databases"
    metric_name      = "connection_failed"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = var.alarm_db_errors_threshold
  }

  action {
    action_group_id = azurerm_monitor_action_group.ops.id
  }
}
