import type { Game } from "./game-types";

/**
 * Cliente HTTP para el recurso /games.
 *
 * Reutiliza la convención de `lib/api.ts` y `lib/albums-api.ts`:
 * - `NEXT_PUBLIC_API_BASE_URL` apunta a la raíz del backend (ej.
 *   http://localhost:4000), SIN /api.
 * - `cache: "no-store"` para que SSR no congele el listado.
 * - `404` en detalle → `null` (la página se encarga de `notFound()`).
 *
 * El helper `buildUrl` se duplica localmente a propósito: levantarlo a
 * `lib/api.ts` ahora obligaría a refactorizar también `albums-api.ts` y
 * `api.ts`, lo cual queda fuera del alcance de T4 y arriesga regresiones en
 * `/albums` y `/products`. Se deja como deuda menor para que el reviewer
 * decida si consolidar en una iteración futura.
 */
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
