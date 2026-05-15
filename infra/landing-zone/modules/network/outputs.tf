output "resource_group_name" {
  description = "Nombre del Resource Group que agrupa toda la landing zone."
  value       = azurerm_resource_group.this.name
}

output "resource_group_id" {
  description = "ID del Resource Group."
  value       = azurerm_resource_group.this.id
}

output "location" {
  description = "Region de Azure usada."
  value       = azurerm_resource_group.this.location
}

output "vnet_id" {
  description = "ID de la VNet."
  value       = azurerm_virtual_network.this.id
}

output "vnet_name" {
  description = "Nombre de la VNet."
  value       = azurerm_virtual_network.this.name
}

output "subnet_cae_id" {
  description = "ID de la subnet del Container Apps Environment."
  value       = azurerm_subnet.cae.id
}

output "subnet_sql_id" {
  description = "ID de la subnet del Private Endpoint de Azure SQL."
  value       = azurerm_subnet.sql.id
}

output "subnet_pe_id" {
  description = "ID de la subnet para Private Endpoints generales (Key Vault, Storage, ...)."
  value       = azurerm_subnet.pe.id
}
