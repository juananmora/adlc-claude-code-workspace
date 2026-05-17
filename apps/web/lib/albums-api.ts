import type { Album } from "./album-types";
import { resolveApiBase } from "./api";

/**
 * Cliente HTTP para el recurso /albums.
 *
 * Reutiliza `resolveApiBase()` de `lib/api.ts` (iter-9):
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

export async function fetchAlbums(options: {
  band?: string | "all";
  genre?: string | "all";
  q?: string;
  signal?: AbortSignal;
} = {}): Promise<Album[]> {
  const url = buildUrl("/albums", {
    band: options.band,
    genre: options.genre,
    q: options.q,
  });
  const res = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`Error cargando discos (${res.status})`);
  }
  return res.json();
}

export async function fetchAlbumById(id: string): Promise<Album | null> {
  const url = buildUrl(`/albums/${id}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error cargando disco (${res.status})`);
  }
  return res.json();
}
