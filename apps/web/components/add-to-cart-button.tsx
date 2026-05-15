"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Botón cliente que añade el producto al carrito y dispara un toast.
 *
 * Existe como componente aislado para que la ficha (`app/products/[id]/page.tsx`)
 * pueda permanecer como server component y solo hidrate este sub-árbol.
 */
export function AddToCartButton({
  product,
  size = "lg",
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = product.stock === 0;

  return (
    <Button
      size={size}
      disabled={isOutOfStock}
      data-testid="add-to-cart"
      className={`gap-2 ${className ?? ""}`}
      onClick={() => {
        addItem(product, 1);
        toast.success("Añadido al carrito", { description: product.name });
      }}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
    </Button>
  );
}
