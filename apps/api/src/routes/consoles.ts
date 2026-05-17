import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { findConsoleById, findConsoles } from "../data/consoles.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    manufacturer: { type: "string", maxLength: 50 },
    generation: { type: "string", maxLength: 3 },
  },
} as const;

interface ListQuery {
  q?: string;
  manufacturer?: string;
  generation?: string;
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

export const consolesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/consoles",
    { schema: { querystring: listQuerySchema } },
    async (request) => {
      const { q, manufacturer, generation } = request.query;
      return findConsoles({ q, manufacturer, generation });
    },
  );

  app.get<{ Params: IdParams }>(
    "/consoles/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const entry = findConsoleById(request.params.id);
      if (!entry) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Consola '${request.params.id}' no encontrada`,
        });
      }
      return entry;
    },
  );
};
