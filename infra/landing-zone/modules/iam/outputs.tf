output "ops_contributor_assignment_id" {
  description = "ID del role assignment Contributor para ops (vacio si no se asigno)."
  value       = try(azurerm_role_assignment.ops_contributor[0].id, "")
}

output "readonly_reader_assignment_id" {
  description = "ID del role assignment Reader para readonly (vacio si no se asigno)."
  value       = try(azurerm_role_assignment.readonly_reader[0].id, "")
}

output "readonly_monitoring_assignment_id" {
  description = "ID del role assignment Monitoring Reader para readonly."
  value       = try(azurerm_role_assignment.readonly_monitoring[0].id, "")
}

output "ci_contributor_assignment_id" {
  description = "ID del role assignment Contributor para CI/CD (vacio en prod)."
  value       = try(azurerm_role_assignment.ci_contributor[0].id, "")
}
