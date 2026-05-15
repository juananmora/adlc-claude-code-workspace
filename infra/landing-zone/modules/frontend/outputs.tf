output "static_web_app_id" {
  description = "ID del Static Web App."
  value       = azurerm_static_web_app.this.id
}

output "static_web_app_name" {
  description = "Nombre del Static Web App."
  value       = azurerm_static_web_app.this.name
}

output "default_hostname" {
  description = "Hostname publico asignado por Azure (formato: <name>.azurestaticapps.net)."
  value       = azurerm_static_web_app.this.default_host_name
}

output "public_url" {
  description = "URL publica completa del frontend."
  value       = "https://${azurerm_static_web_app.this.default_host_name}"
}

output "api_key" {
  description = "API key para deploy via GitHub Actions. Sensitive."
  value       = azurerm_static_web_app.this.api_key
  sensitive   = true
}
