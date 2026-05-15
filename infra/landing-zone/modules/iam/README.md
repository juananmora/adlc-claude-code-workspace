# Modulo: iam (Azure RBAC)

Asigna roles built-in de Azure a nivel de Resource Group.

No crea usuarios ni grupos. Los principales (object_id) llegan como variables y
deben existir previamente en Entra ID. Si una variable viene vacia, el role
assignment correspondiente no se crea (count = 0).

## Recursos

- `azurerm_role_assignment` "ops_contributor"      = Contributor    (RG)
- `azurerm_role_assignment` "readonly_reader"      = Reader         (RG)
- `azurerm_role_assignment` "readonly_monitoring"  = Monitoring Reader (RG)
- `azurerm_role_assignment` "ci_contributor"       = Contributor    (RG) - solo dev/pre

## Diseño

- En prod, el CI/CD NO recibe Contributor automatico. El deploy a prod pasa por
  el gate humano del workflow (`environment: production`) y usa una federated
  identity con scope acotado configurada fuera del modulo.
- La UAMI de la API se crea en `compute` y recibe `Key Vault Secrets User` en
  `secrets`. No se duplica aqui.

## Inputs

| Nombre                     | Tipo   | Default | Descripcion |
| -------------------------- | ------ | ------- | ----------- |
| `project_name`             | string | -       | Prefijo. |
| `environment`              | string | -       | dev/pre/prod. |
| `resource_group_name`      | string | -       | RG destino. |
| `ops_group_object_id`      | string | `""`    | Grupo AAD ops. |
| `readonly_group_object_id` | string | `""`    | Grupo AAD readonly. |
| `ci_principal_object_id`   | string | `""`    | Principal de CI federado. |

## Outputs

| Nombre                              | Descripcion |
| ----------------------------------- | ----------- |
| `ops_contributor_assignment_id`     | ID assignment ops. |
| `readonly_reader_assignment_id`     | ID assignment Reader. |
| `readonly_monitoring_assignment_id` | ID assignment Monitoring Reader. |
| `ci_contributor_assignment_id`      | ID assignment CI (vacio en prod). |
