# Modulo: compute (Azure Container Apps)

Despliega el runtime de la API en Azure Container Apps (ACA).

## Recursos

- `azurerm_user_assigned_identity` (UAMI) consumida por el Container App.
- `azurerm_container_app_environment`:
  - `infrastructure_subnet_id` = subnet-cae (debe estar delegada a `Microsoft.App/environments`).
  - `log_analytics_workspace_id` recibido del modulo observability.
  - `internal_load_balancer_enabled = true` en prod (ingress no expuesto a Internet).
- `azurerm_container_app`:
  - `revision_mode = "Single"`.
  - `identity.type = "UserAssigned"` apuntando a la UAMI.
  - `secret` referenciando un secret de Key Vault via `key_vault_secret_id` + `identity`.
  - `template.http_scale_rule` por requests concurrentes.
  - `ingress.external_enabled = false` en prod, `true` en dev/pre.

## Inputs

| Nombre                            | Tipo   | Default | Sensible | Descripcion |
| --------------------------------- | ------ | ------- | -------- | ----------- |
| `project_name`                    | string | -       | no       | Prefijo. |
| `environment`                     | string | -       | no       | dev/pre/prod. |
| `location`                        | string | -       | no       | Region. |
| `resource_group_name`             | string | -       | no       | RG. |
| `subnet_cae_id`                   | string | -       | no       | Subnet delegada al CAE. |
| `log_analytics_workspace_id`      | string | -       | no       | LAW para logs del CAE. |
| `container_image`                 | string | `mcr.microsoft.com/azuredocs/aci-helloworld:latest` | no | Imagen. |
| `target_port`                     | number | `8080`  | no       | Puerto interno. |
| `cpu`                             | number | `0.5`   | no       | vCPU (0.25-2.0). |
| `memory`                          | string | `1Gi`   | no       | Memoria ('0.5Gi', '1Gi'...). |
| `min_replicas`                    | number | `1`     | no       | Replicas minimas. |
| `max_replicas`                    | number | `3`     | no       | Replicas maximas. |
| `scale_concurrent_requests`       | number | `50`    | no       | Trigger scale HTTP. |
| `sql_server_fqdn`                 | string | -       | no       | FQDN BD. |
| `sql_database_name`               | string | -       | no       | Nombre BD. |
| `sql_admin_login`                 | string | -       | no       | Login admin BD. |
| `sql_password_kv_secret_id`       | string | -       | no       | ID secret en KV. |
| `app_insights_connection_string`  | string | -       | **si**   | Connection string App Insights. |
| `tags`                            | map    | `{}`    | no       | Tags. |

## Outputs

| Nombre                            | Descripcion |
| --------------------------------- | ----------- |
| `container_app_id`                | ID del Container App. |
| `container_app_name`              | Nombre. |
| `container_app_fqdn`              | FQDN (publico en dev/pre, interno en prod). |
| `container_app_environment_id`    | ID del CAE. |
| `api_uami_id`                     | ID de la UAMI. |
| `api_uami_principal_id`           | principal_id (objet_id) - lo consume secrets para el role assignment. |
| `api_uami_client_id`              | Client ID de la UAMI. |

## Seguridad

- No se inyectan passwords como env vars literales. Se referencia el secret en
  Key Vault mediante `key_vault_secret_id` + `identity` (acceso por UAMI).
- En prod, ingress interno; el publico se canaliza por Front Door / App Gateway
  (fuera de alcance de esta iteracion).
