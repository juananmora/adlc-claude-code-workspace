variable "project_name" {
  description = "Nombre del proyecto. Prefijo de nombres."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.project_name))
    error_message = "project_name debe empezar por letra minuscula, contener solo a-z, 0-9 o '-', y tener entre 3 y 31 caracteres."
  }
}

variable "environment" {
  description = "Entorno objetivo (dev, pre, prod)."
  type        = string

  validation {
    condition     = contains(["dev", "pre", "prod"], var.environment)
    error_message = "environment debe ser uno de: dev, pre, prod."
  }
}

variable "resource_group_name" {
  description = "Nombre del Resource Group sobre el que se aplican los role assignments."
  type        = string
}

variable "ops_group_object_id" {
  description = "object_id del grupo AAD 'ops' (Contributor). Vacio = no asignar."
  type        = string
  default     = ""
}

variable "readonly_group_object_id" {
  description = "object_id del grupo AAD readonly (Reader + Monitoring Reader). Vacio = no asignar."
  type        = string
  default     = ""
}

variable "ci_principal_object_id" {
  description = "object_id de la identidad federada GitHub Actions (Contributor en dev/pre). Vacio = no asignar."
  type        = string
  default     = ""
}
