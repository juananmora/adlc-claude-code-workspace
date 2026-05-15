# Entorno: prod

Configuracion de la landing zone para el entorno de produccion.

## REQUIERE APROBACION HUMANA

El despliegue a produccion esta protegido por un gate manual en CI/CD.

- Gate definido en: `.github/workflows/deploy.yml`, job `deploy-prod`.
- GitHub Environment: `production` con `required reviewers`.
- Nunca ejecutar `terraform apply` directamente en prod desde una maquina local.

## Caracteristicas

- Alta disponibilidad activada (multi-AZ en red y BD).
- Tamanos grandes (cpu 2, memoria 2048 MB, BD large, 200 GB).
- Retencion de logs: 90 dias.
- Retencion de backups de BD: 30 dias.
- WAF activado.
- `deletion_protection = true` en la BD.
- Umbrales de alarma mas estrictos (5xx > 1%, p95 > 500 ms).

## Uso (solo validacion local; NO aplicar)

```powershell
cd "C:\02 - Accenture\03 - Repositorios\adlc-claude-code-workspace\infra\landing-zone\envs\prod"
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform plan
```

## Despliegue real

1. Crear PR con cambios.
2. CI ejecuta `fmt`, `validate`, `plan`, `checkov`, `tflint`.
3. Revisor humano aprueba el PR.
4. Merge a main dispara `deploy.yml` -> job `deploy-prod` -> espera aprobacion del reviewer en GitHub Environment `production`.
5. Solo tras aprobacion se ejecuta `terraform apply`.

## Backend

Por defecto usa `backend "local"` para validacion local. En cloud real, editar `versions.tf` para apuntar a un backend remoto con state locking (S3 + DynamoDB / Azure Storage / GCS).

## Secretos

- NO incluir secretos en `terraform.tfvars`.
- La password de BD se genera con `random_password` y se persiste en el modulo `secrets`.
