# Modulo: database (Azure SQL)

Despliega Azure SQL Server + Database privada con Private Endpoint.

## Recursos

- `azurerm_mssql_server` con `public_network_access_enabled = false`, TLS 1.2 minimo.
- `azurerm_mssql_database` con SKU por entorno.
- `azurerm_private_endpoint` en `subnet-sql`.
- `azurerm_private_dns_zone` (`privatelink.database.windows.net`) + virtual network link.
- Administrador AAD configurado (toma `azuread_admin_object_id` como variable).

## SKU recomendado por entorno

| Entorno | sku_name | backup_retention | HA   |
| ------- | -------- | ---------------- | ---- |
| dev     | Basic    | 7                | no   |
| pre     | S1       | 14               | no   |
| prod    | S3       | 30               | si   |

## Inputs

| Nombre                          | Tipo   | Default     | Sensible | Descripcion |
| ------------------------------- | ------ | ----------- | -------- | ----------- |
| `project_name`                  | string | -           | no       | Prefijo. |
| `environment`                   | string | -           | no       | dev/pre/prod. |
| `location`                      | string | -           | no       | Region. |
| `resource_group_name`           | string | -           | no       | RG. |
| `vnet_id`                       | string | -           | no       | VNet. |
| `subnet_sql_id`                 | string | -           | no       | Subnet PE. |
| `administrator_login`           | string | `sqladmin`  | no       | Usuario admin. |
| `administrator_login_password`  | string | -           | **si**   | Password del modulo secrets. |
| `azuread_admin_login`           | string | -           | no       | Display name del admin AAD. |
| `azuread_admin_object_id`       | string | -           | no       | object_id del admin AAD. |
| `sku_name`                      | string | `Basic`     | no       | SKU. |
| `backup_retention_days`         | number | `7`         | no       | Dias retencion. |
| `high_availability`             | bool   | `false`     | no       | zone_redundant + storage Geo. |
| `tags`                          | map    | `{}`        | no       | Tags. |

## Outputs

| Nombre                          | Descripcion |
| ------------------------------- | ----------- |
| `sql_server_id`                 | ID del server. |
| `sql_server_name`               | Nombre. |
| `sql_server_fqdn`               | FQDN privado. |
| `sql_database_id`               | ID de la DB. |
| `sql_database_name`             | Nombre de la DB. |
| `administrator_login`           | Login admin. |
| `private_endpoint_id`           | ID del PE. |
| `connection_string_template`    | Plantilla; la password se inyecta en runtime. |

## Seguridad

- BD no accesible desde Internet (`public_network_access_enabled = false`).
- TLS 1.2 minimo.
- Acceso solo via Private Endpoint en `subnet-sql`.
- Password en Key Vault, jamas en tfvars ni codigo.
- Proteccion contra borrado en prod: el modulo crea un `azurerm_management_lock`
  con `lock_level = "CanNotDelete"` sobre el `azurerm_mssql_server` cuando
  `var.environment == "prod"` (count condicional). El lock se hereda hacia la
  `azurerm_mssql_database` hija. Se aplica al recurso, no al RG, para no
  interferir con el ciclo de vida del resto de recursos del entorno.
  `lifecycle { prevent_destroy }` NO se usa porque no admite expresiones
  dinamicas y bloquearia destroys legitimos en dev/pre.

## Operacion del lock en prod

Para destruir intencionadamente el SQL Server en prod (caso excepcional,
con aprobacion humana), el operador debe eliminar primero el management lock
(via Azure CLI/Portal) y luego ejecutar el destroy. El lock se reaplicara en
el siguiente `terraform apply`.
