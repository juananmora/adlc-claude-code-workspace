import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { TOURS, TOUR_BANDS, TOUR_DECADES } from "../src/data/tours.js";
import type { Tour } from "../src/types/tour.js";

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

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MIN_DESCRIPTION_LENGTH = 200;

describe("GET /tours", () => {
  it("returns all (10) ordered by year ASC", async () => {
    const res = await app.inject({ method: "GET", url: "/tours" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Tour[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(10);
    // Ordering: years ascendentes (no estrictamente, hay empates como 1990 y 1991).
    for (let i = 1; i < body.length; i += 1) {
      const prev = body[i - 1];
      const curr = body[i];
      if (!prev || !curr) throw new Error("body item missing");
      expect(curr.year).toBeGreaterThanOrEqual(prev.year);
    }
  });

  it("filters by decade=1990", async () => {
    const res = await app.inject({ method: "GET", url: "/tours?decade=1990" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Tour[];
    expect(body.length).toBeGreaterThan(0);
    for (const t of body) {
      expect(t.decade).toBe(1990);
    }
  });

  it("filter q substring case-insensitive on name", async () => {
    // 'metallica' en lowercase debe matchear "Metallica (Black Album)" en el
    // album, pero el filtro q opera sobre `name`. Ninguno de los `name` lleva
    // literal 'metallica', así que usamos 'tour' como token genérico para
    // demostrar el case-insensitive substring sobre name.
    const res = await app.inject({
      method: "GET",
      url: "/tours?q=TOUR",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Tour[];
    expect(body.length).toBeGreaterThan(0);
    for (const t of body) {
      expect(t.name.toLowerCase()).toContain("tour");
    }
  });

  it("filters by band exact match (Iron Maiden)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/tours?band=Iron%20Maiden",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Tour[];
    expect(body.length).toBeGreaterThan(0);
    for (const t of body) {
      expect(t.band).toBe("Iron Maiden");
    }
    const ids = body.map((t) => t.id);
    expect(ids).toContain("world-slavery-tour");
  });
});

describe("GET /tours/:id", () => {
  it("GET /tours/:id existing", async () => {
    const sample = TOURS[0];
    if (!sample) throw new Error("dataset is empty");
    const res = await app.inject({
      method: "GET",
      url: `/tours/${sample.id}`,
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Tour;
    expect(body.id).toBe(sample.id);
    expect(body.name).toBe(sample.name);
    expect(body.band).toBe(sample.band);
  });

  it("GET /tours/:id 404 with error shape", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/tours/unknown-xxx",
    });
    expect(res.statusCode).toBe(404);
    const body = res.json() as {
      statusCode: number;
      error: string;
      message: string;
    };
    expect(body.statusCode).toBe(404);
    expect(body.error).toBe("Not Found");
    expect(body.message).toContain("unknown-xxx");
    expect(body.message).toContain("Tour");
  });

  it("rejects invalid id pattern (../etc/passwd)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/tours/../etc/passwd",
    });
    // El path traversal puede resolver a otra ruta (400/404) pero nunca leak.
    expect([400, 404]).toContain(res.statusCode);
    const raw = res.body;
    // Sanity: la respuesta no debe contener contenido típico de /etc/passwd.
    expect(raw).not.toContain("root:x:");
  });
});

describe("dataset invariants", () => {
  it("ids son únicos y kebab-case ascii", () => {
    const ids = TOURS.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(SLUG_PATTERN);
    }
  });
});

describe.each(TOURS)("dataset entry $id", (tour) => {
  it(`descriptions >=${MIN_DESCRIPTION_LENGTH} chars`, () => {
    expect(typeof tour.description).toBe("string");
    expect(tour.description.length).toBeGreaterThanOrEqual(
      MIN_DESCRIPTION_LENGTH,
    );
  });

  it("band is a member of TOUR_BANDS", () => {
    expect(TOUR_BANDS).toContain(tour.band);
  });

  it("decade is a member of TOUR_DECADES", () => {
    expect(TOUR_DECADES).toContain(tour.decade);
  });

  it("countries has >=3 non-empty entries", () => {
    expect(Array.isArray(tour.countries)).toBe(true);
    expect(tour.countries.length).toBeGreaterThanOrEqual(3);
    for (const c of tour.countries) {
      expect(typeof c).toBe("string");
      expect(c.trim().length).toBeGreaterThan(0);
    }
  });

  it("showsCount is a positive integer", () => {
    expect(Number.isInteger(tour.showsCount)).toBe(true);
    expect(tour.showsCount).toBeGreaterThan(0);
  });

  it("coverUrl starts with /covers/tours/", () => {
    expect(tour.coverUrl.startsWith("/covers/tours/")).toBe(true);
  });
});

describe("TOUR_BANDS", () => {
  it("is sorted alphabetically", () => {
    const sorted = [...TOUR_BANDS].sort();
    expect([...TOUR_BANDS]).toEqual(sorted);
  });

  it("has no duplicates", () => {
    const set = new Set(TOUR_BANDS);
    expect(set.size).toBe(TOUR_BANDS.length);
  });

  it("covers every tour's band", () => {
    const fromDataset = new Set(TOURS.map((t) => t.band));
    for (const b of fromDataset) {
      expect(TOUR_BANDS).toContain(b);
    }
  });
});

describe("TOUR_DECADES", () => {
  it("is sorted ascending", () => {
    const sorted = [...TOUR_DECADES].sort((a, b) => a - b);
    expect([...TOUR_DECADES]).toEqual(sorted);
  });

  it("has no duplicates", () => {
    const set = new Set(TOUR_DECADES);
    expect(set.size).toBe(TOUR_DECADES.length);
  });

  it("contains exactly 1980, 1990, 2000", () => {
    expect([...TOUR_DECADES]).toEqual([1980, 1990, 2000]);
  });
});

describe("dataset size", () => {
  it("contains exactly 10 tours", () => {
    expect(TOURS).toHaveLength(10);
  });
});
