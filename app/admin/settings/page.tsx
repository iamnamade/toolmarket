import type { Metadata } from "next";
import { AdminSettingsOverview } from "@/components/admin/AdminSettingsOverview";

export const metadata: Metadata = {
  title: "პარამეტრები | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის პარამეტრების გვერდი",
};

export default function AdminSettingsPage() {
  return <AdminSettingsOverview />;
}
