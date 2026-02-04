"use client";

import { useParams, useRouter } from "next/navigation";

import { SafeProductImage } from "@/components/ui/safe-product-image";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen flex-col gap-6 px-16 py-6 font-sans dark:bg-black dark:text-zinc-50">
      {product.images.length > 0 && (
        <ul className="list-disc pl-5 text-sm opacity-90">
          {product.images.map((img, i) => (
            <SafeProductImage
              key={`${img.url}-${img.name}`}
              src={img.url}
              alt={img.name}
              width={400}
              height={300}
            />
          ))}
        </ul>
      )}

      <article className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
        <div className="flex flex-row gap-1 text-sm">
          <span className="text-sm font-semibold">Product number:</span>
          <span className="text-sm">{product.number}</span>
        </div>
        <p className="text-md opacity-90">{product.description}</p>
      </article>
    </div>
  );
}
