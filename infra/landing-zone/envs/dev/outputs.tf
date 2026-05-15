output "resource_group_name" {
  description = "Nombre del Resource Group del entorno dev."
  value       = module.network.resource_group_name
}

output "vnet_id" {
  description = "ID de la VNet."
  value       = module.network.vnet_id
}

output "container_app_fqdn" {
  description = "FQDN del Container App de la API."
  value       = module.compute.container_app_fqdn
}

output "frontend_public_url" {
  description = "URL publica del Static Web App."
  value       = module.frontend.public_url
}

output "sql_server_fqdn" {
  description = "FQDN privado del Azure SQL Server."
  value       = module.database.sql_server_fqdn
}

output "key_vault_uri" {
  description = "URI del Key Vault."
  value       = module.secrets.key_vault_uri
}

output "log_analytics_workspace_id" {
  description = "ID del Log Analytics Workspace."
  value       = module.observability.log_analytics_workspace_id
}
