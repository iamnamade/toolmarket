import type { Product } from "@/types/catalog";

const productSearchTextCache = new Map<string, string>();

export function searchProducts(products: Product[], query: string, limit?: number) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const results: Product[] = [];

  for (const product of products) {
    if (!getProductSearchText(product).includes(normalizedQuery)) {
      continue;
    }

    results.push(product);

    if (typeof limit === "number" && results.length >= limit) {
      break;
    }
  }

  return results;
}

export function buildSearchHref(query: string) {
  const trimmedQuery = query.trim();

  return trimmedQuery
    ? `/products?search=${encodeURIComponent(trimmedQuery)}`
    : "/products";
}

function getProductSearchText(product: Product) {
  const cachedValue = productSearchTextCache.get(product.id);

  if (cachedValue) {
    return cachedValue;
  }

  const searchText = normalizeSearchText(
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

  productSearchTextCache.set(product.id, searchText);

  return searchText;
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("ka-GE");
}
