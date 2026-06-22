import {
  BadgePercent,
  BellRing,
  ChartNoAxesCombined,
  Images,
  LayoutDashboard,
  MessageSquareText,
  Package,
  ScrollText,
  Settings,
  ShoppingBag,
  Tags,
  TicketPercent,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavigationItem = {
  label: string;
  helper: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  { label: "დეშბორდი", helper: "მიმოხილვა და სტატისტიკა", href: "/admin", icon: LayoutDashboard },
  { label: "პროდუქტები", helper: "კატალოგის მართვა", href: "/admin/products", icon: Package },
  { label: "კატეგორიები", helper: "მიმართულებები და ქვეკატეგორიები", href: "/admin/categories", icon: Tags },
  { label: "შეკვეთები", helper: "შეკვეთები და სტატუსები", href: "/admin/orders", icon: ShoppingBag },
  { label: "მომხმარებლები", helper: "ანგარიშები და როლები", href: "/admin/customers", icon: Users },
  { label: "ბრენდები", helper: "ბრენდების კატალოგი", href: "/admin/brands", icon: BadgePercent },
  { label: "კუპონები", helper: "აქციები და კოდები", href: "/admin/coupons", icon: TicketPercent },
  { label: "რევიუები", helper: "შეფასებების მოდერაცია", href: "/admin/reviews", icon: MessageSquareText },
  { label: "ანალიტიკა", helper: "გაფართოებული ანგარიშები", href: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "პარამეტრები", helper: "მაღაზიის კონფიგურაცია", href: "/admin/settings", icon: Settings },
  { label: "ბანერები", helper: "მთავარი გვერდის სლაიდერი", href: "/admin/banners", icon: Images },
  { label: "შეტყობინებები", helper: "განცხადებები და სისტემური ამბები", href: "/admin/notifications", icon: BellRing },
  { label: "ლოგები", helper: "აქტივობა და აუდიტი", href: "/admin/logs", icon: ScrollText }
];

