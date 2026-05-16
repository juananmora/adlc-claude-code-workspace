import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { findGameById, findGames } from "../data/games.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    genre: { type: "string", maxLength: 50 },
  },
} as const;

interface ListQuery {
  q?: string;
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

export const gamesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/games",
    { schema: { querystring: listQuerySchema } },
    async (request) => {
      const { q, genre } = request.query;
      return findGames({ q, genre });
    },
  );

  app.get<{ Params: IdParams }>(
    "/games/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const game = findGameById(request.params.id);
      if (!game) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Juego '${request.params.id}' no encontrado`,
        });
      }
      return game;
    },
  );
};
