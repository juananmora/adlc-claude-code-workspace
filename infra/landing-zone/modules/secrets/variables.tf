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

variable "location" {
  description = "Region de Azure."
  type        = string
}

variable "resource_group_name" {
  description = "Nombre del Resource Group donde crear el Key Vault."
  type        = string
}

variable "vnet_id" {
  description = "ID de la VNet donde vincular la Private DNS Zone del Key Vault."
  type        = string
}

variable "subnet_pe_id" {
  description = "ID de la subnet de Private Endpoints (usada en pre/prod)."
  type        = string
}

variable "secrets_user_principal_ids" {
  description = "Lista de object_id de identidades que necesitan rol Key Vault Secrets User (p.ej. UAMI de la API)."
  type        = list(string)
  default     = []
}

variable "app_insights_connection_string" {
  description = "Connection string de Application Insights a almacenar como secret. Vacio = no se crea."
  type        = string
  default     = ""
  sensitive   = true
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
