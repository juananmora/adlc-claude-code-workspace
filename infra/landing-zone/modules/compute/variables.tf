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

variable "subnet_cae_id" {
  description = "ID de la subnet del Container Apps Environment."
  type        = string
}

variable "log_analytics_workspace_id" {
  description = "ID del Log Analytics Workspace donde envia logs el CAE."
  type        = string
}

variable "container_image" {
  description = "Imagen del Container App."
  type        = string
  default     = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
}

variable "target_port" {
  description = "Puerto que escucha la API dentro del container."
  type        = number
  default     = 8080

  validation {
    condition     = var.target_port > 0 && var.target_port <= 65535
    error_message = "target_port debe estar entre 1 y 65535."
  }
}

variable "cpu" {
  description = "vCPU del container."
  type        = number
  default     = 0.5

  validation {
    condition     = contains([0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0], var.cpu)
    error_message = "cpu debe ser uno de los valores soportados por ACA Consumption: 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0."
  }
}

variable "memory" {
  description = "Memoria del container (formato: '0.5Gi', '1Gi', '2Gi', ...)."
  type        = string
  default     = "1Gi"

  validation {
    condition     = can(regex("^[0-9.]+Gi$", var.memory))
    error_message = "memory debe expresarse como '<n>Gi' (p.ej. '0.5Gi', '1Gi')."
  }
}

variable "min_replicas" {
  description = "Replicas minimas del Container App."
  type        = number
  default     = 1

  validation {
    condition     = var.min_replicas >= 0 && var.min_replicas <= 100
    error_message = "min_replicas debe estar entre 0 y 100."
  }
}

variable "max_replicas" {
  description = "Replicas maximas del Container App."
  type        = number
  default     = 3

  validation {
    condition     = var.max_replicas >= 1 && var.max_replicas <= 300
    error_message = "max_replicas debe estar entre 1 y 300."
  }
}

variable "scale_concurrent_requests" {
  description = "Numero de peticiones concurrentes objetivo para el autoscaling HTTP."
  type        = number
  default     = 50

  validation {
    condition     = var.scale_concurrent_requests >= 1
    error_message = "scale_concurrent_requests debe ser >= 1."
  }
}

variable "sql_server_fqdn" {
  description = "FQDN privado del SQL Server (output del modulo database)."
  type        = string
}

variable "sql_database_name" {
  description = "Nombre de la base de datos (output del modulo database)."
  type        = string
}

variable "sql_admin_login" {
  description = "Login del administrador SQL."
  type        = string
}

variable "sql_password_kv_secret_id" {
  description = "ID del secret en Key Vault con la password del admin SQL (output del modulo secrets)."
  type        = string
}

variable "app_insights_connection_string" {
  description = "Connection string de App Insights. Sensitive."
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
