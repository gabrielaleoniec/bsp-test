import type { Product } from "@/schemas/product";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProductsState = {
  products: Product[];
  /** True after first successful sync from API (or rehydration had data). */
  hasSyncedOnce: boolean;
  setProducts: (products: Product[]) => void;
  /** Merge one or more updated products into the list (by name match). Call after PATCH. */
  mergeProducts: (updated: Product | Product[]) => void;
  getProductByName: (name: string) => Product | undefined;
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      hasSyncedOnce: false,
      setProducts: (products) => set({ products, hasSyncedOnce: true }),
      mergeProducts: (updated) => {
        const list = Array.isArray(updated) ? updated : [updated];
        set((state) => {
          const next = [...state.products];
          for (const product of list) {
            const i = next.findIndex(
              (p) => p.name.toLowerCase() === product.name.toLowerCase(),
            );
            if (i >= 0) next[i] = product;
            else next.push(product);
          }
          return { products: next };
        });
      },
      getProductByName: (name) => {
        const normalized = name.toLowerCase();
        return get().products.find((p) => p.name.toLowerCase() === normalized);
      },
    }),
    {
      name: "bsp-products",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ products: s.products }),
    },
  ),
);
