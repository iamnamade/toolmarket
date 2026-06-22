import type { ProductSpecifications } from "@/types/catalog";

export function ProductSpecs({ specifications }: { specifications: ProductSpecifications }) {
  return (
    <dl className="grid gap-2">
      {Object.entries(specifications).map(([name, value]) => (
        <div
          key={name}
          className="group grid gap-2 rounded-lg bg-[#F7F9FC] px-4 py-3 transition duration-200 hover:bg-[#EEF3F8] sm:grid-cols-[minmax(150px,0.75fr)_1.25fr] sm:items-center sm:px-5"
        >
          <dt className="flex min-w-0 items-center gap-3 text-sm font-bold text-[#6B7280]">
            <span className="shrink-0">{name}</span>
            <span className="hidden h-px min-w-8 flex-1 border-t border-dotted border-[#B8C2CE] sm:block" />
          </dt>
          <dd className="min-w-0 text-sm font-black text-[#102033]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
