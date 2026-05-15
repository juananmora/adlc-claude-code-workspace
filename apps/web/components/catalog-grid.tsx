"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/api";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/types";

interface CatalogGridProps {
  initialProducts: Product[];
}

type CategoryFilter = ProductCategory | "all";

/**
 * Catálogo: barra de filtros + grid de productos.
 * Estilo IRON DECK metalero (fondo negro, acento rojo sangre).
 * Conserva todos los testids/aria-labels que usa el QA E2E.
 */
export function CatalogGrid({ initialProducts }: CatalogGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce + re-fetch when filters change.
  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({
          search,
          category,
          signal: controller.signal,
        });
        setProducts(data);
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
  }, [search, category]);

  const hasFilters = search.trim().length > 0 || category !== "all";
  const resultCount = useMemo(() => products.length, [products]);

  return (
    <section
      id="categorias"
      aria-label="Catálogo de productos"
      className="container py-14"
    >
      <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            Catálogo
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explora la selección. Filtra por categoría o busca por nombre.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Cargando...
            </span>
          ) : (
            <span>
              {resultCount} resultado{resultCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              id="catalog-search"
              name="search"
              placeholder="Buscar productos, marcas o specs..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar productos"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryFilter)}
            >
              <SelectTrigger
                id="catalog-category"
                name="category"
                className="w-[220px]"
                aria-label="Filtrar por categoría"
              >
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
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
              setCategory("all");
            }}
            className="self-start text-xs font-bold uppercase tracking-[0.22em] text-[var(--iron-bone)] underline-offset-4 transition-colors hover:text-[var(--iron-red)] hover:underline md:self-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-10">
        {error ? (
          <div
            role="alert"
            className="border border-destructive bg-destructive/5 p-6 text-sm"
          >
            <p className="font-semibold text-destructive">
              No se pudieron cargar los productos.
            </p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center">
            <p className="text-base font-semibold text-foreground">
              No hay productos que coincidan con tu búsqueda.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Prueba ajustando los filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
