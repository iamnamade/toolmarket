"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Menu, Search, Tag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { brands } from "@/data/brands";
import {
  categoryHref,
  countProductsForCategory,
  type CatalogCategory,
} from "@/data/category-navigation";
import { allProducts } from "@/data/products";
import { recentSearches } from "@/data/search";
import { formatProductCount } from "@/lib/format";
import { formatPrice } from "@/lib/price";
import { buildSearchHref, searchProducts } from "@/lib/search-products";

const popularCategorySearches = [
  "ხელსაწყოები",
  "ელექტრობა",
  "უსაფრთხოება",
  "აქსესუარები",
];

const popularBrandNames = new Set(["INGCO", "TOTAL", "TOLSEN", "CROWN"]);
const popularBrands = brands.filter((brand) => popularBrandNames.has(brand.name));

export function HeaderMobileCategoryGrid({
  categories,
  onNavigate,
}: {
  categories: CatalogCategory[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={categoryHref(category.slug)}
          className="focus-ring flex items-center gap-3 rounded-md border border-[#E5EAF0] bg-[#F7F9FC] p-3"
          onClick={onNavigate}
        >
          <category.icon className="size-5 shrink-0 text-[#F58220]" strokeWidth={1.9} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[#102033]">{category.nameKa}</span>
            <span className="block truncate text-xs text-[#6B7280]">
              {formatProductCount(countProductsForCategory(allProducts, category))}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function HeaderSearchPanel({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const matchingProducts = useMemo(() => searchProducts(allProducts, query), [query]);
  const popularProducts = useMemo(
    () => allProducts.filter((product) => product.isPopular).slice(0, 6),
    []
  );
  const visibleProducts = hasQuery ? matchingProducts.slice(0, 6) : popularProducts;

  const submitSearch = () => {
    if (!trimmedQuery) {
      inputRef.current?.focus();
      return;
    }

    router.push(buildSearchHref(trimmedQuery));
    onClose();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onClose, open, triggerRef]);

  return (
    <>
      <div
        className={[
          "fixed inset-x-0 bottom-0 top-[var(--search-overlay-top)] z-40 bg-[#041C32]/20 backdrop-blur-[8px] transition-opacity duration-200 ease-out",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={[
          "fixed inset-x-0 top-[var(--search-overlay-top)] z-[60] max-h-[calc(100dvh-var(--search-overlay-top))] overflow-y-auto border-t border-[#E5EAF0] bg-white/95 shadow-[0_20px_45px_rgba(4,28,50,0.16)] backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        ].join(" ")}
        aria-hidden={!open}
        role="dialog"
        aria-label="პროდუქტების ძიება"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-5">
          <form
            className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
          >
            <label htmlFor="site-search" className="sr-only">
              ძებნა
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                tabIndex={open ? 0 : -1}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="მოძებნეთ პროდუქტი, ბრენდი ან კატეგორია"
                autoComplete="off"
                className="focus-ring h-14 w-full rounded-md border border-[#E5EAF0] bg-[#F7F8FA] pl-12 pr-12 text-base font-bold text-[#102033] placeholder:font-normal placeholder:text-[#8A95A8]"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="ძიების გასუფთავება"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#6B7280] transition hover:bg-white hover:text-[#F58220]"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              className="focus-ring h-14 rounded-md bg-[#F58220] px-7 text-sm font-black text-white transition hover:bg-[#de741d]"
              tabIndex={open ? 0 : -1}
            >
              ძებნა
            </button>
          </form>

          <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(250px,0.72fr)_minmax(0,1.6fr)]">
            <section className="rounded-lg border border-[#E5EAF0] bg-[#F7F8FA] p-4 sm:p-5">
              <SearchGroup
                icon={<Clock3 className="size-4" />}
                title="ბოლო ძიებები"
                items={recentSearches}
                open={open}
                onSelect={(item) => {
                  setQuery(item);
                  inputRef.current?.focus();
                }}
              />
              <SearchGroup
                icon={<Menu className="size-4" />}
                title="პოპულარული კატეგორიები"
                items={popularCategorySearches}
                open={open}
                onSelect={(item) => {
                  setQuery(item);
                  inputRef.current?.focus();
                }}
              />
              <SearchGroup
                icon={<Tag className="size-4" />}
                title="პოპულარული ბრენდები"
                items={popularBrands.map((brand) => brand.name)}
                open={open}
                onSelect={(item) => {
                  setQuery(item);
                  inputRef.current?.focus();
                }}
                last
              />
            </section>

            <section className="rounded-lg border border-[#E5EAF0] bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-sm font-black text-[#102033]">
                    {hasQuery ? "ამას ხომ არ ეძებთ?" : "პოპულარული პროდუქტები"}
                  </h2>
                  {hasQuery ? (
                    <p className="mt-1 text-xs font-bold text-[#6B7280]">
                      ნაპოვნია {matchingProducts.length} პროდუქტი
                    </p>
                  ) : null}
                </div>
                {hasQuery ? (
                  <span className="max-w-48 truncate rounded-full bg-[#FFF3E8] px-3 py-1 text-xs font-bold text-[#C65F0B]">
                    {trimmedQuery}
                  </span>
                ) : null}
              </div>

              {visibleProducts.length ? (
                <div className="grid gap-2">
                  {visibleProducts.map((product) => (
                    <Link
                      key={product.id}
                      tabIndex={open ? 0 : -1}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setQuery(product.title);
                        onClose();
                      }}
                      className="focus-ring group grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-transparent p-2.5 text-left transition duration-300 hover:translate-x-1 hover:border-[#F58220]/30 hover:bg-[#FFF8F2] sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:gap-4"
                    >
                      <span className="relative size-14 overflow-hidden rounded-md border border-[#E5EAF0] bg-white sm:size-16">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="64px"
                          quality={70}
                          className="object-contain p-1.5"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-[#102033]">
                          {product.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-[#6B7280]">
                          {product.brand} / {product.category}
                        </span>
                        <span className="mt-1 block text-sm font-black text-[#041C32] sm:hidden">
                          {formatPrice(product.price)}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-sm font-black text-[#041C32] sm:inline">
                          {formatPrice(product.price)}
                        </span>
                        <span className="grid size-9 place-items-center rounded-full border border-[#E5EAF0] bg-white text-[#8A95A8] transition group-hover:border-[#F58220] group-hover:text-[#F58220]">
                          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-[#D9E0E8] bg-[#F7F8FA] px-4 py-8 text-center">
                  <div>
                    <Search className="mx-auto size-7 text-[#F58220]" />
                    <p className="mt-3 text-sm font-black text-[#102033]">პროდუქტი ვერ მოიძებნა</p>
                    <p className="mt-1 text-sm text-[#6B7280]">სცადეთ სხვა სიტყვით ძებნა.</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchGroup({
  icon,
  title,
  items,
  open,
  onSelect,
  last = false,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  open: boolean;
  onSelect: (item: string) => void;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-5 border-b border-[#E5EAF0] pb-5"}>
      <div className="mb-3 flex items-center gap-2 text-[#F58220]">
        {icon}
        <h2 className="text-sm font-black text-[#102033]">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => onSelect(item)}
            className="focus-ring rounded-md border border-[#E5EAF0] bg-white px-3 py-2 text-xs font-bold text-[#6B7280] transition duration-300 hover:border-[#F58220] hover:bg-[#FFF8F2] hover:text-[#072B4D]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
