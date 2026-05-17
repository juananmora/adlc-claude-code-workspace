import type { Console } from "./console-types";
import { resolveApiBase } from "./api";

/**
 * Cliente HTTP para el recurso /consoles (iteración 10).
 *
 * Reutiliza `resolveApiBase()` de `lib/api.ts`:
 * - En navegador → `NEXT_PUBLIC_API_BASE_URL` (default http://localhost:4000).
 * - En SSR dentro de contenedor → `API_BASE_URL_INTERNAL` (Docker: http://api:4000).
 * - `cache: "no-store"` para que SSR no congele el listado.
 * - `404` en detalle → `null` (la página se encarga de `notFound()`).
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

export async function fetchConsoles(
  options: {
    q?: string;
    manufacturer?: string;
    generation?: number | string;
    signal?: AbortSignal;
  } = {},
): Promise<Console[]> {
  // Normalización defensiva: el backend impone maxLength y rechaza
  // additionalProperties. Aquí evitamos enviar `q` vacío o sólo espacios.
  const trimmed = options.q?.trim();
  const generation =
    options.generation === undefined || options.generation === "all"
      ? undefined
      : String(options.generation);
  const url = buildUrl("/consoles", {
    q: trimmed && trimmed.length > 0 ? trimmed : undefined,
    manufacturer: options.manufacturer,
    generation,
  });
  const res = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`Error cargando consolas (${res.status})`);
  }
  return res.json();
}

export async function fetchConsole(id: string): Promise<Console | null> {
  const url = buildUrl(`/consoles/${encodeURIComponent(id)}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error cargando consola (${res.status})`);
  }
  return res.json();
}
