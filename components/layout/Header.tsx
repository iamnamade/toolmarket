"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Tag,
  X
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject
} from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { headerLinks, navItems } from "@/data/navigation";
import { allProducts } from "@/data/products";
import { recentSearches } from "@/data/search";
import { formatProductCount } from "@/lib/format";
import { formatPrice } from "@/lib/price";
import { buildSearchHref, searchProducts } from "@/lib/search-products";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { HeaderUserMenu, MobileUserMenu } from "@/components/layout/HeaderUserMenu";

const popularCategorySearches = [
  "ხელსაწყოები",
  "ელექტრობა",
  "უსაფრთხოება",
  "აქსესუარები"
];

const popularBrandNames = new Set(["INGCO", "TOTAL", "TOLSEN", "CROWN"]);
const popularBrands = brands.filter((brand) => popularBrandNames.has(brand.name));

type HeaderProps = {
  categoryMenuControlsId?: string;
  categoryMenuOpen?: boolean;
  onCategoryMenuClose?: () => void;
  onCategoryMenuToggle?: () => void;
};

export function Header({
  categoryMenuControlsId,
  categoryMenuOpen = false,
  onCategoryMenuClose,
  onCategoryMenuToggle
}: HeaderProps = {}) {
  const {
    cartCount,
    wishlistCount,
    openCart,
    openWishlist
  } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const showSecondaryCatalogNav = pathname === "/";
  const primaryHeaderRef = useRef<HTMLDivElement>(null);
  const searchTriggerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuVisible = menuOpen && !searchOpen;
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => {
    onCategoryMenuClose?.();
    setSearchOpen(false);
    setMenuOpen((value) => !value);
  }, [onCategoryMenuClose]);

  useLayoutEffect(() => {
    const header = primaryHeaderRef.current;

    if (!header) {
      return;
    }

    const syncSearchOverlayTop = () => {
      document.documentElement.style.setProperty(
        "--search-overlay-top",
        `${header.getBoundingClientRect().bottom}px`
      );
    };
    const resizeObserver = new ResizeObserver(syncSearchOverlayTop);

    syncSearchOverlayTop();
    resizeObserver.observe(header);
    window.addEventListener("resize", syncSearchOverlayTop);
    window.visualViewport?.addEventListener("resize", syncSearchOverlayTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncSearchOverlayTop);
      window.visualViewport?.removeEventListener("resize", syncSearchOverlayTop);
      document.documentElement.style.removeProperty("--search-overlay-top");
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
    if (!mobileMenuVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");
    const getFocusableElements = () =>
      Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      ).filter((element) => element.offsetParent !== null);

    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = getFocusableElements()[0];
      firstFocusable?.focus({ preventScroll: true });
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [closeMobileMenu, mobileMenuVisible]);

  const openCommerceDrawer = (drawer: "cart" | "wishlist") => {
    onCategoryMenuClose?.();
    setSearchOpen(false);
    setMenuOpen(false);

    if (drawer === "cart") {
      openCart();
    } else {
      openWishlist();
    }
  };

  return (
    <>
      <header
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
          className="ml-6 hidden flex-1 flex-nowrap items-center justify-center gap-5 xl:flex"
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
              onClick={() => {
                onCategoryMenuClose?.();
                setMenuOpen(false);
                setSearchOpen((value) => !value);
              }}
            >
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </IconButton>
          </div>

          <HeaderUserMenu
            onBeforeOpen={() => {
              onCategoryMenuClose?.();
              setSearchOpen(false);
              setMenuOpen(false);
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
            className="size-10 sm:size-11 xl:hidden"
            onClick={toggleMobileMenu}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>

      {!searchOpen && showSecondaryCatalogNav ? (
        <div className="hidden border-t border-[#E5EAF0] bg-[#F7F9FC] xl:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            {onCategoryMenuToggle ? (
              <button
                type="button"
                aria-controls={categoryMenuControlsId}
                aria-expanded={categoryMenuOpen}
                data-home-category-trigger
                className="category-nav-button focus-ring inline-flex h-12 w-[300px] items-center gap-2 rounded-lg bg-[#072B4D] px-4 text-[15px] font-medium transition hover:bg-[#041C32]"
                onClick={onCategoryMenuToggle}
              >
                <Menu className="size-5" />
                <span className="min-w-0 flex-1 truncate text-left">კატეგორიები</span>
                <ChevronDown
                  className={[
                    "size-4 transition-transform duration-300",
                    categoryMenuOpen ? "rotate-180" : ""
                  ].join(" ")}
                />
              </button>
            ) : (
              <Link
                href="/products"
                className="category-nav-button focus-ring inline-flex h-12 w-[300px] items-center gap-2 rounded-lg bg-[#072B4D] px-4 text-[15px] font-medium"
              >
                <Menu className="size-5" />
                <span className="min-w-0 flex-1 truncate text-left">კატეგორიები</span>
                <ChevronDown className="size-4" />
              </Link>
            )}
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

      <div
        className={[
          "fixed inset-x-0 bottom-0 top-[var(--search-overlay-top)] z-40 xl:hidden",
          mobileMenuVisible ? "pointer-events-auto" : "pointer-events-none"
        ].join(" ")}
        aria-hidden={!mobileMenuVisible}
        inert={!mobileMenuVisible}
      >
        <button
          type="button"
          aria-label="მობილური მენიუს დახურვა"
          className={[
            "absolute inset-0 bg-black/35 transition-opacity duration-300 ease-out",
            mobileMenuVisible ? "opacity-100" : "opacity-0"
          ].join(" ")}
          onClick={closeMobileMenu}
        />
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="მობილური მენიუ"
          className={[
            "relative h-full w-screen overflow-y-auto bg-white shadow-none transition-[opacity,transform] duration-300 ease-out will-change-transform sm:w-[min(88vw,390px)] sm:border-r sm:border-[#E5EAF0] sm:shadow-[18px_0_45px_rgba(4,28,50,0.22)]",
            mobileMenuVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          ].join(" ")}
        >
          <div className="grid gap-5 px-4 py-5">
            <Link href="/" className="focus-ring w-fit rounded-md" onClick={closeMobileMenu}>
              <Logo compact />
            </Link>
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
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href="/products"
                  className="focus-ring flex items-center gap-3 rounded-md border border-[#E5EAF0] bg-[#F7F9FC] p-3"
                  onClick={closeMobileMenu}
                >
                  <category.icon className="size-5 shrink-0 text-[#F58220]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[#102033]">
                      {category.name}
                    </span>
                    <span className="block truncate text-xs text-[#6B7280]">
                      {formatProductCount(category.productCount)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SearchPanel
        open={searchOpen}
        onClose={closeSearch}
        triggerRef={searchTriggerRef}
      />
    </>
  );
}

function SearchPanel({
  open,
  onClose,
  triggerRef
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
  const matchingProducts = useMemo(
    () => searchProducts(allProducts, query),
    [query]
  );
  const popularProducts = useMemo(
    () => allProducts.filter((product) => product.isPopular).slice(0, 6),
    []
  );
  const visibleProducts = hasQuery
    ? matchingProducts.slice(0, 6)
    : popularProducts;

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

      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
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
  }, [open, onClose, triggerRef]);

  return (
    <>
      <div
        className={[
          "fixed inset-x-0 bottom-0 top-[var(--search-overlay-top)] z-40 bg-[#041C32]/20 backdrop-blur-[8px] transition-opacity duration-300 ease-in-out",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={[
          "fixed inset-x-0 top-[var(--search-overlay-top)] z-[60] max-h-[calc(100dvh-var(--search-overlay-top))] overflow-y-auto border-t border-[#E5EAF0] bg-white/95 shadow-[0_20px_45px_rgba(4,28,50,0.16)] backdrop-blur-xl transition duration-300 ease-in-out",
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
  last = false
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
