import type { LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  icon: LucideIcon;
  accentColor: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
  featured?: boolean;
};

export type Brand = {
  name: string;
  slug: string;
  logo: string;
  description: string;
  accentColor: string;
  hoverAccentColor: string;
  logoBackground: string;
  logoHoverBackground: string;
  productCount?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  images: string[];
  stock: number;
  price: string;
  oldPrice?: string;
  discount?: string;
  description: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  sku: string;
  features: string[];
  specifications: ProductSpecifications;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
};

export type ProductSpecifications = Record<string, string>;

export type ProductAvailability = "in_stock" | "limited" | "made_to_order";

export type ProductDetail = Product & {
  availability: ProductAvailability;
  deliveryNotes: string[];
  warrantyNotes: string[];
  supportNotes: string[];
};

export type Stat = {
  value: string;
  label: string;
};

export type ServiceHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};
