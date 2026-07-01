"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Grid2x2,
  Search,
  Settings,
  SlidersHorizontal,
  X
} from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";
import { brands } from "@/data/brands";
import {
  categoryHref,
  countProductsForCategory,
  countProductsForSubcategory,
  getCategoryBySlug,
  getSubcategoryBySlug,
  productMatchesCategory,
  productMatchesSubcategory,
  subcategoryHref
} from "@/data/category-navigation";
import { parsePriceToCents } from "@/lib/price";
import { searchProducts } from "@/lib/search-products";
import { useCatalogCategories } from "@/lib/use-catalog-categories";
import { SlideDrawer } from "@/components/ui/SlideDrawer";
import type { LucideIcon } from "lucide-react";
import type { Product } from "@/types/catalog";

type SortOption = "popular" | "price-asc" | "price-desc" | "new" | "discount";
type AvailabilityFilter = "in-stock" | "made-to-order" | "limited";
type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

type ProductCatalogProps = {
  products: Product[];
  initialSearchQuery?: string;
  initialCategorySlug?: string;
  initialSubcategorySlug?: string;
};

type CountOption = {
  label: string;
  value: string;
  count: number;
};

type AvailabilityOption = CountOption & {
  value: AvailabilityFilter;
};

type SidebarSections = {
  availability: boolean;
  categories: boolean;
  brands: boolean;
  discount: boolean;
};

const brandOrder = [
  "TOPFINE",
  "INGCO",
  "TOTAL",
  "TOLSEN",
  "CROWN",
  "WADFOW",
  "HOGERT",
  "DECAKILA"
];

const brandMetaByName = new Map(brands.map((brand) => [brand.name, brand] as const));

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "popular", label: "პოპულარულობით" },
  { value: "price-asc", label: "ფასი ზრდადობით" },
  { value: "price-desc", label: "ფასი კლებადობით" },
  { value: "new", label: "ახალი" },
  { value: "discount", label: "ფასდაკლებული" }
];

const PRODUCTS_PER_PAGE = 12;
const DEFAULT_CATALOG_DESCRIPTION =
  "მოძებნეთ ხელსაწყოები, სამშენებლო მასალები და ტექნიკური პროდუქტები სასურველი ფასითა და ბრენდით.";

export function ProductCatalog({
  products,
  initialSearchQuery = "",
  initialCategorySlug,
  initialSubcategorySlug
}: ProductCatalogProps) {
  const categories = useCatalogCategories();
  const catalogTopRef = useRef<HTMLDivElement>(null);
  const selectedCatalogCategory = getCategoryBySlug(initialCategorySlug, categories);
  const selectedCatalogSubcategory = getSubcategoryBySlug(
    selectedCatalogCategory,
    initialSubcategorySlug
  );
  const priceLimit = useMemo(() => getPriceLimit(products), [products]);
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.nameKa,
        value: category.slug,
        count: countProductsForCategory(products, category)
      })),
    [categories, products]
  );
  const brandOptions = useMemo(
    () => createCountOptions(products, "brand", brandOrder),
    [products]
  );
  const availabilityOptions = useMemo(
    () => createAvailabilityOptions(products),
    [products]
  );
  const categoryProducts = useMemo(
    () =>
      selectedCatalogCategory
        ? products.filter((product) =>
            productMatchesCategory(product, selectedCatalogCategory)
          )
        : products,
    [products, selectedCatalogCategory]
  );
  const selectedSubcategoryProductCount = useMemo(
    () =>
      selectedCatalogSubcategory
        ? countProductsForSubcategory(products, selectedCatalogSubcategory)
        : null,
    [products, selectedCatalogSubcategory]
  );

  const [query, setQuery] = useState(initialSearchQuery);
  const deferredQuery = useDeferredValue(query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<
    AvailabilityFilter[]
  >([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(priceLimit);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [openSections, setOpenSections] = useState<SidebarSections>({
    availability: true,
    categories: true,
    brands: true,
    discount: true
  });

  const scopedProducts = useMemo(() => {
    if (!selectedCatalogSubcategory) {
      return categoryProducts;
    }

    return categoryProducts.filter((product) =>
      productMatchesSubcategory(product, selectedCatalogSubcategory)
    );
  }, [categoryProducts, selectedCatalogSubcategory]);

  const filteredProducts = useMemo(() => {
    const searchedProducts = deferredQuery.trim()
      ? searchProducts(scopedProducts, deferredQuery)
      : [...scopedProducts];
    const minPriceCents = minPrice * 100;
    const maxPriceCents = maxPrice * 100;

    return searchedProducts
      .filter((product) => {
        const productPrice = parsePriceToCents(product.price);
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.some((categorySlug) => {
            const category = getCategoryBySlug(categorySlug, categories);

            return category
              ? productMatchesCategory(product, category)
              : categorySlug === product.category;
          });
        const matchesBrand =
          selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchesAvailability =
          selectedAvailability.length === 0 ||
          selectedAvailability.includes(getAvailabilityStatus(product));

        return (
          matchesCategory &&
          matchesBrand &&
          matchesAvailability &&
          productPrice >= minPriceCents &&
          productPrice <= maxPriceCents &&
          (!discountOnly || Boolean(product.discount || product.oldPrice))
        );
      })
      .sort((first, second) => sortProducts(first, second, sort));
  }, [
    discountOnly,
    maxPrice,
    minPrice,
    categories,
    deferredQuery,
    scopedProducts,
    selectedAvailability,
    selectedBrands,
    selectedCategories,
    sort
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const activePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (activePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    pageStartIndex,
    pageStartIndex + PRODUCTS_PER_PAGE
  );

  const activeFilters =
    Boolean(query) ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedAvailability.length > 0 ||
    minPrice > 0 ||
    maxPrice < priceLimit ||
    discountOnly;
  const landingTitle = selectedCatalogCategory?.nameKa ?? "პროდუქტების კატალოგი";
  const landingDescription =
    selectedCatalogCategory?.description ?? DEFAULT_CATALOG_DESCRIPTION;
  const hasEmptySelectedSubcategory = selectedSubcategoryProductCount === 0;

  const breadcrumbCategory =
    selectedCatalogSubcategory?.nameKa ??
    selectedCatalogCategory?.nameKa ??
    (selectedCategories.length === 1
      ? selectedCategories[0]
      : selectedCategories.length > 1
        ? `${selectedCategories.length} კატეგორია`
        : null);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAvailability([]);
    setMinPrice(0);
    setMaxPrice(priceLimit);
    setDiscountOnly(false);
    setSort("popular");
    setShowAllCategories(false);
    setCurrentPage(1);
  };

  const toggleCategory = (category: string) => {
    setCurrentPage(1);
    setSelectedCategories((current) => toggleValue(current, category));
  };

  const toggleBrand = (brand: string) => {
    setCurrentPage(1);
    setSelectedBrands((current) => toggleValue(current, brand));
  };

  const toggleAvailability = (availability: AvailabilityFilter) => {
    setCurrentPage(1);
    setSelectedAvailability((current) => toggleValue(current, availability));
  };

  const toggleSection = (key: keyof SidebarSections) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const updateMinPrice = (value: number) => {
    setCurrentPage(1);
    setMinPrice(value);
  };

  const updateMaxPrice = (value: number) => {
    setCurrentPage(1);
    setMaxPrice(value);
  };

  const updateDiscountOnly = (value: boolean) => {
    setCurrentPage(1);
    setDiscountOnly(value);
  };

  const goToPage = (page: number) => {
    const nextPage = clamp(page, 1, totalPages);

    if (nextPage === activePage) {
      return;
    }

    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      catalogTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  };

  return (
    <section className="bg-[#F7F9FC] py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[292px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-[156px] overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-[0_14px_34px_rgba(4,28,50,0.07)]">
              <div className="flex items-center gap-2 border-b border-[#E5EAF0] px-5 py-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-5 text-[#F58220]" />
                  <h2 className="text-lg font-black text-[#041C32]">ფილტრები</h2>
                </div>
              </div>
              <div className="p-4">
                <FilterContent
                  brandOptions={brandOptions}
                  categories={categories}
                  categoryOptions={categoryOptions}
                  activeFilters={activeFilters}
                  clearFilters={clearFilters}
                  availabilityOptions={availabilityOptions}
                  discountOnly={discountOnly}
                  maxPrice={maxPrice}
                  minPrice={minPrice}
                  priceLimit={priceLimit}
                  selectedAvailability={selectedAvailability}
                  selectedBrands={selectedBrands}
                  selectedCategories={selectedCategories}
                  openSections={openSections}
                  setDiscountOnly={updateDiscountOnly}
                  setMaxPrice={updateMaxPrice}
                  setMinPrice={updateMinPrice}
                  setShowAllCategories={setShowAllCategories}
                  showAllCategories={showAllCategories}
                  toggleAvailability={toggleAvailability}
                  toggleBrand={toggleBrand}
                  toggleCategory={toggleCategory}
                  toggleSection={toggleSection}
                />
              </div>
            </div>
          </aside>

          <div ref={catalogTopRef} className="min-w-0 scroll-mt-40">
            <Breadcrumb
              currentCategory={selectedCatalogCategory?.nameKa ?? breadcrumbCategory}
              currentCategoryHref={selectedCatalogCategory ? categoryHref(selectedCatalogCategory.slug) : null}
              currentSubcategory={selectedCatalogSubcategory?.nameKa ?? null}
            />

            <div className="mt-4 rounded-[28px] border border-[#E5EAF0] bg-white p-6 shadow-[0_10px_26px_rgba(4,28,50,0.04)] lg:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#C65F0B]">
                    {selectedCatalogCategory ? "კატეგორია" : "კატალოგი"}
                  </span>
                  <h1 className="mt-4 text-[32px] font-black leading-tight text-[#041C32]">
                    {landingTitle}
                  </h1>
                  <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#6B7280]">
                    {landingDescription}
                  </p>
                </div>

                <div className="grid gap-3 rounded-[24px] border border-[#E5EAF0] bg-[#F7F9FC] p-5 sm:min-w-[300px]">
                  <p className="text-sm font-black text-[#102033]">
                    ნაპოვნია {filteredProducts.length} პროდუქტი
                  </p>
                  <label className="grid gap-2 text-sm font-bold text-[#6B7280]">
                    <span>სორტირება</span>
                    <select
                      value={sort}
                      onChange={(event) => {
                        setCurrentPage(1);
                        setSort(event.target.value as SortOption);
                      }}
                      className="focus-ring h-12 w-full rounded-2xl border border-[#E5EAF0] bg-white px-4 text-sm font-black text-[#102033]"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {selectedCatalogCategory ? (
                <div className="mt-4 rounded-[28px] border border-[#E5EAF0] bg-white p-4 shadow-[0_10px_26px_rgba(4,28,50,0.04)] sm:p-5">
                  <div className="hidden">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8A95A8]">
                        ქვეკატეგორიები
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        აირჩიეთ სასურველი მიმართულება და ნახეთ მხოლოდ შესაბამისი პროდუქტები.
                      </p>
                    </div>
                    <span className="hidden rounded-full bg-[#F1F4F7] px-3 py-1 text-xs font-black text-[#072B4D] md:inline-flex">
                      {categoryProducts.length} პროდუქტი
                    </span>
                  </div>

                  <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0 lg:overflow-visible">
                    <div className="flex min-w-max gap-3 lg:min-w-0 lg:flex-wrap">
                      <SubcategoryQuickLink
                        href={categoryHref(selectedCatalogCategory.slug)}
                        icon={Grid2x2}
                        label="ყველა"
                        active={!selectedCatalogSubcategory}
                      />
                      {selectedCatalogCategory.children.map((child) => (
                        <SubcategoryQuickLink
                          key={child.slug}
                          href={subcategoryHref(selectedCatalogCategory.slug, child.slug)}
                          icon={child.icon}
                          label={child.nameKa}
                          active={selectedCatalogSubcategory?.slug === child.slug}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="hidden">
                <div>
                  <span className="text-sm font-black text-[#F58220]">კატალოგი</span>
                  <h1 className="mt-1 text-2xl font-black text-[#041C32] sm:text-3xl">
                    {selectedCatalogCategory?.nameKa ?? "პროდუქტების კატალოგი"}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                    {selectedCatalogSubcategory?.nameKa ??
                      "მოძებნეთ ხელსაწყოები, სამშენებლო მასალები და ტექნიკური პროდუქტები სასურველი ფასითა და ბრენდით."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="whitespace-nowrap text-sm font-black text-[#102033]">
                    მოიძებნა {filteredProducts.length} პროდუქტი
                  </p>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#6B7280]">
                    <span className="sr-only">სორტირება</span>
                    <select
                      value={sort}
                      onChange={(event) => {
                        setCurrentPage(1);
                        setSort(event.target.value as SortOption);
                      }}
                      className="focus-ring h-11 w-full rounded-md border border-[#E5EAF0] bg-[#F7F8FA] px-3 text-sm font-black text-[#102033] sm:w-auto"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {selectedCatalogCategory ? (
              <div className="hidden">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={categoryHref(selectedCatalogCategory.slug)}
                    className={[
                      "focus-ring rounded-lg border px-3 py-2 text-sm font-black transition duration-150",
                      !selectedCatalogSubcategory
                        ? "border-[#F58220] bg-[#FFF3E8] text-[#C65F0B]"
                        : "border-[#E5EAF0] bg-[#F7F9FC] text-[#102033] hover:border-[#F7CFA7]"
                    ].join(" ")}
                  >
                    ყველა
                  </Link>
                  {selectedCatalogCategory.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={subcategoryHref(selectedCatalogCategory.slug, child.slug)}
                      className={[
                        "focus-ring rounded-lg border px-3 py-2 text-sm font-black transition duration-150",
                        selectedCatalogSubcategory?.slug === child.slug
                          ? "border-[#F58220] bg-[#FFF3E8] text-[#C65F0B]"
                          : "border-[#E5EAF0] bg-[#F7F9FC] text-[#102033] hover:border-[#F7CFA7]"
                      ].join(" ")}
                    >
                      {child.nameKa}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              type="button"
              className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] sm:w-auto lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="size-4 text-[#F58220]" />
              ფილტრების გახსნა
              {activeFilters ? (
                <span className="rounded-full bg-[#F58220] px-2 py-0.5 text-xs text-white">
                  {getActiveFilterCount({
                    discountOnly,
                    maxPrice,
                    minPrice,
                    priceLimit,
                    query,
                    selectedAvailability,
                    selectedBrands,
                    selectedCategories
                  })}
                </span>
              ) : null}
            </button>

            <div className="mt-5">
              {filteredProducts.length ? (
                <>
                  <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <PaginationControls
                    currentPage={activePage}
                    productsPerPage={PRODUCTS_PER_PAGE}
                    totalItems={filteredProducts.length}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-[#D7DEE8] bg-white px-5 py-16 text-center">
                  <Search className="mx-auto size-9 text-[#F58220]" />
                  <h2 className="mt-4 text-2xl font-black text-[#041C32]">
                    {hasEmptySelectedSubcategory
                      ? "ამ ქვეკატეგორიაში პროდუქტები მალე დაემატება."
                      : selectedCatalogCategory
                        ? "ამ კატეგორიაში პროდუქტები ვერ მოიძებნა"
                        : "პროდუქტი ვერ მოიძებნა"}
                  </h2>
                  <p className="mt-2 text-sm font-bold text-[#6B7280]">
                    {hasEmptySelectedSubcategory
                      ? "აირჩიეთ სხვა ქვეკატეგორია ან მოგვიანებით შეამოწმეთ."
                      : selectedCatalogCategory
                        ? "შეცვალეთ ფილტრები ან აირჩიეთ სხვა ქვეკატეგორია."
                        : "შეცვალეთ საძიებო სიტყვა ან ფილტრები."}
                  </p>
                  <h2 className="hidden">
                    {selectedCatalogCategory
                      ? "ამ კატეგორიაში პროდუქტები მალე დაემატება."
                      : "პროდუქტი ვერ მოიძებნა"}
                  </h2>
                  <p className="hidden">
                    {selectedCatalogCategory
                      ? "აირჩიეთ სხვა ქვეკატეგორია ან მოგვიანებით შეამოწმეთ."
                      : "შეცვალეთ საძიებო სიტყვა ან ფილტრები."}
                  </p>
                  {activeFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="focus-ring mt-5 rounded-md bg-[#F58220] px-5 py-3 text-sm font-black text-white transition hover:bg-[#de741d]"
                    >
                      ფილტრების გასუფთავება
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SlideDrawer
        ariaLabel="ფილტრები"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        viewportClassName="inset-0 z-[70] lg:hidden"
        backdropClassName="bg-[#041C32]/35 backdrop-blur-sm"
        panelClassName="w-full max-w-sm overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-4 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-[#F58220]" />
            <h2 className="text-lg font-black text-[#041C32]">ფილტრები</h2>
          </div>
          <button
            type="button"
            aria-label="ფილტრების დახურვა"
            className="focus-ring grid size-10 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D]"
            onClick={() => setFiltersOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterContent
            brandOptions={brandOptions}
            categories={categories}
            categoryOptions={categoryOptions}
            activeFilters={activeFilters}
            clearFilters={clearFilters}
            availabilityOptions={availabilityOptions}
            discountOnly={discountOnly}
            maxPrice={maxPrice}
            minPrice={minPrice}
            priceLimit={priceLimit}
            selectedAvailability={selectedAvailability}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            openSections={openSections}
            setDiscountOnly={updateDiscountOnly}
            setMaxPrice={updateMaxPrice}
            setMinPrice={updateMinPrice}
            setShowAllCategories={setShowAllCategories}
            showAllCategories={showAllCategories}
            toggleAvailability={toggleAvailability}
            toggleBrand={toggleBrand}
            toggleCategory={toggleCategory}
            toggleSection={toggleSection}
          />
        </div>
        <div className="grid gap-3 border-t border-[#E5EAF0] p-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="focus-ring h-11 rounded-md bg-[#F58220] text-sm font-black text-white transition hover:bg-[#de741d]"
          >
            შედეგების ნახვა ({filteredProducts.length})
          </button>
        </div>
      </SlideDrawer>
    </section>
  );
}

function Breadcrumb({
  currentCategory,
  currentCategoryHref,
  currentSubcategory
}: {
  currentCategory: string | null;
  currentCategoryHref: string | null;
  currentSubcategory: string | null;
}) {
  return (
    <nav aria-label="ნავიგაციის გზა" className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
      <Link href="/" className="focus-ring rounded text-[#6B7280] transition hover:text-[#072B4D]">
        მთავარი
      </Link>
      <ChevronRight className="size-3.5 text-[#A1AAB8]" aria-hidden="true" />
      {currentCategory ? (
        <>
          <Link
            href="/products"
            className="focus-ring rounded text-[#6B7280] transition hover:text-[#072B4D]"
          >
            პროდუქტები
          </Link>
          <ChevronRight className="size-3.5 text-[#A1AAB8]" aria-hidden="true" />
          {currentSubcategory && currentCategoryHref ? (
            <>
              <Link
                href={currentCategoryHref}
                className="focus-ring rounded text-[#6B7280] transition hover:text-[#072B4D]"
              >
                {currentCategory}
              </Link>
              <ChevronRight className="size-3.5 text-[#A1AAB8]" aria-hidden="true" />
              <span className="text-[#F58220]" aria-current="page">
                {currentSubcategory}
              </span>
            </>
          ) : (
            <span className="text-[#F58220]" aria-current="page">
              {currentCategory}
            </span>
          )}
        </>
      ) : (
        <span className="text-[#F58220]" aria-current="page">
          პროდუქტები
        </span>
      )}
    </nav>
  );
}

function SubcategoryQuickLink({
  href,
  icon: Icon,
  label,
  count,
  active
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "focus-ring group flex min-h-[124px] min-w-[132px] snap-start flex-col items-center justify-center gap-3 rounded-[22px] border px-4 py-5 text-center transition duration-150 sm:min-w-[148px] lg:min-w-0 lg:flex-1 lg:basis-[152px]",
        active
          ? "border-[#F58220] bg-[#FFF8F1] text-[#072B4D]"
          : "border-[#E5EAF0] bg-white text-[#102033] hover:-translate-y-0.5 hover:border-[#F7CFA7] hover:bg-[#FFFDFC]"
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className={[
            "grid size-14 shrink-0 place-items-center rounded-2xl border transition",
            active
              ? "border-[#F7D7B5] bg-white text-[#F58220]"
              : "border-[#E8EDF3] bg-[#F7F9FC] text-[#0B3A68] group-hover:border-[#F7D7B5] group-hover:bg-[#FFF7F0] group-hover:text-[#F58220]"
          ].join(" ")}
        >
          <Icon className="size-6" strokeWidth={1.9} />
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 block text-sm font-black leading-5">
            {label}
          </span>
          <span className="hidden">
            {count} პროდუქტი
          </span>
        </span>
      </div>
    </Link>
  );
}

function PaginationControls({
  currentPage,
  productsPerPage,
  totalItems,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  productsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const firstVisibleItem = (currentPage - 1) * productsPerPage + 1;
  const lastVisibleItem = Math.min(currentPage * productsPerPage, totalItems);
  const pages = createPaginationItems(currentPage, totalPages);

  return (
    <nav
      aria-label="პროდუქტების გვერდები"
      className="mt-7 rounded-xl border border-[#E5EAF0] bg-white px-4 py-4 shadow-[0_8px_22px_rgba(4,28,50,0.04)] sm:px-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-bold text-[#6B7280]">
          ნაჩვენებია{" "}
          <span className="font-black text-[#102033]">
            {firstVisibleItem}-{lastVisibleItem}
          </span>{" "}
          / {totalItems}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <PaginationButton
            disabled={currentPage === 1}
            label="წინა გვერდი"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronRight className="size-4 rotate-180" />
            <span className="hidden sm:inline">წინა</span>
          </PaginationButton>

          <div className="flex flex-wrap items-center gap-1.5">
            {pages.map((page) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={`გვერდი ${page}`}
                  onClick={() => onPageChange(page)}
                  className={[
                    "focus-ring grid size-10 place-items-center rounded-md border text-sm font-black transition",
                    page === currentPage
                      ? "border-[#072B4D] bg-[#072B4D] text-white shadow-[0_6px_16px_rgba(7,43,77,0.22)]"
                      : "border-[#E5EAF0] bg-white text-[#102033] hover:border-[#F58220] hover:text-[#F58220]"
                  ].join(" ")}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={page}
                  aria-hidden="true"
                  className="grid size-10 place-items-center text-sm font-black text-[#8A95A8]"
                >
                  ...
                </span>
              )
            )}
          </div>

          <PaginationButton
            disabled={currentPage === totalPages}
            label="შემდეგი გვერდი"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <span className="hidden sm:inline">შემდეგი</span>
            <ChevronRight className="size-4" />
          </PaginationButton>
        </div>
      </div>
    </nav>
  );
}

function PaginationButton({
  children,
  disabled,
  label,
  onClick
}: {
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-3 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:bg-[#F7F9FC] disabled:text-[#A1AAB8] disabled:hover:border-[#E5EAF0]"
    >
      {children}
    </button>
  );
}

function FilterContent({
  brandOptions,
  categories,
  categoryOptions,
  availabilityOptions,
  discountOnly,
  maxPrice,
  minPrice,
  priceLimit,
  selectedAvailability,
  selectedBrands,
  selectedCategories,
  activeFilters,
  clearFilters,
  setDiscountOnly,
  setMaxPrice,
  setMinPrice,
  setShowAllCategories,
  showAllCategories,
  openSections,
  toggleAvailability,
  toggleBrand,
  toggleCategory,
  toggleSection
}: {
  brandOptions: CountOption[];
  categories: ReturnType<typeof useCatalogCategories>;
  categoryOptions: CountOption[];
  availabilityOptions: AvailabilityOption[];
  discountOnly: boolean;
  maxPrice: number;
  minPrice: number;
  priceLimit: number;
  selectedAvailability: AvailabilityFilter[];
  selectedBrands: string[];
  selectedCategories: string[];
  activeFilters: boolean;
  clearFilters: () => void;
  setDiscountOnly: (value: boolean) => void;
  setMaxPrice: (value: number) => void;
  setMinPrice: (value: number) => void;
  setShowAllCategories: (value: boolean) => void;
  showAllCategories: boolean;
  openSections: SidebarSections;
  toggleAvailability: (availability: AvailabilityFilter) => void;
  toggleBrand: (brand: string) => void;
  toggleCategory: (category: string) => void;
  toggleSection: (key: keyof SidebarSections) => void;
}) {
  const visibleCategories = showAllCategories
    ? categoryOptions
    : categoryOptions.slice(0, 6);

  return (
    <div className="grid gap-3">
      <section className="rounded-xl border border-[#DDE5EE] bg-[#F7F9FC] p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#041C32]">ფასი</h3>
          {minPrice > 0 || maxPrice < priceLimit ? (
            <button
              type="button"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(priceLimit);
              }}
              className="focus-ring rounded-md px-2 py-1 text-xs font-black text-[#F58220] transition hover:bg-white"
            >
              გასუფთავება
            </button>
          ) : null}
        </div>

        <p className="mt-3 inline-flex w-full justify-center rounded-lg border border-[#E5EAF0] bg-white px-3 py-2 text-sm font-black text-[#041C32]">
          {formatSidebarMoney(minPrice)} ₾ — {formatSidebarMoney(maxPrice)} ₾
        </p>

        <div className="mt-6">
          <PriceRangeSlider
            limit={priceLimit}
            maxValue={maxPrice}
            minValue={minPrice}
            onMaxChange={(value) => setMaxPrice(Math.max(value, minPrice))}
            onMinChange={(value) => setMinPrice(Math.min(value, maxPrice))}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <PriceInput
            label="მინ"
            max={maxPrice}
            value={minPrice}
            onChange={setMinPrice}
          />
          <PriceInput
            label="მაქს"
            min={minPrice}
            max={priceLimit}
            value={maxPrice}
            onChange={setMaxPrice}
          />
        </div>
      </section>

      <AccordionSection
        count={1}
        open={openSections.discount}
        title="ფასდაკლება"
        onToggle={() => toggleSection("discount")}
      >
        <SidebarToggle
          checked={discountOnly}
          label="ფასდაკლებული პროდუქტები"
          onChange={setDiscountOnly}
        />
      </AccordionSection>

      <AccordionSection
        count={availabilityOptions.length}
        open={openSections.availability}
        title="ხელმისაწვდომობა"
        onToggle={() => toggleSection("availability")}
      >
        <div className="grid gap-2">
          {availabilityOptions.map((option) => (
            <SidebarRow
              key={option.value}
              checked={selectedAvailability.includes(option.value)}
              count={option.count}
              label={option.label}
              onChange={() => toggleAvailability(option.value)}
            />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection
        count={categoryOptions.length}
        open={openSections.categories}
        title="კატეგორიები"
        onToggle={() => toggleSection("categories")}
      >
        <div className="grid gap-2">
          {visibleCategories.map((option) => {
            const CategoryIcon = getCategoryBySlug(option.value, categories)?.icon ?? Settings;

            return (
              <SidebarRow
                key={option.value}
                checked={selectedCategories.includes(option.value)}
                count={option.count}
                icon={CategoryIcon}
                label={option.label}
                onChange={() => toggleCategory(option.value)}
              />
            );
          })}
        </div>
        {categoryOptions.length > 6 ? (
          <button
            type="button"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="focus-ring mt-3 inline-flex rounded-md text-sm font-semibold text-[#F58220] transition hover:text-[#C65F0B]"
          >
            {showAllCategories ? "ნაკლების ნახვა" : "მეტის ნახვა"}
          </button>
        ) : null}
      </AccordionSection>

      <AccordionSection
        count={brandOptions.length}
        open={openSections.brands}
        title="ბრენდები"
        onToggle={() => toggleSection("brands")}
      >
        <div className="grid gap-2">
          {brandOptions.map((option) => {
            const meta = brandMetaByName.get(option.label);

            return (
              <BrandSidebarRow
                key={option.label}
                checked={selectedBrands.includes(option.label)}
                color={meta?.accentColor}
                count={option.count}
                label={option.label}
                logo={meta?.logo}
                onChange={() => toggleBrand(option.label)}
              />
            );
          })}
        </div>
      </AccordionSection>

      {activeFilters ? (
        <button
          type="button"
          onClick={clearFilters}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-[#E5EAF0] bg-white px-4 text-sm font-semibold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#041C32]"
        >
          ფილტრების გასუფთავება
        </button>
      ) : null}
    </div>
  );
}

function AccordionSection({
  count,
  open,
  title,
  onToggle,
  children
}: {
  count: number;
  open: boolean;
  title: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E5EAF0] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 border-b border-[#EEF2F6] bg-[#FBFCFE] px-4 py-3.5 text-left transition hover:bg-[#F7F9FC]"
      >
        <span className="min-w-0 truncate text-sm font-black text-[#041C32]">{title}</span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-[#F1F4F7] px-2.5 py-1 text-xs font-black text-[#7B8798] ring-1 ring-[#E5EAF0]">
            {count}
          </span>
          <ChevronDown
            className={[
              "size-4 text-[#8A95A8] transition-transform duration-300 ease-out",
              open ? "rotate-180" : "rotate-0"
            ].join(" ")}
          />
        </span>
      </button>
      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden px-4 py-3.5">{children}</div>
      </div>
    </section>
  );
}

function PriceRangeSlider({
  limit,
  maxValue,
  minValue,
  onMaxChange,
  onMinChange
}: {
  limit: number;
  maxValue: number;
  minValue: number;
  onMaxChange: (value: number) => void;
  onMinChange: (value: number) => void;
}) {
  const minPercent = limit > 0 ? (minValue / limit) * 100 : 0;
  const maxPercent = limit > 0 ? (maxValue / limit) * 100 : 100;
  const minThumbZIndex = minPercent > 92 ? 30 : 20;
  const maxThumbZIndex = maxPercent < 8 ? 20 : 30;

  return (
    <div className="relative px-1 pt-1">
      <div className="relative h-10">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#DDE5EE]" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#F58220] shadow-[0_3px_10px_rgba(245,130,32,0.28)]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        />
        <input
          aria-label="მინიმალური ფასი"
          type="range"
          min={0}
          max={limit}
          step={5}
          value={minValue}
          onChange={(event) => onMinChange(Number(event.target.value))}
          style={{ zIndex: minThumbZIndex }}
          className="price-range-input"
        />
        <input
          aria-label="მაქსიმალური ფასი"
          type="range"
          min={0}
          max={limit}
          step={5}
          value={maxValue}
          onChange={(event) => onMaxChange(Number(event.target.value))}
          style={{ zIndex: maxThumbZIndex }}
          className="price-range-input"
        />
      </div>
    </div>
  );
}

function PriceInput({
  label,
  min = 0,
  max,
  value,
  onChange
}: {
  label: string;
  min?: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-[#6B7280]">
      {label}
      <span className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) =>
            onChange(clamp(Number(event.target.value) || 0, min, max))
          }
          className="focus-ring h-11 w-full rounded-lg border border-[#DDE5EE] bg-white px-3 pr-8 text-sm font-black text-[#102033] shadow-[0_1px_2px_rgba(4,28,50,0.03)]"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#8A95A8]">
          ₾
        </span>
      </span>
    </label>
  );
}

function SidebarRow({
  checked,
  color,
  count,
  icon: Icon,
  label,
  onChange
}: {
  checked: boolean;
  color?: string;
  count: number;
  icon?: LucideIcon;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        "group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition duration-300 ease-out",
        checked
          ? "border-[#F58220] bg-[#FFF3E8]"
          : "border-[#E5EAF0] bg-white hover:border-[#F7CFA7] hover:bg-[#FFF8F1]"
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-[#F58220]"
      />
      {Icon || color ? (
        <span
          className={[
            "grid size-8 shrink-0 place-items-center rounded-lg transition",
            checked
              ? "bg-[#FFF1E4] text-[#F58220]"
              : "bg-[#F7F8FA] text-[#6B7280] group-hover:bg-[#FFF1E4] group-hover:text-[#F58220]"
          ].join(" ")}
          aria-hidden="true"
        >
          {Icon ? (
            <Icon className="size-5" strokeWidth={1.9} />
          ) : (
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
        </span>
      ) : null}
      <span
        className={[
          "line-clamp-2 min-w-0 flex-1 break-words text-sm font-medium leading-5 transition",
          checked
            ? "text-[#072B4D]"
            : "text-[#102033] group-hover:text-[#072B4D]"
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-black transition",
          checked ? "bg-white text-[#C65F0B]" : "bg-[#F1F4F7] text-[#8A95A8]"
        ].join(" ")}
      >
        {count}
      </span>
    </label>
  );
}

function BrandSidebarRow({
  checked,
  color,
  count,
  label,
  logo,
  onChange
}: {
  checked: boolean;
  color?: string;
  count: number;
  label: string;
  logo?: string;
  onChange: () => void;
}) {
  return (
    <label
      title={label}
      className={[
        "group flex min-h-[62px] cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition duration-200 ease-out",
        checked
          ? "border-[#F7CFA7] bg-[#FFF8F1]"
          : "border-[#E5EAF0] bg-white hover:border-[#D7DEE8] hover:bg-[#F7F9FC]"
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="size-4 shrink-0 accent-[#F58220]"
      />
      <span className="flex min-h-12 min-w-0 flex-1 items-center">
        {logo ? (
          <Image
            src={logo}
            alt={`${label} logo`}
            width={158}
            height={48}
            sizes="142px"
            quality={70}
            className="max-h-11 w-auto max-w-[142px] object-contain"
          />
        ) : (
          <span
            className="line-clamp-1 text-sm font-black uppercase tracking-normal text-[#102033]"
            style={{ color }}
          >
            {label}
          </span>
        )}
      </span>
      <span
        className={[
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-black transition",
          checked ? "bg-white text-[#C65F0B]" : "bg-[#F1F4F7] text-[#8A95A8]"
        ].join(" ")}
      >
        {count}
      </span>
    </label>
  );
}

function SidebarToggle({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={[
        "group flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition duration-200",
        checked
          ? "border-[#F7CFA7] bg-[#FFF8F1]"
          : "border-[#E5EAF0] bg-[#F7F9FC] hover:border-[#D7DEE8] hover:bg-white"
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 shrink-0 accent-[#F58220]"
      />
      <span className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-[#102033] transition group-hover:text-[#072B4D]">
        {label}
      </span>
    </label>
  );
}

function formatSidebarMoney(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function createCountOptions(
  products: Product[],
  key: "category" | "brand",
  order: string[]
) {
  const counts = new Map<string, number>();

  products.forEach((product) => {
    const value = product[key];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, value: label, count }))
    .sort((first, second) => {
      const firstIndex = order.indexOf(first.label);
      const secondIndex = order.indexOf(second.label);

      if (firstIndex === -1 && secondIndex === -1) {
        return first.label.localeCompare(second.label);
      }

      if (firstIndex === -1) {
        return 1;
      }

      if (secondIndex === -1) {
        return -1;
      }

      return firstIndex - secondIndex;
    });
}

function getPriceLimit(products: Product[]) {
  const maximumPrice = Math.max(
    ...products.map((product) => parsePriceToCents(product.price) / 100),
    0
  );

  return Math.max(100, Math.ceil(maximumPrice / 100) * 100);
}

function createAvailabilityOptions(products: Product[]): AvailabilityOption[] {
  const counts: Record<AvailabilityFilter, number> = {
    "in-stock": 0,
    "made-to-order": 0,
    limited: 0
  };

  products.forEach((product) => {
    const status = getAvailabilityStatus(product);
    counts[status] += 1;
  });

  return [
    { value: "in-stock", label: "მარაგში", count: counts["in-stock"] },
    { value: "made-to-order", label: "შეკვეთით", count: counts["made-to-order"] },
    { value: "limited", label: "მარაგი იწურება", count: counts.limited }
  ];
}

function getAvailabilityStatus(product: Product): AvailabilityFilter {
  if (product.stock <= 0) {
    return "made-to-order";
  }

  if (product.stock <= 8) {
    return "limited";
  }

  return "in-stock";
}

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getActiveFilterCount({
  discountOnly,
  maxPrice,
  minPrice,
  priceLimit,
  query,
  selectedAvailability,
  selectedBrands,
  selectedCategories
}: {
  discountOnly: boolean;
  maxPrice: number;
  minPrice: number;
  priceLimit: number;
  query: string;
  selectedAvailability: AvailabilityFilter[];
  selectedBrands: string[];
  selectedCategories: string[];
}) {
  return (
    Number(Boolean(query)) +
    selectedBrands.length +
    selectedCategories.length +
    selectedAvailability.length +
    Number(minPrice > 0 || maxPrice < priceLimit) +
    Number(discountOnly)
  );
}

function createPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [1];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    items.push("ellipsis-start");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push("ellipsis-end");
  }

  items.push(totalPages);

  return items;
}

function sortProducts(first: Product, second: Product, sort: SortOption) {
  if (sort === "price-asc") {
    return parsePriceToCents(first.price) - parsePriceToCents(second.price);
  }

  if (sort === "price-desc") {
    return parsePriceToCents(second.price) - parsePriceToCents(first.price);
  }

  if (sort === "new") {
    return Number(second.isNew) - Number(first.isNew);
  }

  if (sort === "discount") {
    return Number(Boolean(second.discount)) - Number(Boolean(first.discount));
  }

  return (
    Number(second.isPopular) - Number(first.isPopular) ||
    second.rating - first.rating ||
    second.reviewCount - first.reviewCount
  );
}
