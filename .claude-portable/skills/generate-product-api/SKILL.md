---
name: generate-product-api
description: Genera o amplía áreas del catálogo en apps/api con Fastify 5 + TypeScript ESM. Stack fijo, estructura fija (types/data/routes/tests), error contract uniforme, JSON Schema en routes, tests con app.inject().
when_to_use: Cuando hay que añadir o modificar una área del catálogo (products, albums, games, consoles, futuros) — endpoints REST, filtros, lookup por id, validación, tests.
allowed-tools: Read Write Edit MultiEdit Bash Grep Glob
---

# Skill: Generate Product API

Esta skill implementa un área del catálogo en `apps/api/` siguiendo el patrón canónico del repo. No improvisa.

## Stack fijo

- Fastify 5, TypeScript 5.6 ESM, Vitest 4.
- Datos estáticos en memoria (no BD).
- Validación con JSON Schema nativo de Fastify (no zod).
- Tests con `buildApp() + app.inject()`.

## Pasos obligatorios

### 1. Define el tipo

`apps/api/src/types/<area>.ts`:

```ts
/**
 * Tipos del catálogo <Area>.
 *
 * Dataset estático en `apps/api/src/data/<area>.ts`. Expuesto en
 * `apps/api/src/routes/<area>.ts` con GET /<area> y GET /<area>/:id.
 * El frontend espeja este tipo en `apps/web/lib/<area>-types.ts`.
 */
export interface <Area> {
  /** Slug kebab-case ascii (^[a-z0-9]+(-[a-z0-9]+)*$). */
  id: string;
  /** Nombre comercial. */
  name: string;
  /** Descripción larga (>=200 chars en áreas históricas). */
  description: string;
  /** Ruta de la portada: /covers/<area>/<id>.jpg */
  coverUrl: string;
  // ... resto de campos según PRD
}
```

### 2. Define el dataset y los helpers

`apps/api/src/data/<area>.ts`:

```ts
import type { <Area> } from "../types/<area>.js";

export const <AREAS_UPPER>: <Area>[] = [
  // ... N items, ids únicos en kebab-case
];

// Enums derivados para filtros (si aplica)
export const <AREA>_MANUFACTURERS = Array.from(
  new Set(<AREAS_UPPER>.map((x) => x.manufacturer))
).sort();

export interface Find<Area>Filters {
  q?: string;
  // ... otros filtros opcionales
}

export function find<Area>s(filters: Find<Area>Filters = {}): <Area>[] {
  let result = <AREAS_UPPER>;
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    result = result.filter((x) => x.name.toLowerCase().includes(needle));
  }
  // ... aplicar resto de filtros con igualdad estricta
  return result;
}

export function find<Area>ById(id: string): <Area> | undefined {
  return <AREAS_UPPER>.find((x) => x.id === id);
}
```

### 3. Define la route

`apps/api/src/routes/<area>.ts`:

```ts
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { find<Area>ById, find<Area>s } from "../data/<area>.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    // ... otros filtros con maxLength
  },
} as const;

interface ListQuery {
  q?: string;
  // ... otros
}

const idParamSchema = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: { type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9_.-]+$" },
  },
} as const;

interface IdParams { id: string; }

export const <area>Routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/<area>",
    { schema: { querystring: listQuerySchema } },
    async (request) => find<Area>s(request.query),
  );

  app.get<{ Params: IdParams }>(
    "/<area>/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const entry = find<Area>ById(request.params.id);
      if (!entry) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `<Area> '${request.params.id}' no encontrada`,
        });
      }
      return entry;
    },
  );
};
```

### 4. Registra en app.ts

`apps/api/src/app.ts` debe importar y registrar:

```ts
import { <area>Routes } from "./routes/<area>.js";
// ...
await app.register(<area>Routes);
```

### 5. Escribe los tests

`apps/api/tests/<area>.test.ts`:

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
  it("returns all (N)", async () => {
    const res = await app.inject({ method: "GET", url: "/<area>" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as <Area>[];
    expect(body.length).toBe(<AREAS_UPPER>.length);
  });

  it("filters by ?q=X (case-insensitive substring)", async () => {
    const res = await app.inject({ method: "GET", url: "/<area>?q=test" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as <Area>[];
    for (const item of body) {
      expect(item.name.toLowerCase()).toContain("test");
    }
  });
});

describe("GET /<area>/:id", () => {
  it("returns 200 for valid id", async () => {
    const sample = <AREAS_UPPER>[0];
    const res = await app.inject({ method: "GET", url: `/<area>/${sample.id}` });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ id: sample.id, name: sample.name });
  });

  it("returns 404 for unknown id with error shape", async () => {
    const res = await app.inject({ method: "GET", url: "/<area>/unknown-xxx" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({
      statusCode: 404,
      error: "Not Found",
      message: expect.stringContaining("unknown-xxx"),
    });
  });

  it("returns 400 for id with invalid characters", async () => {
    const res = await app.inject({ method: "GET", url: "/<area>/../etc/passwd" });
    expect([400, 404]).toContain(res.statusCode);
  });
});
```

### 6. Ejecuta y valida

```powershell
cd apps/api
npm test                # vitest run — TODOS verdes
npx tsc --noEmit        # exit 0 sin warnings
```

## Reglas duras

- IDs en kebab-case ascii. Regex `^[a-z0-9]+(-[a-z0-9]+)*$`.
- `pattern` en `idParamSchema` **siempre** — no negociable.
- `additionalProperties: false` en todos los schemas (prohíbe propiedades no declaradas).
- `maxLength` en todo string del querystring (anti-DoS).
- Error con shape `{ statusCode, error, message }` exacto.
- No `any`, no `as unknown as`, no `@ts-ignore`.
- No añadas dependencias nuevas sin pasar por `security-engineer`.

## Anti-patrones (rechazo automático)

| Anti-patrón | Por qué falla |
|---|---|
| Usar zod en routes | El repo usa JSON Schema nativo. Mezclar genera doble validación. |
| Path param sin `pattern` | Permite path traversal y caracteres de control. |
| Lanzar `throw new Error(...)` en handler | El errorHandler convierte a 500 con stack. Usa `reply.code(N).send(shape)`. |
| Test con `node-fetch` o servidor real | El patrón es `app.inject()`. Más rápido y determinista. |
| Filtros con `==` o `===` directos sin lowercase | `q` debe ser case-insensitive substring. Filtros enum son igualdad estricta. |
| Mutar `<AREAS_UPPER>` (push/splice) | Es la fuente de verdad. Los helpers devuelven copias filtradas. |
