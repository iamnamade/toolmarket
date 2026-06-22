import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brands } from "@/data/brands";
import { BrandCard } from "@/components/home/BrandCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function BrandSection() {
  return (
    <section id="brands" className="scroll-mt-32 bg-[#F7F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="ბრენდები"
            title="პოპულარული ბრენდები"
            description="შეარჩიეთ პროდუქცია სანდო მწარმოებლების მიხედვით."
          />
          <Link
            href="/products"
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-4 py-3 text-sm font-black text-[#0B3A68] transition hover:border-[#F58220] hover:text-[#F58220]"
          >
            ყველა პროდუქტი
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
