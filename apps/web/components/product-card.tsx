"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
}

/**
 * Tarjeta de producto con estética IRON DECK metalera:
 * fondo negro, borde fino gris oscuro, hover con glow rojo sangre.
 * Se conservan los `data-testid`, `data-product-id`, `data-category` y
 * `aria-label` que el QA E2E asume.
 */
export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article
      data-testid="product-card"
      data-product-id={product.id}
      data-category={product.category}
      className="group relative flex h-full flex-col overflow-hidden border border-stone-800 bg-black/40 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(192,0,0,0.6)]"
    >
      <Link
        href={`/products/${product.id}`}
        className="block"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover contrast-110 transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge>{CATEGORY_LABELS[product.category]}</Badge>
            {isOutOfStock ? (
              <Badge variant="destructive">Sin stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Últimas unidades</Badge>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-4 pt-4">
        <Link href={`/products/${product.id}`} className="hover:text-[var(--iron-red)]">
          <h3 className="line-clamp-1 text-base font-black uppercase tracking-[0.05em] text-[var(--iron-bone)] [font-family:var(--font-metal)]">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-stone-400">
          {product.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
        <span className="text-xl font-black tracking-tight text-[var(--iron-bone)]">
          {formatPrice(product.price)}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href={`/products/${product.id}`}>Ver detalle</Link>
          </Button>
          <Button
            size="sm"
            data-testid="add-to-cart"
            disabled={isOutOfStock}
            className="flex-1 gap-2"
            onClick={() => {
              addItem(product, 1);
              toast.success("Añadido al carrito", {
                description: product.name,
              });
            }}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {isOutOfStock ? "Sin stock" : "Añadir"}
          </Button>
        </div>
      </div>

      {/* Barra inferior rojo sangre, animada en hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[var(--iron-red)] transition-transform duration-300 group-hover:scale-x-100"
      />
    </article>
  );
}
