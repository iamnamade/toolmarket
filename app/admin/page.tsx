import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "დეშბორდი | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის დეშბორდი",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
