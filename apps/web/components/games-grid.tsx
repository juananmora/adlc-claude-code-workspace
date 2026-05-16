"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { fetchGames } from "@/lib/games-api";
import { GAME_GENRES, type Game, type GameGenre } from "@/lib/game-types";

interface GamesGridProps {
  initialGames: Game[];
}

type GenreFilter = GameGenre | "all";

/**
 * Convierte un género ("Aventura isométrica", "Beat 'em up"...) a un slug
 * ascii kebab-case usado por los `data-testid` de los chips. El conjunto de
 * valores resultantes está enumerado en `specs/acceptance-criteria.md` y los
 * tests E2E de T9 los buscarán exactamente:
 *   "Beat 'em up"          → "beat-em-up"
 *   "Aventura isométrica"  → "aventura-isometrica"
 *   "Shooter sobre raíles" → "shooter-sobre-railes"
 */
function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Estilos de los chips de género. Mismo lenguaje que `albums-grid.tsx`:
 * activo en rojo sangre, inactivo en negro con borde stone. Sin radius.
 */
function chipClass(active: boolean): string {
  const base =
    "h-9 select-none border px-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors";
  return active
    ? `${base} border-[var(--metal-blood)] bg-[var(--metal-blood)]/15 text-[var(--metal-bone)]`
    : `${base} border-stone-700 bg-black/40 text-stone-300 hover:border-stone-500 hover:text-stone-100`;
}

/**
 * Grid de juegos con buscador por título (debounce 250ms + AbortController)
 * y chips de género exclusivos. Mantiene el contrato esperado por los tests
 * E2E (T9):
 *   - `<section role="region" aria-label="Catálogo de games">`
 *   - input `data-testid="game-search-input"`, `aria-label="Buscar juegos"`
 *   - chips con `data-testid="game-genre-chip-<slug>"` y `aria-pressed`
 *   - botón `data-testid="game-clear-filters"` cuando hay filtros activos
 *   - cada GameCard con `data-testid="game-card"`, `data-game-id`,
 *     `data-genre`.
 *
 * Detalle retro: borde `border-2` en el wrapper del buscador y tracking
 * monoespaciado en los labels. Sin scanlines aquí (se reservan al hero).
 */
export function GamesGrid({ initialGames }: GamesGridProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<GenreFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGames({
          q: search || undefined,
          genre: genre === "all" ? undefined : genre,
          signal: controller.signal,
        });
        setGames(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [search, genre]);

  const hasFilters = search.trim().length > 0 || genre !== "all";
  const resultCount = useMemo(() => games.length, [games]);

  function clearFilters() {
    setSearch("");
    setGenre("all");
  }

  return (
    <section
      id="games"
      role="region"
      aria-label="Catálogo de games"
      className="container py-16"
    >
      <div className="flex flex-col gap-4 border-b border-stone-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {"// Catálogo"}
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-wider text-stone-100 md:text-4xl">
            Todos los juegos
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Cargando...
            </span>
          ) : (
            <span>
              {resultCount} {resultCount === 1 ? "Resultado" : "Resultados"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            {/* Buscador industrial 8-bit: borde grueso `border-2` para evocar
                el pixelado del Amstrad. */}
            <div className="relative w-full md:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                aria-hidden="true"
              />
              <input
                type="search"
                id="games-search"
                name="search"
                data-testid="game-search-input"
                placeholder="BUSCAR POR TÍTULO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar juegos"
                className="h-11 w-full border-2 border-stone-700 bg-black/60 pl-9 pr-3 text-sm uppercase tracking-[0.18em] text-stone-100 placeholder:text-stone-500 focus:border-[var(--metal-blood)] focus:outline-none focus:ring-1 focus:ring-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
              />
            </div>
          </div>
          {hasFilters && !loading && (
            <button
              type="button"
              data-testid="game-clear-filters"
              onClick={clearFilters}
              className="self-start text-xs font-bold uppercase tracking-[0.28em] text-stone-300 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline md:self-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Fila de chips de género. Activo se conmuta clic a clic. */}
        <div
          role="group"
          aria-label="Filtrar por género"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.32em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            Género
          </span>
          <button
            type="button"
            aria-pressed={genre === "all"}
            onClick={() => setGenre("all")}
            data-testid="game-genre-chip-todos"
            className={chipClass(genre === "all")}
          >
            Todos
          </button>
          {GAME_GENRES.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={genre === g}
              onClick={() => setGenre(genre === g ? "all" : g)}
              data-testid={`game-genre-chip-${slug(g)}`}
              className={chipClass(genre === g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        {error ? (
          <div
            role="alert"
            className="border border-[var(--metal-blood)] bg-[var(--metal-blood)]/10 p-6 text-sm"
          >
            <p className="font-bold uppercase tracking-[0.2em] text-[var(--metal-blood)]">
              No se pudieron cargar los juegos.
            </p>
            <p className="mt-2 text-stone-400 [font-family:Inter,system-ui,sans-serif]">
              {error}
            </p>
          </div>
        ) : games.length === 0 ? (
          <div className="border border-dashed border-stone-700 p-12 text-center">
            <p className="text-base font-bold uppercase tracking-[0.24em] text-stone-200">
              Sin coincidencias
            </p>
            <p className="mt-2 text-sm text-stone-400 [font-family:Inter,system-ui,sans-serif]">
              Prueba ajustando los filtros.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
