import { ProductCard } from "@/components/home/ProductCard";
import type { Product } from "@/types/catalog";

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="related-products-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-[#F58220]">შერჩეული თქვენთვის</p>
          <h2 id="related-products-heading" className="mt-2 text-2xl font-black text-[#041C32]">
            მსგავსი პროდუქტები
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
