import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceINR: number;
  image?: string;
  qty: number;
  color?: string;
  size?: string;
};

type CartState = {
  open: boolean;
  items: CartItem[];
  subtotal: number;
  count: number;
  toggle: (next?: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, color?: string, size?: string) => void;
  setQty: (productId: string, qty: number, color?: string, size?: string) => void;
  clear: () => void;
};

const CartCtx = createContext<CartState | null>(null);

const KEY = "bee_merch_cart_v1";

function keyOf(item: { productId: string; color?: string; size?: string }) {
  return `${item.productId}::${item.color || ""}::${item.size || ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  });

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.priceINR * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const value = useMemo<CartState>(
    () => ({
      open,
      items,
      subtotal,
      count,
      toggle(next) {
        setOpen((cur) => (typeof next === "boolean" ? next : !cur));
      },
      add(item, qty = 1) {
        const k = keyOf(item);
        const next = [...items];
        const idx = next.findIndex((i) => keyOf(i) === k);
        if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        else next.push({ ...item, qty });
        persist(next);
        setOpen(true);
      },
      remove(productId, color, size) {
        const k = keyOf({ productId, color, size });
        persist(items.filter((i) => keyOf(i) !== k));
      },
      setQty(productId, qty, color, size) {
        const k = keyOf({ productId, color, size });
        const next = items.map((i) => (keyOf(i) === k ? { ...i, qty: Math.max(1, qty) } : i));
        persist(next);
      },
      clear() {
        persist([]);
      }
    }),
    [count, items, open, subtotal]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

