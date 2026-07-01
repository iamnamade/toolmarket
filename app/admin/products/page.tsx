import type { Metadata } from "next";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const metadata: Metadata = {
  title: "პროდუქტები | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის პროდუქტების გვერდი",
};

export default function AdminProductsPage() {
  return <AdminProductsManager />;
}
