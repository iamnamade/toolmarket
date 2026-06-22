import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/home/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CategorySection() {
  return (
    <section id="categories" className="scroll-mt-32 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow="კატეგორიები"
          title="ყველაფერი სამუშაოსთვის ერთ სივრცეში"
          description="კატეგორიის რაოდენობები მოდის მონაცემებიდან და მზად არის მომავალში API-ით ჩანაცვლებისთვის."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
