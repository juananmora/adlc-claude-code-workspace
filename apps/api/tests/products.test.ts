import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import type { Product } from "../src/types.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp({
    config: {
      port: 0,
      host: "127.0.0.1",
      corsOrigin: ["http://localhost:3000"],
      nodeEnv: "test",
    },
    logger: false,
  });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("health", () => {
  it("returns 200 with status ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});

describe("GET /products", () => {
  it("returns the full catalog", async () => {
    const res = await app.inject({ method: "GET", url: "/products" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Product[];
    expect(Array.isArray(body)).toBe(true);
    // Dataset shipped from apps/web/lib/products.ts contains 13 entries.
    expect(body).toHaveLength(13);
    for (const product of body) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("stock");
      expect(product).toHaveProperty("specs");
      expect(product).toHaveProperty("imageUrl");
    }
  });

  it("filters by category=Portatiles", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products?category=Portatiles",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Product[];
    expect(body.length).toBeGreaterThan(0);
    for (const product of body) {
      expect(product.category).toBe("Portatiles");
    }
  });

  it("rejects unknown categories with 400", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products?category=NotARealCategory",
    });
    expect(res.statusCode).toBe(400);
  });

  it("filters by q=ThinkPad", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products?q=ThinkPad",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Product[];
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body.some((p) => p.name.includes("ThinkPad"))).toBe(true);
  });

  it("accepts 'search' as an alias for 'q' (frontend compatibility)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products?search=MacBook",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Product[];
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body.some((p) => p.name.includes("MacBook"))).toBe(true);
  });
});

describe("GET /products/:id", () => {
  it("returns a product by id", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products/thinkpad-x1-carbon-g12",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Product;
    expect(body.id).toBe("thinkpad-x1-carbon-g12");
    expect(body.name).toContain("ThinkPad");
    expect(body.category).toBe("Portatiles");
  });

  it("returns 404 when the product does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products/no-existe",
    });
    expect(res.statusCode).toBe(404);
    const body = res.json() as { statusCode: number; error: string; message: string };
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain("no-existe");
  });
});

describe("CORS", () => {
  it("emits CORS headers for allowed origins", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "http://localhost:3000" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });
});
