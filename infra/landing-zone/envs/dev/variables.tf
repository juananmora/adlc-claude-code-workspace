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
  description = "Entorno objetivo. Fijo a 'dev' en este directorio."
  type        = string
  default     = "dev"

  validation {
    condition     = var.environment == "dev"
    error_message = "Este directorio solo despliega el entorno dev."
  }
}

variable "location" {
  description = "Region de Azure."
  type        = string
  default     = "westeurope"
}

variable "subscription_id" {
  description = "ID de la suscripcion Azure. Se inyecta por env var ARM_SUBSCRIPTION_ID o tfvars."
  type        = string
  default     = "00000000-0000-0000-0000-000000000000"
}

variable "azuread_admin_login" {
  description = "Display name del administrador AAD del SQL Server."
  type        = string
  default     = "sql-admins-dev"
}

variable "azuread_admin_object_id" {
  description = "Object ID del administrador AAD del SQL Server."
  type        = string
  default     = "00000000-0000-0000-0000-000000000000"
}

variable "ops_group_object_id" {
  description = "object_id del grupo AAD ops."
  type        = string
  default     = ""
}

variable "readonly_group_object_id" {
  description = "object_id del grupo AAD readonly."
  type        = string
  default     = ""
}

variable "ci_principal_object_id" {
  description = "object_id de la identidad federada CI/CD."
  type        = string
  default     = ""
}
