---
name: project-landing-zone-azure
description: La landing zone IaC del workspace usa Azure (azurerm ~> 4.0), no es agnóstica. Iteración 2 portó los módulos null_resource a recursos reales (Container Apps, Azure SQL privado, Key Vault, Static Web App, Log Analytics, App Insights).
metadata:
  type: project
---

La landing zone en `infra/landing-zone/` esta portada a Azure con `azurerm ~> 4.0` (no es ya agnostica con `null_resource`).

**Why:** PRD computer-catalog Iteracion 2 fija Azure como cloud objetivo.

**How to apply:**
- Cualquier nuevo modulo/recurso debe usar `azurerm_*` (no AWS/GCP).
- Convenciones:
  - RG: `<env>-<project>-rg` (en realidad `<project>-<env>-rg` desde el modulo network).
  - VNet 10.X.0.0/16 con `subnet-cae` /23 (delegada a `Microsoft.App/environments`), `subnet-sql` /28, `subnet-pe` /28.
  - SQL: SKU por entorno (Basic dev, S1 pre, S3 prod). `public_network_access_enabled = false` siempre.
  - Key Vault: RBAC, soft delete; `purge_protection_enabled` en pre/prod; Private Endpoint en pre/prod.
  - Container App: `revision_mode = "Single"`; ingress externo en dev/pre, `internal_load_balancer_enabled = true` en prod.
  - Static Web App elegida frente a Storage+CDN (deploy nativo GitHub Actions, TLS gestionado, menos coste).
- Backend `local` documentado, debe sustituirse por `backend "azurerm"` con `use_oidc = true` en CI/CD.
- Secretos: `random_password` -> `azurerm_key_vault_secret`. Nunca en `.tfvars` ni codigo.
- Validar con: `terraform fmt -recursive`, `terraform fmt -check -recursive`, `terraform init -backend=false` + `terraform validate` por entorno.

Related: [[feedback-terraform-not-installed]]
