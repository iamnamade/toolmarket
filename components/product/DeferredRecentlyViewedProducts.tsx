"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/types/catalog";

const RecentlyViewedProducts = dynamic(
  () =>
    import("@/components/product/RecentlyViewedProducts").then(
      (module) => module.RecentlyViewedProducts
    ),
  {
    ssr: false,
    loading: () => <RecentlyViewedSkeleton />,
  }
);

export function DeferredRecentlyViewedProducts({
  products,
}: {
  products: Product[];
}) {
  return <RecentlyViewedProducts products={products} />;
}

function RecentlyViewedSkeleton() {
  return (
    <section aria-hidden="true">
      <div className="h-8 w-56 animate-pulse rounded-md bg-[#E8EDF3]" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[360px] animate-pulse rounded-xl border border-[#E5EAF0] bg-white"
          />
        ))}
      </div>
    </section>
  );
}
