"use client";

import { useParams, useRouter } from "next/navigation";

import { SafeProductImage } from "@/components/ui/safe-product-image";
import { useProductsStore } from "@/store/products-store";
import useEmblaCarousel from "embla-carousel-react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [emblaRef] = useEmblaCarousel({});

  const productName = decodeURIComponent(params?.name as string);
  const product = useProductsStore((s) => s.getProductByName(productName));
  const hasSyncedOnce = useProductsStore((s) => s.hasSyncedOnce);

  const isPending = !hasSyncedOnce && !product;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black dark:text-zinc-50">
        <p className="text-lg">Loading...</p>
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
    <div className="flex flex-col min-h-screen items-center content-start space-y-4">
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-[400px_1fr] md:grid-rows-1 flex-col gap-6 px-4 lg:px-16 py-6 font-sans dark:bg-black dark:text-zinc-50 max-w-dvw overflow-hidden">
        {product.images.length > 0 && (
          <div className="flex justify-center">
            <div className="overflow-hidden mx-auto" ref={emblaRef}>
              <ul className="flex list-none opacity-90">
                {product.images.map((img, i) => (
                  <li
                    key={`${img.url}-${img.name}`}
                    className="w-100 flex grow-0 shrink-0"
                  >
                    <SafeProductImage
                      src={img.url}
                      alt={img.name}
                      width={400}
                      height={300}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <article className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="flex flex-row gap-1 text-sm">
            <span className="text-sm font-semibold">Product number:</span>
            <span className="text-sm">{product.number}</span>
          </div>
          <p className="text-md opacity-90">{product.description}</p>
        </article>
      </div>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() =>
          router.push(`/products/${encodeURIComponent(product.name)}/edit`)
        }
      >
        Edit
      </button>
    </div>
  );
}
