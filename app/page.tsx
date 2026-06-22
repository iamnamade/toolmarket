import { Footer } from "@/components/layout/Footer";
import { BrandSection } from "@/components/home/BrandSection";
import { HomepageHeaderHero } from "@/components/home/HomepageHeaderHero";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductSection } from "@/components/home/ProductSection";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import {
  allProducts,
  discountProducts,
  featuredProducts
} from "@/data/products";
import { searchProducts } from "@/lib/search-products";

type HomeProps = {
  searchParams?: Promise<{
    search?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const rawSearchQuery = resolvedSearchParams?.search;
  const searchQuery = Array.isArray(rawSearchQuery)
    ? rawSearchQuery[0] ?? ""
    : rawSearchQuery ?? "";
  const trimmedSearchQuery = searchQuery.trim();
  const searchResults = trimmedSearchQuery
    ? searchProducts(allProducts, trimmedSearchQuery)
    : [];

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <HomepageHeaderHero />
      {trimmedSearchQuery ? (
        <ProductSection
          eyebrow="ძიება"
          emptyText="სცადეთ სხვა სიტყვით ძებნა"
          emptyTitle="პროდუქტი ვერ მოიძებნა"
          id="products"
          products={searchResults}
          title={`ძიების შედეგები: ${trimmedSearchQuery}`}
        />
      ) : (
        <ProductSection
          eyebrow="რჩეული"
          id="products"
          title="რჩეული პროდუქტები"
          products={featuredProducts}
        />
      )}
      <ProductSection
        eyebrow="აქციები"
        id="discounts"
        title="ფასდაკლებები"
        products={discountProducts}
      />
      <BrandSection />
      <ServiceHighlights />
      <Newsletter />
      <Footer />
    </main>
  );
}
