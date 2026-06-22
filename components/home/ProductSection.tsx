import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/home/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const HOME_SECTION_PRODUCT_LIMIT = 8;

type ProductSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
  emptyTitle?: string;
  emptyText?: string;
  viewAllHref?: string;
};

export function ProductSection({
  id,
  eyebrow,
  title,
  products,
  emptyTitle,
  emptyText,
  viewAllHref = "/products"
}: ProductSectionProps) {
  const visibleProducts = products.slice(0, HOME_SECTION_PRODUCT_LIMIT);

  return (
    <section id={id} className="scroll-mt-32 bg-[#F7F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader eyebrow={eyebrow} title={title} />
        {visibleProducts.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={index > 3 ? "hidden h-full sm:block" : "h-full"}
                >
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center sm:justify-end">
              <Link
                href={viewAllHref}
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-5 text-sm font-black text-[#0B3A68] transition hover:border-[#F58220] hover:text-[#F58220]"
              >
                ყველას ნახვა
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-[#E5EAF0] bg-white px-5 py-10 text-center">
            <h3 className="text-xl font-black text-[#041C32]">
              {emptyTitle ?? "პროდუქტები ვერ მოიძებნა"}
            </h3>
            {emptyText ? (
              <p className="mt-2 text-sm font-bold text-[#6B7280]">{emptyText}</p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
