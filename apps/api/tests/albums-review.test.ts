import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { albums, findAlbumById } from "../src/data/albums.js";
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

const MIN_SECTION_LENGTH = 200;
const MIN_TRACK_HIGHLIGHTS = 2;
const MIN_CRITIC_QUOTES = 2;
const MIN_YEAR = 1965;
const MAX_YEAR = 2026;
const MIN_SCORE = 1;
const MAX_SCORE = 10;
const HTTPS_PATTERN = /^https:\/\//;

describe("Album reviews dataset", () => {
  it("contains a review for every one of the 20 base albums", () => {
    expect(albums.length).toBeGreaterThanOrEqual(20);
    for (const base of albums) {
      const full = findAlbumById(base.id);
      expect(full, `album ${base.id} not found via findAlbumById`).toBeDefined();
      expect(full!.review, `album ${base.id} is missing review`).toBeDefined();
    }
  });

  describe.each(albums.map((a) => [a.id]))("album %s", (id) => {
    const album = findAlbumById(id as string)!;
    const review = album.review;

    it("has sections.historicalContext, sound, legacy as non-empty strings of >= 200 chars", () => {
      for (const key of ["historicalContext", "sound", "legacy"] as const) {
        const value = review.sections[key];
        expect(typeof value, `${id}: sections.${key} is not a string`).toBe("string");
        expect(value.trim().length, `${id}: sections.${key} is empty`).toBeGreaterThan(0);
        expect(
          value.length,
          `${id}: sections.${key} has ${value.length} chars, expected >= ${MIN_SECTION_LENGTH}`,
        ).toBeGreaterThanOrEqual(MIN_SECTION_LENGTH);
      }
    });

    it(`has >= ${MIN_TRACK_HIGHLIGHTS} track highlights, each consistent with album.tracks`, () => {
      expect(
        Array.isArray(review.trackHighlights),
        `${id}: trackHighlights is not an array`,
      ).toBe(true);
      expect(
        review.trackHighlights.length,
        `${id}: trackHighlights has ${review.trackHighlights.length} items, expected >= ${MIN_TRACK_HIGHLIGHTS}`,
      ).toBeGreaterThanOrEqual(MIN_TRACK_HIGHLIGHTS);

      for (const highlight of review.trackHighlights) {
        expect(typeof highlight.track).toBe("string");
        expect(highlight.track.trim().length, `${id}: empty track name in highlight`).toBeGreaterThan(0);
        expect(typeof highlight.note).toBe("string");
        expect(highlight.note.trim().length, `${id}: empty note in highlight`).toBeGreaterThan(0);
        expect(
          album.tracks.includes(highlight.track),
          `${id}: trackHighlight "${highlight.track}" is not present in album.tracks`,
        ).toBe(true);
      }
    });

    it("has a rating with score in [1, 10] and non-empty justification", () => {
      const { score, justification } = review.rating;
      expect(typeof score, `${id}: rating.score is not a number`).toBe("number");
      expect(Number.isFinite(score), `${id}: rating.score is not finite`).toBe(true);
      expect(score, `${id}: rating.score=${score} below ${MIN_SCORE}`).toBeGreaterThanOrEqual(MIN_SCORE);
      expect(score, `${id}: rating.score=${score} above ${MAX_SCORE}`).toBeLessThanOrEqual(MAX_SCORE);
      expect(typeof justification, `${id}: rating.justification is not a string`).toBe("string");
      expect(
        justification.trim().length,
        `${id}: rating.justification is empty`,
      ).toBeGreaterThan(0);
    });

    it(`has >= ${MIN_CRITIC_QUOTES} critic quotes, each well-formed`, () => {
      expect(
        Array.isArray(review.criticQuotes),
        `${id}: criticQuotes is not an array`,
      ).toBe(true);
      expect(
        review.criticQuotes.length,
        `${id}: criticQuotes has ${review.criticQuotes.length} items, expected >= ${MIN_CRITIC_QUOTES}`,
      ).toBeGreaterThanOrEqual(MIN_CRITIC_QUOTES);

      for (const quote of review.criticQuotes) {
        expect(typeof quote.outlet, `${id}: outlet is not a string`).toBe("string");
        expect(quote.outlet.trim().length, `${id}: empty outlet`).toBeGreaterThan(0);

        expect(typeof quote.year, `${id}: year is not a number`).toBe("number");
        expect(
          Number.isInteger(quote.year),
          `${id}: year=${quote.year} is not an integer`,
        ).toBe(true);
        expect(
          quote.year,
          `${id}: year=${quote.year} below ${MIN_YEAR}`,
        ).toBeGreaterThanOrEqual(MIN_YEAR);
        expect(
          quote.year,
          `${id}: year=${quote.year} above ${MAX_YEAR}`,
        ).toBeLessThanOrEqual(MAX_YEAR);

        expect(typeof quote.url, `${id}: url is not a string`).toBe("string");
        expect(
          HTTPS_PATTERN.test(quote.url),
          `${id}: url "${quote.url}" does not start with https://`,
        ).toBe(true);

        expect(typeof quote.quote, `${id}: quote text is not a string`).toBe("string");
        expect(quote.quote.trim().length, `${id}: empty quote text`).toBeGreaterThan(0);

        if (quote.author !== undefined) {
          expect(typeof quote.author, `${id}: author is not a string`).toBe("string");
          expect(
            quote.author.trim().length,
            `${id}: author is defined but empty`,
          ).toBeGreaterThan(0);
        }
      }
    });
  });

  it("aggregates at least 2 distinct outlets across all critic quotes", () => {
    const outlets = new Set<string>();
    for (const base of albums) {
      const full = findAlbumById(base.id)!;
      for (const quote of full.review.criticQuotes) {
        outlets.add(quote.outlet);
      }
    }
    expect(
      outlets.size,
      `expected >= 2 distinct outlets across all reviews, got ${outlets.size}: ${[...outlets].join(", ")}`,
    ).toBeGreaterThanOrEqual(2);
  });
});

describe("GET /albums/:id includes review", () => {
  it("returns review with the expected shape for metallica-master-of-puppets", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/albums/metallica-master-of-puppets",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Album;
    expect(body.id).toBe("metallica-master-of-puppets");
    expect(body.review).toBeDefined();

    expect(body.review.sections).toBeDefined();
    expect(typeof body.review.sections.historicalContext).toBe("string");
    expect(typeof body.review.sections.sound).toBe("string");
    expect(typeof body.review.sections.legacy).toBe("string");

    expect(Array.isArray(body.review.trackHighlights)).toBe(true);
    expect(body.review.trackHighlights.length).toBeGreaterThanOrEqual(MIN_TRACK_HIGHLIGHTS);
    for (const h of body.review.trackHighlights) {
      expect(typeof h.track).toBe("string");
      expect(typeof h.note).toBe("string");
    }

    expect(body.review.rating).toBeDefined();
    expect(typeof body.review.rating.score).toBe("number");
    expect(body.review.rating.score).toBeGreaterThanOrEqual(MIN_SCORE);
    expect(body.review.rating.score).toBeLessThanOrEqual(MAX_SCORE);
    expect(typeof body.review.rating.justification).toBe("string");

    expect(Array.isArray(body.review.criticQuotes)).toBe(true);
    expect(body.review.criticQuotes.length).toBeGreaterThanOrEqual(MIN_CRITIC_QUOTES);
    for (const q of body.review.criticQuotes) {
      expect(typeof q.outlet).toBe("string");
      expect(typeof q.year).toBe("number");
      expect(typeof q.url).toBe("string");
      expect(HTTPS_PATTERN.test(q.url)).toBe(true);
      expect(typeof q.quote).toBe("string");
    }
  });
});
