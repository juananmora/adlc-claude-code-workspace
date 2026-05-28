---
name: security-review
description: Checklist ejecutable de seguridad para apps/api, apps/web, infra/landing-zone, .github/workflows y Docker. Emite findings con severidad (CRITICAL/HIGH/MEDIUM/LOW). CRITICAL+HIGH bloquean cierre. Re-valida tras fix antes de cerrar finding.
when_to_use: Fase 7 de toda iteración (obligatoria). También cuando se introducen dependencias nuevas, IaC nuevo, contenedores nuevos, secrets, IAM o exposición pública.
allowed-tools: Read Write Edit Bash Grep Glob
---

# Skill: Security Review

Skill prescriptiva. Cada sección lleva comandos exactos y criterios para asignar severidad.

## Severidad y bloqueo

| Sev | Bloquea cierre | Criterio |
|---|---|---|
| CRITICAL | sí | Secretos en código, RCE, SQLi explotable, BD pública en prod, `dangerouslySetInnerHTML` sin sanitización, eval. |
| HIGH | sí | npm audit high, IaC con 0.0.0.0/0 inbound, KV sin RBAC, TLS<1.2, Container root, deploy-prod sin gate humano, path traversal por validación. |
| MEDIUM | no (deuda) | Imágenes Docker grandes con devDeps, IAM role amplio (Contributor), falta soft delete, alerts faltantes. |
| LOW | no | Action sin SHA pin, healthcheck faltante, recomendaciones de hardening menores. |

## Checks obligatorios

### 1. Dependencias npm

```powershell
cd apps/api
npm audit --audit-level=high
npm audit --audit-level=moderate    # informativo

cd apps/web
npm audit --audit-level=high
npm audit --audit-level=moderate
```

- `high+` con fix disponible → HIGH (recomendar `npm audit fix` o bump manual).
- `high+` sin fix → HIGH (documentar excepción + tarea de seguimiento).

### 2. Secretos hardcodeados

```powershell
# Patrones comunes
git grep -nE "(AKIA|ASIA|AIza|sk_live|ghp_|gho_|github_pat_|-----BEGIN)" -- ":(exclude)node_modules" ":(exclude)dist"
git grep -nE "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]{8,}" -- ":(exclude)node_modules" ":(exclude)*.test.*"
# .env / .envrc en el repo
git ls-files -- ".env*" "*.envrc"
```

Cualquier match real → CRITICAL. Rotar la credencial inmediatamente.

### 3. Terraform / infra

```powershell
cd infra/landing-zone
terraform fmt -check -recursive
terraform -chdir=envs/dev init -backend=false
terraform -chdir=envs/dev validate

# Si están instalados
checkov -d . --quiet --framework terraform
tfsec .
```

Criterios manuales (grep por términos):

| Hallazgo | Comando | Severidad |
|---|---|---|
| `0.0.0.0/0` en NSG inbound | `Get-ChildItem -Recurse infra -Include *.tf \| Select-String "0\.0\.0\.0/0"` | HIGH (a menos que sea CDN público con WAF) |
| Key Vault sin RBAC | `Select-String "enable_rbac_authorization\s*=\s*false" infra/...` | HIGH |
| SQL Server público | `Select-String "public_network_access_enabled\s*=\s*true" infra/landing-zone/envs/prod` | HIGH |
| Storage sin TLS 1.2 | `Select-String "min_tls_version" infra/...` (debe ser `"TLS1_2"`) | HIGH si <1.2 |
| Falta `prevent_destroy` en SQL/KV de prod | inspección manual `lifecycle` | MEDIUM |
| Role `Owner`/`Contributor` a UAMI de app | grep `role_definition_name\s*=\s*"(Owner\|Contributor)"` | MEDIUM |
| Falta `purge_protection_enabled` en KV de prod | `Select-String "purge_protection" infra/...envs/prod` | HIGH |

### 4. Docker / docker-compose

`Dockerfile` (cada uno):

```powershell
Get-ChildItem -Recurse -Filter Dockerfile | ForEach-Object {
  Write-Host "==> $($_.FullName)"
  Get-Content $_.FullName
}
```

- ¿`USER node` o `USER 1000`? Si root → HIGH.
- ¿Multi-stage? Si runtime incluye `node_modules` completos con devDeps → MEDIUM.
- ¿Imagen base pinneada por digest (`@sha256:...`)? Si solo por tag → LOW.
- ¿`HEALTHCHECK`? Si falta → LOW.

`docker-compose.yml`:
- `CORS_ORIGIN` restrictivo (no `*`)? Si `*` → HIGH.
- Volúmenes con secretos montados rw → MEDIUM si podría ser ro.

### 5. API (apps/api)

```powershell
# CORS abierto
Select-String -Path apps/api/src/**/* -Pattern "origin:\s*['\"]?\*"

# Routes sin schema
Select-String -Path apps/api/src/routes/*.ts -Pattern "app\.(get|post|put|delete)<" -Context 0,3
```

- CORS `*` en prod → HIGH.
- Route sin `schema: { ... }` → HIGH (input no validado).
- Path param sin `pattern` en schema → HIGH (path traversal posible).
- `setErrorHandler` que filtra stack traces → debe estar (ya está en `app.ts`); si lo quitan → MEDIUM.

### 6. Frontend (apps/web)

```powershell
# dangerouslySetInnerHTML
Get-ChildItem -Recurse apps/web -Include *.tsx,*.ts | Select-String "dangerouslySetInnerHTML"

# eval / new Function
Get-ChildItem -Recurse apps/web -Include *.tsx,*.ts | Select-String -Pattern "(\beval\(|new Function\()"

# target="_blank" sin rel
Get-ChildItem -Recurse apps/web -Include *.tsx | Select-String 'target="_blank"' -Context 0,3
```

- `dangerouslySetInnerHTML` sin DOMPurify u origen confiable → CRITICAL.
- `eval` / `new Function` → CRITICAL.
- `target="_blank"` sin `rel="noopener noreferrer"` → MEDIUM.
- Path params sin `encodeURIComponent` → MEDIUM (XSS reflejado posible).

### 7. GitHub Actions (.github/workflows/*.yml)

```powershell
Get-ChildItem .github/workflows/*.yml | ForEach-Object { Write-Host "==> $($_.Name)"; Get-Content $_.FullName }
```

- `permissions: write-all` o sin `permissions:` → HIGH.
- Secretos en `env:` con valor literal → CRITICAL.
- Job `deploy-prod` sin `environment: production` → HIGH.
- Actions sin pinear (sin `@v4` ni `@sha`) → LOW.
- `gitleaks-action` corriendo con `fetch-depth: 0` en checkout → debe estar.

### 8. Fair use / créditos

Si hay imágenes nuevas en `apps/web/public/covers/`:
- Confirma entrada en `apps/web/lib/credits.ts` (`author`, `publisher`, `year`, `url`).
- Confirma render en `/about`.
- Si falta → MEDIUM.

## Workflow del agente

1. Lee diff de la iter.
2. Para cada check arriba, ejecuta el comando.
3. Anota findings en tabla (formato del agente `security-engineer.md`).
4. Si CRITICAL/HIGH: lista pasos exactos de remediación y delega al agente responsable.
5. Cuando el implementador diga "fixed", **vuelve a ejecutar el check**. El finding solo se cierra si el comando que falló ahora pasa.
6. Veredicto final: APROBADO / APROBADO CON OBSERVACIONES / BLOQUEADO.

## Anti-patrones

- "Fixed según el agente" sin re-ejecutar el check → no se cierra.
- Bajar severidad porque "es solo MVP" → no.
- Aprobar con CRITICAL/HIGH abiertos "porque el reviewer ya lo vio" → no.
- Marcar finding como falso positivo sin evidencia documentada → no.
