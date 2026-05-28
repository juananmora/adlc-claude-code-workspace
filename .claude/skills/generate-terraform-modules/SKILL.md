---
name: generate-terraform-modules
description: Genera módulos Terraform AzureRM ~> 4.0 con estructura modules/<m>/{main,variables,outputs,versions,README} y envs/<dev|pre|prod>/. Naming consistente, tags merge, RBAC mínimo, validación local sin credenciales. NUNCA terraform apply en prod.
when_to_use: Cuando hay que crear o modificar IaC en infra/landing-zone/. Módulos (network/compute/database/secrets/frontend/observability/iam) y entornos (dev/pre/prod).
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Generate Terraform Modules

Skill prescriptiva para `infra/landing-zone/`. Cumple `azurerm ~> 4.0` y la topología decidida por el `cloud-architect`.

## Stack fijo

- `required_version = ">= 1.5"`.
- `azurerm = "~> 4.0"` (features `{}` mínimo).
- `random >= 3.5.0` para passwords.
- Backend `local` en dev, `azurerm` en pre/prod.

## Estructura por módulo

```
modules/<m>/
├─ main.tf       # recursos + locals
├─ variables.tf  # type + description + validation
├─ outputs.tf    # description + sensitive cuando aplique
├─ versions.tf   # required_providers (cada módulo declara los suyos)
└─ README.md     # propósito + ejemplo de uso + inputs/outputs
```

## Estructura por entorno

```
envs/<env>/
├─ main.tf
├─ variables.tf
├─ outputs.tf
├─ versions.tf            # required_version + required_providers + backend
└─ terraform.tfvars.example
```

## Plantillas

### main.tf del módulo (cabecera)

```hcl
# Modulo <m> - Azure.
# Proposito: <una línea>.
#
# Notas de seguridad:
#   - <ejemplos: ningun 0.0.0.0/0 inbound; KV con RBAC + PE en pre/prod>.

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  tags = merge(var.tags, {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
    module      = "<m>"
  })
}
```

### variables.tf

```hcl
variable "project_name" {
  type        = string
  description = "Nombre corto del proyecto (slug minúsculas)."
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,23}$", var.project_name))
    error_message = "project_name debe ser slug minúsculas (2-24 chars)."
  }
}

variable "environment" {
  type        = string
  description = "Entorno: dev | pre | prod."
  validation {
    condition     = contains(["dev", "pre", "prod"], var.environment)
    error_message = "environment debe ser dev, pre o prod."
  }
}

variable "location" {
  type        = string
  description = "Region Azure (p.ej. westeurope, northeurope, francecentral)."
}

variable "tags" {
  type        = map(string)
  description = "Tags adicionales a fusionar con los del módulo."
  default     = {}
}
```

### outputs.tf

```hcl
output "<algo>_id" {
  description = "Resource ID de <algo>, consumido por <quién>."
  value       = azurerm_<x>.<algo>.id
}

output "connection_string" {
  description = "Cadena de conexión a <servicio>. Secreto."
  value       = azurerm_<x>.<algo>.primary_connection_string
  sensitive   = true
}
```

### versions.tf del módulo

```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
    random  = { source = "hashicorp/random",  version = ">= 3.5.0" }
  }
}
```

### versions.tf del env

```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
    random  = { source = "hashicorp/random",  version = ">= 3.5.0" }
  }

  # Dev: backend local para validar sin credenciales.
  # Pre/Prod: SUSTITUIR por backend "azurerm" con Storage Account dedicado.
  backend "local" {
    path = "terraform.tfstate"
  }
  # Ejemplo backend remoto (pre/prod):
  # backend "azurerm" {
  #   resource_group_name  = "tfstate-rg"
  #   storage_account_name = "<tfstate-sa>"
  #   container_name       = "tfstate"
  #   key                  = "<env>.tfstate"
  #   use_oidc             = true
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
```

## Convenciones por módulo (resumen)

### network

- VNet `/16`, subnets `cae` (con delegación `Microsoft.App/environments`), `sql`, `pe`.
- `private_endpoint_network_policies = "Disabled"` en `sql` y `pe`.
- NSGs: `VirtualNetwork → VirtualNetwork` en 443 (cae) y 1433 (sql). Sin `0.0.0.0/0`.

### database

- `azurerm_mssql_server` con `public_network_access_enabled = false` en pre/prod.
- `azuread_administrator` block obligatorio.
- `minimum_tls_version = "1.2"`.
- Private Endpoint hacia `subnet_sql_id`.
- En prod: `lifecycle { prevent_destroy = true }`.

### secrets (Key Vault)

- `enable_rbac_authorization = true`.
- `purge_protection_enabled = true`, `soft_delete_retention_days = 90` en pre/prod.
- Private Endpoint en pre/prod.
- Role assignment `"Key Vault Secrets User"` (NO Owner / NO Contributor) a UAMIs.

### compute

- `azurerm_container_app` con UAMI.
- `ingress { external_enabled = true }` para la API; healthcheck a `/health`.
- Secrets desde KV via `key_vault_secret_id` + `identity`.

### frontend

- `azurerm_static_web_app` con `sku_tier = var.sku_tier`.

### observability

- Log Analytics Workspace, retention por env.
- App Insights, Action Group, Metric Alerts (5xx, latencia p95, DB errors).

### iam

- Role assignments a AAD groups (ops Reader del RG, readonly Reader, CI principal con role custom mínimo).

## Validación obligatoria

```powershell
cd infra/landing-zone
terraform fmt -check -recursive

cd envs/dev
terraform init -backend=false
terraform validate
terraform plan -var "subscription_id=00000000-0000-0000-0000-000000000000" -out=tfplan

# Opcional pero recomendado
tflint --recursive
checkov -d . --quiet --framework terraform
tfsec .
```

## Reglas duras

- Subscription_id, object_ids, claves: SIEMPRE por `variables.tf`.
- `*.tfvars` reales en `.gitignore`. Solo `*.tfvars.example` se versionan.
- Passwords con `random_password` + `azurerm_key_vault_secret`. Nunca literal.
- Sin recursos abiertos a `0.0.0.0/0` salvo exigencia documentada (WAF público).
- TLS 1.2 mínimo. HTTPS-only en Storage / KV.
- `prevent_destroy = true` en prod para SQL / KV / Storage / Static Web App.
- Nunca `terraform apply` en prod desde el agente. El apply real lo dispara `deploy.yml`.

## Anti-patrones

| Anti-patrón | Por qué |
|---|---|
| `azurerm = ">= 3.0"` sin major | Cambios breaking. Usa `~> 4.0`. |
| Tags hardcodeados duplicados en cada recurso | Centralizar en `locals.tags`. |
| Output sin `description` | Pierde contrato. |
| Output con secret sin `sensitive = true` | Lo loguea Terraform. |
| `tfvars` real en git | Secretos filtrados. |
| Backend local en pre/prod | Sin state compartido → caos. |
| Acceso a KV con access policies en vez de RBAC | Modelo obsoleto, dispar entre orgs. |
