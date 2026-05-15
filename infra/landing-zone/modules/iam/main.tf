# Modulo iam - Azure RBAC.
# Asigna roles built-in a nivel de Resource Group.
#
# No crea usuarios ni grupos: los principales (object_id) entran como variables.
# La identidad de la API se crea en el modulo compute; aqui solo se enlaza
# a los roles que necesita en el RG (DB Contributor opcional, Reader del RG, ...).

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

data "azurerm_resource_group" "this" {
  name = var.resource_group_name
}

# Operators group: Contributor sobre el RG completo (no a nivel suscripcion).
# Permite operar el entorno sin tener Owner global.
resource "azurerm_role_assignment" "ops_contributor" {
  count                = var.ops_group_object_id == "" ? 0 : 1
  scope                = data.azurerm_resource_group.this.id
  role_definition_name = "Contributor"
  principal_id         = var.ops_group_object_id
  description          = "Ops group - Contributor sobre RG ${local.name_prefix}"
}

# Readonly group: Reader sobre el RG (oncall, soporte).
resource "azurerm_role_assignment" "readonly_reader" {
  count                = var.readonly_group_object_id == "" ? 0 : 1
  scope                = data.azurerm_resource_group.this.id
  role_definition_name = "Reader"
  principal_id         = var.readonly_group_object_id
  description          = "Readonly group - Reader sobre RG ${local.name_prefix}"
}

# Monitoring Reader para readonly (acceso a metricas y logs).
resource "azurerm_role_assignment" "readonly_monitoring" {
  count                = var.readonly_group_object_id == "" ? 0 : 1
  scope                = data.azurerm_resource_group.this.id
  role_definition_name = "Monitoring Reader"
  principal_id         = var.readonly_group_object_id
  description          = "Readonly group - Monitoring Reader sobre RG ${local.name_prefix}"
}

# CI/CD: en dev/pre, Contributor sobre el RG. En prod, gestionado fuera (entorno protegido en GitHub).
resource "azurerm_role_assignment" "ci_contributor" {
  count                = var.ci_principal_object_id == "" || var.environment == "prod" ? 0 : 1
  scope                = data.azurerm_resource_group.this.id
  role_definition_name = "Contributor"
  principal_id         = var.ci_principal_object_id
  description          = "CI/CD federated identity - Contributor sobre RG ${local.name_prefix} (no aplica en prod)"
}
