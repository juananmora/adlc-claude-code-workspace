output "sql_server_id" {
  description = "ID del Azure SQL Server."
  value       = azurerm_mssql_server.this.id
}

output "sql_server_name" {
  description = "Nombre del Azure SQL Server."
  value       = azurerm_mssql_server.this.name
}

output "sql_server_fqdn" {
  description = "FQDN privado del SQL Server (resuelto via Private DNS Zone)."
  value       = azurerm_mssql_server.this.fully_qualified_domain_name
}

output "sql_database_id" {
  description = "ID de la base de datos."
  value       = azurerm_mssql_database.this.id
}

output "sql_database_name" {
  description = "Nombre de la base de datos."
  value       = azurerm_mssql_database.this.name
}

output "administrator_login" {
  description = "Login del administrador SQL."
  value       = azurerm_mssql_server.this.administrator_login
}

output "private_endpoint_id" {
  description = "ID del Private Endpoint del SQL Server."
  value       = azurerm_private_endpoint.sql.id
}

output "connection_string_template" {
  description = "Plantilla de connection string. La password se inyecta en runtime desde Key Vault."
  value       = "Server=tcp:${azurerm_mssql_server.this.fully_qualified_domain_name},1433;Database=${azurerm_mssql_database.this.name};User ID=${azurerm_mssql_server.this.administrator_login};Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;"
}
