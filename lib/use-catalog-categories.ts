"use client";

import { useEffect, useState } from "react";
import {
  catalogCategories,
  resolveCatalogCategories,
  type CatalogCategory,
  type CatalogCategoryData,
} from "@/data/category-navigation";

const CATALOG_CATEGORY_CACHE_TTL_MS = 60_000;

let cachedCategories: CatalogCategory[] = catalogCategories;
let cachedCategoriesAt = 0;
let categoriesRequest: Promise<CatalogCategory[] | null> | null = null;

async function loadCatalogCategories() {
  const now = Date.now();

  if (cachedCategoriesAt && now - cachedCategoriesAt < CATALOG_CATEGORY_CACHE_TTL_MS) {
    return cachedCategories;
  }

  if (categoriesRequest) {
    return categoriesRequest;
  }

  categoriesRequest = fetch("/api/catalog-categories", {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as CatalogCategoryData[];
      const resolvedCategories = resolveCatalogCategories(data);

      cachedCategories = resolvedCategories;
      cachedCategoriesAt = Date.now();

      return resolvedCategories;
    })
    .catch(() => null)
    .finally(() => {
      categoriesRequest = null;
    });

  return categoriesRequest;
}

export function useCatalogCategories() {
  const [categories, setCategories] = useState<CatalogCategory[]>(cachedCategories);

  useEffect(() => {
    let cancelled = false;

    void loadCatalogCategories().then((nextCategories) => {
      if (!cancelled && nextCategories) {
        setCategories(nextCategories);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
