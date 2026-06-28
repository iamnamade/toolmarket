import {
  AirVent,
  Anchor,
  AppWindow,
  Axe,
  BetweenHorizontalStart,
  BetweenVerticalStart,
  Blend,
  Bolt,
  BrickWall,
  BriefcaseBusiness,
  BringToFront,
  BrushCleaning,
  Bubbles,
  Cable,
  CassetteTape,
  Circle,
  CircleDot,
  CircleGauge,
  CirclePower,
  Cog,
  Construction,
  Container,
  Crosshair,
  Cylinder,
  Disc,
  Disc3,
  DiscAlbum,
  DoorClosed,
  DoorClosedLocked,
  Drill,
  Droplets,
  Factory,
  Fence,
  Film,
  FlameKindling,
  FlaskConical,
  Glasses,
  Grip,
  GripHorizontal,
  Hammer,
  Hand,
  HardHat,
  Hexagon,
  HousePlug,
  KeyRound,
  Lamp,
  Lightbulb,
  Link2,
  LocateFixed,
  LockKeyhole,
  Nut,
  Orbit,
  Paintbrush,
  Paintbrush2,
  PaintBucket,
  PaintRoller,
  PenLine,
  PenTool,
  Pickaxe,
  Pipette,
  Plug,
  Plug2,
  PocketKnife,
  Power,
  Router,
  ScanLine,
  Scissors,
  ScissorsLineDashed,
  Settings,
  ShieldCheck,
  ShieldEllipsis,
  Shirt,
  Shovel,
  Sparkle,
  Sprout,
  SquareDashedBottom,
  SquarePower,
  ToggleLeft,
  Toolbox,
  Trees,
  Truck,
  Unplug,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Product } from "@/types/catalog";

export type CatalogChildCategory = {
  nameKa: string;
  slug: string;
  icon: LucideIcon;
  productIds?: string[];
  productCount?: number;
};

export type CatalogCategory = {
  nameKa: string;
  slug: string;
  icon: LucideIcon;
  description?: string;
  children: CatalogChildCategory[];
  productCategoryNames?: string[];
  productIds?: string[];
  productCount?: number;
};

export const catalogCategories: CatalogCategory[] = [
  {
    nameKa: "ხელსაწყოები",
    slug: "tools",
    icon: Toolbox,
    description: "ხელის ინსტრუმენტები, ნაკრებები და ყოველდღიური სამუშაოსთვის საჭირო პრაქტიკული აქსესუარები.",
    productIds: [
      "tolsen-hand-tool-kit-45pcs",
      "total-screwdriver-set-32pcs"
    ],
    children: [
      { nameKa: "ჩაქუჩები", slug: "hammers", icon: Hammer },
      { nameKa: "სახრახნისები", slug: "screwdrivers", icon: PenTool, productIds: ["total-screwdriver-set-32pcs"] },
      { nameKa: "ქანჩის გასაღებები", slug: "wrenches", icon: Wrench, productIds: ["tolsen-hand-tool-kit-45pcs"] },
      { nameKa: "პლოსკოები", slug: "pliers", icon: Grip, productIds: ["tolsen-hand-tool-kit-45pcs"] },
      { nameKa: "მკვნეტარები", slug: "cutters", icon: ScissorsLineDashed },
      { nameKa: "დანები", slug: "knives", icon: PocketKnife },
      { nameKa: "ხერხები", slug: "saws", icon: ScanLine }
    ]
  },
  {
    nameKa: "ელექტრო ინსტრუმენტები",
    slug: "power-tools",
    icon: SquarePower,
    description: "ელექტრო და აკუმულატორული ინსტრუმენტები სამშენებლო, სამონტაჟო და საამქრო სამუშაოებისთვის.",
    productIds: [
      "ingco-cordless-drill-20v",
      "crown-rotary-hammer-850w",
      "wadfow-compact-drill-650w",
      "crown-construction-mixer-1400w"
    ],
    children: [
      { nameKa: "დრელები", slug: "drills", icon: Drill, productIds: ["ingco-cordless-drill-20v", "wadfow-compact-drill-650w"] },
      { nameKa: "პერფორატორები", slug: "rotary-hammers", icon: Construction, productIds: ["crown-rotary-hammer-850w"] },
      { nameKa: "ბულგარულები", slug: "angle-grinders", icon: CirclePower },
      { nameKa: "შურუპოვერტები", slug: "screwdrivers", icon: Power, productIds: ["ingco-cordless-drill-20v"] },
      { nameKa: "სამშენებლო მიქსერები", slug: "mixers", icon: Blend, productIds: ["crown-construction-mixer-1400w"] },
      { nameKa: "ელექტრო ინსტრუმენტების აქსესუარები", slug: "power-tool-accessories", icon: Settings, productIds: ["ingco-drill-bit-set-16pcs", "hogert-cutting-discs-125mm", "crown-sanding-discs-10pcs"] }
    ]
  },
  {
    nameKa: "სამშენებლო მასალები",
    slug: "construction-materials",
    icon: BrickWall,
    description: "სამშენებლო ქიმია, ნარევები და დამხმარე მასალები პროექტის სხვადასხვა ეტაპისთვის.",
    productCategoryNames: ["სამშენებლო მასალები"],
    children: [
      { nameKa: "სამშენებლო ქიმია", slug: "construction-chemistry", icon: FlaskConical },
      { nameKa: "სილიკონი", slug: "silicone", icon: Pipette, productIds: ["decakila-silicone-sealant"] },
      { nameKa: "ქაფი", slug: "foam", icon: Bubbles },
      { nameKa: "წებო", slug: "adhesive", icon: PenLine, productIds: ["decakila-ceramic-adhesive"] },
      { nameKa: "ჰიდროიზოლაცია", slug: "waterproofing", icon: Droplets },
      { nameKa: "ლენტები", slug: "tapes", icon: CassetteTape },
      { nameKa: "სამშენებლო ნარევები", slug: "mixes", icon: Container, productIds: ["decakila-ceramic-adhesive", "topfine-wall-primer-5l"] }
    ]
  },
  {
    nameKa: "სამაგრები და საკინძები",
    slug: "fasteners",
    icon: Hexagon,
    description: "სამაგრები და საკინძეები მონტაჟის, გამაგრებისა და სარემონტო სამუშაოებისთვის.",
    productCategoryNames: ["სამაგრები"],
    children: [
      { nameKa: "თვითმჭრელები", slug: "self-tapping-screws", icon: BetweenVerticalStart, productIds: ["tolsen-screw-assortment-300pcs", "total-drywall-screws-1000pcs"] },
      { nameKa: "დუბელები", slug: "wall-plugs", icon: Unplug, productIds: ["hogert-wall-plugs-200pcs"] },
      { nameKa: "ანკერები", slug: "anchors", icon: Anchor, productIds: ["crown-anchor-bolts-m10"] },
      { nameKa: "ჭანჭიკები", slug: "bolts", icon: Bolt, productIds: ["crown-anchor-bolts-m10"] },
      { nameKa: "ქანჩები", slug: "nuts", icon: Nut },
      { nameKa: "სამაგრები", slug: "ties", icon: Link2, productIds: ["topfine-cable-ties-200pcs"] }
    ]
  },
  {
    nameKa: "საჭრელი და სახეხი",
    slug: "cutting-grinding",
    icon: DiscAlbum,
    description: "საჭრელი და სახეხი დისკები, ჯაგრისები და დამუშავების აქსესუარები სხვადასხვა ზედაპირისთვის.",
    productIds: ["hogert-cutting-discs-125mm", "crown-sanding-discs-10pcs"],
    children: [
      { nameKa: "საჭრელი დისკები", slug: "cutting-discs", icon: Disc3, productIds: ["hogert-cutting-discs-125mm"] },
      { nameKa: "ალმასის დისკები", slug: "diamond-discs", icon: Sparkle },
      { nameKa: "სახეხი დისკები", slug: "sanding-discs", icon: Disc, productIds: ["crown-sanding-discs-10pcs"] },
      { nameKa: "ჯაგრისები", slug: "brushes", icon: BrushCleaning },
      { nameKa: "სახეხი აქსესუარები", slug: "grinding-accessories", icon: Cog }
    ]
  },
  {
    nameKa: "საბურღები და ბიტები",
    slug: "drill-bits",
    icon: Crosshair,
    description: "ბურღები, ბიტები და ზუსტი ბურღვისთვის საჭირო სპეციალური ნაკრებები.",
    productIds: ["ingco-drill-bit-set-16pcs"],
    children: [
      { nameKa: "საბურღები", slug: "drill-bits", icon: LocateFixed, productIds: ["ingco-drill-bit-set-16pcs"] },
      { nameKa: "ბიტები", slug: "bits", icon: GripHorizontal },
      { nameKa: "ბიტების ნაკრები", slug: "bit-sets", icon: BriefcaseBusiness },
      { nameKa: "ფრეზერის პირები", slug: "router-bits", icon: Router },
      { nameKa: "გვირგვინები", slug: "hole-saws", icon: CircleGauge }
    ]
  },
  {
    nameKa: "ბორბლები და ტრანსპორტირება",
    slug: "wheels-transport",
    icon: Truck,
    description: "ბორბლები და გადაადგილების სისტემები საწყობის, სახელოსნოსა და საწარმოო ინვენტარისთვის.",
    children: [
      { nameKa: "ავეჯის ბორბლები", slug: "furniture-casters", icon: CircleDot },
      { nameKa: "სამრეწველო ბორბლები", slug: "industrial-wheels", icon: Orbit },
      { nameKa: "სატვირთო ბორბლები", slug: "cargo-wheels", icon: Circle },
      { nameKa: "როლიკები", slug: "rollers", icon: BetweenHorizontalStart }
    ]
  },
  {
    nameKa: "ელექტრობა და განათება",
    slug: "electrical-lighting",
    icon: HousePlug,
    description: "კაბელები, როზეტები, განათება და სხვა ელექტრო აქსესუარები სანდო მონტაჟისთვის.",
    productCategoryNames: ["ელექტრობა და განათება", "იზოლენტები"],
    children: [
      { nameKa: "კაბელები", slug: "cables", icon: Cable, productIds: ["total-cable-reel-25m", "wadfow-extension-cord-5m"] },
      { nameKa: "როზეტები", slug: "sockets", icon: Plug, productIds: ["topfine-switch-socket-set"] },
      { nameKa: "ჩამრთველები", slug: "switches", icon: ToggleLeft, productIds: ["topfine-switch-socket-set"] },
      { nameKa: "ელექტრო ლენტები", slug: "electrical-tapes", icon: BringToFront, productIds: ["topfine-pvc-tape-black", "total-insulation-tape-red", "wadfow-duct-tape-silver"] },
      { nameKa: "დამაგრძელებლები", slug: "extension-cords", icon: Plug2, productIds: ["wadfow-extension-cord-5m"] },
      { nameKa: "ნათურები", slug: "bulbs", icon: Lightbulb },
      { nameKa: "განათება", slug: "lighting", icon: Lamp, productIds: ["ingco-led-work-light-30w", "hogert-led-flashlight"] }
    ]
  },
  {
    nameKa: "უსაფრთხოება",
    slug: "safety",
    icon: ShieldCheck,
    description: "ინდივიდუალური დაცვის საშუალებები და უსაფრთხოების აქსესუარები ყოველდღიური სამუშაო პროცესისთვის.",
    productCategoryNames: ["უსაფრთხოება"],
    children: [
      { nameKa: "ხელთათმანები", slug: "gloves", icon: Hand, productIds: ["hogert-work-gloves"] },
      { nameKa: "დამცავი სათვალეები", slug: "goggles", icon: Glasses, productIds: ["tolsen-safety-goggles"] },
      { nameKa: "ჩაფხუტები", slug: "helmets", icon: HardHat, productIds: ["total-safety-helmet"] },
      { nameKa: "ნიღბები", slug: "masks", icon: AirVent, productIds: ["crown-respirator-mask", "ingco-welding-mask"] },
      { nameKa: "სამუშაო ტანსაცმელი", slug: "workwear", icon: Shirt }
    ]
  },
  {
    nameKa: "ბაღი და ეზო",
    slug: "garden-yard",
    icon: Trees,
    description: "ბაღისა და ეზოს მოვლისთვის საჭირო ხელსაწყოები, საჭრელები და მორწყვის აქსესუარები.",
    productCategoryNames: ["ბაღი და ეზო"],
    children: [
      { nameKa: "ნიჩბები", slug: "shovels", icon: Shovel },
      { nameKa: "თოხები", slug: "hoes", icon: Pickaxe },
      { nameKa: "ფოცხები", slug: "rakes", icon: Fence, productIds: ["topfine-garden-rake"] },
      { nameKa: "ბაღის მაკრატლები", slug: "pruners", icon: Scissors, productIds: ["ingco-garden-pruner"] },
      { nameKa: "ცულები", slug: "axes", icon: Axe },
      { nameKa: "ბაღის ხელსაწყოები", slug: "garden-tools", icon: Sprout, productIds: ["wadfow-grass-trimmer", "tolsen-garden-hose-20m", "decakila-pressure-sprayer-5l"] }
    ]
  },
  {
    nameKa: "შედუღება",
    slug: "welding",
    icon: FlameKindling,
    description: "შედუღების სამუშაოებისთვის საჭირო აქსესუარები, დამცავი საშუალებები და ინვენტარი.",
    productIds: ["ingco-welding-mask"],
    children: [
      { nameKa: "ელექტროდები", slug: "electrodes", icon: Zap },
      { nameKa: "შედუღების აქსესუარები", slug: "welding-accessories", icon: ShieldEllipsis, productIds: ["ingco-welding-mask"] },
      { nameKa: "შედუღების ინვენტარი", slug: "welding-equipment", icon: Factory }
    ]
  },
  {
    nameKa: "საღებავები და სამღებრო ინვენტარი",
    slug: "paint-supplies",
    icon: PaintBucket,
    description: "შეღებვის, მოსამზადებელი და დამცავი სამუშაოებისთვის საჭირო ინვენტარი და აქსესუარები.",
    productIds: ["decakila-masking-tape-30mm", "topfine-wall-primer-5l"],
    children: [
      { nameKa: "ფუნჯები", slug: "brushes", icon: Paintbrush },
      { nameKa: "ლილვაკები", slug: "rollers", icon: PaintRoller },
      { nameKa: "შპატელები", slug: "scrapers", icon: SquareDashedBottom },
      { nameKa: "საღებავის აქსესუარები", slug: "paint-accessories", icon: Paintbrush2, productIds: ["topfine-wall-primer-5l"] },
      { nameKa: "დამცავი ფირი", slug: "masking-film", icon: Film, productIds: ["decakila-masking-tape-30mm"] }
    ]
  },
  {
    nameKa: "საკეტები და ფურნიტურა",
    slug: "locks-hardware",
    icon: DoorClosedLocked,
    description: "საკეტები, ფურნიტურა და მონტაჟის დეტალები საცხოვრებელი და კომერციული ობიექტებისთვის.",
    children: [
      { nameKa: "ბოქლომები", slug: "padlocks", icon: LockKeyhole },
      { nameKa: "საკეტები", slug: "locks", icon: DoorClosed },
      { nameKa: "ცილინდრები", slug: "cylinders", icon: Cylinder },
      { nameKa: "კარის ფურნიტურა", slug: "door-hardware", icon: KeyRound },
      { nameKa: "მინის სამაგრები", slug: "glass-hardware", icon: AppWindow }
    ]
  }
];

export function categoryHref(categorySlug: string) {
  return `/products?category=${categorySlug}`;
}

export function subcategoryHref(categorySlug: string, subcategorySlug: string) {
  return `/products?category=${categorySlug}&subcategory=${subcategorySlug}`;
}

export function getCategoryBySlug(slug?: string) {
  return catalogCategories.find((category) => category.slug === slug) ?? null;
}

export function getSubcategoryBySlug(category: CatalogCategory | null, slug?: string) {
  return category?.children.find((child) => child.slug === slug) ?? null;
}

export function countProductsForCategory(products: Product[], category: CatalogCategory) {
  return products.filter((product) => productMatchesCategory(product, category)).length;
}

export function countProductsForSubcategory(products: Product[], child: CatalogChildCategory) {
  if (!child.productIds?.length) {
    return 0;
  }

  return products.filter((product) => child.productIds?.includes(product.id)).length;
}

export function productMatchesCategory(product: Product, category: CatalogCategory) {
  return Boolean(
    category.productIds?.includes(product.id) ||
      category.productCategoryNames?.includes(product.category)
  );
}

export function productMatchesSubcategory(product: Product, child: CatalogChildCategory) {
  return Boolean(child.productIds?.includes(product.id));
}
