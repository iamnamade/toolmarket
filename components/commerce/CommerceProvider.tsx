"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { SlideDrawer } from "@/components/ui/SlideDrawer";
import { featuredProducts } from "@/data/products";
import { formatPrice, formatPriceFromCents, parsePriceToCents } from "@/lib/price";
import type { Product } from "@/types/catalog";

type DrawerType = "cart" | "wishlist";

type CartLine = {
  product: Product;
  quantity: number;
};

type ToastState = {
  message: string;
  tone: "cart" | "wishlist";
  action?: "openCart";
};

type CommerceContextValue = {
  cartCount: number;
  wishlistCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  addToWishlist: (product: Product) => void;
  openCart: () => void;
  openWishlist: () => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const initialCart: CartLine[] = [
  { product: featuredProducts[0], quantity: 2 },
  { product: featuredProducts[1], quantity: 1 }
];

const initialWishlist = [featuredProducts[2]];

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [wishlist, setWishlist] = useState<Product[]>(initialWishlist);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (!existing) {
        return [...current, { product, quantity: Math.min(quantity, product.stock) }];
      }

      return current.map((item) =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, product.stock)
            }
          : item
      );
    });
    setToast({
      message: "პროდუქტი კალათაში დაემატა",
      tone: "cart",
      action: "openCart"
    });
  };

  const addToWishlist = (product: Product) => {
    setWishlist((current) =>
      current.some((item) => item.id === product.id) ? current : [...current, product]
    );
    setToast({
      message: "დაემატა ფავორიტებში",
      tone: "wishlist"
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.product.stock))
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  };

  const handleToastAction = () => {
    if (toast?.action !== "openCart") {
      return;
    }

    setToast(null);
    setActiveDrawer("cart");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotalCents = cart.reduce(
    (total, item) => total + parsePriceToCents(item.product.price) * item.quantity,
    0
  );

  const contextValue = {
    cartCount,
    wishlistCount: wishlist.length,
    addToCart,
    addToWishlist,
    openCart: () => setActiveDrawer("cart"),
    openWishlist: () => setActiveDrawer("wishlist")
  };

  return (
    <CommerceContext.Provider value={contextValue}>
      {children}

      <Drawer
        title="კალათა"
        count={cartCount}
        open={activeDrawer === "cart"}
        onClose={() => setActiveDrawer(null)}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {cart.length ? (
              <div className="grid gap-3">
                {cart.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onDecrease={() =>
                      updateCartQuantity(item.product.id, item.quantity - 1)
                    }
                    onIncrease={() =>
                      updateCartQuantity(item.product.id, item.quantity + 1)
                    }
                    onRemove={() => removeFromCart(item.product.id)}
                    onNavigate={() => setActiveDrawer(null)}
                  />
                ))}
              </div>
            ) : (
              <EmptyDrawer
                icon={<ShoppingCart className="size-7" />}
                title="კალათა ცარიელია"
                text="დაამატეთ პროდუქტი და ის აქ გამოჩნდება."
              />
            )}
          </div>

          <div className="border-t border-[#E5EAF0] bg-white p-4 sm:p-5">
            <div className="grid gap-2 text-sm">
              <PriceRow label="შუალედური ჯამი" value={formatPriceFromCents(subtotalCents)} />
              <PriceRow label="მიწოდება" value="მისამართის მიხედვით" muted />
              <div className="my-1 h-px bg-[#E5EAF0]" />
              <PriceRow label="სულ" value={formatPriceFromCents(subtotalCents)} strong />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="focus-ring h-12 rounded-md border border-[#0B3A68] bg-white px-4 text-sm font-black text-[#0B3A68] transition hover:bg-[#F7F8FA]"
              >
                კალათის ნახვა
              </button>
              <button
                type="button"
                className="focus-ring h-12 rounded-md bg-[#F58220] px-4 text-sm font-black text-white transition hover:bg-[#de741d]"
              >
                შეკვეთის გაფორმება
              </button>
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        title="რჩეულები"
        count={wishlist.length}
        open={activeDrawer === "wishlist"}
        onClose={() => setActiveDrawer(null)}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {wishlist.length ? (
            <div className="grid gap-3">
              {wishlist.map((product) => (
                <WishlistItem
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onRemove={() => removeFromWishlist(product.id)}
                  onNavigate={() => setActiveDrawer(null)}
                />
              ))}
            </div>
          ) : (
            <EmptyDrawer
              icon={<Heart className="size-7" />}
              title="რჩეულების სია ცარიელია"
              text="შეინახეთ საინტერესო პროდუქტები მოგვიანებით სანახავად."
            />
          )}
        </div>
      </Drawer>

      <div
        className={[
          "fixed bottom-4 right-4 z-[100] max-w-[calc(100%_-_2rem)] rounded-md border border-[#DCE3EA] bg-white text-sm font-black text-[#102033] shadow-[0_14px_34px_rgba(4,28,50,0.18)] transition duration-200 sm:max-w-sm",
          toast
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        ].join(" ")}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast?.action === "openCart" ? (
          <button
            type="button"
            onClick={handleToastAction}
            className="focus-ring flex w-full cursor-pointer items-start gap-3 rounded-md px-4 py-3 text-left transition duration-150 hover:bg-[#F8FAFC] hover:shadow-[0_18px_36px_rgba(4,28,50,0.2)]"
          >
            <span
              className={[
                "mt-0.5 grid size-9 shrink-0 place-items-center rounded-md text-white",
                toast.tone === "cart" ? "bg-[#F58220]" : "bg-[#157347]"
              ].join(" ")}
            >
              {toast.tone === "cart" ? (
                <ShoppingCart className="size-4" />
              ) : (
                <Heart className="size-4 fill-current" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block leading-5">{toast.message}</span>
              <span className="mt-2 block text-xs font-black text-[#0B3A68] underline-offset-4 transition hover:text-[#F58220] hover:underline">
                კალათის ნახვა
              </span>
            </span>
          </button>
        ) : (
          <div className="flex items-start gap-3 px-4 py-3">
            <span
              className={[
                "mt-0.5 grid size-9 shrink-0 place-items-center rounded-md text-white",
                toast?.tone === "cart" ? "bg-[#F58220]" : "bg-[#157347]"
              ].join(" ")}
            >
              {toast?.tone === "cart" ? (
                <ShoppingCart className="size-4" />
              ) : (
                <Heart className="size-4 fill-current" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block leading-5">{toast?.message}</span>
            </span>
          </div>
        )}
      </div>
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }

  return context;
}

function Drawer({
  title,
  count,
  open,
  onClose,
  children
}: {
  title: string;
  count: number;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <SlideDrawer
      ariaLabel={title}
      open={open}
      onClose={onClose}
      side="right"
      viewportClassName="inset-0 z-[80]"
      panelClassName="w-full max-w-md bg-[#F7F8FA] shadow-[-16px_0_36px_rgba(4,28,50,0.16)]"
    >
      <div className="flex h-18 shrink-0 items-center justify-between gap-4 border-b border-[#E5EAF0] bg-white px-4 sm:px-5">
        <div>
          <p className="text-lg font-black text-[#041C32]">{title}</p>
          <p className="mt-0.5 text-xs font-bold text-[#6B7280]">{count} პროდუქტი</p>
        </div>
        <button
          type="button"
          aria-label={`${title} - დახურვა`}
          onClick={onClose}
          className="focus-ring grid size-10 place-items-center rounded-md border border-[#E5EAF0] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
        >
          <X className="size-5" />
        </button>
      </div>
      {children}
    </SlideDrawer>
  );
}

function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  onNavigate
}: {
  item: CartLine;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  return (
    <article className="rounded-lg border border-[#E5EAF0] bg-white p-3">
      <div className="flex gap-3">
        <Link
          href={`/products/${item.product.slug}`}
          onClick={onNavigate}
          className="focus-ring relative size-24 shrink-0 overflow-hidden rounded-md bg-[#F7F8FA]"
        >
          <Image
            src={item.product.image}
            alt={item.product.title}
            fill
            sizes="96px"
            quality={65}
            className="object-contain p-2"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${item.product.slug}`}
            onClick={onNavigate}
            className="focus-ring line-clamp-2 rounded-md text-sm font-black leading-5 text-[#102033] hover:text-[#0B3A68]"
          >
            {item.product.title}
          </Link>
          <p className="mt-2 text-base font-black text-[#041C32]">
            {formatPrice(item.product.price)}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="inline-flex h-9 items-center rounded-md border border-[#E5EAF0] bg-[#F7F8FA]">
              <QuantityButton label="რაოდენობის შემცირება" onClick={onDecrease}>
                <Minus className="size-3.5" />
              </QuantityButton>
              <span className="w-9 text-center text-xs font-black text-[#102033]">
                {item.quantity}
              </span>
              <QuantityButton label="რაოდენობის გაზრდა" onClick={onIncrease}>
                <Plus className="size-3.5" />
              </QuantityButton>
            </div>
            <button
              type="button"
              aria-label={`${item.product.title} - კალათიდან წაშლა`}
              onClick={onRemove}
              className="focus-ring grid size-9 place-items-center rounded-md text-[#6B7280] transition hover:bg-[#FFF1F1] hover:text-[#D92D20]"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function WishlistItem({
  product,
  onAddToCart,
  onRemove,
  onNavigate
}: {
  product: Product;
  onAddToCart: () => void;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  return (
    <article className="rounded-lg border border-[#E5EAF0] bg-white p-3">
      <div className="flex gap-3">
        <Link
          href={`/products/${product.slug}`}
          onClick={onNavigate}
          className="focus-ring relative size-24 shrink-0 overflow-hidden rounded-md bg-[#F7F8FA]"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="96px"
            quality={65}
            className="object-contain p-2"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="focus-ring line-clamp-2 rounded-md text-sm font-black leading-5 text-[#102033] hover:text-[#0B3A68]"
          >
            {product.title}
          </Link>
          <p className="mt-2 text-base font-black text-[#041C32]">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={onAddToCart}
          className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#F58220] px-3 text-xs font-black text-white transition hover:bg-[#de741d]"
        >
          <ShoppingCart className="size-4" />
          კალათაში დამატება
        </button>
        <button
          type="button"
          aria-label={`${product.title} - რჩეულებიდან წაშლა`}
          onClick={onRemove}
          className="focus-ring grid size-10 place-items-center rounded-md border border-[#E5EAF0] text-[#6B7280] transition hover:border-[#D92D20] hover:text-[#D92D20]"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}

function QuantityButton({
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
      className="focus-ring grid size-9 place-items-center rounded-md text-[#072B4D] transition hover:bg-white"
    >
      {children}
    </button>
  );
}

function PriceRow({
  label,
  value,
  muted = false,
  strong = false
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4",
        strong ? "text-lg font-black text-[#041C32]" : "font-bold",
        muted ? "text-[#6B7280]" : ""
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function EmptyDrawer({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="grid min-h-72 place-items-center text-center">
      <div className="max-w-xs">
        <span className="mx-auto grid size-14 place-items-center rounded-md bg-white text-[#F58220] ring-1 ring-[#E5EAF0]">
          {icon}
        </span>
        <h2 className="mt-4 text-lg font-black text-[#041C32]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">{text}</p>
      </div>
    </div>
  );
}
