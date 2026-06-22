import type { Metadata } from "next";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const metadata: Metadata = {
  title: "Products Admin | ToolMarket.ge",
  description: "ToolMarket.ge admin product management interface"
};

export default function AdminProductsPage() {
  return <AdminProductsManager />;
}
