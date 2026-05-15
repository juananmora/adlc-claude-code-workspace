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
  description = "Region de Azure (Static Web Apps esta limitado a regiones concretas: westeurope, eastus2, ...)."
  type        = string
}

variable "resource_group_name" {
  description = "Nombre del Resource Group."
  type        = string
}

variable "sku_tier" {
  description = "SKU del Static Web App: Free en dev, Standard en pre/prod."
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.sku_tier)
    error_message = "sku_tier debe ser Free o Standard."
  }
}

variable "api_container_app_id" {
  description = "ID del Container App de la API a vincular como backend (Standard tier). Vacio = no vincular."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
