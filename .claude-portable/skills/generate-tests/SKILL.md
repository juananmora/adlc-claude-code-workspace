---
name: generate-tests
description: Genera test plan + tests Vitest (unit+integración API con app.inject) + Playwright E2E (--workers=1, debounce-aware, contra Docker). Cobertura por área. Tolerancia cero a errores de consola del navegador.
when_to_use: Cuando hay que validar criterios G/W/T de un área del catálogo, o cuando una iteración toca infra/docker/deploy y exige re-validación contra el nuevo entorno.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Generate Tests

Implementa la estrategia de pruebas del repo: Vitest + Playwright. Cero ambigüedad sobre qué se testea y cómo.

## Stack fijo

- **Unit + integración API**: Vitest 4, desde `apps/api/`, con `buildApp() + app.inject()`.
- **E2E navegador**: Playwright 1.60, desde `apps/web/`, con `--workers=1` SIEMPRE (API single-threaded).
- **Smoke**: Chrome DevTools MCP — el orquestador lo dispara siguiendo tu plan.

## Pasos obligatorios

### 1. Test plan

Crea `reports/iter-<N>/qa-test-plan.md`:

```markdown
# Test plan iter-<N>

## Mapping criterio → test
| Criterio (G/W/T) | Tipo | Archivo:línea | Estado |
|---|---|---|---|
| Given lista /consoles, when GET, then 200 + 10 items | MUST | apps/api/tests/consoles.test.ts:37 | verde |
| Given /consoles UI, when carga, then h1 + 10 cards + 0 errores consola | MUST | apps/web/e2e/consoles.spec.ts:31 | verde |
| ... | | | |

## Capas
- Unit/Integración: `cd apps/api; npm test`
- Type check API: `cd apps/api; npx tsc --noEmit`
- E2E: `cd apps/web; npx playwright test --workers=1`
- Type check Web: `cd apps/web; npx tsc --noEmit -p tsconfig.json`
- Lint Web: `cd apps/web; npm run lint`
- Smoke MCP: rutas listadas abajo
- Contra Docker (si aplica): `docker compose up -d` + Playwright contra puertos publicados

## Smoke MCP — rutas obligatorias
- /<area>           (listado, 0 errores consola)
- /<area>/<id1>     (ficha 1, server component fetch OK)
- /<area>/<id2>     (ficha 2 distinta)
- /<area>/unknown-x (404)
```

### 2. Tests Vitest

Patrón canónico (ver `apps/api/tests/consoles.test.ts` como referencia):

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { <AREAS_UPPER> } from "../src/data/<area>.js";
import type { <Area> } from "../src/types/<area>.js";

let app: FastifyInstance;
beforeAll(async () => {
  app = await buildApp({
    config: { port: 0, host: "127.0.0.1", corsOrigin: ["http://localhost:3000"], nodeEnv: "test" },
    logger: false,
  });
  await app.ready();
});
afterAll(async () => { await app.close(); });

describe("GET /<area>", () => {
  it("returns all (N exact)", async () => { /* conteo exacto */ });
  it("filters by ?q=...", async () => { /* assert substring + conteo */ });
  it("filters by ?filtroX=...", async () => { /* igualdad estricta */ });
});

describe("GET /<area>/:id", () => {
  it("200 + shape para id válido", async () => { /* */ });
  it("404 con shape { statusCode, error, message } para id inexistente", async () => { /* */ });
  it("400/404 para id con caracteres prohibidos (pattern)", async () => { /* */ });
});

describe("dataset invariants", () => {
  it("todos los ids son únicos", async () => {
    const ids = <AREAS_UPPER>.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("todos los ids cumplen el slug ascii kebab-case", async () => {
    const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const x of <AREAS_UPPER>) expect(x.id).toMatch(slug);
  });
});
```

Comandos:
```powershell
cd apps/api
npm test
npx vitest run --coverage
npx tsc --noEmit
```

### 3. Tests Playwright

Patrón canónico (ver `apps/web/e2e/consoles.spec.ts` línea a línea):

```ts
import { expect, test } from "@playwright/test";
import { collectConsoleErrors } from "./helpers/console-errors";

test.describe("listado", () => {
  test("/<area> muestra h1 y N cards con cero errores de consola", async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto("/<area>");

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/<area>/i);

    const cards = page.getByTestId("<area>-card");
    await expect.poll(async () => cards.count(), { timeout: 10_000 }).toBe(N);

    expect(consoleErrors.errors, `errores: ${consoleErrors.errors.join("\n")}`).toEqual([]);
    expect(consoleErrors.pageErrors.map((e) => e.message)).toEqual([]);
  });
});

test.describe("buscador", () => {
  test("buscar 'X' filtra a cards cuyo name lo contenga", async ({ page }) => {
    await page.goto("/<area>");
    await expect.poll(async () => page.getByTestId("<area>-card").count(), { timeout: 10_000 }).toBe(N);

    const search = page.getByTestId("<area>-search-input");

    // CRÍTICO: armar waitForResponse ANTES de .fill() — debounce 250ms en el cliente
    const respPromise = page.waitForResponse(
      (r) => r.url().includes("/<area>?") && r.url().toLowerCase().includes("q=x") && r.status() === 200,
      { timeout: 8_000 },
    );
    await search.fill("X");
    await respPromise;

    // Asserts...
  });
});

test.describe("ficha", () => {
  test("/<area>/<id> muestra h1, breadcrumb, <dl> con K <dt>, descripción >=200 chars", async ({ page }) => {
    await page.goto("/<area>/<id>");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const dl = page.locator("dl").first();
    await expect(dl.locator("dt")).toHaveCount(K);
    const desc = await page.locator("section[aria-labelledby='description-title'] p").first().innerText();
    expect(desc.trim().length).toBeGreaterThanOrEqual(200);
  });
});

test.describe("404", () => {
  test("/<area>/unknown-x renderiza not-found con link al listado", async ({ page }) => {
    await page.goto("/<area>/unknown-x");
    await expect(page.getByRole("heading", { level: 1, name: /no encontrada/i })).toBeVisible();
    const link = page.getByRole("link", { name: /volver/i });
    await expect(link).toHaveAttribute("href", "/<area>");
  });
});
```

Comandos:
```powershell
cd apps/web
npx playwright test --workers=1                       # toda la suite
npx playwright test --workers=1 e2e/<area>.spec.ts    # un archivo
npx playwright test --headed --workers=1              # debug visual
```

### 4. Helper de console errors

`apps/web/e2e/helpers/console-errors.ts` (ya existe en el repo):

- Captura `page.on("console")` y `page.on("pageerror")`.
- Filtra ruido conocido del dev runtime (next devtools warnings, fast refresh).
- Cualquier nuevo ruido se añade ahí con justificación documentada — **nunca se ignoran errores reales**.

### 5. Validación contra Docker (obligatoria si la iter toca infra)

Si la iter toca infra, docker-compose, Dockerfile, `resolveApiBase()`, o variables de entorno de la app:

```powershell
docker compose build
docker compose up -d
# Esperar healthy
$tries = 0; while ((docker inspect -f '{{.State.Health.Status}}' ironheart-api 2>$null) -ne 'healthy' -and $tries -lt 40) { Start-Sleep 3; $tries++ }
docker compose ps
# Playwright contra el stack publicado (puertos 3000/4000)
cd apps/web; npx playwright test --workers=1
docker compose down
```

Si la suite pasa contra `npm run dev` pero falla contra Docker, hay un bug real. No cierres sin investigarlo.

### 6. Smoke MCP

El orquestador ejecuta MCP siguiendo el plan. Tu trabajo: listar EXPLÍCITAMENTE qué rutas deben smokearse:

```markdown
## Rutas a smokear con Chrome DevTools MCP
- /                  (home)
- /<area>            (listado de cada área tocada)
- /<area>/<id1>      (ficha — server component, vital tras cambios de infra)
- /<area>/<id2>      (otra ficha distinta)
- /<area>/unknown-x  (404)
```

Por cada una: capturar consola y network. Errores 4xx/5xx, exceptions, warnings de hidratación = bugs reales.

## Reglas duras

- `--workers=1` siempre en Playwright. Si lo omites, los tests son flaky.
- Conteos exactos (`toBe(N)`) cuando el dataset es fijo. `toBeGreaterThanOrEqual(N)` solo si crece sin contrato.
- `expect.poll` para asserts de cosas que se hidratan / cargan tras render.
- `waitForResponse` ARMADO ANTES del trigger (fill/click). El debounce de 250ms hace que `await fill; await waitForResponse` pueda perder el evento.
- Cero errores de consola del navegador. Cualquier error → bug.
- Toda iteración con app ejecutable → smoke MCP listado + 2 fichas + 404 por área tocada.
- Iteración que toca infra → Playwright contra Docker.

## Anti-patrones (rechazo automático)

| Anti-patrón | Por qué |
|---|---|
| Playwright sin `--workers=1` | Tests flaky por API single-threaded. |
| `toBeGreaterThan(0)` cuando el dataset es fijo | Oculta regresiones de conteo. |
| `await fill(); await waitForResponse(...)` | Race con debounce 250ms. Armar promise ANTES. |
| Eliminar test que falla "porque es flaky" | Investigar root cause; si es timing, usar `expect.poll`. |
| Test que asume orden de items no garantizado | Orden no es contrato salvo que la spec lo diga. |
| Snapshot tests para HTML grande | Frágiles. Asserts dirigidos por `data-testid` y roles. |
| Saltarse Docker porque "es solo un refactor" | Los bugs SSR/DNS interno se escapan precisamente ahí. Si la iter toca infra, Docker o el helper de URL, re-ejecutar Playwright contra `docker compose up -d` no es opcional. |
