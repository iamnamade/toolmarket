import { NextResponse } from "next/server";
import { getFallbackCatalogCategoryData, getPublicCatalogCategoryData } from "@/lib/catalog-category-tree";

export const revalidate = 60;

const publicCacheHeaders = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
};

export async function GET() {
  try {
    const categories = await getPublicCatalogCategoryData();

    return NextResponse.json(categories, {
      headers: publicCacheHeaders,
    });
  } catch {
    return NextResponse.json(getFallbackCatalogCategoryData(), {
      headers: publicCacheHeaders,
    });
  }
}
