output "container_app_id" {
  description = "ID del Container App de la API."
  value       = azurerm_container_app.api.id
}

output "container_app_name" {
  description = "Nombre del Container App."
  value       = azurerm_container_app.api.name
}

output "container_app_fqdn" {
  description = "FQDN del Container App. En dev/pre es publico; en prod es interno."
  value       = azurerm_container_app.api.latest_revision_fqdn
}

output "container_app_environment_id" {
  description = "ID del Container Apps Environment."
  value       = azurerm_container_app_environment.this.id
}

output "api_uami_id" {
  description = "ID de la User Assigned Managed Identity de la API."
  value       = azurerm_user_assigned_identity.api.id
}

output "api_uami_principal_id" {
  description = "Principal (object_id) de la UAMI. Lo consume el modulo secrets para el role assignment Secrets User."
  value       = azurerm_user_assigned_identity.api.principal_id
}

output "api_uami_client_id" {
  description = "Client ID de la UAMI."
  value       = azurerm_user_assigned_identity.api.client_id
}
