# Modulo: frontend (Azure Static Web Apps)

Hosting del frontend Next.js usando `azurerm_static_web_app`.

## Decision: Static Web App vs Storage+CDN

Elegido **Static Web App** porque:

1. Integra build/deploy nativo desde GitHub Actions sin pipeline aparte.
2. Routing SPA y APIs serverless out-of-the-box.
3. TLS y dominios gestionados sin emitir certificados manualmente.
4. Menor superficie de gestion y coste para un Next.js estatico.

Si en el futuro se requiere SSR completo o headers/edge logic muy custom,
migrar a Container Apps (con Front Door delante) o a Storage+CDN+Functions.

## Recursos

- `azurerm_static_web_app` con `sku_tier` por entorno (Free / Standard).
- Identity `SystemAssigned`.
- (Opcional, pre/prod): registro del backend Container App como function app linked.

## SKU por entorno

| Entorno | sku_tier |
| ------- | -------- |
| dev     | Free     |
| pre     | Standard |
| prod    | Standard |

## Inputs

| Nombre                  | Tipo   | Default     | Descripcion |
| ----------------------- | ------ | ----------- | ----------- |
| `project_name`          | string | -           | Prefijo. |
| `environment`           | string | -           | dev/pre/prod. |
| `location`              | string | -           | Region (limitada por SWA: westeurope, eastus2, ...). |
| `resource_group_name`   | string | -           | RG. |
| `sku_tier`              | string | `Free`      | Free / Standard. |
| `api_container_app_id`  | string | `""`        | ID del Container App backend (Standard). |
| `tags`                  | map    | `{}`        | Tags. |

## Outputs

| Nombre                | Sensible | Descripcion |
| --------------------- | -------- | ----------- |
| `static_web_app_id`   | no       | ID del SWA. |
| `static_web_app_name` | no       | Nombre. |
| `default_hostname`    | no       | `<name>.azurestaticapps.net`. |
| `public_url`          | no       | URL publica completa. |
| `api_key`             | **si**   | API key para CI/CD (deploy). |
