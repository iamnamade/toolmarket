import type { Product } from "@/types/catalog";

export function searchProducts(products: Product[], query: string, limit?: number) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const results = products.filter((product) =>
    getProductSearchText(product).includes(normalizedQuery)
  );

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function buildSearchHref(query: string) {
  const trimmedQuery = query.trim();

  return trimmedQuery
    ? `/products?search=${encodeURIComponent(trimmedQuery)}`
    : "/products";
}

function getProductSearchText(product: Product) {
  return normalizeSearchText(
    [
      product.title,
      product.name,
      product.brand,
      product.category,
      product.sku,
      product.id,
      product.description,
      product.shortDescription,
      product.features.join(" "),
      Object.values(product.specifications).join(" ")
    ].join(" ")
  );
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("ka-GE");
}
