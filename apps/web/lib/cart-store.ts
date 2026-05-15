"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./types";

/**
 * Cart store (Zustand).
 *
 * - Persistencia en `localStorage` mediante middleware `persist`.
 * - Pensado para uso solo en cliente (`"use client"` arriba). En SSR el storage
 *   queda en modo no-op porque `localStorage` no existe.
 * - `addItem` agrupa por `productId`: si ya existe la línea, suma cantidades
 *   respetando el `stock` para no permitir cantidades imposibles.
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalUnits: () => number;
  subtotal: () => number;
  setHydrated: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((it) => it.productId === product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stock || existing.quantity + quantity);
          set({
            items: items.map((it) =>
              it.productId === product.id ? { ...it, quantity: nextQty, stock: product.stock } : it,
            ),
          });
          return;
        }
        const safeQty = Math.max(1, Math.min(quantity, product.stock || quantity));
        set({
          items: [
            ...items,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              stock: product.stock,
              quantity: safeQty,
            },
          ],
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((it) => it.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((it) =>
            it.productId === productId ? { ...it, quantity } : it,
          ),
        });
      },
      clear: () => set({ items: [] }),
      totalUnits: () => get().items.reduce((acc, it) => acc + it.quantity, 0),
      subtotal: () => get().items.reduce((acc, it) => acc + it.price * it.quantity, 0),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "byteforge-cart",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
