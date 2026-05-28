import type { Tour } from "./tour-types";
import { resolveApiBase } from "./api";

/**
 * Cliente HTTP para el recurso /tours (iteración 12).
 *
 * Reutiliza `resolveApiBase()` de `lib/api.ts`:
 * - En navegador → `NEXT_PUBLIC_API_BASE_URL` (default http://localhost:4000).
 * - En SSR dentro de contenedor → `API_BASE_URL_INTERNAL` (Docker: http://api:4000).
 * - `cache: "no-store"` para que SSR no congele el listado.
 * - `404` en detalle → `null` (la página se encarga de `notFound()`).
 *
 * Todos los `path params` dinámicos pasan por `encodeURIComponent` para
 * blindar la URL contra ids con caracteres especiales (DEC-005).
 */
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

export async function fetchTours(
  options: {
    q?: string;
    band?: string;
    decade?: number | string;
    signal?: AbortSignal;
  } = {},
): Promise<Tour[]> {
  // Normalización defensiva: el backend impone maxLength y rechaza
  // additionalProperties. Evitamos enviar `q` vacío o sólo espacios.
  const trimmed = options.q?.trim();
  const decade =
    options.decade === undefined || options.decade === "all"
      ? undefined
      : String(options.decade);
  const url = buildUrl("/tours", {
    q: trimmed && trimmed.length > 0 ? trimmed : undefined,
    band: options.band,
    decade,
  });
  const res = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`Error cargando tours (${res.status})`);
  }
  return res.json();
}

export async function fetchTour(id: string): Promise<Tour | null> {
  const url = buildUrl(`/tours/${encodeURIComponent(id)}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error cargando tour (${res.status})`);
  }
  return res.json();
}
