import { getProductByNumber } from "@/server/functions";
import { queryOptions } from "@tanstack/react-query";

export const getProductByNumberOptions = (number: string) =>
  queryOptions({
    queryKey: ["products", { number }],
    queryFn: () => getProductByNumber(number),
  });
