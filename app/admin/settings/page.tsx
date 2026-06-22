import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/AdminSettings";

export const metadata: Metadata = {
  title: "Admin Settings | ToolMarket.ge",
  description: "ToolMarket.ge store and administration settings"
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
