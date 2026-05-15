"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

/**
 * Página dedicada del carrito (IRON DECK).
 *
 * Misma fuente de verdad que el drawer (`useCartStore`), tematizada en
 * negro/blanco hueso/rojo sangre. Se mantienen todos los `data-testid`
 * que usan los E2E: cart-line, cart-line-qty, cart-line-remove, cart-total.
 */
export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const isHydrated = useCartStore((s) => s.isHydrated);
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalUnits = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <section className="container py-12" aria-label="Carrito de la compra">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.28em] text-stone-400 transition-colors hover:text-[var(--iron-red)]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Volver al catálogo
      </Link>

      <h1 className="mt-6 text-4xl font-black uppercase tracking-[0.08em] text-[var(--iron-bone)] [font-family:var(--font-metal)] [text-shadow:0_0_30px_rgba(192,0,0,0.2)] md:text-5xl">
        Tu carrito
      </h1>
      <span
        aria-hidden="true"
        className="mt-3 block h-[2px] w-24 bg-[var(--iron-red)]"
      />

      {!isHydrated ? (
        <div className="mt-10" aria-hidden="true" />
      ) : items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 border border-dashed border-stone-700 bg-black/40 p-12 text-center">
          <ShoppingBag
            className="h-10 w-10 text-stone-500"
            aria-hidden="true"
          />
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-stone-200">
            Tu carrito está vacío
          </p>
          <Button asChild className="bg-[var(--iron-red)] text-[var(--iron-bone)] hover:bg-[var(--iron-red-dark)] uppercase tracking-[0.22em]">
            <Link href="/">Ver catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="border border-stone-800 bg-black/40 p-5">
            <ul className="divide-y divide-stone-800">
              {items.map((item) => (
                <li
                  key={item.productId}
                  data-testid="cart-line"
                  data-product-id={item.productId}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 border border-stone-800 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--iron-bone)] transition-colors hover:text-[var(--iron-red)]"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      {formatPrice(item.price)} / ud.
                    </p>
                  </div>

                  <div className="flex items-center gap-1" aria-label="Cantidad">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-stone-700 bg-black text-[var(--iron-bone)] hover:bg-[var(--iron-red)] hover:text-[var(--iron-bone)] hover:border-[var(--iron-red)]"
                      aria-label="Disminuir cantidad"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span
                      data-testid="cart-line-qty"
                      className="min-w-[2ch] text-center text-sm font-bold text-[var(--iron-bone)]"
                    >
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-stone-700 bg-black text-[var(--iron-bone)] hover:bg-[var(--iron-red)] hover:text-[var(--iron-bone)] hover:border-[var(--iron-red)]"
                      aria-label="Aumentar cantidad"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span className="text-sm font-bold text-[var(--iron-bone)]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--iron-red)] hover:bg-[var(--iron-red)]/15 hover:text-[var(--iron-red)]"
                      aria-label="Eliminar del carrito"
                      data-testid="cart-line-remove"
                      onClick={() => {
                        removeItem(item.productId);
                        toast.success("Producto eliminado del carrito");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {items.length > 0 && (
              <div className="mt-4 flex justify-end border-t border-stone-800 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs uppercase tracking-[0.22em] text-stone-400 hover:text-[var(--iron-red)] hover:bg-transparent"
                  onClick={() => {
                    clear();
                    toast.success("Carrito vaciado");
                  }}
                >
                  Vaciar carrito
                </Button>
              </div>
            )}
          </div>

          <div className="border border-stone-800 bg-black/40 p-5">
            <h2 className="text-base font-black uppercase tracking-[0.2em] text-[var(--iron-bone)] [font-family:var(--font-metal)]">
              Resumen
            </h2>
            <span
              aria-hidden="true"
              className="mt-2 block h-[2px] w-12 bg-[var(--iron-red)]"
            />
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-300">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Unidades
                </dt>
                <dd>{totalUnits}</dd>
              </div>
              <div className="flex justify-between text-stone-300">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Subtotal
                </dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-3 text-base">
                <dt className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--iron-bone)]">
                  Total
                </dt>
                <dd
                  className="font-black text-[var(--iron-bone)]"
                  data-testid="cart-total"
                >
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>
            <Button
              className="mt-6 w-full bg-[var(--iron-red)] uppercase tracking-[0.24em] text-[var(--iron-bone)] hover:bg-[var(--iron-red-dark)]"
              size="lg"
              onClick={() => toast.info("Demo: checkout fuera de alcance")}
              disabled={items.length === 0}
            >
              Tramitar pedido
            </Button>
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.28em] text-stone-500">
              Demo sin pasarela de pago.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
