import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "პროდუქტები",
  description:
    "ToolMarket.ge-ზე დაათვალიერეთ ხელსაწყოების, სამშენებლო მასალების და ტექნიკური პროდუქტების სრული კატალოგი.",
  path: "/products"
});

export default function ProductsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
