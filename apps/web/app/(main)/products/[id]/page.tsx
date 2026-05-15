import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { fetchProductById } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await fetchProductById(id);
    if (!product) return { title: "Producto no encontrado" };
    return {
      title: `${product.name} — IRON DECK`,
      description: product.description,
    };
  } catch {
    return { title: "Producto" };
  }
}

/**
 * Ficha de producto IRON DECK.
 *
 * Tema oscuro: fondo negro, blanco hueso, acentos rojo sangre. El
 * botón "AÑADIR AL CARRITO" en rojo. Specs en tabla con líneas finas.
 * El texto canónico "Especificaciones" se conserva porque el E2E
 * `product-detail.spec.ts` lo verifica vía `getByRole("heading", { name: /Especificaciones/i })`.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <article className="container py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.28em] text-stone-400 transition-colors hover:text-[var(--iron-red)]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden border border-stone-800 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover contrast-110"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{CATEGORY_LABELS[product.category]}</Badge>
            {isOutOfStock ? (
              <Badge variant="destructive">Sin stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Últimas {product.stock} unidades</Badge>
            ) : (
              <Badge variant="success">En stock ({product.stock})</Badge>
            )}
          </div>

          <h1 className="text-balance text-4xl font-black uppercase leading-[1.05] tracking-[0.04em] text-[var(--iron-bone)] [font-family:var(--font-metal)] [text-shadow:0_0_30px_rgba(192,0,0,0.25)] md:text-5xl lg:text-6xl">
            {product.name}
          </h1>
          <span
            aria-hidden="true"
            className="block h-[2px] w-24 bg-[var(--iron-red)]"
          />

          <p className="text-base text-stone-300 [font-family:Inter,system-ui,sans-serif]">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3 border-t border-b border-stone-800 py-4">
            <span className="text-5xl font-black tracking-tight text-[var(--iron-bone)]">
              {formatPrice(product.price)}
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.28em] text-stone-500">
              IVA incluido
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-[var(--iron-bone)] bg-transparent text-[var(--iron-bone)] uppercase tracking-[0.22em] hover:bg-[var(--iron-bone)] hover:text-[#0a0a0a]"
            >
              <Link href="/">Seguir explorando</Link>
            </Button>
          </div>

          <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.26em] text-stone-500">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Demo sin pasarela de pago. El botón es solo UI.
          </p>

          <section aria-labelledby="specs-title" className="mt-2">
            <h2
              id="specs-title"
              className="border-b border-stone-800 pb-2 text-lg font-black uppercase tracking-[0.2em] text-[var(--iron-bone)] [font-family:var(--font-metal)]"
            >
              Especificaciones
            </h2>
            <dl className="mt-2 divide-y divide-stone-800">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[140px_1fr] gap-3 py-3 text-sm"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    {key}
                  </dt>
                  <dd className="font-medium text-stone-200">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
}
