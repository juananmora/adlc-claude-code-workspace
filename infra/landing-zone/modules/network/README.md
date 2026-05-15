# Modulo: network (Azure)

Define la red base de la landing zone en Azure:

- `azurerm_resource_group` que agrupa todos los recursos del entorno.
- `azurerm_virtual_network` con tres subredes:
  - `subnet-cae` (delegada a `Microsoft.App/environments`) — Container Apps Environment.
  - `subnet-sql` — Private Endpoint de Azure SQL.
  - `subnet-pe`  — Private Endpoints generales (Key Vault, Storage, ...).
- `azurerm_network_security_group` minimo por subred (deny por defecto, allow intra-VNet).

## Inputs

| Nombre              | Tipo         | Default          | Descripcion |
| ------------------- | ------------ | ---------------- | ----------- |
| `project_name`      | string       | -                | Prefijo de nombres. Regex `^[a-z][a-z0-9-]{2,30}$`. |
| `environment`       | string       | -                | `dev`, `pre` o `prod`. |
| `location`          | string       | `westeurope`     | Region de Azure. |
| `vnet_cidr`         | string       | `10.10.0.0/16`   | CIDR de la VNet. |
| `subnet_cae_cidr`   | string       | `10.10.0.0/23`   | CIDR subnet ACA. Min /23. |
| `subnet_sql_cidr`   | string       | `10.10.2.0/28`   | CIDR subnet SQL PE. Min /28. |
| `subnet_pe_cidr`    | string       | `10.10.2.16/28`  | CIDR subnet PE generales. Min /28. |
| `tags`              | map(string)  | `{}`             | Tags adicionales. |

## Outputs

| Nombre                 | Descripcion |
| ---------------------- | ----------- |
| `resource_group_name`  | Nombre del RG. |
| `resource_group_id`    | ID del RG. |
| `location`             | Region de Azure. |
| `vnet_id`              | ID de la VNet. |
| `vnet_name`            | Nombre de la VNet. |
| `subnet_cae_id`        | ID subnet ACA. |
| `subnet_sql_id`        | ID subnet PE SQL. |
| `subnet_pe_id`         | ID subnet PE generales. |

## Notas de seguridad

- NSGs sin reglas `0.0.0.0/0`. Solo trafico intra-VNet.
- `private_endpoint_network_policies = "Disabled"` en `subnet-sql` y `subnet-pe`
  (requisito para alojar Private Endpoints).
- Subnet ACA delegada a `Microsoft.App/environments` (obligatorio).
