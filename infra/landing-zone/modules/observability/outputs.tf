output "log_analytics_workspace_id" {
  description = "ID del Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.this.id
}

output "log_analytics_workspace_name" {
  description = "Nombre del Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.this.name
}

output "application_insights_id" {
  description = "ID de Application Insights."
  value       = azurerm_application_insights.this.id
}

output "application_insights_connection_string" {
  description = "Connection string de App Insights. Sensitive."
  value       = azurerm_application_insights.this.connection_string
  sensitive   = true
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key (legacy). Preferir connection_string."
  value       = azurerm_application_insights.this.instrumentation_key
  sensitive   = true
}

output "action_group_id" {
  description = "ID del Action Group ops."
  value       = azurerm_monitor_action_group.ops.id
}

output "alert_ids" {
  description = "IDs de las alertas creadas (vacio si target ausente)."
  value = {
    api_5xx         = try(azurerm_monitor_metric_alert.api_5xx[0].id, "")
    api_latency_p95 = try(azurerm_monitor_metric_alert.api_latency_p95[0].id, "")
    db_errors       = try(azurerm_monitor_metric_alert.db_errors[0].id, "")
  }
}
