import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/home/BrandLogo";
import { formatProductCount } from "@/lib/format";
import type { Brand } from "@/types/catalog";

export function BrandCard({ brand }: { brand: Brand }) {
  const brandStyle = {
    "--brand-accent": brand.accentColor,
    "--brand-accent-hover": brand.hoverAccentColor,
    "--brand-logo-background": hexToRgba(brand.accentColor, 0.035),
    "--brand-logo-hover-background": hexToRgba(brand.accentColor, 0.065),
    "--brand-logo-border": hexToRgba(brand.accentColor, 0.14),
    "--brand-badge-background": hexToRgba(brand.accentColor, 0.15),
    "--brand-badge-hover-background": hexToRgba(brand.accentColor, 0.23),
    "--brand-badge-border": hexToRgba(brand.accentColor, 0.25)
  } as CSSProperties;

  return (
    <Link
      href="/#products"
      style={brandStyle}
      className="group focus-ring flex h-full min-h-[238px] flex-col overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--brand-logo-border)] hover:shadow-[0_14px_28px_rgba(4,28,50,0.09)]"
    >
      <div className="flex h-full flex-col p-4">
        <div className="relative">
          <div className="flex h-[88px] items-center justify-center rounded-lg border border-[var(--brand-logo-border)] bg-[var(--brand-logo-background)] p-4 transition-all duration-300 ease-in-out group-hover:bg-[var(--brand-logo-hover-background)]">
            <BrandLogo brand={brand} />
          </div>
          <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-[#E5EAF0] bg-white text-[#072B4D] shadow-sm transition-colors duration-300 ease-in-out group-hover:border-[var(--brand-logo-border)] group-hover:text-[var(--brand-accent)]">
            <ArrowRight className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 min-w-0 break-words text-lg font-black tracking-normal text-[#102033] transition-colors duration-300 ease-in-out group-hover:text-[var(--brand-accent-hover)]">
            {brand.name}
          </h3>
          {typeof brand.productCount === "number" ? (
            <span className="shrink-0 rounded-md border border-[var(--brand-badge-border)] bg-[var(--brand-badge-background)] px-2.5 py-1 text-xs font-black text-[var(--brand-accent)] transition-colors duration-300 ease-in-out group-hover:bg-[var(--brand-badge-hover-background)] group-hover:text-[var(--brand-accent-hover)]">
              {formatProductCount(brand.productCount)}
            </span>
          ) : null}
        </div>

        <p className="mt-2 line-clamp-2 min-h-10 break-words text-sm leading-5 text-[#4B5563]">
          {brand.description}
        </p>

        <span className="relative mt-auto inline-flex w-fit items-center gap-2 pt-4 text-sm font-black text-[var(--brand-accent)] transition-colors duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-px after:w-[calc(100%-24px)] after:origin-left after:scale-x-0 after:bg-[var(--brand-accent-hover)] after:transition-transform after:duration-300 group-hover:text-[var(--brand-accent-hover)] group-hover:after:scale-x-100">
          პროდუქტების ნახვა
          <ArrowRight className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
