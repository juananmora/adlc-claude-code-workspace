---
name: generate-terraform-modules
description: Genera módulos Terraform seguros, reutilizables y validados para una landing zone o aplicación.
when_to_use: Cuando se necesita IaC con Terraform: módulos, variables, outputs, providers, entornos o validación.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Generate Terraform Modules

## Instrucciones

Crea Terraform con:

- módulos pequeños y reutilizables;
- `variables.tf`;
- `outputs.tf`;
- `main.tf`;
- README del módulo;
- configuración por entorno;
- valores sensibles como variables secretas, nunca hardcodeados.

## Validaciones sugeridas

Ejecuta o prepara:

```bash
terraform fmt -recursive
terraform validate
terraform plan
```

Cuando existan herramientas:

```bash
tflint
checkov
```

## Reglas

- No ejecutes `terraform apply` en producción.
- No abras servicios a `0.0.0.0/0` salvo exigencia documentada.
- No guardes secretos.
