# Entorno: pre

Configuracion de la landing zone para el entorno de preproduccion.

## Caracteristicas

- Tamanos intermedios (cpu 1, memoria 1024 MB, BD medium).
- Sin alta disponibilidad (replicar topologia prod en escala reducida).
- Retencion de logs: 30 dias.
- Retencion de backups de BD: 7 dias.
- WAF activado (igual que prod).
- Sin gate de aprobacion.

## Uso

```powershell
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\infra\landing-zone\envs\pre"
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform plan
```

## Backend

Por defecto usa `backend "local"` para validacion local. En cloud real, editar `versions.tf` para apuntar a S3 / Azure Storage / GCS.

## Secretos

- NO incluir secretos en `terraform.tfvars`.
- La password de BD se genera con `random_password` y se persiste en el modulo `secrets`.
