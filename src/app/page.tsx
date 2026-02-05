"use client";

import Link from "next/link";

import { useProductsStore } from "@/store/products-store";

const Home = () => {
  const products = useProductsStore((s) => s.products);
  const hasSyncedOnce = useProductsStore((s) => s.hasSyncedOnce);
  const isPending = !hasSyncedOnce;

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start justify-start px-16 py-6">
        <div className="flex flex-col items-start gap-6 text-left">
          <h1 className="max-w-xs text-xl font-semibold leading-10 tracking-tight text-stone-900 dark:text-zinc-50">
            Products
          </h1>

          {isPending && (
            <p className="text-sm text-stone-600 dark:text-zinc-400">
              Loading…
            </p>
          )}

          {products.length > 0 && (
            <table className="w-full [&_td]:p-2 [&_th]:p-2 -mx-2 border border-stone-200 dark:border-zinc-800 rounded-md">
              <thead className="bg-stone-100 dark:bg-zinc-800">
                <tr className="border-b border-stone-200 dark:border-zinc-800">
                  <th>Name</th>
                  <th>Number</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={`${product.number}-${product.name}`}
                    className="hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors duration-600 timing-ease border-b border-stone-200 dark:border-zinc-800"
                  >
                    <td>
                      <Link
                        href={`/products/${encodeURIComponent(product.name)}`}
                        className="inline-block cursor-pointer w-100"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/products/${encodeURIComponent(product.name)}`}
                        className="inline-block cursor-pointer w-100"
                      >
                        {product.number}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isPending && products.length === 0 && (
            <p className="text-sm text-stone-500 dark:text-zinc-400">
              No products.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
