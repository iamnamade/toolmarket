import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "ჩვენ შესახებ",
  description:
    "ToolMarket.ge არის ონლაინ სივრცე პროფესიონალური ხელსაწყოების, სამშენებლო მასალების და ტექნიკური პროდუქტებისთვის.",
  path: "/about"
});

export default function AboutLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
