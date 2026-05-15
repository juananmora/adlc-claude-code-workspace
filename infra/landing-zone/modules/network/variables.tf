variable "project_name" {
  description = "Nombre del proyecto. Usado como prefijo de nombres de recursos."
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
  description = "Region de Azure donde desplegar (p.ej. westeurope, northeurope)."
  type        = string
  default     = "westeurope"
}

variable "vnet_cidr" {
  description = "CIDR de la VNet."
  type        = string
  default     = "10.10.0.0/16"

  validation {
    condition     = can(cidrhost(var.vnet_cidr, 0))
    error_message = "vnet_cidr debe ser un CIDR IPv4 valido."
  }
}

variable "subnet_cae_cidr" {
  description = "CIDR de la subnet del Container Apps Environment (minimo /23)."
  type        = string
  default     = "10.10.0.0/23"
}

variable "subnet_sql_cidr" {
  description = "CIDR de la subnet del Private Endpoint de Azure SQL (minimo /28)."
  type        = string
  default     = "10.10.2.0/28"
}

variable "subnet_pe_cidr" {
  description = "CIDR de la subnet para Private Endpoints generales (minimo /28)."
  type        = string
  default     = "10.10.2.16/28"
}

variable "tags" {
  description = "Tags adicionales aplicados a todos los recursos."
  type        = map(string)
  default     = {}
}
