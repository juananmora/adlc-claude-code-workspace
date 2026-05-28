---
name: ci-cd-pipeline
description: Crea y mantiene los workflows GitHub Actions del repo (ci.yml, deploy.yml, e2e.yml, validate-claude-workspace.yml). Permissions mínimas, actions pinneadas, path filters, security gate obligatorio, deploy-prod con environment + Required reviewers.
when_to_use: Cuando hay que añadir/modificar pipelines: build, test, lint, security scan, E2E, deploys por entorno, gates humanos en producción.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: CI/CD Pipeline

Skill prescriptiva para `.github/workflows/`. Refleja la realidad del repo: monorepo con `apps/api`, `apps/web`, `infra/landing-zone`, Docker compose.

## Workflows obligatorios

### ci.yml — Validación de PR y push a main

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    outputs:
      web: ${{ steps.filter.outputs.web }}
      api: ${{ steps.filter.outputs.api }}
      infra: ${{ steps.filter.outputs.infra }}
    steps:
      - uses: actions/checkout@v4
      - id: filter
        uses: dorny/paths-filter@v3
        with:
          filters: |
            web:
              - 'apps/web/**'
              - '.github/workflows/ci.yml'
            api:
              - 'apps/api/**'
              - '.github/workflows/ci.yml'
            infra:
              - 'infra/**'
              - '.github/workflows/ci.yml'

  api:
    name: API — build & test
    needs: detect-changes
    if: needs.detect-changes.outputs.api == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    defaults:
      run:
        working-directory: apps/api
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/api/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm test

  web:
    name: Web — lint & build
    needs: detect-changes
    if: needs.detect-changes.outputs.web == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    defaults:
      run:
        working-directory: apps/web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/web/package-lock.json
      - run: npm ci
      - run: npm run lint
      - env:
          NEXT_PUBLIC_API_BASE_URL: http://localhost:4000
        run: npm run build

  security:
    name: Security scans
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # gitleaks necesita el historial
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: npm audit — api
        working-directory: apps/api
        run: |
          npm ci --ignore-scripts
          npm audit --audit-level=moderate
      - name: npm audit — web
        working-directory: apps/web
        run: |
          npm ci --ignore-scripts
          npm audit --audit-level=moderate
      - name: Dependency review
        if: github.event_name == 'pull_request'
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: moderate
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Trivy
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: fs
          scan-ref: .
          severity: CRITICAL,HIGH
          exit-code: '1'
          ignore-unfixed: true

  iac-lint:
    name: IaC lint
    needs: detect-changes
    if: needs.detect-changes.outputs.infra == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - id: tfcheck
        run: |
          if find infra -type f -name '*.tf' | grep -q .; then
            echo "has_tf=true" >> "$GITHUB_OUTPUT"
          else
            echo "has_tf=false" >> "$GITHUB_OUTPUT"
          fi
      - if: steps.tfcheck.outputs.has_tf == 'true'
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '1.9.5'
      - if: steps.tfcheck.outputs.has_tf == 'true'
        run: terraform fmt -check -recursive infra
```

### deploy.yml — Despliegues por entorno

```yaml
name: Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Entorno objetivo'
        required: true
        type: choice
        options: [dev, pre, prod]
  push:
    tags: ['v*']

permissions:
  contents: read

jobs:
  build-artifacts: { ... }   # builds API + Web, sube artifacts

  deploy-dev:
    needs: build-artifacts
    if: github.event_name == 'workflow_dispatch' && inputs.environment == 'dev'
    runs-on: ubuntu-latest
    environment: dev   # opcional reviewers
    # ...

  deploy-pre:
    needs: build-artifacts
    if: |
      (github.event_name == 'workflow_dispatch' && inputs.environment == 'pre') ||
      (github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v'))
    runs-on: ubuntu-latest
    environment: pre
    # ...

  deploy-prod:
    needs: build-artifacts
    # PROD: SIEMPRE manual, jamás por tag ni push
    if: github.event_name == 'workflow_dispatch' && inputs.environment == 'prod'
    runs-on: ubuntu-latest
    environment: production   # Settings → Environments: Required reviewers OBLIGATORIO
    # ...
```

Requisito manual (documentar en el header del workflow): en GitHub UI Settings → Environments deben existir `dev`, `pre`, `production`. El env `production` con "Required reviewers" activado. Eso es el gate humano de Fase 11 (ADLC).

### e2e.yml — Playwright contra Docker

```yaml
name: E2E

on:
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  e2e:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: apps/web/package-lock.json }
      - name: Stack up
        run: docker compose up -d --build
      - name: Wait healthy
        run: |
          timeout 180 bash -c '
            until [ "$(docker inspect -f "{{.State.Health.Status}}" ironheart-api)" = "healthy" ] \
              && [ "$(docker inspect -f "{{.State.Health.Status}}" ironheart-web)" = "healthy" ]; do
              sleep 3
            done'
      - name: Playwright
        working-directory: apps/web
        run: |
          npm ci
          npx playwright install --with-deps chromium
          npx playwright test --workers=1
      - name: Stack down
        if: always()
        run: docker compose down -v
      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/playwright-report
```

### validate-claude-workspace.yml — Sanidad del workspace

```yaml
name: Validate Claude workspace

on:
  pull_request:
    paths:
      - '.claude/**'
      - 'CLAUDE.md'

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Validación: cada agente declara skills que existen.
      # Cada skill tiene frontmatter válido (name, description, when_to_use).
      - run: node scripts/validate-claude-workspace.mjs   # implementar si no existe
```

## Reglas duras

- Top-level `permissions: contents: read`. Cada job sube lo mínimo.
- Actions de Anthropic / GitHub / HashiCorp por tag major (`@v4`, `@v3`).
- Actions de terceros menos conocidos pinneadas por SHA.
- `setup-node` con `cache: 'npm'` y `cache-dependency-path` por app.
- `deploy-prod` jamás sin `workflow_dispatch` + `environment: production`.
- `gitleaks` con `fetch-depth: 0` en checkout.
- `trivy` con `severity: CRITICAL,HIGH` y `exit-code: '1'` para fallar el job.
- Playwright en CI: `--workers=1` y `--with-deps chromium`.

## Anti-patrones

- `permissions: write-all` o sin permissions → bloqueo seguridad.
- Secretos en `env:` con literal → exposición.
- Deploy a prod por push o tag → quita el gate humano.
- `npm install` (no `npm ci`) → no determinista.
- Saltar tests con `if:` no documentado → riesgo.
- Job security condicionado a paths → no, corre siempre.
