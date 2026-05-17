# Spec — Plataforma

Fundación cloud del proyecto: entornos, red, identidad, gestión de secretos y gates humanos.

> **Estado vivo.** Última actualización: iter-2 (commit `73b5405`).

## Requirements

### REQ-PLAT-1: Entornos separados

Given una organización que va a desplegar el catálogo,
when se aprovisiona la plataforma,
then los entornos `dev`, `pre` y `prod` MUST estar definidos como módulos
independientes en `infra/envs/`, con variables propias y sin compartir
estado de Terraform.

**Validación:** existencia de `infra/envs/dev`, `infra/envs/pre`, `infra/envs/prod`.

### REQ-PLAT-2: Red pública y privada

Given una red de plataforma,
when se describe su topología,
then la VNet SHALL exponer 3 subredes documentadas:
- `subnet-public` para ingress controlados,
- `subnet-private` para Container Apps,
- `subnet-sql` para la base de datos privada.

**Validación:** `infra/modules/network/main.tf` declara las 3 subredes con CIDRs no solapados.

### REQ-PLAT-3: Base de datos privada

Given una base de datos en cualquier entorno,
when un cliente externo intenta conectarse desde fuera de la VNet,
then el firewall MUST rechazar la conexión.
El recurso Azure SQL SHALL tener `public_network_access_enabled = false`
y un Private Endpoint en `subnet-sql`.

**Validación:** `infra/modules/sql/main.tf` con flag explícito.

### REQ-PLAT-4: Gestión de secretos

Given un secreto (credencial de BD, token, API key),
when se aprovisiona o consume,
then MUST persistir en Azure Key Vault, NO en variables de Terraform
ni en código de aplicación. Los `azurerm_key_vault_secret` SHALL usar
`random_password` para generación.

**Validación:** grep en `infra/` por `password.*=.*"..."` (literales) debe devolver 0 matches; existencia de módulo `infra/modules/keyvault`.

### REQ-PLAT-5: Gate humano para producción

Given un despliegue a `prod`,
when un pipeline lo intenta automáticamente,
then el workflow MUST exigir aprobación manual antes de aplicar
`terraform apply` o desplegar contenedores.

**Validación:** `.github/workflows/deploy.yml` con `environment: production` y `required_reviewers`.

## Evidencia histórica

Criterios cumplidos en iter-1 e iter-2 (commit base + IaC Azure). Ver
`specs/acceptance-criteria-archive.md` §§ "Plataforma" e "IaC Azure".

## Deudas conocidas

- `terraform fmt -check -recursive` y `terraform validate` no se ejecutan en CI porque Terraform no está instalado en la máquina del usuario. Pendiente de adoptar `winget install --id HashiCorp.Terraform` y reactivar el step.
