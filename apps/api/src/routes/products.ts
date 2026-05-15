import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { findProductById, findProducts } from "../data/products.js";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../types.js";

const listQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    q: { type: "string", maxLength: 200 },
    search: { type: "string", maxLength: 200 },
    category: { type: "string", enum: PRODUCT_CATEGORIES },
  },
} as const;

interface ListQuery {
  q?: string;
  search?: string;
  category?: ProductCategory;
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

export const productsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get<{ Querystring: ListQuery }>(
    "/products",
    { schema: { querystring: listQuerySchema } },
    async (request) => {
      const { q, search, category } = request.query;
      const queryText = q ?? search;
      const data = findProducts({ q: queryText, category });
      return data;
    },
  );

  app.get<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const product = findProductById(request.params.id);
      if (!product) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Producto '${request.params.id}' no encontrado`,
        });
      }
      return product;
    },
  );
};
