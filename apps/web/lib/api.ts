import type { Product, ProductCategory } from "./types";

/**
 * Base URL del backend.
 *
 * - **Client-side (browser):** usa `NEXT_PUBLIC_API_BASE_URL` (default
 *   `http://localhost:4000`). El navegador del host accede a la API por el
 *   puerto publicado.
 * - **Server-side (SSR en contenedor):** usa `API_BASE_URL_INTERNAL` si está
 *   definido (en Docker: `http://api:4000`, DNS interno de compose). Si no,
 *   cae al valor público.
 *
 * Decisión arquitectónica iter-9: las fichas /products/[id], /albums/[id] y
 * /games/[id] son server components y hacen fetch desde el contenedor web,
 * donde `localhost:4000` apunta al propio contenedor (no a `api`). Por eso
 * el server-side requiere el hostname interno de la red Docker.
 */
export function resolveApiBase(): string {
  // typeof window === "undefined" en server components y route handlers.
  if (typeof window === "undefined") {
    const internal = process.env.API_BASE_URL_INTERNAL;
    if (internal) return internal.replace(/\/$/, "");
  }
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value && value !== "all") search.set(key, value);
    }
  }
  const qs = search.toString();
  return `${resolveApiBase()}${path}${qs ? `?${qs}` : ""}`;
}

export async function fetchProducts(options: {
  search?: string;
  category?: ProductCategory | "all";
  signal?: AbortSignal;
} = {}): Promise<Product[]> {
  const url = buildUrl("/products", {
    q: options.search,
    category: options.category,
  });
  const res = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`Error cargando productos (${res.status})`);
  }
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const url = buildUrl(`/products/${id}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error cargando producto (${res.status})`);
  }
  return res.json();
}
