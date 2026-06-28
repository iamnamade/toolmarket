"use client";

import Link from "next/link";
import {
  ClipboardList,
  Heart,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
  UserRound
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";

type AccountMenuProps = {
  onBeforeOpen?: () => void;
  onNavigate?: () => void;
  onOpenWishlist: () => void;
};

const menuItemClass =
  "focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-bold text-[#102033] transition hover:bg-[#F7F9FC] hover:text-[#072B4D]";

export function HeaderUserMenu({ onBeforeOpen, onOpenWishlist }: AccountMenuProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const authenticated = status === "authenticated" && Boolean(session?.user);
  const isAdmin = authenticated && session.user.role === "ADMIN";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setOpen(false);
      triggerRef.current?.focus();
    };
    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const openWishlist = () => {
    closeMenu();
    onOpenWishlist();
  };
  const logout = async () => {
    closeMenu();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        ref={triggerRef}
        type="button"
        aria-label={authenticated ? "მომხმარებლის მენიუ" : "ავტორიზაციის მენიუ"}
        aria-busy={status === "loading"}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={status === "loading"}
        className="focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[#E5EAF0] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:bg-[#FFF8F1] disabled:cursor-wait disabled:opacity-70"
        onClick={() => {
          if (!open) {
            onBeforeOpen?.();
          }
          setOpen((value) => !value);
        }}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#EEF3F8] text-[#072B4D]">
          {isAdmin ? <ShieldCheck className="size-4.5" /> : <UserRound className="size-4.5" />}
        </span>
      </button>

      <div
        id={menuId}
        ref={menuRef}
        role="menu"
        aria-label={isAdmin ? "ადმინის მენიუ" : authenticated ? "მომხმარებლის მენიუ" : "ავტორიზაცია"}
        aria-hidden={!open}
        inert={!open}
        className={[
          "absolute left-0 top-full z-[70] mt-2 w-[min(280px,calc(100vw-2rem))] origin-top-left rounded-lg border border-[#E5EAF0] bg-white p-2 shadow-[0_16px_38px_rgba(4,28,50,0.14)] transition-[opacity,transform] duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        ].join(" ")}
      >
        {authenticated ? (
          <>
            {isAdmin ? (
              <MenuLink href="/admin" icon={<ShieldCheck className="size-4.5" />} onClick={closeMenu}>
                ადმინის პანელი
              </MenuLink>
            ) : null}
            <MenuLink href="/profile" icon={<UserRound className="size-4.5" />} onClick={closeMenu}>
              პროფილი
            </MenuLink>
            <MenuLink href="/profile#orders" icon={<ClipboardList className="size-4.5" />} onClick={closeMenu}>
              ჩემი შეკვეთები
            </MenuLink>
            <button type="button" role="menuitem" className={menuItemClass} onClick={openWishlist}>
              <Heart className="size-4.5 shrink-0 text-[#072B4D]" />
              სურვილების სია
            </button>
            <div className="my-1 border-t border-[#E5EAF0]" />
            <button type="button" role="menuitem" className={menuItemClass} onClick={logout}>
              <LogOut className="size-4.5 shrink-0 text-[#F58220]" />
              გასვლა
            </button>
          </>
        ) : (
          <>
            <MenuLink href="/auth" icon={<LogIn className="size-4.5" />} onClick={closeMenu}>
              შესვლა
            </MenuLink>
            <MenuLink href="/auth?mode=register" icon={<UserPlus className="size-4.5" />} onClick={closeMenu}>
              რეგისტრაცია
            </MenuLink>
          </>
        )}
      </div>
    </div>
  );
}

export function MobileUserMenu({ onNavigate, onOpenWishlist }: AccountMenuProps) {
  const { data: session, status } = useSession();
  const authenticated = status === "authenticated" && Boolean(session?.user);
  const isAdmin = authenticated && session.user.role === "ADMIN";
  const logout = async () => {
    onNavigate?.();
    await signOut({ callbackUrl: "/" });
  };

  if (!authenticated) {
    return (
      <>
        <MobileLink href="/auth" icon={<LogIn className="size-4" />} onClick={onNavigate}>
          შესვლა
        </MobileLink>
        <MobileLink href="/auth?mode=register" icon={<UserPlus className="size-4" />} onClick={onNavigate}>
          რეგისტრაცია
        </MobileLink>
      </>
    );
  }

  return (
    <>
      {isAdmin ? (
        <MobileLink href="/admin" icon={<ShieldCheck className="size-4" />} onClick={onNavigate}>
          ადმინის პანელი
        </MobileLink>
      ) : null}
      <MobileLink href="/profile" icon={<UserRound className="size-4" />} onClick={onNavigate}>
        პროფილი
      </MobileLink>
      <MobileLink href="/profile#orders" icon={<ClipboardList className="size-4" />} onClick={onNavigate}>
        ჩემი შეკვეთები
      </MobileLink>
      <button
        type="button"
        className="focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-[#072B4D] hover:bg-[#F7F9FC]"
        onClick={() => {
          onNavigate?.();
          onOpenWishlist();
        }}
      >
        <Heart className="size-4" />
        სურვილების სია
      </button>
      <button
        type="button"
        className="focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-[#072B4D] hover:bg-[#F7F9FC]"
        onClick={logout}
      >
        <LogOut className="size-4 text-[#F58220]" />
        გასვლა
      </button>
    </>
  );
}

function MenuLink({
  children,
  href,
  icon,
  onClick
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} role="menuitem" className={menuItemClass} onClick={onClick}>
      <span className="shrink-0 text-[#072B4D]">{icon}</span>
      <span className="min-w-0 break-words">{children}</span>
    </Link>
  );
}

function MobileLink({
  children,
  href,
  icon,
  onClick
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-[#072B4D] hover:bg-[#F7F9FC]"
      onClick={onClick}
    >
      {icon}
      <span className="min-w-0 break-words">{children}</span>
    </Link>
  );
}
