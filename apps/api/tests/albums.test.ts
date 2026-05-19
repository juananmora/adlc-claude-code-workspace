import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import type { Album } from "../src/types/album.js";

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

describe("GET /albums", () => {
  it("returns at least 12 albums", async () => {
    const res = await app.inject({ method: "GET", url: "/albums" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(12);
    for (const album of body) {
      expect(album).toHaveProperty("id");
      expect(album).toHaveProperty("title");
      expect(album).toHaveProperty("band");
      expect(album).toHaveProperty("year");
      expect(album).toHaveProperty("genre");
      expect(album).toHaveProperty("description");
      expect(album).toHaveProperty("coverUrl");
      expect(Array.isArray(album.tracks)).toBe(true);
      expect(album.tracks.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("filters by band=Iron Maiden", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?band=Iron%20Maiden",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body.length).toBeGreaterThan(0);
    for (const album of body) {
      expect(album.band).toBe("Iron Maiden");
    }
  });

  it("finds 'Master of Puppets' via q=master", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?q=master",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body.some((a) => a.title === "Master of Puppets")).toBe(true);
  });

  it("returns [] for a non-existent band without 400", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?band=BandaInexistente",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body).toEqual([]);
  });

  it("filters by genre=Thrash Metal returning only thrash albums", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?genre=Thrash%20Metal",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body.length).toBeGreaterThanOrEqual(3);
    for (const album of body) {
      expect(album.genre).toBe("Thrash Metal");
    }
    const titles = body.map((a) => a.title);
    expect(titles).toContain("Master of Puppets");
    expect(titles).toContain("Ride the Lightning");
    expect(titles).toContain("Rust in Peace");
    expect(titles).toContain("Reign in Blood");
  });

  it("combines genre=Heavy Metal + band=Iron Maiden returning only the 3 Iron Maiden albums", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?genre=Heavy%20Metal&band=Iron%20Maiden",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body.length).toBe(3);
    for (const album of body) {
      expect(album.band).toBe("Iron Maiden");
      expect(album.genre).toBe("Heavy Metal");
    }
  });

  it("combines genre=Thrash Metal + q=Master returning only Master of Puppets", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?genre=Thrash%20Metal&q=Master",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body.length).toBe(1);
    expect(body[0]?.title).toBe("Master of Puppets");
    expect(body[0]?.genre).toBe("Thrash Metal");
  });

  it("returns [] for an unknown genre", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?genre=Generodesconocido",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body).toEqual([]);
  });

  it("filters by band=Pantera returning the 2 albums added in iter-11", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums?band=Pantera",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album[];
    expect(body).toHaveLength(2);
    for (const album of body) {
      expect(album.band).toBe("Pantera");
      expect(album.genre).toBe("Groove Metal");
    }
    const ids = body.map((a) => a.id);
    expect(ids).toContain("pantera-cowboys-from-hell");
    expect(ids).toContain("pantera-vulgar-display-of-power");
  });
});

describe("GET /albums/:id", () => {
  it("returns the album for iron-maiden-number-of-the-beast", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums/iron-maiden-number-of-the-beast",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album;
    expect(body.id).toBe("iron-maiden-number-of-the-beast");
    expect(body.band).toBe("Iron Maiden");
    expect(body.title).toBe("The Number of the Beast");
  });

  it("returns 404 when the album does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums/no-existe",
    });
    expect(res.statusCode).toBe(404);
    const body = res.json() as { statusCode: number; error: string; message: string };
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain("no-existe");
  });
});
