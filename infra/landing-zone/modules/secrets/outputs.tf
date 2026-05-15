output "key_vault_id" {
  description = "ID del Key Vault."
  value       = azurerm_key_vault.this.id
}

output "key_vault_name" {
  description = "Nombre del Key Vault."
  value       = azurerm_key_vault.this.name
}

output "key_vault_uri" {
  description = "URI del Key Vault (https://<name>.vault.azure.net/)."
  value       = azurerm_key_vault.this.vault_uri
}

output "sql_admin_password_secret_id" {
  description = "ID del secreto que contiene la password del administrador SQL."
  value       = azurerm_key_vault_secret.sql_admin_password.id
}

output "sql_admin_password_secret_name" {
  description = "Nombre del secreto sql-admin-password."
  value       = azurerm_key_vault_secret.sql_admin_password.name
}

output "sql_admin_password" {
  description = "Password generada para el administrador SQL. La consume el modulo database. NO se imprime en logs."
  value       = random_password.sql_admin.result
  sensitive   = true
}
