export interface AppConfig {
  port: number;
  host: string;
  corsOrigin: string[];
  nodeEnv: string;
}

function parsePort(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }
  return parsed;
}

function parseOrigins(value: string | undefined, fallback: string): string[] {
  const raw = (value ?? fallback).trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: parsePort(env.PORT, 4000),
    host: env.HOST ?? "0.0.0.0",
    // Permitimos por defecto :3000 y :3001 en dev, tanto localhost como
    // 127.0.0.1 (el navegador los trata como origenes distintos para CORS).
    // Next salta a :3001 si :3000 esta ocupado, y Playwright apunta a :3001.
    // En entornos pre/prod se debe pasar CORS_ORIGIN explicitamente.
    corsOrigin: parseOrigins(
      env.CORS_ORIGIN,
      "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001",
    ),
    nodeEnv: env.NODE_ENV ?? "development",
  };
}
