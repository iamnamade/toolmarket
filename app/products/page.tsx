import type { Metadata } from "next";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { allProducts } from "@/data/products";
import { createPageMetadata } from "@/lib/seo";

type ProductsPageProps = {
  searchParams?: Promise<{
    search?: string | string[];
    category?: string | string[];
    subcategory?: string | string[];
  }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "პროდუქტები",
  description:
    "ToolMarket.ge-ზე დაათვალიერეთ ხელსაწყოების, სამშენებლო მასალების და ტექნიკური პროდუქტების სრული კატალოგი.",
  path: "/products"
});

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawSearchQuery = resolvedSearchParams?.search;
  const rawCategory = resolvedSearchParams?.category;
  const rawSubcategory = resolvedSearchParams?.subcategory;
  const searchQuery = Array.isArray(rawSearchQuery)
    ? rawSearchQuery[0] ?? ""
    : rawSearchQuery ?? "";
  const categorySlug = Array.isArray(rawCategory)
    ? rawCategory[0] ?? ""
    : rawCategory ?? "";
  const subcategorySlug = Array.isArray(rawSubcategory)
    ? rawSubcategory[0] ?? ""
    : rawSubcategory ?? "";

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <ProductCatalog
        products={allProducts}
        initialSearchQuery={searchQuery}
        initialCategorySlug={categorySlug}
        initialSubcategorySlug={subcategorySlug}
      />
      <Footer />
    </main>
  );
}
