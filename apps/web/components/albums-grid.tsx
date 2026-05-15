"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlbumCard } from "@/components/album-card";
import { fetchAlbums } from "@/lib/albums-api";
import { BANDS, type Album } from "@/lib/album-types";

interface AlbumsGridProps {
  initialAlbums: Album[];
}

type BandFilter = string | "all";

/**
 * Grid de discos con filtros (banda + búsqueda libre).
 *
 * Estética metalera oscura: fondo negro, controles industriales (borde
 * fino, sin radios), buscador con icono blanco hueso, banda activa en
 * rojo. La lógica (debounce 250ms, AbortController, estados de
 * carga/error/vacío con reset) se mantiene estable porque el contrato
 * con la API y los tests E2E no cambia:
 *
 *   - `aria-label="Filtrar por banda"` en el SelectTrigger.
 *   - `aria-label="Buscar discos"` en el Input.
 *   - `role="region"` `aria-label="Catálogo de discos"` en la section.
 */
export function AlbumsGrid({ initialAlbums }: AlbumsGridProps) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [search, setSearch] = useState("");
  const [band, setBand] = useState<BandFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAlbums({
          q: search || undefined,
          band,
          signal: controller.signal,
        });
        setAlbums(data);
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
  }, [search, band]);

  const hasFilters = search.trim().length > 0 || band !== "all";
  const resultCount = useMemo(() => albums.length, [albums]);

  return (
    <section
      id="discos"
      role="region"
      aria-label="Catálogo de discos"
      className="container py-16"
    >
      <div className="flex flex-col gap-4 border-b border-stone-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[var(--metal-blood)]">
            {"// Catálogo"}
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-wider text-stone-100 md:text-4xl">
            Todos los discos
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-stone-500">
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

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          {/* Buscador industrial: input nativo, negro, borde fino, sin radius. */}
          <div className="relative w-full md:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
              aria-hidden="true"
            />
            <input
              type="search"
              id="albums-search"
              name="search"
              placeholder="BUSCAR POR TÍTULO O BANDA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar discos"
              className="h-11 w-full border border-stone-700 bg-black/60 pl-9 pr-3 text-sm uppercase tracking-[0.18em] text-stone-100 placeholder:text-stone-500 focus:border-[var(--metal-blood)] focus:outline-none focus:ring-1 focus:ring-[var(--metal-blood)]"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.65rem] uppercase tracking-[0.32em] text-stone-500 md:inline">
              Filtrar
            </span>
            <Select
              value={band}
              onValueChange={(value) => setBand(value as BandFilter)}
            >
              <SelectTrigger
                id="albums-band"
                name="band"
                aria-label="Filtrar por banda"
                className="h-11 w-[240px] rounded-none border-stone-700 bg-black/60 text-xs uppercase tracking-[0.2em] text-stone-100 focus:border-[var(--metal-blood)] focus:ring-1 focus:ring-[var(--metal-blood)] focus:ring-offset-0"
              >
                <SelectValue placeholder="Todas las bandas" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-stone-700 bg-black text-stone-100">
                <SelectItem
                  value="all"
                  className="text-xs uppercase tracking-[0.2em] focus:bg-[var(--metal-blood)]/15 focus:text-[var(--metal-bone)]"
                >
                  Todas las bandas
                </SelectItem>
                {BANDS.map((b) => (
                  <SelectItem
                    key={b}
                    value={b}
                    className="text-xs uppercase tracking-[0.2em] focus:bg-[var(--metal-blood)]/15 focus:text-[var(--metal-bone)]"
                  >
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilters && !loading && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setBand("all");
            }}
            className="self-start text-xs font-bold uppercase tracking-[0.28em] text-stone-300 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline md:self-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-12">
        {error ? (
          <div
            role="alert"
            className="border border-[var(--metal-blood)] bg-[var(--metal-blood)]/10 p-6 text-sm"
          >
            <p className="font-bold uppercase tracking-[0.2em] text-[var(--metal-blood)]">
              No se pudieron cargar los discos.
            </p>
            <p className="mt-2 text-stone-400 [font-family:Inter,system-ui,sans-serif]">
              {error}
            </p>
          </div>
        ) : albums.length === 0 ? (
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
                onClick={() => {
                  setSearch("");
                  setBand("all");
                }}
                className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 underline-offset-4 transition-colors hover:text-[var(--metal-blood)] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
