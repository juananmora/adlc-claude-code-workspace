# GitHub Actions workflows

Este directorio contiene los pipelines CI/CD del monorepo. Siguen los principios de ADLC definidos en `CLAUDE.md` y los criterios de aceptación en `specs/acceptance-criteria.md`.

## Workflows

### `ci.yml` — Validación de PR y push a `main`

Se dispara en cualquier `pull_request` contra `main` y en cada `push` a `main`. Usa `dorny/paths-filter` para correr solo los jobs relevantes a los archivos modificados.

Jobs:

- **detect-changes** — calcula qué áreas del monorepo cambiaron (`api`, `web`, `infra`).
- **api** — `npm ci`, `npm run build`, `npm test` en `apps/api/`.
- **web** — `npm ci`, `npm run lint`, `npm run build` en `apps/web/`.
- **security** — corre siempre:
  - `npm audit --audit-level=high` en api y web (falla en HIGH+).
  - `actions/dependency-review-action@v4` solo en PRs.
  - `gitleaks/gitleaks-action@v2` para detectar secretos.
  - `aquasecurity/trivy-action@v0.36.0` en modo `fs` con severidad `CRITICAL,HIGH` y `exit-code=1`.
- **iac-lint** — `terraform fmt -check -recursive` si y solo si hay archivos `.tf` bajo `infra/`. Mientras no exista Terraform real, se omite automáticamente.

Cualquier fallo en estos jobs bloquea el merge (configura branch protection en `Settings → Branches` requiriendo estos checks).

### `deploy.yml` — Despliegue por entorno

Se dispara de dos formas:

- **`workflow_dispatch`** manual con input `environment` (`dev` | `pre` | `prod`).
- **`push` de tag `v*`** — dispara automáticamente `deploy-pre`. Producción nunca se dispara por tag.

Jobs:

- **build-artifacts** — construye API y Web y publica como artifacts (`api-dist`, `web-dist`).
- **deploy-dev** — descarga artifacts, despliega (placeholder), smoke tests.
- **deploy-pre** — igual que dev, sobre el entorno `pre`.
- **deploy-prod** — solo manual. Usa `environment: production`, que en GitHub UI debe tener **Required reviewers** activos. Este es el gate humano obligatorio que exige CLAUDE.md.

> Los pasos de despliegue son placeholders (`echo "Deploying..."`) hasta que exista el Terraform real en `infra/landing-zone/`.

## Configuración manual requerida en GitHub

### 1. Environments

En `Settings → Environments` crear tres entornos:

| Entorno      | Required reviewers | Notas |
|--------------|--------------------|-------|
| `dev`        | No                 | Deploy rápido para QA interno. |
| `pre`        | Opcional           | Pre-producción / staging. |
| `production` | **Sí (obligatorio)** | Mínimo 1 reviewer. **Este es el gate ADLC.** |

Para `production`, además del required reviewer, recomendado:
- Restringir a la rama `main` (Deployment branches → Selected branches → `main`).
- Habilitar "Wait timer" si se quiere ventana de revisión.

### 2. Secretos

Nunca commitear secretos. Para cada entorno, en `Settings → Environments → <env> → Environment secrets`, añadir lo que vaya necesitando el deploy (p. ej. `AWS_ROLE_ARN`, `NEXT_PUBLIC_API_BASE_URL`, credenciales de registry, etc.).

Para secretos compartidos entre workflows (no entornos), usar `Settings → Secrets and variables → Actions → Repository secrets`.

### 3. Branch protection

En `Settings → Branches`, proteger `main` requiriendo:

- Status checks: `API — build & test`, `Web — lint & build`, `Security scans`, `IaC lint`.
- Required reviewers en pull requests.
- "Require branches to be up to date before merging".

## Pendientes

- Implementar el despliegue real (Terraform apply + publicación de imágenes/artefactos) cuando `infra/landing-zone/` tenga código `.tf`.
- Añadir tests para `apps/web` y conectarlos al job `web` en `ci.yml`.
- Sustituir placeholder `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` por el valor del entorno en cada deploy.
