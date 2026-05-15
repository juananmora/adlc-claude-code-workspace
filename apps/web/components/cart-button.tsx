"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/cart-drawer";

/**
 * Botón del carrito + Sheet drawer.
 *
 * Diseñado para vivir en el header (o en el slot dejado por el agente de
 * branding). Solo es UI cliente; el estado proviene de Zustand persistente.
 */
export function CartButton() {
  const [open, setOpen] = useState(false);
  const totalUnits = useCartStore((s) => s.totalUnits());
  const isHydrated = useCartStore((s) => s.isHydrated);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Abrir carrito"
        data-testid="cart-button"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {isHydrated && totalUnits > 0 && (
          <span
            data-testid="cart-count"
            className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
            aria-label={`${totalUnits} unidades en el carrito`}
          >
            {totalUnits}
          </span>
        )}
      </Button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
