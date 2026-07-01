import type { Metadata } from "next";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

export const metadata: Metadata = {
  title: "ანალიტიკა | ToolMarket.ge",
  description: "ToolMarket.ge ადმინისტრაციის ანალიტიკის გვერდი",
};

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}
