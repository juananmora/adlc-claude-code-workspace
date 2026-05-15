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
  description = "Nombre del Resource Group."
  type        = string
}

variable "vnet_id" {
  description = "ID de la VNet para vincular la Private DNS Zone."
  type        = string
}

variable "subnet_sql_id" {
  description = "ID de la subnet donde crear el Private Endpoint del SQL Server."
  type        = string
}

variable "administrator_login" {
  description = "Usuario administrador SQL."
  type        = string
  default     = "sqladmin"
}

variable "administrator_login_password" {
  description = "Password del administrador SQL. Viene del modulo secrets (Key Vault)."
  type        = string
  sensitive   = true
}

variable "azuread_admin_login" {
  description = "Display name del administrador AAD (grupo o usuario)."
  type        = string
}

variable "azuread_admin_object_id" {
  description = "Object ID del administrador AAD del SQL Server."
  type        = string
}

variable "sku_name" {
  description = "SKU de la base de datos SQL (Basic, S0, S1, S3, P1, ...)."
  type        = string
  default     = "Basic"

  validation {
    condition     = can(regex("^(Basic|S[0-9]+|P[0-9]+|GP_S_Gen5_[0-9]+|GP_Gen5_[0-9]+|BC_Gen5_[0-9]+)$", var.sku_name))
    error_message = "sku_name debe ser un SKU valido de Azure SQL (Basic, S0-Sxx, P1-Pxx, GP_*, BC_*)."
  }
}

variable "backup_retention_days" {
  description = "Dias de retencion de backups (short term)."
  type        = number
  default     = 7

  validation {
    condition     = var.backup_retention_days >= 1 && var.backup_retention_days <= 35
    error_message = "backup_retention_days debe estar entre 1 y 35."
  }
}

variable "high_availability" {
  description = "Si true, activa zone_redundant y storage Geo."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
