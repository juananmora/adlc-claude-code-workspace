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

variable "log_retention_days" {
  description = "Dias de retencion de logs. dev=7, pre=30, prod=90."
  type        = number
  default     = 30

  validation {
    condition     = var.log_retention_days >= 7 && var.log_retention_days <= 730
    error_message = "log_retention_days debe estar entre 7 y 730 (limite de Azure Monitor)."
  }
}

variable "alarm_5xx_threshold_pct" {
  description = "Umbral de ratio 5xx (%) para disparar alarma."
  type        = number
  default     = 5

  validation {
    condition     = var.alarm_5xx_threshold_pct >= 0 && var.alarm_5xx_threshold_pct <= 100
    error_message = "alarm_5xx_threshold_pct debe estar entre 0 y 100."
  }
}

variable "alarm_latency_p95_ms" {
  description = "Umbral de latencia p95 (ms) para disparar alarma."
  type        = number
  default     = 1000

  validation {
    condition     = var.alarm_latency_p95_ms >= 50 && var.alarm_latency_p95_ms <= 60000
    error_message = "alarm_latency_p95_ms debe estar entre 50 y 60000."
  }
}

variable "alarm_db_errors_threshold" {
  description = "Numero de errores de conexion a BD en la ventana para disparar alarma."
  type        = number
  default     = 5

  validation {
    condition     = var.alarm_db_errors_threshold >= 1
    error_message = "alarm_db_errors_threshold debe ser >= 1."
  }
}

variable "alert_webhook_url" {
  description = "URL del webhook al que se notifican las alertas (Teams, Slack, ...). Placeholder."
  type        = string
  default     = "https://example.com/ops-webhook"
}

variable "container_app_id" {
  description = "ID del Container App de la API, target de las alertas. Si vacio, las alertas relacionadas no se crean."
  type        = string
  default     = ""
}

variable "sql_database_id" {
  description = "ID de la base de datos SQL, target de la alerta de errores BD."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
