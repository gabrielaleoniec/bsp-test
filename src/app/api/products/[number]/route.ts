import { NextResponse } from "next/server";

import { products } from "@/data/products";

export async function GET(
  request: Request,
  { params }: { params: { number: string } },
) {
  const productNumber = decodeURIComponent(params.number);

  // Find all products matching the number (case-insensitive)
  const matchingProducts = products.filter(
    (product) => product.number.toLowerCase() === productNumber.toLowerCase(),
  );

  if (matchingProducts.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // If only one product matches, return it directly
  // Otherwise return the array of matching products
  return NextResponse.json(
    matchingProducts.length === 1 ? matchingProducts[0] : matchingProducts,
  );
}
