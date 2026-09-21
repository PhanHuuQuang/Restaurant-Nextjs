"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: number;
  title: string;
  img: string | null;
  price: number;
  sizeOption?: string;
  additionalPrice: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  serviceCost: number;
  deliveryCost: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "cart";

export function itemKey(item: { productId: number; sizeOption?: string }) {
  return `${item.productId}-${item.sizeOption ?? "default"}`;
}

const SERVICE_RATE = 0.05;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = itemKey(item);
        const existing = prev.find((i) => itemKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => itemKey(i) !== key)
        : prev.map((i) => (itemKey(i) === key ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalQuantity, subtotal, serviceCost, deliveryCost, total } =
    useMemo(() => {
      const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
      const subtotal = items.reduce(
        (sum, i) => sum + (i.price + i.additionalPrice) * i.quantity,
        0,
      );
      const serviceCost = Math.round(subtotal * SERVICE_RATE * 100) / 100;
      const deliveryCost = 0;
      const total = Math.round((subtotal + serviceCost + deliveryCost) * 100) / 100;
      return { totalQuantity, subtotal, serviceCost, deliveryCost, total };
    }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        serviceCost,
        deliveryCost,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}