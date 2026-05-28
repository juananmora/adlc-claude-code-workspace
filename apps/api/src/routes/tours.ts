import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { findTourById, findTours } from "../data/tours.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    decade: { type: "string", maxLength: 4 },
    band: { type: "string", maxLength: 80 },
  },
} as const;

interface ListQuery {
  q?: string;
  decade?: string;
  band?: string;
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

export const toursRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/tours",
    { schema: { querystring: listQuerySchema } },
    async (request) => {
      const { q, decade, band } = request.query;
      return findTours({ q, decade, band });
    },
  );

  app.get<{ Params: IdParams }>(
    "/tours/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const entry = findTourById(request.params.id);
      if (!entry) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Tour '${request.params.id}' no encontrado`,
        });
      }
      return entry;
    },
  );
};
