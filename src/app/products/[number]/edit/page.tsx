"use client";

import { useCallback, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { SafeProductImage } from "@/components/ui/safe-product-image";
import { getProductByNumberOptions } from "@/hooks/query-options";
import type { Product, ProductImage } from "@/schemas/product";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";

function EditProductForm({
  product,
  mutation,
  onCancel,
}: {
  product: Product;
  mutation: UseMutationResult<
    Product | Product[],
    Error,
    {
      name?: string;
      number?: string;
      description?: string;
      images?: ProductImage[];
    }
  >;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [number, setNumber] = useState(product.number);
  const [description, setDescription] = useState(product.description);
  const [images, setImages] = useState<ProductImage[]>(product.images);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setImageError(null);
      const url = newImageUrl.trim();
      const imgName = newImageName.trim();
      if (!url || !imgName) {
        setImageError("URL and name are required");
        return;
      }
      try {
        new URL(url);
      } catch {
        setImageError("Please enter a valid URL");
        return;
      }
      setImages((prev) => [...prev, { url, name: imgName }]);
      setNewImageUrl("");
      setNewImageName("");
    },
    [newImageUrl, newImageName],
  );

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateImage = useCallback(
    (index: number, field: "url" | "name", value: string) => {
      setImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      mutation.mutate(
        { name, number, description, images },
        {
          onError: (err: Error) => setSubmitError(err.message),
        },
      );
    },
    [name, number, description, images, mutation],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Edit product</h1>

      {submitError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="product-name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-number" className="text-sm font-medium">
          Product number
        </label>
        <input
          id="product-number"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 resize-y"
        />
      </div>

      <fieldset className="flex flex-col gap-3 rounded border border-zinc-200 p-4 dark:border-zinc-700">
        <legend className="text-sm font-medium">Images</legend>
        {images.length > 0 && (
          <ul className="flex flex-col gap-3">
            {images.map((img, i) => (
              <li
                key={`img-${i}`}
                className="flex flex-col gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-800/50"
              >
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`image-url-${i}`}
                      className="text-xs text-zinc-500"
                    >
                      Image URL
                    </label>
                    <input
                      id={`image-url-${i}`}
                      type="url"
                      value={img.url}
                      onChange={(e) =>
                        handleUpdateImage(i, "url", e.target.value)
                      }
                      placeholder="https://…"
                      className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`image-name-${i}`}
                      className="text-xs text-zinc-500"
                    >
                      Name
                    </label>
                    <input
                      id={`image-name-${i}`}
                      type="text"
                      value={img.name}
                      onChange={(e) =>
                        handleUpdateImage(i, "name", e.target.value)
                      }
                      placeholder="e.g. Front view"
                      className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                      aria-label={`Remove image ${img.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <div className="flex flex-col gap-1">
            <label htmlFor="new-image-url" className="text-xs text-zinc-500">
              Image URL
            </label>
            <input
              id="new-image-url"
              type="url"
              placeholder="https://…"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="new-image-name" className="text-xs text-zinc-500">
              Name
            </label>
            <input
              id="new-image-name"
              type="text"
              placeholder="e.g. Front view"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-1 sm:pt-6">
            <button
              type="button"
              onClick={handleAddImage}
              className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Add image
            </button>
          </div>
        </div>
        {imageError && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {imageError}
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [emblaRef] = useEmblaCarousel({});

  const productNumber = params?.number as string;
  const { data, isPending, error } = useQuery(
    getProductByNumberOptions(productNumber),
  );

  const product: Product | undefined = data
    ? Array.isArray(data)
      ? data[0]
      : data
    : undefined;

  const mutation = useMutation({
    mutationFn: async (patch: {
      name?: string;
      number?: string;
      description?: string;
      images?: ProductImage[];
    }) => {
      const res = await fetch(
        `/api/products/${encodeURIComponent(productNumber)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? res.statusText);
      }
      return res.json();
    },
    onSuccess: (updated: Product | Product[]) => {
      const num = Array.isArray(updated) ? updated[0]?.number : updated?.number;
      const newNumber = num ?? productNumber;
      queryClient.invalidateQueries({
        queryKey: ["products", { number: productNumber }],
      });
      if (newNumber !== productNumber) {
        queryClient.invalidateQueries({
          queryKey: ["products", { number: newNumber }],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/products/${encodeURIComponent(newNumber)}`);
    },
  });

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
    <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-[400px_1fr] md:grid-rows-1 min-h-screen flex-col gap-6 px-4 lg:px-16 py-6 font-sans dark:bg-black dark:text-zinc-50 max-w-dvw overflow-hidden">
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

      <EditProductForm
        product={product}
        mutation={mutation}
        onCancel={() => router.back()}
      />
    </div>
  );
}
