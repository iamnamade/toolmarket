"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/home/ProductCard";
import type { Product } from "@/types/catalog";

export function RecentlyViewedProducts({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(620, window.innerWidth * 0.78),
      behavior: "smooth"
    });
  };

  return (
    <section aria-labelledby="recent-products-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="recent-products-heading" className="text-2xl font-black text-[#041C32]">
          ბოლოს ნანახი პროდუქტები
        </h2>
        <div className="hidden gap-2 sm:flex">
          <RailButton label="წინა პროდუქტები" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-5" />
          </RailButton>
          <RailButton label="შემდეგი პროდუქტები" onClick={() => scroll(1)}>
            <ChevronRight className="size-5" />
          </RailButton>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#C8D1DC_transparent]"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[82vw] max-w-[300px] shrink-0 snap-start sm:w-[290px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RailButton({
  label,
  onClick,
  children
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="focus-ring grid size-11 place-items-center rounded-lg border border-[#DCE3EA] bg-white text-[#062B4F] transition hover:border-[#F58220] hover:text-[#F58220]"
    >
      {children}
    </button>
  );
}
