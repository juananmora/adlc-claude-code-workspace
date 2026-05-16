import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { findAlbumById, findAlbums } from "../data/albums.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    band: { type: "string", maxLength: 100 },
    genre: { type: "string", maxLength: 50 },
  },
} as const;

interface ListQuery {
  q?: string;
  band?: string;
  genre?: string;
}

const idParamSchema = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: { type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9_.-]+$" },
  },
} as const;

interface IdParams {
  id: string;
}

export const albumsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/albums",
    { schema: { querystring: listQuerySchema } },
    async (request) => {
      const { q, band, genre } = request.query;
      const data = findAlbums({ q, band, genre });
      return data;
    },
  );

  app.get<{ Params: IdParams }>(
    "/albums/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const album = findAlbumById(request.params.id);
      if (!album) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Disco '${request.params.id}' no encontrado`,
        });
      }
      return album;
    },
  );
};
