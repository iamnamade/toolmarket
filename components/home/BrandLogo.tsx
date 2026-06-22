import Image from "next/image";
import type { Brand } from "@/types/catalog";

export function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={220}
      height={90}
      className="h-auto max-h-[70px] w-auto max-w-full rounded-md object-contain"
    />
  );
}
