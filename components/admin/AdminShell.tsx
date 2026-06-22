"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Clock3,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { adminNavigationItems } from "@/components/admin/admin-navigation";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { HeaderUserMenu } from "@/components/layout/HeaderUserMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminShell({
  children,
  title,
  eyebrow = "ადმინისტრაციის პანელი",
  description,
  actions,
  searchValue,
  searchPlaceholder = "ადმინისტრაციის ძიება...",
  onSearchChange
}: AdminShellProps) {
  const pathname = usePathname();
  const { cartCount, wishlistCount, openCart, openWishlist } = useCommerce();
  const { data: session } = useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const drawerRef = useRef<HTMLElement>(null);
  const resolvedSearch = searchValue ?? internalSearch;
  const updateSearch = onSearchChange ?? setInternalSearch;

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const selector = "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const focusable = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
        (element) => element.offsetParent !== null
      );
    const frame = window.requestAnimationFrame(() => focusable()[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#102033]">
      <header className="sticky top-0 z-50 border-b border-[#E5EAF0] bg-white shadow-sm">
        <div className="bg-[#041C32] text-white">
          <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between gap-4 px-3 text-[11px] font-bold sm:px-4 lg:px-6">
            <div className="flex min-w-0 items-center gap-4 text-white/78">
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <MapPin className="size-3.5 text-[#F58220]" /> თბილისი, საქართველო
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Phone className="size-3.5 text-[#F58220]" /> +995 599 12 34 56
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <Clock3 className="size-3.5 text-[#F58220]" /> ორშ-შაბ 10:00-19:00
              </span>
            </div>
            <Link href="/admin" className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded text-[#F58220]">
              <ShieldCheck className="size-3.5" /> ადმინის პანელი
            </Link>
          </div>
        </div>

        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-3 sm:px-4 lg:px-6">
          <button
            type="button"
            aria-label="ადმინისტრაციის მენიუს გახსნა"
            aria-expanded={mobileSidebarOpen}
            onClick={() => setMobileSidebarOpen(true)}
            className="focus-ring grid size-11 shrink-0 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D] transition hover:border-[#F58220] lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link href="/" className="focus-ring min-w-0 rounded-md">
            <Logo />
          </Link>

          <div className="relative ml-auto hidden w-full max-w-xl sm:block lg:ml-8">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8A95A8]" />
            <input
              type="search"
              value={resolvedSearch}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="focus-ring h-11 w-full rounded-md border border-[#E5EAF0] bg-[#F7F9FC] pl-11 pr-4 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <IconButton label={`რჩეულები, ${wishlistCount} პროდუქტი`} badge={wishlistCount} className="hidden sm:grid" onClick={openWishlist}>
              <Heart className="size-5" />
            </IconButton>
            <IconButton label={`კალათა, ${cartCount} პროდუქტი`} badge={cartCount} onClick={openCart}>
              <ShoppingCart className="size-5" />
            </IconButton>
            <Link
              href="/admin/notifications"
              aria-label="ადმინისტრაციის შეტყობინებები"
              className="focus-ring relative hidden size-11 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D] transition hover:border-[#F58220] md:grid"
            >
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#F58220] text-[10px] font-black text-white ring-2 ring-white">3</span>
            </Link>
            <HeaderUserMenu onOpenWishlist={openWishlist} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] overflow-y-auto border-r border-white/10 bg-[#041C32] text-white lg:block">
          <AdminNavigation pathname={pathname} onNavigate={() => undefined} />
        </aside>

        <div className="min-w-0">
          <div className="border-b border-[#E5EAF0] bg-white px-4 py-5 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#F58220]">{eyebrow}</p>
                <h1 className="mt-1 break-words text-2xl font-semibold tracking-normal text-[#0D1B2A]">{title}</h1>
                {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">{description}</p> : null}
              </div>
              {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
            </div>
          </div>
          <main className="min-w-0 px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>

      <div className={["fixed inset-0 z-[80] lg:hidden", mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"].join(" ")} aria-hidden={!mobileSidebarOpen} inert={!mobileSidebarOpen}>
        <button
          type="button"
          aria-label="ადმინისტრაციის მენიუს დახურვა"
          onClick={() => setMobileSidebarOpen(false)}
          className={["absolute inset-0 bg-black/45 transition-opacity duration-300", mobileSidebarOpen ? "opacity-100" : "opacity-0"].join(" ")}
        />
        <aside
          ref={drawerRef}
          className={["absolute inset-y-0 left-0 flex w-[min(320px,calc(100vw-32px))] flex-col bg-[#041C32] text-white shadow-2xl transition-transform duration-300 ease-out", mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <Logo inverted />
            <button type="button" aria-label="მენიუს დახურვა" onClick={() => setMobileSidebarOpen(false)} className="focus-ring grid size-10 place-items-center rounded-md border border-white/15 text-white">
              <X className="size-5" />
            </button>
          </div>
          <AdminNavigation pathname={pathname} onNavigate={() => setMobileSidebarOpen(false)} />
          <div className="mt-auto border-t border-white/10 p-4">
            <div className="mb-3 flex min-w-0 items-center gap-3 rounded-lg bg-white/8 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10"><UserRound className="size-4" /></span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{session?.user?.name ?? "ადმინისტრატორი"}</span>
                <span className="block truncate text-xs text-white/55">{session?.user?.email ?? "admin@toolmarket.ge"}</span>
              </span>
            </div>
            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="focus-ring flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white">
              <LogOut className="size-4 text-[#F58220]" /> გასვლა
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AdminNavigation({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="grid gap-1 p-3" aria-label="ადმინისტრაციის ნავიგაცია">
      {adminNavigationItems.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "focus-ring group flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition",
              active ? "bg-[#174B78] font-bold text-white" : "font-medium text-white/68 hover:bg-white/8 hover:text-white"
            ].join(" ")}
          >
            <Icon className={['size-4.5 shrink-0', active ? 'text-[#F58220]' : 'text-white/55 group-hover:text-[#F58220]'].join(' ')} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
