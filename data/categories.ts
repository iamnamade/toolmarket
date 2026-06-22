import {
  Cable,
  Drill,
  Flame,
  Hammer,
  Leaf,
  Lightbulb,
  ShieldCheck,
  ShowerHead,
  SquareStack,
  Wrench
} from "lucide-react";
import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "tools",
    name: "ხელსაწყოები",
    slug: "khelsatskhoebi",
    description: "ელექტრო და ხელის ინსტრუმენტები",
    productCount: 320,
    icon: Drill,
    accentColor: "#2563EB",
    backgroundColor: "#EFF6FF",
    hoverBackgroundColor: "#E5EFFF"
  },
  {
    id: "electrical",
    name: "ელექტროობა და განათება",
    slug: "elektrooba-da-ganateba",
    description: "კაბელები, სანათები და აქსესუარები",
    productCount: 180,
    icon: Lightbulb,
    accentColor: "#F58220",
    backgroundColor: "#FFF3E8",
    hoverBackgroundColor: "#FFE8D2",
    featured: true
  },
  {
    id: "construction-materials",
    name: "სამშენებლო მასალები",
    slug: "samsheneblo-masalebi",
    description: "ცემენტი, საღებავი და მშრალი ნარევები",
    productCount: 240,
    icon: Hammer,
    accentColor: "#64748B",
    backgroundColor: "#F1F5F9",
    hoverBackgroundColor: "#E8EEF4"
  },
  {
    id: "fasteners",
    name: "სამაგრები",
    slug: "samagrebi",
    description: "ხრახნები, დუბელები და ჭანჭიკები",
    productCount: 150,
    icon: SquareStack,
    accentColor: "#475569",
    backgroundColor: "#F1F5F9",
    hoverBackgroundColor: "#E2E8F0"
  },
  {
    id: "tapes",
    name: "იზოლენტები",
    slug: "izolentebi",
    description: "PVC ლენტები და სამუშაო აქსესუარები",
    productCount: 75,
    icon: Cable,
    accentColor: "#0891B2",
    backgroundColor: "#ECFEFF",
    hoverBackgroundColor: "#CFFAFE"
  },
  {
    id: "plumbing",
    name: "სანტექნიკა",
    slug: "santeqnika",
    description: "მილები, ონკანები და მონტაჟი",
    productCount: 130,
    icon: ShowerHead,
    accentColor: "#0E7490",
    backgroundColor: "#ECFEFF",
    hoverBackgroundColor: "#D5F7FA"
  },
  {
    id: "safety",
    name: "უსაფრთხოება",
    slug: "usaprtkhoeba",
    description: "ხელთათმანები, ნიღბები და სათვალეები",
    productCount: 95,
    icon: ShieldCheck,
    accentColor: "#7C3AED",
    backgroundColor: "#F5F3FF",
    hoverBackgroundColor: "#EDE9FE"
  },
  {
    id: "garden",
    name: "ბაღი და ეზო",
    slug: "baghi-da-ezo",
    description: "ეზოს მოვლის ინსტრუმენტები",
    productCount: 110,
    icon: Leaf,
    accentColor: "#15803D",
    backgroundColor: "#F0FDF4",
    hoverBackgroundColor: "#DCFCE7"
  },
  {
    id: "welding",
    name: "შედუღება",
    slug: "shedugheba",
    description: "აპარატები და დამხმარე ინვენტარი",
    productCount: 80,
    icon: Flame,
    accentColor: "#DC4A1D",
    backgroundColor: "#FFF1ED",
    hoverBackgroundColor: "#FFE2D8"
  },
  {
    id: "accessories",
    name: "აქსესუარები",
    slug: "aqsesuarebi",
    description: "საცვლელი ნაწილები და სამუშაო კომპლექტები",
    productCount: 210,
    icon: Wrench,
    accentColor: "#476582",
    backgroundColor: "#F1F5F9",
    hoverBackgroundColor: "#E5EDF5"
  }
];
