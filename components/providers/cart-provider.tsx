"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartItemInput } from "@/lib/types";

const STORAGE_KEY = "premium-tools-cart";

type CartContextValue = {
  items: CartItemInput[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemInput[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem(productId, quantity = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
              : item,
          );
        }

        return [...current, { productId, quantity: Math.min(quantity, 99) }];
      });
    },
    updateQuantity(productId, quantity) {
      if (quantity <= 0) {
        setItems((current) => current.filter((item) => item.productId !== productId));
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.min(quantity, 99) } : item,
        ),
      );
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    clear() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
