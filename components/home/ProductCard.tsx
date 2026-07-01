"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { formatPrice } from "@/lib/price";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, addToWishlist } = useCommerce();
  const productHref = `/products/${product.slug}`;
  const imageClassName = compact
    ? "object-contain p-5 transition duration-300 group-hover:scale-[1.025] sm:p-6"
    : "object-contain p-6 transition duration-300 group-hover:scale-[1.025] sm:p-8";
  const imageSizes = compact
    ? "(min-width: 1280px) 18rem, (min-width: 1024px) 21rem, (min-width: 640px) calc(50vw - 2rem), 92vw"
    : "(min-width: 1280px) 19rem, (min-width: 640px) calc(50vw - 2rem), 94vw";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F58220] hover:shadow-[0_16px_36px_rgba(4,28,50,0.1)]">
      <div className={compact ? "relative aspect-[1.18] overflow-hidden bg-white" : "relative aspect-[1.06] overflow-hidden bg-white"}>
        {product.discount ? (
          <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-[#FFE3E5] px-2.5 py-1 text-xs font-black leading-none text-[#D92D20] ring-1 ring-[#FFD1D1]">
            {product.discount}
          </span>
        ) : null}
        <Link
          href={productHref}
          aria-label={`${product.title} - პროდუქტის ნახვა`}
          className="focus-ring block h-full w-full rounded-t-xl"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes={imageSizes}
            quality={70}
            className={imageClassName}
          />
        </Link>
      </div>

      <div className={compact ? "flex flex-1 flex-col border-t border-[#F1F4F7] p-3 sm:p-4" : "flex flex-1 flex-col border-t border-[#F1F4F7] p-4 sm:p-5"}>
        <div className="flex min-h-7 items-center justify-between gap-2">
          <span className="min-w-0 max-w-[58%] truncate rounded-md bg-[#F7F9FC] px-2.5 py-1 text-xs font-black text-[#072B4D]">
            {product.brand}
          </span>
          <span className="min-w-0 truncate text-right text-xs font-bold text-[#157347]">
            მარაგშია: {product.stock}
          </span>
        </div>

        <Link href={productHref} className="focus-ring mt-3 rounded-md">
          <h3 className={compact ? "line-clamp-2 min-h-11 break-words text-[15px] font-black leading-[22px] text-[#102033] transition group-hover:text-[#072B4D]" : "line-clamp-2 min-h-12 break-words text-base font-black leading-6 text-[#102033] transition group-hover:text-[#072B4D]"}>
            {product.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-1 text-xs font-bold uppercase tracking-normal text-[#8A95A8]">
          {product.sku}
        </p>

        <div className={compact ? "mt-auto flex min-h-10 items-end justify-between gap-3 pt-3" : "mt-auto flex min-h-11 items-end justify-between gap-3 pt-4"}>
          <div className="min-w-0">
            <span className={compact ? "text-xl font-black leading-none text-[#041C32] sm:text-[22px]" : "text-[22px] font-black leading-none text-[#041C32] sm:text-2xl"}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <span className="ml-2 align-baseline text-sm font-bold text-[#8A95A8] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </div>
          <ActionButton
            label="რჩეულებში დამატება"
            onClick={() => addToWishlist(product)}
          >
            <Heart className="size-5" />
          </ActionButton>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className={compact ? "focus-ring mt-3 inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-md bg-[#072B4D] px-3 text-sm font-black text-white transition hover:bg-[#041C32]" : "focus-ring mt-4 inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-md bg-[#072B4D] px-3 text-sm font-black text-white transition hover:bg-[#041C32]"}
        >
          <ShoppingCart className="size-4 shrink-0" />
          <span className="truncate">მოთხოვნის დამატება</span>
        </button>
      </div>
    </article>
  );
}

function ActionButton({
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
      className="focus-ring grid size-11 place-items-center rounded-md border border-[#E5EAF0] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:bg-[#F58220] hover:text-white"
    >
      {children}
    </button>
  );
}
