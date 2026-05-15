# Modulo: observability (Azure Monitor)

Despliega telemetria de la landing zone en Azure.

## Recursos

- `azurerm_log_analytics_workspace` (SKU PerGB2018).
- `azurerm_application_insights` workspace-based, vinculado al LAW anterior.
- `azurerm_monitor_action_group` con webhook placeholder.
- `azurerm_monitor_metric_alert`:
  - `api-5xx`        - ratio de 5xx en Container App por encima del umbral.
  - `api-latency-p95`- duracion media de request por encima del umbral.
  - `db-errors`      - `connection_failed` en SQL DB por encima del umbral.

Si el target (`container_app_id`, `sql_database_id`) llega vacio, la alerta correspondiente
no se crea (se usa `count = 0`).

## Inputs

| Nombre                     | Tipo   | Default                              | Descripcion |
| -------------------------- | ------ | ------------------------------------ | ----------- |
| `project_name`             | string | -                                    | Prefijo. |
| `environment`              | string | -                                    | dev/pre/prod. |
| `location`                 | string | -                                    | Region. |
| `resource_group_name`      | string | -                                    | RG. |
| `log_retention_days`       | number | `30`                                 | Retencion logs (7-730). |
| `alarm_5xx_threshold_pct`  | number | `5`                                  | Umbral 5xx (%). |
| `alarm_latency_p95_ms`     | number | `1000`                               | Umbral p95 (ms). |
| `alarm_db_errors_threshold`| number | `5`                                  | Umbral fallos conexion BD. |
| `alert_webhook_url`        | string | `https://example.com/ops-webhook`    | Webhook placeholder. |
| `container_app_id`         | string | `""`                                 | Target alertas API. |
| `sql_database_id`          | string | `""`                                 | Target alerta BD. |
| `tags`                     | map    | `{}`                                 | Tags. |

## Outputs

| Nombre                                       | Sensible | Descripcion |
| -------------------------------------------- | -------- | ----------- |
| `log_analytics_workspace_id`                 | no       | ID LAW. |
| `log_analytics_workspace_name`               | no       | Nombre LAW. |
| `application_insights_id`                    | no       | ID App Insights. |
| `application_insights_connection_string`     | **si**   | Connection string App Insights. |
| `application_insights_instrumentation_key`   | **si**   | Instrumentation key (legacy). |
| `action_group_id`                            | no       | ID action group. |
| `alert_ids`                                  | no       | Mapa de IDs de alertas. |
