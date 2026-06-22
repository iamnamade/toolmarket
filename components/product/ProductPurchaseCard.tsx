"use client";

import {
  Heart,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck
} from "lucide-react";
import { useState } from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import type { ProductDetail } from "@/types/catalog";

export function ProductPurchaseCard({ product }: { product: ProductDetail }) {
  const { addToCart, addToWishlist } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const [shareStatus, setShareStatus] = useState("");
  const maxQuantity = Math.max(product.stock, 1);

  const shareProduct = async () => {
    const shareData = {
      title: product.title,
      text: product.shortDescription,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("გაზიარებულია");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setShareStatus("ბმული დაკოპირებულია");
      } else {
        setShareStatus("");
      }
    } catch {
      setShareStatus("");
    }
  };

  return (
    <aside className="mt-7 rounded-xl border border-[#DCE3EA] bg-white p-5 shadow-[0_16px_38px_rgba(6,43,79,0.09)] lg:sticky lg:top-36">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex h-[52px] w-fit items-center rounded-lg border border-[#DCE3EA] bg-[#F7F9FC]">
          <QuantityButton
            label="რაოდენობის შემცირება"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity === 1}
          >
            <Minus className="size-4" />
          </QuantityButton>
          <span className="w-12 text-center text-sm font-black text-[#102033]" aria-live="polite">
            {quantity}
          </span>
          <QuantityButton
            label="რაოდენობის გაზრდა"
            onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
            disabled={quantity >= maxQuantity}
          >
            <Plus className="size-4" />
          </QuantityButton>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product, quantity)}
          className="focus-ring inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#F58220] px-5 text-sm font-black text-white transition duration-200 hover:bg-[#DF731B] hover:shadow-[0_8px_22px_rgba(245,130,32,0.24)]"
        >
          <ShoppingCart className="size-5" />
          კალათაში დამატება
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => addToWishlist(product)}
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DCE3EA] bg-white px-3 text-xs font-black text-[#062B4F] transition hover:border-[#F58220] hover:text-[#F58220]"
        >
          <Heart className="size-4" />
          რჩეულებში
        </button>
        <button
          type="button"
          onClick={shareProduct}
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DCE3EA] bg-white px-3 text-xs font-black text-[#062B4F] transition hover:border-[#F58220] hover:text-[#F58220]"
        >
          <Share2 className="size-4" />
          გაზიარება
        </button>
      </div>

      <div className="mt-5 grid gap-1 border-t border-[#E5EAF0] pt-4">
        <PurchaseNote
          icon={<Truck className="size-5" />}
          title="სწრაფი მიწოდება"
          text="თბილისში 1-2 სამუშაო დღე"
        />
        <PurchaseNote
          icon={<ShieldCheck className="size-5" />}
          title="ოფიციალური გარანტია"
          text={product.warrantyNotes[0]}
        />
        <PurchaseNote
          icon={<PackageCheck className="size-5" />}
          title="მარაგის დადასტურება"
          text="შეკვეთამდე მოწმდება ოპერატორის მიერ"
        />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#F1F7F4] px-4 py-3 text-[#176B45]">
        <LockKeyhole className="size-5 shrink-0" />
        <span className="text-xs font-black">დაცული და უსაფრთხო შეძენა</span>
      </div>

      <p className="mt-3 min-h-5 text-center text-xs font-bold text-[#6B7280]" role="status">
        {shareStatus}
      </p>
    </aside>
  );
}

function QuantityButton({
  label,
  onClick,
  disabled,
  children
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="focus-ring grid size-[52px] place-items-center rounded-lg text-[#062B4F] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function PurchaseNote({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#FFF4EA] text-[#F58220]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-black text-[#102033]">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-[#6B7280]">{text}</span>
      </span>
    </div>
  );
}
