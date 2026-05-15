variable "project_name" {
  description = "Nombre del proyecto."
  type        = string
  default     = "byteforge"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.project_name))
    error_message = "project_name debe empezar por letra minuscula, contener solo a-z, 0-9 o '-', y tener entre 3 y 31 caracteres."
  }
}

variable "environment" {
  description = "Entorno objetivo. Fijo a 'prod' en este directorio."
  type        = string
  default     = "prod"

  validation {
    condition     = var.environment == "prod"
    error_message = "Este directorio solo despliega el entorno prod."
  }
}

variable "location" {
  description = "Region de Azure."
  type        = string
  default     = "westeurope"
}

variable "subscription_id" {
  description = "ID de la suscripcion Azure de produccion."
  type        = string
  default     = "00000000-0000-0000-0000-000000000000"
}

variable "azuread_admin_login" {
  description = "Display name del administrador AAD del SQL Server."
  type        = string
  default     = "sql-admins-prod"
}

variable "azuread_admin_object_id" {
  description = "Object ID del administrador AAD del SQL Server."
  type        = string
  default     = "00000000-0000-0000-0000-000000000000"
}

variable "ops_group_object_id" {
  description = "object_id del grupo AAD ops (Contributor sobre RG)."
  type        = string
  default     = ""
}

variable "readonly_group_object_id" {
  description = "object_id del grupo AAD readonly."
  type        = string
  default     = ""
}

variable "ci_principal_object_id" {
  description = "object_id de la identidad federada CI/CD. En prod NO recibe Contributor automatico (gate humano en GitHub)."
  type        = string
  default     = ""
}
