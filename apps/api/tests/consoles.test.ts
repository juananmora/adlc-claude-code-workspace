import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import {
  CONSOLES,
  CONSOLE_GENERATIONS,
  CONSOLE_MANUFACTURERS,
} from "../src/data/consoles.js";
import type { Console } from "../src/types/console.js";

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

const MIN_YEAR = 1970;
const MAX_YEAR = 2010;
const MIN_GENERATION = 3;
const MAX_GENERATION = 7;
const MIN_DESCRIPTION_LENGTH = 200;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("GET /consoles", () => {
  it("returns all consoles (10)", async () => {
    const res = await app.inject({ method: "GET", url: "/consoles" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(10);
  });

  it("filters by ?q=Nintendo returning at least 3 matches (name-substring)", async () => {
    // q es substring case-insensitive sobre `name` (no sobre manufacturer).
    // Solo NES, N64 y SNES llevan literalmente "Nintendo" en su nombre
    // comercial; Game Boy y Wii no aparecen porque su `name` no lo contiene.
    const res = await app.inject({ method: "GET", url: "/consoles?q=Nintendo" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(body.length).toBeGreaterThanOrEqual(3);
    for (const c of body) {
      expect(c.name.toLowerCase()).toContain("nintendo");
    }
    const ids = body.map((c) => c.id);
    expect(ids).toContain("nes");
    expect(ids).toContain("snes");
    expect(ids).toContain("nintendo-64");
  });

  it("filters by ?manufacturer=Nintendo returns exactly 5", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/consoles?manufacturer=Nintendo",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(body.length).toBe(5);
    for (const c of body) {
      expect(c.manufacturer).toBe("Nintendo");
    }
    const ids = body.map((c) => c.id);
    expect(ids).toContain("nes");
    expect(ids).toContain("game-boy");
    expect(ids).toContain("snes");
    expect(ids).toContain("nintendo-64");
    expect(ids).toContain("wii");
  });

  it("filters by ?generation=6 returns exactly 3 (Dreamcast, PS2, Xbox)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/consoles?generation=6",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(body.length).toBe(3);
    const ids = body.map((c) => c.id).sort();
    expect(ids).toEqual(["dreamcast", "playstation-2", "xbox"]);
  });

  it("combines ?manufacturer=Sega&q=Mega returns exactly 1", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/consoles?manufacturer=Sega&q=Mega",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(body.length).toBe(1);
    expect(body[0]?.id).toBe("sega-genesis");
  });

  it("returns empty array for ?generation=99", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/consoles?generation=99",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console[];
    expect(body).toEqual([]);
  });

  it("rejects manufacturer longer than 50 chars with 400", async () => {
    const overlong = "a".repeat(51);
    const res = await app.inject({
      method: "GET",
      url: `/consoles?manufacturer=${overlong}`,
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /consoles/:id", () => {
  it("returns the console when id exists (playstation)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/consoles/playstation",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Console;
    expect(body.id).toBe("playstation");
    expect(body.name).toBe("PlayStation");
    expect(body.manufacturer).toBe("Sony");
  });

  it("GET /consoles/missing returns 404 with shape {statusCode,error,message}", async () => {
    const res = await app.inject({ method: "GET", url: "/consoles/missing" });
    expect(res.statusCode).toBe(404);
    const body = res.json() as {
      statusCode: number;
      error: string;
      message: string;
    };
    expect(body.statusCode).toBe(404);
    expect(typeof body.error).toBe("string");
    expect(body.error.length).toBeGreaterThan(0);
    expect(typeof body.message).toBe("string");
    expect(body.message).toContain("missing");
  });
});

describe.each(CONSOLES)("dataset entry $id", (consoleEntry) => {
  it("id is kebab-case slug without accents", () => {
    expect(consoleEntry.id).toMatch(SLUG_PATTERN);
  });

  it(`year is an integer in [${MIN_YEAR}, ${MAX_YEAR}]`, () => {
    expect(Number.isInteger(consoleEntry.year)).toBe(true);
    expect(consoleEntry.year).toBeGreaterThanOrEqual(MIN_YEAR);
    expect(consoleEntry.year).toBeLessThanOrEqual(MAX_YEAR);
  });

  it(`generation is an integer in [${MIN_GENERATION}, ${MAX_GENERATION}]`, () => {
    expect(Number.isInteger(consoleEntry.generation)).toBe(true);
    expect(consoleEntry.generation).toBeGreaterThanOrEqual(MIN_GENERATION);
    expect(consoleEntry.generation).toBeLessThanOrEqual(MAX_GENERATION);
  });

  it("name is a non-empty string", () => {
    expect(typeof consoleEntry.name).toBe("string");
    expect(consoleEntry.name.trim().length).toBeGreaterThan(0);
  });

  it(`description is >= ${MIN_DESCRIPTION_LENGTH} chars`, () => {
    expect(typeof consoleEntry.description).toBe("string");
    expect(consoleEntry.description.length).toBeGreaterThanOrEqual(
      MIN_DESCRIPTION_LENGTH,
    );
  });

  it("unitsSoldM is a positive number", () => {
    expect(typeof consoleEntry.unitsSoldM).toBe("number");
    expect(consoleEntry.unitsSoldM).toBeGreaterThan(0);
  });

  it("iconicGames has between 3 and 5 entries (all non-empty strings)", () => {
    expect(Array.isArray(consoleEntry.iconicGames)).toBe(true);
    expect(consoleEntry.iconicGames.length).toBeGreaterThanOrEqual(3);
    expect(consoleEntry.iconicGames.length).toBeLessThanOrEqual(5);
    for (const g of consoleEntry.iconicGames) {
      expect(typeof g).toBe("string");
      expect(g.trim().length).toBeGreaterThan(0);
    }
  });

  it("media is a non-empty string", () => {
    expect(typeof consoleEntry.media).toBe("string");
    expect(consoleEntry.media.trim().length).toBeGreaterThan(0);
  });

  it("coverUrl starts with /covers/consoles/", () => {
    expect(typeof consoleEntry.coverUrl).toBe("string");
    expect(consoleEntry.coverUrl.startsWith("/covers/consoles/")).toBe(true);
  });

  it("manufacturer is a member of CONSOLE_MANUFACTURERS", () => {
    expect(CONSOLE_MANUFACTURERS).toContain(consoleEntry.manufacturer);
  });

  it("generation is a member of CONSOLE_GENERATIONS", () => {
    expect(CONSOLE_GENERATIONS).toContain(consoleEntry.generation);
  });
});

describe("CONSOLE_MANUFACTURERS", () => {
  it("is sorted alphabetically", () => {
    const sorted = [...CONSOLE_MANUFACTURERS].sort();
    expect([...CONSOLE_MANUFACTURERS]).toEqual(sorted);
  });

  it("has no duplicates", () => {
    const set = new Set(CONSOLE_MANUFACTURERS);
    expect(set.size).toBe(CONSOLE_MANUFACTURERS.length);
  });

  it("covers every console's manufacturer", () => {
    const fromDataset = new Set(CONSOLES.map((c) => c.manufacturer));
    for (const m of fromDataset) {
      expect(CONSOLE_MANUFACTURERS).toContain(m);
    }
  });
});

describe("CONSOLE_GENERATIONS", () => {
  it("is sorted ascending", () => {
    const sorted = [...CONSOLE_GENERATIONS].sort((a, b) => a - b);
    expect([...CONSOLE_GENERATIONS]).toEqual(sorted);
  });

  it("has no duplicates", () => {
    const set = new Set(CONSOLE_GENERATIONS);
    expect(set.size).toBe(CONSOLE_GENERATIONS.length);
  });

  it("covers every console's generation", () => {
    const fromDataset = new Set(CONSOLES.map((c) => c.generation));
    for (const g of fromDataset) {
      expect(CONSOLE_GENERATIONS).toContain(g);
    }
  });
});

describe("dataset size", () => {
  it("contains exactly 10 consoles", () => {
    expect(CONSOLES).toHaveLength(10);
  });

  it("consoles-dataset has exactly 10 entries (id-named test for acceptance criteria)", () => {
    expect(CONSOLES.length).toBe(10);
  });
});
