import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { GAMES, GAME_GENRES } from "../src/data/games.js";
import type { Game } from "../src/types/game.js";

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

const MIN_YEAR = 1984;
const MAX_YEAR = 1995;
const MIN_DESCRIPTION_LENGTH = 200;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SYSTEM_PATTERN = /^Amstrad CPC (464|6128|464 \/ 6128)$/;
const HTTPS_PATTERN = /^https:\/\//;

describe("GET /games", () => {
  it("returns all games", async () => {
    const res = await app.inject({ method: "GET", url: "/games" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(10);
  });

  it("filters by ?q= substring case-insensitive (q=knight returns Knight Lore)", async () => {
    const res = await app.inject({ method: "GET", url: "/games?q=knight" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game[];
    expect(body.length).toBe(1);
    expect(body[0]?.id).toBe("knight-lore");
  });

  it("filters by ?genre= exact match (genre=Aventura isométrica)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/games?genre=Aventura%20isom%C3%A9trica",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game[];
    expect(body.length).toBeGreaterThanOrEqual(2);
    for (const game of body) {
      expect(game.genre).toBe("Aventura isométrica");
    }
    const ids = body.map((g) => g.id);
    expect(ids).toContain("knight-lore");
    expect(ids).toContain("head-over-heels");
    expect(ids).toContain("la-abadia-del-crimen");
  });

  it("combines q and genre (q=knight&genre=Aventura isométrica returns only Knight Lore)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/games?q=knight&genre=Aventura%20isom%C3%A9trica",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game[];
    expect(body.length).toBe(1);
    expect(body[0]?.id).toBe("knight-lore");
  });

  it("returns empty array for unknown genre", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/games?genre=Generodesconocido",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game[];
    expect(body).toEqual([]);
  });

  it("rejects genre longer than 50 chars with 400", async () => {
    const overlong = "a".repeat(51);
    const res = await app.inject({
      method: "GET",
      url: `/games?genre=${overlong}`,
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /games/:id", () => {
  it("returns the game when id exists (knight-lore)", async () => {
    const res = await app.inject({ method: "GET", url: "/games/knight-lore" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Game;
    expect(body.id).toBe("knight-lore");
    expect(body.title).toBe("Knight Lore");
    expect(body.developer).toBe("Ultimate Play the Game");
  });

  it("GET /games/missing returns 404 with shape {statusCode,error,message}", async () => {
    const res = await app.inject({ method: "GET", url: "/games/missing" });
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

describe.each(GAMES)("dataset entry $id", (game) => {
  it("id is kebab-case slug without accents", () => {
    expect(game.id).toMatch(SLUG_PATTERN);
  });

  it(`year is an integer between ${MIN_YEAR} and ${MAX_YEAR}`, () => {
    expect(Number.isInteger(game.year)).toBe(true);
    expect(game.year).toBeGreaterThanOrEqual(MIN_YEAR);
    expect(game.year).toBeLessThanOrEqual(MAX_YEAR);
  });

  it("system matches CPC regex", () => {
    expect(game.system).toMatch(SYSTEM_PATTERN);
  });

  it("title is a non-empty string", () => {
    expect(typeof game.title).toBe("string");
    expect(game.title.trim().length).toBeGreaterThan(0);
  });

  it("developer and publisher are non-empty strings", () => {
    expect(typeof game.developer).toBe("string");
    expect(game.developer.trim().length).toBeGreaterThan(0);
    expect(typeof game.publisher).toBe("string");
    expect(game.publisher.trim().length).toBeGreaterThan(0);
  });

  it(`description is >= ${MIN_DESCRIPTION_LENGTH} chars`, () => {
    expect(typeof game.description).toBe("string");
    expect(game.description.length).toBeGreaterThanOrEqual(
      MIN_DESCRIPTION_LENGTH,
    );
  });

  it("coverUrl starts with /covers/games/", () => {
    expect(typeof game.coverUrl).toBe("string");
    expect(game.coverUrl.startsWith("/covers/games/")).toBe(true);
  });

  it("quotes length is in [1, 2]", () => {
    expect(Array.isArray(game.quotes)).toBe(true);
    expect(game.quotes.length).toBeGreaterThanOrEqual(1);
    expect(game.quotes.length).toBeLessThanOrEqual(2);
  });

  it("each quote has outlet, year in [1984,1995] and non-empty quote", () => {
    for (const q of game.quotes) {
      expect(typeof q.outlet).toBe("string");
      expect(q.outlet.trim().length).toBeGreaterThan(0);

      expect(typeof q.year).toBe("number");
      expect(Number.isInteger(q.year)).toBe(true);
      expect(q.year).toBeGreaterThanOrEqual(MIN_YEAR);
      expect(q.year).toBeLessThanOrEqual(MAX_YEAR);

      expect(typeof q.quote).toBe("string");
      expect(q.quote.trim().length).toBeGreaterThan(0);
    }
  });

  it("each quote.url is undefined or starts with https://", () => {
    for (const q of game.quotes) {
      if (q.url !== undefined) {
        expect(typeof q.url).toBe("string");
        expect(HTTPS_PATTERN.test(q.url)).toBe(true);
      }
    }
  });

  it("genre is a member of GAME_GENRES", () => {
    expect(GAME_GENRES).toContain(game.genre);
  });
});

describe("GAME_GENRES", () => {
  it("is sorted alphabetically", () => {
    const sorted = [...GAME_GENRES].sort();
    expect([...GAME_GENRES]).toEqual(sorted);
  });

  it("covers every game's genre", () => {
    const gameGenres = new Set(GAMES.map((g) => g.genre));
    for (const genre of gameGenres) {
      expect(GAME_GENRES).toContain(genre);
    }
  });

  it("has no duplicates", () => {
    const set = new Set(GAME_GENRES);
    expect(set.size).toBe(GAME_GENRES.length);
  });
});

describe("dataset size", () => {
  it("contains exactly 10 games", () => {
    expect(GAMES).toHaveLength(10);
  });

  it("games-dataset has exactly 10 games (id-named test for acceptance criteria)", () => {
    expect(GAMES.length).toBe(10);
  });
});
