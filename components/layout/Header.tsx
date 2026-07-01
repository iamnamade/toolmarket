"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock3,
  Grid2x2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  X
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import {
  categoryHref,
  subcategoryHref,
  type CatalogCategory,
} from "@/data/category-navigation";
import { headerLinks, navItems } from "@/data/navigation";
import { useCatalogCategories } from "@/lib/use-catalog-categories";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { SlideDrawer } from "@/components/ui/SlideDrawer";
import { HeaderUserMenu, MobileUserMenu } from "@/components/layout/HeaderUserMenu";

const HeaderSearchPanel = dynamic(
  () =>
    import("@/components/layout/HeaderCatalogClient").then(
      (module) => module.HeaderSearchPanel
    ),
  { ssr: false }
);

const HeaderMobileCategoryGrid = dynamic(
  () =>
    import("@/components/layout/HeaderCatalogClient").then(
      (module) => module.HeaderMobileCategoryGrid
    ),
  {
    ssr: false,
    loading: () => <MobileCategoryGridFallback />,
  }
);

export function Header() {
  const categories = useCatalogCategories();
  const {
    cartCount,
    wishlistCount,
    openCart,
    openWishlist
  } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPanelMounted, setSearchPanelMounted] = useState(false);
  const [categoryFlyoutOpen, setCategoryFlyoutOpen] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const pathname = usePathname();
  const showSecondaryCatalogNav = pathname !== "/auth";
  const activeCategory =
    activeCategorySlug === null
      ? null
      : categories.find((category) => category.slug === activeCategorySlug) ?? null;
  const headerRef = useRef<HTMLElement>(null);
  const primaryHeaderRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryCloseTimeoutRef = useRef<number | null>(null);
  const searchTriggerRef = useRef<HTMLDivElement>(null);
  const mobileMenuVisible = menuOpen && !searchOpen;
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const cancelCategoryFlyoutClose = useCallback(() => {
    if (categoryCloseTimeoutRef.current !== null) {
      window.clearTimeout(categoryCloseTimeoutRef.current);
      categoryCloseTimeoutRef.current = null;
    }
  }, []);
  const closeCategoryFlyout = useCallback(() => {
    setCategoryFlyoutOpen(false);
    setActiveCategorySlug(null);
  }, []);
  const scheduleCategoryFlyoutClose = useCallback(() => {
    cancelCategoryFlyoutClose();
    categoryCloseTimeoutRef.current = window.setTimeout(() => {
      closeCategoryFlyout();
      categoryCloseTimeoutRef.current = null;
    }, 140);
  }, [cancelCategoryFlyoutClose, closeCategoryFlyout]);
  const toggleCategoryFlyout = useCallback(() => {
    cancelCategoryFlyoutClose();
    setActiveCategorySlug(null);
    setCategoryFlyoutOpen((current) => !current);
  }, [cancelCategoryFlyoutClose]);
  const previewCategoryFlyout = useCallback((slug: string) => {
    cancelCategoryFlyoutClose();
    setActiveCategorySlug(slug);
  }, [cancelCategoryFlyoutClose]);
  const toggleMobileMenu = useCallback(() => {
    setSearchOpen(false);
    closeCategoryFlyout();
    setMenuOpen((value) => !value);
  }, [closeCategoryFlyout]);
  const toggleSearchPanel = useCallback(() => {
    const nextSearchOpen = !searchOpen;

    setMenuOpen(false);
    closeCategoryFlyout();

    if (nextSearchOpen) {
      setSearchPanelMounted(true);
    }

    setSearchOpen(nextSearchOpen);
  }, [closeCategoryFlyout, searchOpen]);

  useLayoutEffect(() => {
    const headerRoot = headerRef.current;
    const primaryHeader = primaryHeaderRef.current;

    if (!headerRoot || !primaryHeader) {
      return;
    }

    const syncOverlayOffsets = () => {
      document.documentElement.style.setProperty(
        "--search-overlay-top",
        `${primaryHeader.getBoundingClientRect().bottom}px`
      );
      document.documentElement.style.setProperty(
        "--category-overlay-top",
        `${headerRoot.getBoundingClientRect().bottom}px`
      );
    };
    const resizeObserver = new ResizeObserver(syncOverlayOffsets);

    syncOverlayOffsets();
    resizeObserver.observe(headerRoot);
    resizeObserver.observe(primaryHeader);
    window.addEventListener("resize", syncOverlayOffsets);
    window.visualViewport?.addEventListener("resize", syncOverlayOffsets);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncOverlayOffsets);
      window.visualViewport?.removeEventListener("resize", syncOverlayOffsets);
      document.documentElement.style.removeProperty("--search-overlay-top");
      document.documentElement.style.removeProperty("--category-overlay-top");
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!categoryFlyoutOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCategoryFlyout();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (categoryNavRef.current?.contains(target)) {
        return;
      }

      closeCategoryFlyout();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [categoryFlyoutOpen, closeCategoryFlyout]);

  useEffect(() => {
    return () => {
      if (categoryCloseTimeoutRef.current !== null) {
        window.clearTimeout(categoryCloseTimeoutRef.current);
      }
    };
  }, []);

  const openCommerceDrawer = (drawer: "cart" | "wishlist") => {
    setSearchOpen(false);
    setMenuOpen(false);
    closeCategoryFlyout();

    if (drawer === "cart") {
      openCart();
    } else {
      openWishlist();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[#E5EAF0] bg-white/95 backdrop-blur"
      >
      <div className="hidden bg-[#081D33] text-white lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-6 text-xs font-semibold">
          <div className="flex min-w-0 items-center gap-6">
            <span className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap text-white/90">
              <MapPin className="size-3.5 shrink-0 text-[#F58220]" />
              თბილისი, საქართველო
            </span>
            <a
              href="tel:+995599123456"
              className="focus-ring inline-flex items-center gap-2 rounded text-white/95 transition hover:text-white"
            >
              <Phone className="size-3.5 shrink-0 text-[#F58220]" />
              +995 599 12 34 56
            </a>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-white/80">
              <Clock3 className="size-3.5 shrink-0 text-[#F58220]" />
              ორშ-შაბ 10:00-19:00
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-5 text-white/80">
            <Link href="/about" className="focus-ring rounded transition hover:text-white">
              ჩვენ შესახებ
            </Link>
            <Link href="/contact" className="focus-ring rounded transition hover:text-white">
              მხარდაჭერა
            </Link>
          </div>
        </div>
      </div>
      <div
        ref={primaryHeaderRef}
        className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:px-4 sm:py-2 lg:gap-3 lg:px-6"
      >
        <Link href="/" className="focus-ring min-w-0 rounded-md">
          <Logo />
        </Link>

        <nav
          className="ml-6 hidden flex-1 flex-nowrap items-center justify-center gap-5 lg:flex"
          aria-label="მთავარი ნავიგაცია"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="header-nav-link focus-ring shrink-0 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-bold text-[#102033] transition hover:text-[#072B4D]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div ref={searchTriggerRef}>
            <IconButton
              label={searchOpen ? "ძებნის დახურვა" : "ძებნის გახსნა"}
              expanded={searchOpen}
              className="size-10 sm:size-11"
              onClick={toggleSearchPanel}
            >
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </IconButton>
          </div>

          <HeaderUserMenu
            onBeforeOpen={() => {
              setSearchOpen(false);
              setMenuOpen(false);
              closeCategoryFlyout();
            }}
            onOpenWishlist={() => openCommerceDrawer("wishlist")}
          />

          <IconButton
            label={`რჩეულები, ${wishlistCount} პროდუქტი`}
            badge={wishlistCount}
            className="hidden sm:grid"
            onClick={() => openCommerceDrawer("wishlist")}
          >
            <Heart className="size-5" />
          </IconButton>
          <IconButton
            label={`კალათა, ${cartCount} პროდუქტი`}
            badge={cartCount}
            className="size-10 sm:size-11"
            onClick={() => openCommerceDrawer("cart")}
          >
            <ShoppingCart className="size-5" />
          </IconButton>
          <IconButton
            label={menuOpen ? "მენიუს დახურვა" : "მენიუს გახსნა"}
            expanded={menuOpen}
            className="size-10 sm:size-11 lg:hidden"
            onClick={toggleMobileMenu}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>

      {!searchOpen && showSecondaryCatalogNav ? (
        <div className="hidden border-t border-[#E5EAF0] bg-[#F7F9FC] lg:block">
          <div
            ref={categoryNavRef}
            className="relative mx-auto flex max-w-7xl items-center justify-between px-6"
            onMouseEnter={cancelCategoryFlyoutClose}
            onMouseLeave={scheduleCategoryFlyoutClose}
          >
            <button
              type="button"
              aria-expanded={categoryFlyoutOpen}
              className="category-nav-button focus-ring inline-flex h-12 w-[286px] items-center gap-2 rounded-xl bg-[#0B2341] px-5 text-[15px] font-medium transition hover:bg-[#081C35]"
              onClick={toggleCategoryFlyout}
            >
              <Menu className="size-5" />
              <span className="min-w-0 flex-1 truncate text-left">კატეგორიები</span>
              <ChevronDown
                className={[
                  "size-4 transition-transform duration-300",
                  categoryFlyoutOpen ? "rotate-180" : ""
                ].join(" ")}
              />
            </button>
            <CategoryFlyout
              categories={categories}
              open={categoryFlyoutOpen}
              activeCategory={activeCategory}
              setActiveCategorySlug={previewCategoryFlyout}
              onHoverEnter={cancelCategoryFlyoutClose}
              onHoverLeave={scheduleCategoryFlyoutClose}
              onClose={closeCategoryFlyout}
            />
            <nav className="flex items-center gap-6 text-sm font-bold text-[#102033]" aria-label="სწრაფი ბმულები">
              {headerLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="focus-ring rounded-md px-2 py-2 transition hover:text-[#072B4D]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      </header>

      <button
        type="button"
        aria-label="კატეგორიების მენიუს დახურვა"
        tabIndex={categoryFlyoutOpen ? 0 : -1}
        className={[
          "fixed inset-x-0 bottom-0 top-[var(--category-overlay-top)] z-[45] hidden bg-[rgba(2,23,45,0.35)] backdrop-blur-[4px] transition-opacity duration-200 ease-out lg:block",
          categoryFlyoutOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        onClick={closeCategoryFlyout}
      />

      <SlideDrawer
        ariaLabel="მობილური მენიუ"
        open={mobileMenuVisible}
        onClose={closeMobileMenu}
        side="right"
        viewportClassName="inset-0 z-[60] lg:hidden"
        backdropClassName="bg-black/35 md:bg-[#041C32]/55"
        panelClassName="h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-white shadow-none md:w-[70vw] md:min-w-[420px] md:max-w-[640px] md:border-l md:border-[#E5EAF0] md:shadow-[-18px_0_45px_rgba(4,28,50,0.22)]"
      >
        <div
          className="grid min-h-full gap-5"
          style={{
            paddingTop: "max(1.25rem, env(safe-area-inset-top))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
            paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
          }}
        >
          <nav className="grid gap-1" aria-label="მობილური ნავიგაცია">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="focus-ring rounded-md px-3 py-2 text-sm font-bold text-[#102033] hover:bg-[#F7F9FC]"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <MobileUserMenu
              onNavigate={closeMobileMenu}
              onOpenWishlist={() => openCommerceDrawer("wishlist")}
            />
            <button
              type="button"
              className="focus-ring flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-bold text-[#072B4D] hover:bg-[#F7F9FC] sm:hidden"
              onClick={() => openCommerceDrawer("wishlist")}
            >
              <span className="inline-flex items-center gap-2">
                <Heart className="size-4" />
                რჩეულები
              </span>
              <span className="rounded-full bg-[#F58220] px-2 py-0.5 text-xs font-black text-white">
                {wishlistCount}
              </span>
            </button>
          </nav>
          <HeaderMobileCategoryGrid categories={categories} onNavigate={closeMobileMenu} />
        </div>
      </SlideDrawer>
      {searchPanelMounted ? (
        <HeaderSearchPanel open={searchOpen} onClose={closeSearch} triggerRef={searchTriggerRef} />
      ) : null}
    </>
  );
}

function CategoryFlyout({
  categories,
  open,
  activeCategory,
  setActiveCategorySlug,
  onHoverEnter,
  onHoverLeave,
  onClose
}: {
  categories: CatalogCategory[];
  open: boolean;
  activeCategory: CatalogCategory | null;
  setActiveCategorySlug: (slug: string) => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      aria-hidden={!open}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      className={[
        "absolute left-0 top-full z-[60] mt-3 flex max-w-[calc(100vw-3rem)] items-start gap-4 transition-[opacity,transform] duration-200 ease-out",
        activeCategory
          ? "after:absolute after:left-[356px] after:top-0 after:h-full after:w-4 after:content-['']"
          : "",
        activeCategory ? "w-[min(1232px,calc(100vw-3rem))]" : "w-[356px]",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      ].join(" ")}
    >
      <div className="w-[356px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_20px_40px_rgba(11,35,65,0.1)]">
        <div className="max-h-[560px] divide-y divide-[#EEF2F6] overflow-y-auto bg-white">
        {categories.map((category) => {
          const active = activeCategory?.slug === category.slug;

          return (
            <Link
              key={category.slug}
              href={categoryHref(category.slug)}
              onMouseEnter={() => setActiveCategorySlug(category.slug)}
              onFocus={() => setActiveCategorySlug(category.slug)}
              onClick={onClose}
              className={[
                "focus-ring group flex min-h-[72px] items-center gap-4 border-l-4 px-7 py-[18px] text-left transition-all duration-200",
                active
                  ? "border-l-[#F58220] bg-[#FFF6ED] text-[#F58220]"
                  : "border-l-transparent text-[#102033] hover:border-l-[#F58220]/70 hover:bg-[#FFF9F3] hover:text-[#F58220]"
              ].join(" ")}
            >
              <span
                className={[
                  "grid size-11 shrink-0 place-items-center rounded-xl border transition duration-200",
                  active
                    ? "border-[#F7D7B5] bg-[#FFF7F0] text-[#F58220]"
                    : "border-[#E8EDF3] bg-white text-[#0B3A68] group-hover:border-[#F7D7B5] group-hover:bg-[#FFF7F0] group-hover:text-[#F58220]"
                ].join(" ")}
              >
                <category.icon className="size-5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold leading-6">
                {category.nameKa}
              </span>
              <ChevronRight
                className={[
                  "size-4 shrink-0 transition duration-150",
                  active
                    ? "translate-x-0 text-[#F58220]"
                    : "text-[#A1AAB8] group-hover:translate-x-0.5 group-hover:text-[#F58220]"
                ].join(" ")}
              />
            </Link>
          );
        })}
        </div>
      </div>
      {activeCategory ? (
        <div className="w-[min(860px,calc(100vw-25rem))] min-w-0 rounded-2xl border border-[#E5E7EB] bg-white px-12 py-11 shadow-[0_20px_40px_rgba(11,35,65,0.1)]">
          <div className="mb-11 flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#FFF4EA] text-[#F97316]">
              <activeCategory.icon className="size-5" strokeWidth={1.9} />
            </span>
            <Link
              href={categoryHref(activeCategory.slug)}
              onClick={onClose}
              className="focus-ring rounded text-[22px] font-black text-[#0B2341] transition duration-200 hover:text-[#F97316]"
            >
              {activeCategory.nameKa}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-x-14 gap-y-11">
            {activeCategory.children.map((child) => {
              return (
                <Link
                  key={child.slug}
                  href={subcategoryHref(activeCategory.slug, child.slug)}
                  onClick={onClose}
                  className="focus-ring group flex items-start gap-4 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-[#102033] transition duration-200 hover:bg-[#FBFCFE] hover:text-[#F97316]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl text-[#0B3A68] transition duration-200 group-hover:bg-[#FFF7F0] group-hover:text-[#F97316]">
                    <child.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1 leading-6">
                    {child.nameKa}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-11 border-t border-[#EEF2F6] pt-7">
            <Link
              href={categoryHref(activeCategory.slug)}
              onClick={onClose}
              className="focus-ring group inline-flex w-full items-center justify-between gap-4 rounded-xl px-2 py-2 text-[15px] font-black text-[#0B2341] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#F97316]"
            >
              <span className="inline-flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[#F7F9FC] text-[#0B2341] transition duration-200 group-hover:text-[#F97316]">
                  <Grid2x2 className="size-5" strokeWidth={1.9} />
                </span>
                ყველა {activeCategory.nameKa} ნახვა
              </span>
              <ArrowRight className="size-5 shrink-0" strokeWidth={1.9} />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileCategoryGridFallback() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[74px] animate-pulse rounded-md border border-[#E5EAF0] bg-[#F7F9FC]"
        />
      ))}
    </div>
  );
}
