import type { Metadata } from "next";
import { AdminOrdersStatus } from "@/components/admin/AdminOrdersStatus";

export const metadata: Metadata = {
  title: "შეკვეთები | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის შეკვეთების გვერდი",
};

export default function AdminOrdersPage() {
  return <AdminOrdersStatus />;
}
