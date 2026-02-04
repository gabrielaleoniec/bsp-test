"use client";

import { useParams, useRouter } from "next/navigation";

import { getProductByNumberOptions } from "@/hooks/query-options";
import type { Product } from "@/schemas/product";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const productNumber = params?.number as string;
  const { data, isPending, error } = useQuery(
    getProductByNumberOptions(productNumber),
  );

  const product: Product | undefined = data
    ? Array.isArray(data)
      ? data[0]
      : data
    : undefined;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black dark:text-zinc-50">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans dark:bg-black dark:text-zinc-50">
        <p className="text-lg text-red-600 dark:text-red-400">
          {error.message}
        </p>
        <button
          onClick={() => router.back()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black dark:text-zinc-50">
        <p className="text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-16 py-6 font-sans dark:bg-black dark:text-zinc-50">
      <h1 className="text-xl font-semibold tracking-tight">Product</h1>

      <article className="space-y-2">
        <h2 className="text-lg font-semibold">{product.number}</h2>
        <p className="text-sm opacity-90">{product.description}</p>
        {product.images.length > 0 && (
          <ul className="list-disc pl-5 text-sm opacity-90">
            {product.images.map((img) => (
              <li key={`${img.url}-${img.name}`}>
                {img.name} — {img.url}
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
