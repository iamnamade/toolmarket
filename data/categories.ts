import { catalogCategories } from "@/data/category-navigation";
import type { Category } from "@/types/catalog";

export const categories: Category[] = catalogCategories.map((category, index) => ({
  id: category.slug,
  name: category.nameKa,
  slug: category.slug,
  description: category.children.map((child) => child.nameKa).slice(0, 4).join(", "),
  productCount: category.productCount ?? 0,
  icon: category.icon,
  accentColor: index % 3 === 0 ? "#F58220" : index % 3 === 1 ? "#0B3A68" : "#476582",
  backgroundColor: "#F7F8FA",
  hoverBackgroundColor: "#FFF3E8",
  featured: index < 4
}));
