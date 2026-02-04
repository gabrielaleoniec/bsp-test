import { getProductByNumber, getProducts } from "@/server/functions";
import { queryOptions } from "@tanstack/react-query";

export const getProductsOptions = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: getProducts,
  });

export const getProductByNumberOptions = (number: string) =>
  queryOptions({
    queryKey: ["products", { number }],
    queryFn: () => getProductByNumber(number),
  });
