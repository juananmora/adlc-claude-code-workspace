import type { Game } from "./game-types";
import { resolveApiBase } from "./api";

/**
 * Cliente HTTP para el recurso /games.
 *
 * Reutiliza `resolveApiBase()` de `lib/api.ts` (iter-9):
 * - En navegador → `NEXT_PUBLIC_API_BASE_URL` (default http://localhost:4000).
 * - En SSR dentro de contenedor → `API_BASE_URL_INTERNAL` (Docker: http://api:4000).
 * - `cache: "no-store"` para que SSR no congele el listado.
 * - `404` en detalle → `null` (la página se encarga de `notFound()`).
 *
 * En iter-9 se consolida la lógica de resolución de base URL en `lib/api.ts`
 * porque la dockerización exigía distinguir entre fetch client-side y SSR
 * (REC-7 del backlog iter-7 resuelto).
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

export async function fetchGames(
  options: {
    q?: string;
    genre?: string;
    signal?: AbortSignal;
  } = {},
): Promise<Game[]> {
  // Normalización defensiva: el backend impone maxLength y rechaza
  // additionalProperties. Aquí evitamos enviar `q` vacío o sólo espacios
  // (lo cual el backend trataría como sin filtro de todos modos, pero
  // ensucia la URL y los tests).
  const trimmed = options.q?.trim();
  const url = buildUrl("/games", {
    q: trimmed && trimmed.length > 0 ? trimmed : undefined,
    genre: options.genre,
  });
  const res = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) {
    throw new Error(`Error cargando juegos (${res.status})`);
  }
  return res.json();
}

export async function fetchGame(id: string): Promise<Game | null> {
  const url = buildUrl(`/games/${id}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error cargando juego (${res.status})`);
  }
  return res.json();
}
