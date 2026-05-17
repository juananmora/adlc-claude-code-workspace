"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ConsoleCard } from "@/components/console-card";
import { fetchConsoles } from "@/lib/consoles-api";
import {
  CONSOLE_GENERATIONS,
  type Console,
  type ConsoleGeneration,
} from "@/lib/console-types";

interface ConsolesGridProps {
  initialConsoles: Console[];
}

type GenerationFilter = ConsoleGeneration | "all";

/**
 * Estilos de los chips de generación. Mismo lenguaje que `games-grid.tsx`:
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
 * Grid de consolas con buscador por nombre (debounce 250ms + AbortController)
 * y chips de generación exclusivos. Mantiene el contrato esperado por los
 * tests E2E:
 *   - `<section role="region" aria-label="Catálogo de consolas">`
 *   - input `data-testid="console-search-input"`, `aria-label="Buscar consolas"`
 *   - chips con `data-testid="console-gen-chip-<n>"` y `aria-pressed`
 *   - botón `data-testid="console-clear-filters"` cuando hay filtros activos
 *   - cada ConsoleCard con `data-testid="console-card"`, `data-console-id`,
 *     `data-generation`.
 *
 * El filtrado de búsqueda y generación se hace server-side vía
 * `fetchConsoles()` para mantener una única fuente de verdad, igual que en
 * `games-grid.tsx`. El `initialConsoles` sirve como SSR snapshot inicial.
 */
export function ConsolesGrid({ initialConsoles }: ConsolesGridProps) {
  const [consoles, setConsoles] = useState<Console[]>(initialConsoles);
  const [search, setSearch] = useState("");
  const [generation, setGeneration] = useState<GenerationFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConsoles({
          q: search || undefined,
          generation: generation === "all" ? undefined : generation,
          signal: controller.signal,
        });
        setConsoles(data);
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
  }, [search, generation]);

  const hasFilters = search.trim().length > 0 || generation !== "all";
  const resultCount = useMemo(() => consoles.length, [consoles]);

  function clearFilters() {
    setSearch("");
    setGeneration("all");
  }

  return (
    <section
      id="consoles"
      role="region"
      aria-label="Catálogo de consolas"
      className="container py-16"
    >
      <div className="flex flex-col gap-4 border-b border-stone-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            {"// Catálogo"}
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-wider text-stone-100 md:text-4xl">
            Todas las consolas
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
                id="consoles-search"
                name="search"
                data-testid="console-search-input"
                placeholder="BUSCAR POR NOMBRE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar consolas"
                className="h-11 w-full border-2 border-stone-700 bg-black/60 pl-9 pr-3 text-sm uppercase tracking-[0.18em] text-stone-100 placeholder:text-stone-500 focus:border-[var(--metal-blood)] focus:outline-none focus:ring-1 focus:ring-[var(--metal-blood)] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]"
              />
            </div>
          </div>
          {hasFilters && !loading && (
            <button
              type="button"
              data-testid="console-clear-filters"
              onClick={clearFilters}
              className="self-start text-xs font-bold uppercase tracking-[0.28em] text-stone-300 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline md:self-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Fila de chips de generación. Clic en el mismo chip conmuta a "all". */}
        <div
          role="group"
          aria-label="Filtrar por generación"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.32em] text-stone-500 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
            Generación
          </span>
          <button
            type="button"
            aria-pressed={generation === "all"}
            onClick={() => setGeneration("all")}
            data-testid="console-gen-chip-todas"
            className={chipClass(generation === "all")}
          >
            Todas
          </button>
          {CONSOLE_GENERATIONS.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={generation === g}
              onClick={() => setGeneration(generation === g ? "all" : g)}
              data-testid={`console-gen-chip-${g}`}
              className={chipClass(generation === g)}
            >
              Gen {g}
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
              No se pudieron cargar las consolas.
            </p>
            <p className="mt-2 text-stone-400 [font-family:Inter,system-ui,sans-serif]">
              {error}
            </p>
          </div>
        ) : consoles.length === 0 ? (
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
            {consoles.map((c) => (
              <ConsoleCard key={c.id} console={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
