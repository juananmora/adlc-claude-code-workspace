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
