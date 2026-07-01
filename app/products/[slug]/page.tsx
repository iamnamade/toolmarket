import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import {
  allProducts,
  getProductBySlug,
  getRecentlyViewedProducts,
  getSimilarProducts
} from "@/data/products";
import { createPageMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "პროდუქტი ვერ მოიძებნა",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    ...createPageMetadata({
      title: `${product.title} | ${product.brand}`,
      description: product.shortDescription,
      path: `/products/${slug}`,
      images: [
        {
          url: product.images[0] ?? product.image,
          alt: product.title
        }
      ]
    }),
    category: product.category
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = getSimilarProducts(slug);
  const recentlyViewedProducts = getRecentlyViewedProducts(slug);

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <div className="border-b border-[#E5EAF0] bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center gap-2 overflow-hidden px-4 py-4 text-sm font-bold text-[#6B7280] lg:px-6"
          aria-label="ნავიგაციის ბილიკი"
        >
          <Link href="/" className="focus-ring shrink-0 rounded-md transition hover:text-[#072B4D]">
            მთავარი
          </Link>
          <ChevronRight className="size-4 shrink-0 text-[#8A95A8]" />
          <Link
            href="/#products"
            className="focus-ring shrink-0 rounded-md transition hover:text-[#072B4D]"
          >
            პროდუქტები
          </Link>
          <ChevronRight className="size-4 shrink-0 text-[#8A95A8]" />
          <span className="hidden shrink-0 text-[#6B7280] sm:inline">{product.category}</span>
          <ChevronRight className="hidden size-4 shrink-0 text-[#8A95A8] sm:block" />
          <span className="truncate text-[#102033]">{product.title}</span>
        </nav>
      </div>
      <ProductDetailView
        product={product}
        similarProducts={similarProducts}
        recentlyViewedProducts={recentlyViewedProducts}
      />
      <Footer />
    </main>
  );
}
