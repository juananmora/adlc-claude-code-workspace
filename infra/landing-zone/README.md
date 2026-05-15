# Landing Zone (Azure)

Infraestructura de la tienda de ordenadores Byteforge en **Azure**.

Provider: `hashicorp/azurerm ~> 4.0`. La password del administrador SQL se genera
con `random_password` y se persiste en Key Vault, jamas en codigo ni `.tfvars`.

## Arquitectura

```
                            Internet
                                |
                       +--------v--------+
                       | Static Web App  |   azurerm_static_web_app
                       | (Next.js)       |   sku Free (dev) / Standard (pre/prod)
                       +--------+--------+
                                | HTTPS
                                |
Resource Group <env>-byteforge-rg
+-- VNet 10.x.0.0/16
|   +-- subnet-cae  /23  (Container Apps Environment, delegada a Microsoft.App/environments)
|   |   +-- Container App "api" (Fastify)
|   |       - revision_mode = Single
|   |       - ingress external (dev/pre) / internal (prod)
|   |       - secret "sql-admin-password" via Key Vault reference (UAMI)
|   +-- subnet-sql  /28  Private Endpoint -> Azure SQL Server (public_network_access = false)
|   +-- subnet-pe   /28  Private Endpoints (Key Vault en pre/prod, Storage, ...)
+-- Azure SQL Server + Database  (Basic dev / S1 pre / S3 prod)
+-- Key Vault  (RBAC, soft delete; purge_protection en pre/prod; PE en pre/prod)
|   +-- sql-admin-password
|   +-- api-app-insights-key
+-- Log Analytics Workspace
+-- Application Insights (workspace-based)
+-- User Assigned Managed Identity (API) con rol "Key Vault Secrets User"
```

## Entornos

- `dev/`  - SKU minimos, retencion 30d (LAW exige >= 7), ingress externo, KV publico, sin PE en KV.
- `pre/`  - SKU intermedios, retencion 30d, ingress externo, PE en KV.
- `prod/` - SKU altos, retencion 90d, ingress interno, PE en KV, purge_protection en KV. Requiere **aprobacion humana** (gate en `.github/workflows/deploy.yml`).

## Diferencias por entorno

| Aspecto                          | dev          | pre          | prod                  |
| -------------------------------- | ------------ | ------------ | --------------------- |
| Container App CPU/Memory         | 0.5 / 1Gi    | 1.0 / 2Gi    | 2.0 / 4Gi             |
| Container App replicas (min/max) | 1 / 2        | 1 / 3        | 2 / 10                |
| Container App ingress            | external     | external     | **internal**          |
| Azure SQL SKU                    | Basic        | S1           | S3                    |
| SQL `zone_redundant`             | no           | no           | **si**                |
| SQL `storage_account_type`       | Local        | Local        | Geo                   |
| `backup_retention_days`          | 7            | 14           | 30                    |
| Log retention (LAW)              | 30           | 30           | 90                    |
| Alarma 5xx (% umbral)            | 10           | 5            | 1                     |
| Alarma p95 (ms umbral)           | 2000         | 1000         | 500                   |
| Static Web App SKU               | Free         | Standard     | Standard              |
| Key Vault `purge_protection`     | no           | si           | si                    |
| Key Vault Private Endpoint       | no           | si           | si                    |
| Gate aprobacion humana           | no           | no           | **si**                |

## Principios obligatorios (CLAUDE.md)

- Sin secretos en codigo. La password del admin SQL se genera con `random_password`
  y se almacena en `azurerm_key_vault_secret` ("sql-admin-password").
- BD nunca expuesta a internet: `public_network_access_enabled = false`, acceso
  exclusivamente via Private Endpoint en `subnet-sql`.
- Container App de prod no expuesto a internet (`internal_load_balancer_enabled = true`).
- Produccion detras de aprobacion humana.
- Infraestructura reproducible (IaC versionada).
- Logs, metricas y alertas minimas por entorno.

## Validacion local

Desde `infra/landing-zone/`:

```powershell
terraform fmt -recursive
terraform fmt -check -recursive
```

En cada entorno:

```powershell
cd .\envs\dev   # o pre / prod
terraform init -backend=false
terraform validate
```

`terraform validate` no requiere credenciales Azure. Para `plan` y `apply` se
requiere una identidad federada (OIDC GitHub -> Azure) o `az login` previo.

## Proximos pasos para desplegar

1. **OIDC GitHub -> Azure**: crear App Registration + federated credential que
   confie en `repo:<org>/<repo>:environment:dev|pre|production`, asignarle role
   assignment limitado al RG del entorno.
2. **Backend remoto**: crear `tfstate-rg` con `storage_account_name` privada y
   container `tfstate`. Sustituir bloques `backend "local"` por `backend "azurerm"`
   con `use_oidc = true`.
3. Rellenar `terraform.tfvars` con `subscription_id`, `azuread_admin_object_id`,
   y opcionalmente `ops_group_object_id`, `readonly_group_object_id`,
   `ci_principal_object_id`.
4. `terraform plan` con el principal federado del workflow.
5. Aprobacion humana del environment `production` en GitHub antes de `apply`.
6. Linkar el backend del Static Web App al Container App via Azure CLI:
   `az staticwebapp backends link --name <swa> --backend-resource-id <container-app-id>`.
