"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { categories } from "@/data/categories";
import { heroStats } from "@/data/site";
import { formatProductCount } from "@/lib/format";

type HeroSectionProps = {
  categoryMenuOpen?: boolean;
  categoryPanelId?: string;
  onCategoryNavigate?: () => void;
};

const buildCategoryHref = (categoryName: string) =>
  `/products?search=${encodeURIComponent(categoryName)}`;

export function HeroSection({
  categoryMenuOpen = true,
  categoryPanelId,
  onCategoryNavigate
}: HeroSectionProps) {
  const heroGridStyle = {
    "--hero-category-column": categoryMenuOpen ? "300px" : "0px",
    "--hero-category-gap": categoryMenuOpen ? "1.25rem" : "0px"
  } as CSSProperties;

  return (
    <section className="bg-white">
      <div
        className="mx-auto grid max-w-7xl gap-5 px-4 pb-6 pt-0 transition-[grid-template-columns,gap] duration-300 ease-out lg:px-6 xl:grid-cols-[var(--hero-category-column)_minmax(0,1fr)] xl:gap-[var(--hero-category-gap)]"
        style={heroGridStyle}
      >
        <div className="relative hidden xl:block">
          <aside
            id={categoryPanelId}
            data-home-category-panel
            className={[
              "absolute left-0 top-0 z-30 w-[300px] overflow-hidden rounded-lg border border-[#E5EAF0] bg-white shadow-[0_18px_42px_rgba(4,28,50,0.14)] transition-[opacity,transform] duration-300 ease-out will-change-transform",
              categoryMenuOpen
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-4 opacity-0"
            ].join(" ")}
            aria-hidden={!categoryMenuOpen}
          >
          <div className="max-h-[520px] divide-y divide-[#E5EAF0] overflow-y-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildCategoryHref(category.name)}
                className="focus-ring group flex h-12 items-center gap-2 px-4 text-[15px] font-medium transition duration-200 hover:bg-[#F7F9FC]"
                onClick={onCategoryNavigate}
                tabIndex={categoryMenuOpen ? undefined : -1}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#E5EAF0] bg-[#F7F8FA] text-[#8A95A8] transition group-hover:border-[#F58220]/35 group-hover:bg-[#FFF4EA] group-hover:text-[#F58220]">
                  <category.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium leading-[18px] text-[#102033]">
                    {category.name}
                  </span>
                  <span className="block truncate text-[11px] font-medium leading-[13px] text-[#6B7280]">
                    {formatProductCount(category.productCount)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-[#8A95A8] transition group-hover:translate-x-0.5 group-hover:text-[#F58220]" />
              </Link>
            ))}
          </div>
        </aside>
        </div>

        <div className="overflow-hidden rounded-lg bg-[#041C32]">
          <div className="grid min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
              <span className="mb-4 inline-flex w-fit items-center rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                ToolMarket.ge
              </span>
              <h1 className="max-w-xl break-words text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl lg:text-5xl">
                პროფესიონალური ხელსაწყოები და მასალები
              </h1>
              <p className="mt-5 max-w-lg break-words text-base font-medium leading-7 text-white/78 sm:text-lg">
                ყველაფერი მშენებლობისთვის, რემონტისთვის და ყოველდღიური სამუშაოებისთვის.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#products"
                  className="focus-ring inline-flex items-center justify-center rounded-lg bg-[#F58220] px-6 py-3 text-sm font-black text-white shadow-sm transition duration-300 ease-in-out hover:scale-105 hover:bg-[#de741d] hover:shadow-[0_12px_24px_rgba(245,130,32,0.28)]"
                >
                  პროდუქტის ნახვა
                </Link>
                <Link
                  href="#brands"
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-md border border-white/45 bg-white px-5 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:bg-[#FFF4EA] hover:text-[#041C32]"
                >
                  ბრენდების ნახვა
                </Link>
              </div>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-white/12 bg-white/8 p-3">
                    <div className="text-lg font-black text-white">{stat.value}</div>
                    <div className="mt-1 truncate text-xs font-semibold text-white/65">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px] bg-[#072B4D] lg:min-h-full">
              <Image
                src="/images/cover.png"
                alt="პროფესიონალური ხელსაწყოები"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
