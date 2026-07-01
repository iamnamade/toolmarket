import type { Metadata } from "next";
import { AdminCustomersManager } from "@/components/admin/AdminCustomersManager";

export const metadata: Metadata = {
  title: "მომხმარებლები | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის მომხმარებლების გვერდი",
};

export default function AdminCustomersPage() {
  return <AdminCustomersManager />;
}
