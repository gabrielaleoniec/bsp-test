"use client";

import { useEffect } from "react";

import { useProductsStore } from "@/store/products-store";

/** Rehydrates persisted products and syncs from API on mount. */
export function ProductsSync() {
  const setProducts = useProductsStore((s) => s.setProducts);

  useEffect(() => {
    useProductsStore.persist.rehydrate();
    // If we had cached products, show them immediately (set hasSyncedOnce)
    const state = useProductsStore.getState();
    if (state.products.length > 0) {
      useProductsStore.setState({ hasSyncedOnce: true });
    }
  }, []);

  useEffect(() => {
    const state = useProductsStore.getState();
    if (state.products.length === 0) {
      let cancelled = false;
      fetch("/api/products")
        .then((res) =>
          res.ok ? res.json() : Promise.reject(new Error(res.statusText)),
        )
        .then((data) => {
          if (!cancelled && Array.isArray(data)) setProducts(data);
        })
        .catch(() => {
          // ignore; store keeps rehydrated or initial state
        });
      return () => {
        cancelled = true;
      };
    }
  }, [setProducts]);

  return null;
}
