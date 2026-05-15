import type { Product, ProductCategory } from "./types";

// Base URL del backend de productos. Debe apuntar a la raíz del servicio
// (p. ej. http://localhost:4000), NO incluir /api: el backend Fastify expone
// los endpoints directamente bajo /products.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value && value !== "all") search.set(key, value);
    }
  }
  const qs = search.toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ""}`;
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
