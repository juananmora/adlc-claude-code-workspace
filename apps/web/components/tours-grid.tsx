"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { TourCard } from "@/components/tour-card";
import { fetchTours } from "@/lib/tours-api";
import {
  TOUR_DECADES,
  type Tour,
  type TourDecade,
} from "@/lib/tour-types";

interface ToursGridProps {
  initialTours: Tour[];
}

type DecadeFilter = TourDecade | "all";

/**
 * Estilos de los chips de década. Mismo lenguaje que `consoles-grid.tsx`:
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
 * Grid de tours con buscador por nombre (debounce 250ms + AbortController)
 * y chips de década exclusivos. Mantiene el contrato esperado por los tests
 * E2E:
 *   - `<section role="region" aria-label="Catálogo de tours">`
 *   - input `data-testid="tour-search-input"`, `aria-label="Buscar tours"`
 *   - chips con `data-testid="tour-decade-chip-<n>"` y `aria-pressed`
 *   - botón `data-testid="tour-clear-filters"` cuando hay filtros activos
 *   - cada TourCard con `data-testid="tour-card"`, `data-tour-id`,
 *     `data-decade`.
 *
 * El filtrado de búsqueda y década se hace server-side vía `fetchTours()`
 * para mantener una única fuente de verdad, igual que en `consoles-grid.tsx`.
 * El `initialTours` sirve como SSR snapshot inicial.
 */
export function ToursGrid({ initialTours }: ToursGridProps) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [search, setSearch] = useState("");
  const [decade, setDecade] = useState<DecadeFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTours({
          q: search || undefined,
          decade: decade === "all" ? undefined : decade,
          signal: controller.signal,
        });
        setTours(data);
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
  }, [search, decade]);

  const hasFilters = search.trim().length > 0 || decade !== "all";
  const resultCount = useMemo(() => tours.length, [tours]);

  function clearFilters() {
    setSearch("");
    setDecade("all");
  }

  return (
    <section
      id="tours"
      role="region"
      aria-label="Catálogo de tours"
      className="container py-16"
    >
      <div className="flex flex-col gap-4 border-b border-stone-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {"// Catálogo"}
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-wider text-stone-100 md:text-4xl">
            Todas las giras
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
            <div className="relative w-full md:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                aria-hidden="true"
              />
              <input
                type="search"
                id="tours-search"
                name="search"
                data-testid="tour-search-input"
                placeholder="BUSCAR POR NOMBRE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar tours"
                className="h-11 w-full border-2 border-stone-700 bg-black/60 pl-9 pr-3 text-sm uppercase tracking-[0.18em] text-stone-100 placeholder:text-stone-500 focus:border-[var(--metal-blood)] focus:outline-none focus:ring-1 focus:ring-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
              />
            </div>
          </div>
          {hasFilters && !loading && (
            <button
              type="button"
              data-testid="tour-clear-filters"
              onClick={clearFilters}
              className="self-start text-xs font-bold uppercase tracking-[0.28em] text-stone-300 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline md:self-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Fila de chips de década. Clic en el mismo chip conmuta a "all". */}
        <div
          role="group"
          aria-label="Filtrar por década"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.32em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            Década
          </span>
          <button
            type="button"
            aria-pressed={decade === "all"}
            onClick={() => setDecade("all")}
            data-testid="tour-decade-chip-todas"
            className={chipClass(decade === "all")}
          >
            Todas
          </button>
          {TOUR_DECADES.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={decade === d}
              onClick={() => setDecade(decade === d ? "all" : d)}
              data-testid={`tour-decade-chip-${d}`}
              className={chipClass(decade === d)}
            >
              {String(d).slice(2)}s
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
              No se pudieron cargar los tours.
            </p>
            <p className="mt-2 text-stone-400 [font-family:Inter,system-ui,sans-serif]">
              {error}
            </p>
          </div>
        ) : tours.length === 0 ? (
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
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
