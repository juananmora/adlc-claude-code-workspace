# Spec — Infraestructura Azure (IaC)

Terraform sobre Azure (`azurerm ~> 4.0`) para los 3 entornos.

> **Estado vivo.** Última actualización: iter-2.

## Requirements

### REQ-INFRA-1: Provider azurerm versionado

Given cualquier módulo o entorno bajo `infra/`,
when Terraform inicializa,
then `azurerm ~> 4.0` MUST estar declarado como provider en todos los
`versions.tf` y `providers.tf`.

**Validación:** grep en `infra/**/*.tf`.

### REQ-INFRA-2: Recursos mínimos

Given la landing zone,
when se aprovisiona,
then SHALL incluir:
- Resource Group
- VNet con 3 subredes (`subnet-public`, `subnet-private`, `subnet-sql`)
- Azure Container Apps Environment + Container App para API
- Static Web App para frontend
- Azure SQL privado (Private Endpoint)
- Key Vault
- Log Analytics + Application Insights

**Validación:** inspección de `infra/modules/`.

### REQ-INFRA-3: Diferencias por entorno

Given los tres entornos (`dev`, `pre`, `prod`),
when comparas sus variables,
then deben diferir en SKU (más barato en dev, HA en prod), retención
de logs (corta en dev, larga en prod), e `ingress` (público en dev,
internal en prod).

**Validación:** `infra/envs/<env>/terraform.tfvars` con valores distintos.

### REQ-INFRA-4: Validación local

Given un cambio en `infra/`,
when un dev ejecuta `terraform fmt -check -recursive` y `terraform validate`,
then ambos MUST pasar sin errores.

**Validación:** comandos en local o CI cuando Terraform esté disponible.

**Estado actual:** PENDIENTE (Terraform no instalado en la máquina del usuario; resolver con `winget install --id HashiCorp.Terraform -e`).

### REQ-INFRA-5: Sin secretos en código

Given `infra/**`,
when se hace `grep -rE 'password\s*=\s*"\w+"'` en archivos `.tf`,
then SHALL devolver 0 matches. Las contraseñas se generan con
`random_password` y se persisten en Key Vault.

**Validación:** grep + presencia de `azurerm_key_vault_secret`.

### REQ-INFRA-6: Variables y outputs documentados

Given cualquier módulo bajo `infra/modules/`,
when un consumidor lo lee,
then cada `variable` y `output` SHALL tener un bloque `description` no
vacío.

**Validación:** lint manual.

## Evidencia histórica

Cumplido en iter-2 (IaC Azure base). Ver `specs/acceptance-criteria-archive.md` § "IaC Azure".

## Deudas

- REQ-INFRA-4 en rojo permanente hasta instalar Terraform localmente o en CI.
