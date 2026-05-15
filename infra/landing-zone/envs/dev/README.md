# Entorno: dev

Configuracion de la landing zone para el entorno de desarrollo.

## Caracteristicas

- Tamanos minimos (cpu 0.5, memoria 512 MB, BD small).
- Sin alta disponibilidad.
- Retencion de logs: 7 dias.
- Retencion de backups de BD: 1 dia.
- WAF desactivado.
- Sin gate de aprobacion humana.

## Uso

```powershell
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\infra\landing-zone\envs\dev"
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform plan
```

Para aplicar (solo en cloud real, con credenciales y backend remoto configurados):

```powershell
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

## Backend

Por defecto usa `backend "local"` para validacion local. En cloud real, editar `versions.tf` para apuntar a S3 / Azure Storage / GCS.

## Secretos

- NO incluir secretos en `terraform.tfvars`.
- La password de BD se genera con `random_password` y se persiste en el modulo `secrets`.
