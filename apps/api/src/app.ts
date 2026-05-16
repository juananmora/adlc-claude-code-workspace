import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { loadConfig, type AppConfig } from "./config.js";
import { productsRoutes } from "./routes/products.js";
import { albumsRoutes } from "./routes/albums.js";
import { gamesRoutes } from "./routes/games.js";

export interface BuildAppOptions {
  config?: AppConfig;
  logger?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadConfig();
  const app = Fastify({
    logger: options.logger ?? config.nodeEnv !== "test",
    disableRequestLogging: config.nodeEnv === "test",
  });

  await app.register(cors, {
    origin: config.corsOrigin.length === 0 ? false : config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  });

  await app.register(sensible);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(productsRoutes);
  await app.register(albumsRoutes);
  await app.register(gamesRoutes);

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;
    if (statusCode >= 500) {
      app.log.error(error);
    }
    reply.code(statusCode).send({
      statusCode,
      error: error.name || "Error",
      message: error.message || "Error inesperado",
    });
  });

  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "Recurso no encontrado",
    });
  });

  return app;
}
