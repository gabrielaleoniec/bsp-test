import { z } from "zod";

export const ProductImageSchema = z.object({
  url: z.url(),
  name: z.string(),
});

export const ProductSchema = z.object({
  name: z.string(),
  number: z.string(),
  description: z.string(),
  images: z.array(ProductImageSchema),
});

export const ProductsResponseSchema = z.union([
  ProductSchema,
  z.array(ProductSchema),
]);

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
