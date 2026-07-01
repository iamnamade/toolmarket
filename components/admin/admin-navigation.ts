import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavigationItem = {
  helper: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    label: "დეშბორდი",
    helper: "მიმოხილვა და ძირითადი მაჩვენებლები",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "პროდუქტები",
    helper: "კატალოგის მიმდინარე სია",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "კატეგორიები",
    helper: "სტრუქტურა და ქვეკატეგორიები",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "შეკვეთები",
    helper: "სტატუსი და საოპერაციო ნაკადი",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "მომხმარებლები",
    helper: "ანგარიშები და როლები",
    href: "/admin/customers",
    icon: Users,
  },
];
