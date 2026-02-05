import { API_URL } from "@/constants/urls";
import {
  type Product,
  type ProductPatch,
  ProductsListSchema,
  ProductsResponseSchema,
} from "@/schemas/product";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}api/products`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  const json = await res.json();
  const parsed = ProductsListSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid products payload: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function updateProduct(
  number: string,
  patch: ProductPatch,
): Promise<Product | Product[]> {
  const res = await fetch(
    `${API_URL}api/products/${encodeURIComponent(number)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    },
  );

  if (res.status === 404) {
    throw new Error("Product not found");
  }
  if (!res.ok) {
    throw new Error(`Failed to update product (${res.status})`);
  }

  const json = await res.json();
  const parsed = ProductsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid product payload: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function getProductByNumber(
  number: string,
): Promise<Product | Product[]> {
  const res = await fetch(
    `${API_URL}api/products/${encodeURIComponent(number)}`,
    { cache: "no-store" },
  );

  if (res.status === 404) {
    throw new Error("Product not found");
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`);
  }

  const json = await res.json();
  const parsed = ProductsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid product payload: ${parsed.error.message}`);
  }
  return parsed.data;
}
