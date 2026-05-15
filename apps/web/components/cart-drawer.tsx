"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Sheet del carrito (lateral). Se monta dentro de `CartButton` y comparte
 * abrir/cerrar mediante props para evitar acoplar Sheet a cada trigger.
 */
export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalUnits = useCartStore((s) => s.totalUnits());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-testid="cart-drawer"
        side="right"
        aria-label="Carrito de la compra"
      >
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
          <SheetDescription>
            {totalUnits === 0
              ? "Aún no has añadido productos."
              : `${totalUnits} unidad${totalUnits === 1 ? "" : "es"} en el carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag
                className="h-10 w-10 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                Tu carrito está vacío
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href="/">Ver catálogo</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  data-testid="cart-line"
                  data-product-id={item.productId}
                  className="flex gap-3 border-b border-border/60 pb-4 last:border-b-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} ·{" "}
                      <span data-testid="cart-line-qty">{item.quantity}</span>{" "}
                      ud.
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        aria-label="Disminuir cantidad"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        aria-label="Aumentar cantidad"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-destructive"
                        aria-label="Eliminar del carrito"
                        data-testid="cart-line-remove"
                        onClick={() => {
                          removeItem(item.productId);
                          toast.success("Producto eliminado del carrito");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold" data-testid="cart-total">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href="/cart">Ver carrito</Link>
              </Button>
              <Button
                onClick={() =>
                  toast.info("Demo: checkout fuera de alcance")
                }
              >
                Tramitar pedido
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
