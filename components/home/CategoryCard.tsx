import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { formatProductCount } from "@/lib/format";
import type { Category } from "@/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  const colorStyle = {
    "--category-accent": category.accentColor,
    "--category-soft": category.backgroundColor,
    "--category-hover": category.hoverBackgroundColor
  } as CSSProperties;

  return (
    <Link
      href={`/categories/${category.slug}`}
      style={colorStyle}
      className={[
        "group focus-ring flex min-h-56 flex-col rounded-lg border p-5 transition-[background-color,border-color] duration-300 ease-in-out hover:border-[var(--category-accent)] hover:bg-[var(--category-hover)]",
        category.featured
          ? "border-[#F58220] bg-[var(--category-soft)]"
          : "border-[#E5EAF0] bg-white"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-12 place-items-center rounded-md bg-[var(--category-soft)] text-[var(--category-accent)] ring-1 ring-[color:var(--category-accent)]/15 transition-colors duration-300 ease-in-out group-hover:bg-[var(--category-hover)]">
          <category.icon className="size-5.5" strokeWidth={2} />
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#E5EAF0] bg-white text-[#8A95A8] transition-[color,border-color,transform] duration-300 ease-in-out group-hover:translate-x-1 group-hover:border-[var(--category-accent)] group-hover:text-[var(--category-accent)]">
          <ArrowRight className="size-4" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-7 text-[#102033]">
        {category.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7280]">
        {category.description}
      </p>
      <div className="mt-auto pt-5">
        <span className="inline-flex rounded-md bg-[var(--category-soft)] px-3 py-1.5 text-xs font-black text-[var(--category-accent)] transition-colors duration-300 ease-in-out group-hover:bg-white">
          {formatProductCount(category.productCount)}
        </span>
      </div>
    </Link>
  );
}
