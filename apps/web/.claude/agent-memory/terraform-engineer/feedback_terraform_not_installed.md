---
name: feedback-terraform-not-installed
description: Terraform CLI no está instalado en la máquina del usuario; no inventar resultados de fmt/validate. Dejar instrucción de instalación como pendiente.
metadata:
  type: feedback
---

Terraform CLI no esta disponible en PATH en la maquina del usuario (verificado en bash y PowerShell: `command not found` / `not recognized`).

**Why:** El usuario pidio explicitamente: "Si Terraform no está instalado, dilo claramente. NO inventes resultados". Inventar outputs de `terraform validate` rompe la confianza y oculta que el código nunca fue verificado contra el parser/schema real.

**How to apply:**
- Cuando se ejecuten skills de generacion Terraform en este workspace, primero comprobar `terraform version`.
- Si no esta instalado: reportar literalmente que falta, dejar `winget install --id HashiCorp.Terraform -e` como instruccion pendiente, marcar los checkboxes de fmt/validate en `specs/acceptance-criteria.md` como pendientes con la causa, y NO ejecutar nada simulado.
- Cuando el usuario lo instale, volver a correr `terraform fmt -recursive`, `terraform fmt -check -recursive` y `terraform init -backend=false; terraform validate` en `envs/dev|pre|prod` desde `infra/landing-zone/`.

Related: [[project-landing-zone-azure]]
