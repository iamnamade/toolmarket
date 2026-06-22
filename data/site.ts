import { BadgeCheck, Headphones, PackageCheck, Truck } from "lucide-react";
import type { ServiceHighlight, Stat } from "@/types/catalog";

export const heroStats: Stat[] = [
  { value: "1,200+", label: "პროდუქტი" },
  { value: "8", label: "ბრენდი" },
  { value: "24/7", label: "მხარდაჭერა" }
];

export const serviceHighlights: ServiceHighlight[] = [
  {
    title: "ხარისხიანი პროდუქცია",
    description: "შერჩეული პროდუქტები პროფესიული და ყოველდღიური სამუშაოსთვის",
    icon: BadgeCheck
  },
  {
    title: "სწრაფი მიწოდება",
    description: "შეკვეთის სწრაფი დამუშავება და კომფორტული მიღება",
    icon: Truck
  },
  {
    title: "ბრენდების არჩევანი",
    description: "პოპულარული მწარმოებლები ერთ სანდო სივრცეში",
    icon: PackageCheck
  },
  {
    title: "მომხმარებლის მხარდაჭერა",
    description: "კონსულტაცია პროდუქტის სწორად შერჩევისთვის",
    icon: Headphones
  }
];

export const footerLinks = {
  customer: ["მიწოდება", "დაბრუნება", "კონფიდენციალურობა", "წესები და პირობები"],
  company: ["მთავარი", "პროდუქტები", "ბრენდები", "კონტაქტი"]
};
