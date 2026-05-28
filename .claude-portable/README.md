# Claude Code Workspace — Portable Pack (ADLC catálogo Next.js + Fastify + Azure)

Pack autocontenido para arrancar un nuevo proyecto tipo **catálogo web ADLC** con el mismo flujo y nivel de calidad que el repo `adlc-claude-code-workspace`.

## Qué incluye

```
.claude-portable/
├─ README.md                     # esta guía
├─ CLAUDE.md.template            # plantilla de CLAUDE.md (raíz del repo)
├─ openspec/
│  └─ config.yaml.template       # plantilla de openspec/config.yaml
├─ agents/                       # 9 agentes ejecutores (prescriptivos)
│  ├─ backend-engineer.md
│  ├─ frontend-engineer.md
│  ├─ qa-engineer.md
│  ├─ security-engineer.md
│  ├─ reviewer.md
│  ├─ cicd-engineer.md
│  ├─ cloud-architect.md
│  ├─ terraform-engineer.md
│  └─ observability-engineer.md
└─ skills/                       # 11 skills prescriptivas
   ├─ create-prd/SKILL.md
   ├─ plan-agentic-work/SKILL.md
   ├─ design-landing-zone/SKILL.md
   ├─ generate-terraform-modules/SKILL.md
   ├─ generate-product-api/SKILL.md
   ├─ create-catalog-ui/SKILL.md
   ├─ ci-cd-pipeline/SKILL.md
   ├─ generate-tests/SKILL.md
   ├─ security-review/SKILL.md
   ├─ observability-design/SKILL.md
   └─ review-pr/SKILL.md
```

## Stack codificado en los agentes y skills

- **Frontend**: Next.js 15 App Router + React 19 + TypeScript 5.6 + Tailwind 3.4 + shadcn/ui (`new-york`) + Radix + lucide-react + Zustand + Sonner.
- **Backend**: Fastify 5 + TypeScript 5.6 ESM + `@fastify/cors` + `@fastify/sensible` + Vitest 4.
- **Tests E2E**: Playwright 1.60 con `--workers=1` (la API es single-threaded en dev).
- **Cloud**: Azure con `azurerm ~> 4.0` (Container Apps, SQL, Key Vault, Static Web App, Log Analytics, App Insights).
- **CI/CD**: GitHub Actions con `permissions` mínimas, actions pinneadas, path filters, security gate, deploy con `environment: production` + Required reviewers.
- **Contenedores**: node:22-alpine multi-stage, `USER node`, healthchecks. `docker-compose.yml` con `API_BASE_URL_INTERNAL` para SSR.

> Si tu proyecto usa otro stack, primero ajusta los agentes/skills aquí, luego cópialos.

## Cómo trasplantarlo a un nuevo repo

### 1. Copiar la estructura `.claude/`

Desde el nuevo repo (ej. `nuevo-catalogo/`):

```powershell
# Linux/macOS
cp -r path/to/.claude-portable/agents nuevo-catalogo/.claude/agents
cp -r path/to/.claude-portable/skills nuevo-catalogo/.claude/skills

# Windows PowerShell
Copy-Item -Recurse path\to\.claude-portable\agents nuevo-catalogo\.claude\agents
Copy-Item -Recurse path\to\.claude-portable\skills nuevo-catalogo\.claude\skills
```

### 2. Copiar y rellenar `CLAUDE.md`

```powershell
Copy-Item path\to\.claude-portable\CLAUDE.md.template nuevo-catalogo\CLAUDE.md
```

Edita `CLAUDE.md` y reemplaza los placeholders:

- `<PROJECT_NAME>` → nombre del proyecto.
- `<AREAS>` → áreas iniciales (p.ej. `platform, infra-azure, catalog-products`).
- `<BRAND_NAME>` → nombre de marca de tu portal (sustituye `IRON DECK` si renuncias a esa línea gráfica).

### 3. Copiar y rellenar `openspec/config.yaml`

```powershell
mkdir nuevo-catalogo\openspec
Copy-Item path\to\.claude-portable\openspec\config.yaml.template nuevo-catalogo\openspec\config.yaml
```

Ajusta `context:` con tu monorepo real.

### 4. Crear estructura mínima de carpetas

```
nuevo-catalogo/
├─ CLAUDE.md
├─ .claude/
│  ├─ agents/
│  └─ skills/
├─ openspec/
│  ├─ config.yaml
│  └─ changes/
├─ specs/
│  ├─ areas/
│  │  ├─ platform/spec.md
│  │  └─ infra-azure/spec.md
│  └─ acceptance-criteria-archive.md
├─ reports/
├─ apps/
│  ├─ api/           # backend-engineer trabaja aquí
│  └─ web/           # frontend-engineer trabaja aquí
├─ infra/
│  └─ landing-zone/  # terraform-engineer trabaja aquí
└─ .github/
   └─ workflows/     # cicd-engineer trabaja aquí
```

Crea los `specs/areas/<area>/spec.md` vacíos con un encabezado. La primera iter los rellena.

### 5. Primera iteración

Desde Claude Code en el nuevo repo:

```
> Quiero arrancar el proyecto con el área products: 10 entradas
> con id, name, description, coverUrl. Necesito API + UI + tests +
> security gate + reviewer.
```

Claude principal aplicará el flujo ADLC de 12 fases del `CLAUDE.md`. Verás:

1. Fase 1-3: PRD + criterios G/W/T.
2. Fase 4-5: plan de agentes.
3. Fase 6: delegará a `backend-engineer`, `frontend-engineer`, `qa-engineer` con prompts autocontenidos. Cada uno invocará su skill y producirá su reporte.
4. Fase 7: `security-engineer` audita y emite findings.
5. Fase 8: auditoría criterio por criterio.
6. Fase 9: smoke MCP en navegador.
7. Fase 10: `reviewer` independiente da veredicto.
8. Fase 11: el humano (tú) aprueba.
9. Fase 12: `/ship` abre el PR.

## Reglas críticas codificadas (no las saltes)

- **qa-engineer + security-engineer + reviewer son OBLIGATORIOS en TODA iter.** Incluso si "solo es infra" o "solo es refactor" — los bugs de SSR/Docker se escapan precisamente ahí.
- **Playwright `--workers=1` siempre.** La API de Fastify dev es single-threaded.
- **`resolveApiBase()` en cualquier `fetch` server-side del frontend.** Sin esto, las fichas se rompen en Docker.
- **Validación contra Docker** cuando la iter toca infra/docker/deploy. No basta `npm run dev`.
- **0 errores de consola del navegador.** Cualquier error = bug.
- **CRITICAL/HIGH del security-engineer bloquean cierre.** Se re-valida tras fix.
- **Producción solo con aprobación humana.** `deploy.yml` con `environment: production` + Required reviewers.

## Línea gráfica IRON DECK

La skill `create-catalog-ui` codifica la estética del repo origen (paleta sangre+bone+black, fuentes Inter+Cinzel, cards con border-2 y hover rojo). Si tu proyecto necesita otra línea gráfica:

- Edita `skills/create-catalog-ui/SKILL.md` y reemplaza la sección "Línea gráfica IRON DECK".
- Edita el agente `agents/frontend-engineer.md` en la misma sección.
- Si el cambio es grande (otro framework, otro design system), considera empezar por modificar las skills antes de la primera iter.

## Personalización rápida común

| Quiero... | Edito... |
|---|---|
| Cambiar de Azure a AWS | `agents/cloud-architect.md`, `agents/terraform-engineer.md`, `skills/design-landing-zone/SKILL.md`, `skills/generate-terraform-modules/SKILL.md` |
| Cambiar de Fastify a NestJS/Express | `agents/backend-engineer.md` + `skills/generate-product-api/SKILL.md` |
| Cambiar de Next.js a Remix/Nuxt | `agents/frontend-engineer.md` + `skills/create-catalog-ui/SKILL.md` |
| Cambiar línea gráfica | Sección "Línea gráfica IRON DECK" en agente front + skill create-catalog-ui |
| Endurecer security (audit-level=critical) | `skills/security-review/SKILL.md` |
| Añadir un nuevo agente (ej. `data-engineer`) | Crear `agents/data-engineer.md` + skill propia + actualizar `CLAUDE.md § Fase 4` |

## Validación del pack en un nuevo repo

Tras copiar, comprueba que cada agente referenciado en `CLAUDE.md` existe:

```powershell
$agentes = "backend-engineer","frontend-engineer","qa-engineer","security-engineer","reviewer","cicd-engineer","cloud-architect","terraform-engineer","observability-engineer"
foreach ($a in $agentes) { if (-not (Test-Path ".claude/agents/$a.md")) { Write-Error "Falta $a" } }

$skills = "create-prd","plan-agentic-work","design-landing-zone","generate-terraform-modules","generate-product-api","create-catalog-ui","ci-cd-pipeline","generate-tests","security-review","observability-design","review-pr"
foreach ($s in $skills) { if (-not (Test-Path ".claude/skills/$s/SKILL.md")) { Write-Error "Falta $s" } }
```

## Origen

Este pack destila prácticas de un flujo ADLC validado end-to-end con varios catálogos web sobre el mismo stack (Next.js + Fastify + Azure). Cada anti-patrón documentado viene de un incidente real en producción: bug SSR cuando los server components hacen fetch a `localhost` dentro de un contenedor, regresiones que pasaron tests pero rompieron Docker, fichas que dejaron de renderizar tras un refactor de infra. La regla de "qa + security + reviewer obligatorios en TODA iter" no es burocracia: es la salvaguarda que evita repetir esos bugs.
