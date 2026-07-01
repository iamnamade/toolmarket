import type { Metadata } from "next";
import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";
import {
  getAdminCategoryTreeResult,
  type AdminCategoryNode,
  type AdminCategoryTreeResult,
} from "@/lib/catalog-category-tree";

export const metadata: Metadata = {
  title: "კატეგორიები | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის კატეგორიების გვერდი",
};

export default async function AdminCategoriesPage() {
  let initialCategories: AdminCategoryNode[] = [];
  let initialError: string | null = null;
  let initialWarning: string | null = null;
  let initialSource: AdminCategoryTreeResult["source"] = "database";

  try {
    const result = await getAdminCategoryTreeResult();
    initialCategories = result.categories;
    initialWarning = result.warning;
    initialSource = result.source;
  } catch {
    initialError = "კატეგორიების ჩატვირთვა ვერ მოხერხდა. სცადეთ გვერდის განახლება.";
  }

  return (
    <AdminCategoriesManager
      initialCategories={initialCategories}
      initialError={initialError}
      initialSource={initialSource}
      initialWarning={initialWarning}
    />
  );
}
