import { NextRequest, NextResponse } from "next/server";

import { products } from "@/data/products";
import { ProductPatchSchema } from "@/schemas/product";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const productName = decodeURIComponent((await params).name);

  const matchingProducts = products.filter(
    (product) => product.name.toLowerCase() === productName.toLowerCase(),
  );

  if (matchingProducts.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(
    matchingProducts.length === 1 ? matchingProducts[0] : matchingProducts,
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const productName = decodeURIComponent((await params).name);

  const body = await request.json();
  const parsed = ProductPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const patch = parsed.data;
  const indices = products
    .map((p, i) =>
      p.name.toLowerCase() === productName.toLowerCase() ? i : -1,
    )
    .filter((i) => i >= 0);

  if (indices.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  for (const i of indices) {
    if (patch.name !== undefined) products[i].name = patch.name;
    if (patch.number !== undefined) products[i].number = patch.number;
    if (patch.description !== undefined)
      products[i].description = patch.description;
    if (patch.images !== undefined) products[i].images = patch.images;
  }

  const updated =
    indices.length === 1
      ? products[indices[0]]
      : indices.map((i) => products[i]);
  return NextResponse.json(updated);
}
