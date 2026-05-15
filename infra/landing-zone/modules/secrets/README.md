# Modulo: secrets (Azure Key Vault)

Aloja secretos de la landing zone en `azurerm_key_vault` con RBAC.

## Recursos

- `azurerm_key_vault` con `enable_rbac_authorization = true` y `soft_delete_retention_days = 7`.
- `purge_protection_enabled = true` en pre/prod.
- `public_network_access_enabled = false` en pre/prod (con Private Endpoint).
- Private Endpoint + Private DNS Zone (`privatelink.vaultcore.azure.net`) en pre/prod.
- `azurerm_key_vault_secret`:
  - `sql-admin-password` - valor generado con `random_password`.
  - `api-app-insights-key` - connection string de App Insights (opcional).
- `azurerm_role_assignment` para:
  - Principal de Terraform = "Key Vault Secrets Officer".
  - Identidades consumidoras (UAMI de la API) = "Key Vault Secrets User".

## Inputs

| Nombre                            | Tipo          | Default | Descripcion |
| --------------------------------- | ------------- | ------- | ----------- |
| `project_name`                    | string        | -       | Prefijo. |
| `environment`                     | string        | -       | dev/pre/prod. |
| `location`                        | string        | -       | Region Azure. |
| `resource_group_name`             | string        | -       | RG destino. |
| `vnet_id`                         | string        | -       | VNet a vincular DNS PE. |
| `subnet_pe_id`                    | string        | -       | Subnet para PE. |
| `secrets_user_principal_ids`      | list(string)  | `[]`    | object_id de identidades con acceso de lectura. |
| `app_insights_connection_string`  | string        | `""`    | Connection string a guardar. Sensitive. |
| `tags`                            | map(string)   | `{}`    | Tags. |

## Outputs

| Nombre                            | Descripcion |
| --------------------------------- | ----------- |
| `key_vault_id`                    | ID del KV. |
| `key_vault_name`                  | Nombre del KV. |
| `key_vault_uri`                   | URI (https://<name>.vault.azure.net/). |
| `sql_admin_password_secret_id`    | ID del secret sql-admin-password. |
| `sql_admin_password_secret_name`  | Nombre del secret. |
| `sql_admin_password`              | Password en claro (sensitive). Consumida por modulo database. |

## Reglas

- Las passwords se generan con `random_password`, NUNCA hardcodeadas.
- El output `sql_admin_password` viaja entre modulos como `sensitive`.
- Soft delete activado en todos los entornos.
- Proteccion contra borrado en prod: el modulo crea un `azurerm_management_lock`
  con `lock_level = "CanNotDelete"` sobre el `azurerm_key_vault` cuando
  `var.environment == "prod"` (count condicional). Combinado con
  `purge_protection_enabled = true` (activo en pre/prod), evita borrados y
  purges accidentales del Key Vault productivo. `lifecycle { prevent_destroy }`
  NO se usa porque no admite expresiones dinamicas y bloquearia destroys
  legitimos en dev/pre.

## Operacion del lock en prod

Para destruir intencionadamente el KV en prod (excepcional, con aprobacion
humana), el operador debe eliminar primero el management lock (via Azure
CLI/Portal) y luego ejecutar el destroy. El lock se reaplicara en el
siguiente `terraform apply`.
