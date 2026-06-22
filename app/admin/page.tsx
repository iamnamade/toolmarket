import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციული პანელი"
};

export default function AdminPage() {
  return <AdminDashboard />;
}
