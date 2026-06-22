import type { Product, ProductAvailability, ProductDetail } from "@/types/catalog";

type DemoProductInput = Omit<
  ProductDetail,
  | "title"
  | "image"
  | "images"
  | "price"
  | "oldPrice"
  | "discount"
  | "availability"
  | "deliveryNotes"
  | "warrantyNotes"
  | "supportNotes"
> & {
  price: number;
  oldPrice?: number;
  imageSeed: string;
  gallerySeeds?: string[];
};

const PRODUCT_IMAGE_FALLBACK = "/products/tool-catalog-fallback.png";

const productImageBySeed: Record<string, string> = {
  "ingco-cordless-drill-20v": "/products/cordless-drill.png",
  "crown-rotary-hammer-850w": "/products/rotary-hammer.png",
  "wadfow-compact-drill-650w": "/products/corded-drill.png",
  "tolsen-hand-tool-kit-45pcs": "/products/hand-tool-kit.png",
  "total-screwdriver-set-32pcs": "/products/screwdriver-set.png",
  "ingco-led-work-light-30w": "/products/led-work-light.png",
  "total-cable-reel-25m": "/products/cable-reel.png",
  "hogert-led-flashlight": "/products/led-flashlight.png",
  "topfine-switch-socket-set": "/products/switch-socket-set.png",
  "wadfow-extension-cord-5m": "/products/extension-cord.png",
  "crown-construction-mixer-1400w": "/products/construction-equipment.png",
  "tolsen-tile-cutter-600mm": "/products/construction-equipment.png",
  "decakila-silicone-sealant": "/products/construction-materials.png",
  "decakila-ceramic-adhesive": "/products/construction-materials.png",
  "topfine-wall-primer-5l": "/products/construction-materials.png",
  "tolsen-screw-assortment-300pcs": "/products/fasteners.png",
  "hogert-wall-plugs-200pcs": "/products/fasteners.png",
  "crown-anchor-bolts-m10": "/products/fasteners.png",
  "total-drywall-screws-1000pcs": "/products/fasteners.png",
  "topfine-cable-ties-200pcs": "/products/fasteners.png",
  "topfine-pvc-tape-black": "/products/tapes-insulation.png",
  "total-insulation-tape-red": "/products/tapes-insulation.png",
  "wadfow-duct-tape-silver": "/products/tapes-insulation.png",
  "hogert-heat-shrink-tubes": "/products/tapes-insulation.png",
  "decakila-masking-tape-30mm": "/products/tapes-insulation.png",
  "hogert-work-gloves": "/products/safety-equipment.png",
  "tolsen-safety-goggles": "/products/safety-equipment.png",
  "crown-respirator-mask": "/products/safety-equipment.png",
  "ingco-welding-mask": "/products/safety-equipment.png",
  "total-safety-helmet": "/products/safety-equipment.png",
  "wadfow-grass-trimmer": "/products/garden-tools.png",
  "ingco-garden-pruner": "/products/garden-tools.png",
  "tolsen-garden-hose-20m": "/products/garden-tools.png",
  "decakila-pressure-sprayer-5l": "/products/garden-tools.png",
  "topfine-garden-rake": "/products/garden-tools.png",
  "ingco-drill-bit-set-16pcs": "/products/power-tool-accessories.png",
  "hogert-cutting-discs-125mm": "/products/power-tool-accessories.png",
  "crown-sanding-discs-10pcs": "/products/power-tool-accessories.png",
  "decakila-organizer-box": "/products/power-tool-accessories.png",
  "wadfow-glue-sticks-12pcs": "/products/power-tool-accessories.png"
};

const imageUrl = (seed: string) => productImageBySeed[seed] ?? PRODUCT_IMAGE_FALLBACK;

function priceToString(price: number) {
  return `${price.toFixed(2)} ₾`;
}

function calculateDiscount(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) {
    return undefined;
  }

  return `-${Math.round((1 - price / oldPrice) * 100)}%`;
}

function getAvailability(stock: number): ProductAvailability {
  if (stock === 0) {
    return "made_to_order";
  }

  return stock <= 8 ? "limited" : "in_stock";
}

function createProduct(input: DemoProductInput): ProductDetail {
  const seeds = input.gallerySeeds ?? [input.imageSeed];

  return {
    ...input,
    title: input.name,
    price: priceToString(input.price),
    oldPrice: input.oldPrice ? priceToString(input.oldPrice) : undefined,
    discount: calculateDiscount(input.price, input.oldPrice),
    image: imageUrl(input.imageSeed),
    images: seeds.map(imageUrl),
    availability: getAvailability(input.stock),
    deliveryNotes: [
      "თბილისში მიწოდება 1-2 სამუშაო დღეში",
      "რეგიონებში მიწოდება შეთანხმებული პირობებით",
      "მიღებისას შესაძლებელია პროდუქტის ვიზუალური შემოწმება"
    ],
    warrantyNotes: [
      "ოფიციალური გარანტია მოქმედებს პროდუქტის ტიპის მიხედვით",
      "საგარანტიო მოთხოვნისთვის საჭიროა შეძენის დადასტურება",
      "სერვისის პირობები ზუსტდება შეკვეთის გაფორმებისას"
    ],
    supportNotes: [
      "პროდუქტის შერჩევაში კონსულტაცია ხელმისაწვდომია",
      "მარაგი დასტურდება შეკვეთის დამუშავებისას",
      "დაბრუნება და გაცვლა მოქმედი პირობების შესაბამისად"
    ]
  };
}

export const allProducts: ProductDetail[] = [
  createProduct({
    id: "ingco-cordless-drill-20v",
    slug: "ingco-akumulatoruli-dreli-20v",
    name: "INGCO აკუმულატორული დრელი 20V",
    brand: "INGCO",
    category: "ხელსაწყოები",
    price: 189,
    oldPrice: 239,
    stock: 18,
    sku: "TM-ING-CD20V-001",
    imageSeed: "ingco-cordless-drill-20v",
    shortDescription: "20V აკუმულატორული დრელი ყოველდღიური მონტაჟისა და სახელოსნოს სამუშაოებისთვის.",
    description:
      "INGCO 20V აკუმულატორული დრელი განკუთვნილია ხის, ლითონისა და მსუბუქი სამონტაჟო სამუშაოებისთვის. მოდელი გამოდგება როგორც სახლის ოსტატისთვის, ისე პროფესიონალური ბრიგადისთვის.",
    rating: 4.8,
    reviewCount: 64,
    features: [
      "20V Li-ion აკუმულატორის პლატფორმა",
      "რეგულირებადი ბრუნვის მომენტი",
      "LED განათება სამუშაო ზონისთვის",
      "კომპაქტური კორპუსი და კომფორტული სახელური"
    ],
    specifications: {
      ბრენდი: "INGCO",
      მოდელი: "CDLI2002",
      ძაბვა: "20V",
      ბატარეა: "Li-ion",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "crown-rotary-hammer-850w",
    slug: "crown-perforatori-850w",
    name: "CROWN პერფორატორი 850W",
    brand: "CROWN",
    category: "ხელსაწყოები",
    price: 259,
    oldPrice: 319,
    stock: 7,
    sku: "TM-CRN-RH850-002",
    imageSeed: "crown-rotary-hammer-850w",
    shortDescription: "მძლავრი პერფორატორი ბეტონისა და ქვის სამუშაოებისთვის.",
    description:
      "CROWN 850W პერფორატორი შექმნილია სამშენებლო და სარემონტო პროცესებისთვის, სადაც საჭიროა სტაბილური დარტყმა, ძლიერი ძრავი და საიმედო კორპუსი.",
    rating: 4.7,
    reviewCount: 42,
    features: [
      "850W ძრავი მძიმე დატვირთვისთვის",
      "სამუშაო რეჟიმების სწრაფი შეცვლა",
      "დამხმარე სახელური უკეთესი კონტროლისთვის",
      "SDS-plus ტიპის სამაგრი"
    ],
    specifications: {
      ბრენდი: "CROWN",
      სიმძლავრე: "850W",
      ტიპი: "პერფორატორი",
      სამაგრი: "SDS-plus",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "wadfow-compact-drill-650w",
    slug: "wadfow-kompaqturi-burghi-650w",
    name: "WADFOW კომპაქტური ბურღი 650W",
    brand: "WADFOW",
    category: "ხელსაწყოები",
    price: 89,
    oldPrice: 109,
    stock: 15,
    sku: "TM-WAD-DR650-003",
    imageSeed: "wadfow-compact-drill-650w",
    shortDescription: "მსუბუქი ელექტრო ბურღი სახლისა და მცირე სახელოსნოსთვის.",
    description:
      "WADFOW 650W ბურღი არის პრაქტიკული არჩევანი სწრაფი ხვრეტისა და მსუბუქი მონტაჟისთვის. დაბალანსებული კორპუსი ხელს უწყობს კომფორტულ მუშაობას.",
    rating: 4.5,
    reviewCount: 28,
    features: [
      "650W სიმძლავრე",
      "სიჩქარის მარტივი რეგულირება",
      "მსუბუქი და მოსახერხებელი კორპუსი",
      "ხისა და ლითონისთვის შესაბამისი რეჟიმები"
    ],
    specifications: {
      ბრენდი: "WADFOW",
      სიმძლავრე: "650W",
      კვება: "220-240V",
      გამოყენება: "ხე, ლითონი",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "tolsen-hand-tool-kit-45pcs",
    slug: "tolsen-khelis-instrumentebis-nakrebi-45",
    name: "TOLSEN ხელის ინსტრუმენტების ნაკრები 45 ც",
    brand: "TOLSEN",
    category: "ხელსაწყოები",
    price: 149,
    oldPrice: 179,
    stock: 22,
    sku: "TM-TOL-HK45-004",
    imageSeed: "tolsen-hand-tool-kit-45pcs",
    shortDescription: "საბაზისო ხელის ინსტრუმენტების ნაკრები სახლში და სახელოსნოში გამოსაყენებლად.",
    description:
      "TOLSEN 45-ნაწილიანი ნაკრები აერთიანებს ყველაზე ხშირად საჭირო ხელის ინსტრუმენტებს. გამოდგება მონტაჟის, მცირე რემონტისა და ყოველდღიური სამუშაოებისთვის.",
    rating: 4.9,
    reviewCount: 76,
    features: [
      "45 ერთეული ერთ კომპლექტში",
      "მყარი შესანახი ქეისი",
      "ქრომირებული სამუშაო ზედაპირები",
      "საწყისი და პროფესიონალური გამოყენება"
    ],
    specifications: {
      ბრენდი: "TOLSEN",
      კომპლექტაცია: "45 ცალი",
      მასალა: "Cr-V ფოლადი",
      ქეისი: "დიახ",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "total-screwdriver-set-32pcs",
    slug: "total-sakhrakhnisebis-nakrebi-32",
    name: "TOTAL სახრახნისების ნაკრები 32 ც",
    brand: "TOTAL",
    category: "ხელსაწყოები",
    price: 39,
    oldPrice: 52,
    stock: 35,
    sku: "TM-TOT-SD32-005",
    imageSeed: "total-screwdriver-set-32pcs",
    shortDescription: "კომპაქტური სახრახნისების ნაკრები ტექნიკური და საყოფაცხოვრებო სამუშაოებისთვის.",
    description:
      "TOTAL 32-ნაწილიანი სახრახნისების ნაკრები იდეალურია ავეჯის აწყობისთვის, ელექტრო მოწყობილობების მოვლისთვის და წვრილი სამონტაჟო სამუშაოებისთვის.",
    rating: 4.6,
    reviewCount: 53,
    features: [
      "32 განსხვავებული თავი",
      "მაგნიტური დამჭერი",
      "კომპაქტური შესანახი ქეისი",
      "ზუსტი სამუშაოებისთვის შესაფერისი"
    ],
    specifications: {
      ბრენდი: "TOTAL",
      რაოდენობა: "32 ცალი",
      მასალა: "Cr-V",
      ქეისი: "დიახ",
      დანიშნულება: "მონტაჟი და რემონტი"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "ingco-led-work-light-30w",
    slug: "ingco-led-samushao-ganateba-30w",
    name: "INGCO LED სამუშაო განათება 30W",
    brand: "INGCO",
    category: "ელექტრობა და განათება",
    price: 58,
    stock: 31,
    sku: "TM-ING-LED30-006",
    imageSeed: "ingco-led-work-light-30w",
    shortDescription: "პორტატული LED განათება სარემონტო და სახელოსნო სამუშაოებისთვის.",
    description:
      "INGCO LED 30W სამუშაო განათება უზრუნველყოფს ნათელ და თანაბარ სინათლეს სამუშაო სივრცეში. კორპუსი გამძლეა და მარტივად თავსდება სხვადასხვა პოზიციაში.",
    rating: 4.7,
    reviewCount: 36,
    features: [
      "30W ეკონომიური LED მოდული",
      "კომპაქტური და მობილური კორპუსი",
      "ფართო განათების კუთხე",
      "სახელოსნოსა და ობიექტისთვის"
    ],
    specifications: {
      ბრენდი: "INGCO",
      სიმძლავრე: "30W",
      ტიპი: "LED სამუშაო განათება",
      კვება: "220V",
      ფერი: "ცივი თეთრი"
    },
    isFeatured: true,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "total-cable-reel-25m",
    slug: "total-eleqtro-kabelis-doli-25m",
    name: "TOTAL ელექტრო კაბელის დოლი 25მ",
    brand: "TOTAL",
    category: "ელექტრობა და განათება",
    price: 119,
    oldPrice: 145,
    stock: 12,
    sku: "TM-TOT-CR25-007",
    imageSeed: "total-cable-reel-25m",
    shortDescription: "25 მეტრიანი კაბელის დოლი სამუშაო სივრცის მოქნილი ელექტრომომარაგებისთვის.",
    description:
      "TOTAL კაბელის დოლი განკუთვნილია სამშენებლო ობიექტებზე, ეზოში და სახელოსნოში უსაფრთხო ელექტრომომარაგებისთვის. აქვს გამძლე კორპუსი და მარტივი გადახვევა.",
    rating: 4.8,
    reviewCount: 41,
    features: [
      "25მ კაბელი",
      "გადახვევის მოსახერხებელი მექანიზმი",
      "გამძლე ჩარჩო",
      "სამუშაო ობიექტებისთვის შესაფერისი"
    ],
    specifications: {
      ბრენდი: "TOTAL",
      სიგრძე: "25მ",
      ძაბვა: "220-240V",
      ტიპი: "კაბელის დოლი",
      დაცვა: "სტანდარტული"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "hogert-led-flashlight",
    slug: "hogert-led-fanari",
    name: "HOGERT LED ფანარი",
    brand: "HOGERT",
    category: "ელექტრობა და განათება",
    price: 34,
    stock: 46,
    sku: "TM-HOG-FL01-008",
    imageSeed: "hogert-led-flashlight",
    shortDescription: "გამძლე LED ფანარი სამუშაოდ, ავტომობილში და ყოველდღიური გამოყენებისთვის.",
    description:
      "HOGERT LED ფანარი გამოირჩევა ძლიერი სინათლით, კომფორტული დაჭერით და გამძლე კორპუსით. იდეალურია ტექნიკური მომსახურებისა და ღამის სამუშაოებისთვის.",
    rating: 4.4,
    reviewCount: 19,
    features: [
      "ძლიერი LED ნათება",
      "კომპაქტური ზომა",
      "გამძლე კორპუსი",
      "ეკონომიური ენერგომოხმარება"
    ],
    specifications: {
      ბრენდი: "HOGERT",
      ტიპი: "LED ფანარი",
      კვება: "ბატარეა",
      რეჟიმები: "2",
      გამოყენება: "სამუშაო და ყოველდღიური"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "topfine-switch-socket-set",
    slug: "topfine-chamrtveli-da-rozetis-nakrebi",
    name: "TOPFINE ჩამრთველი და როზეტის ნაკრები",
    brand: "TOPFINE",
    category: "ელექტრობა და განათება",
    price: 22.5,
    oldPrice: 29,
    stock: 68,
    sku: "TM-TOP-SW02-009",
    imageSeed: "topfine-switch-socket-set",
    shortDescription: "სუფთა დიზაინის ჩამრთველი და როზეტი საცხოვრებელი და კომერციული სივრცისთვის.",
    description:
      "TOPFINE ელექტრო აქსესუარების ნაკრები შექმნილია სწრაფი მონტაჟისთვის და სუფთა ინტერიერული იერისთვის. მასალა გამძლეა ყოველდღიური გამოყენებისას.",
    rating: 4.3,
    reviewCount: 22,
    features: [
      "თანამედროვე თეთრი დიზაინი",
      "მარტივი მონტაჟი",
      "გამძლე პლასტიკი",
      "საცხოვრებელი და საოფისე სივრცისთვის"
    ],
    specifications: {
      ბრენდი: "TOPFINE",
      ტიპი: "ჩამრთველი და როზეტი",
      ფერი: "თეთრი",
      ძაბვა: "220V",
      მონტაჟი: "შიდა"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "wadfow-extension-cord-5m",
    slug: "wadfow-damagrdzelebeli-5m",
    name: "WADFOW დამაგრძელებელი 5მ",
    brand: "WADFOW",
    category: "ელექტრობა და განათება",
    price: 24,
    stock: 54,
    sku: "TM-WAD-EXT5-010",
    imageSeed: "wadfow-extension-cord-5m",
    shortDescription: "5 მეტრიანი დამაგრძელებელი ყოველდღიური ელექტრო სამუშაოებისთვის.",
    description:
      "WADFOW დამაგრძელებელი გამოდგება სახლში, ოფისში და მსუბუქ სამუშაო სივრცეში. კაბელი მოქნილია, ხოლო ბუდეები განკუთვნილია სტაბილური გამოყენებისთვის.",
    rating: 4.5,
    reviewCount: 31,
    features: [
      "5მ კაბელი",
      "მრავალბუდიანი კონსტრუქცია",
      "მოქნილი კაბელი",
      "ყოველდღიური გამოყენება"
    ],
    specifications: {
      ბრენდი: "WADFOW",
      სიგრძე: "5მ",
      ტიპი: "დამაგრძელებელი",
      ძაბვა: "220V",
      გამოყენება: "საყოფაცხოვრებო"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "crown-construction-mixer-1400w",
    slug: "crown-samsheneblo-mikseri-1400w",
    name: "CROWN სამშენებლო მიქსერი 1400W",
    brand: "CROWN",
    category: "სამშენებლო მასალები",
    price: 329,
    oldPrice: 389,
    stock: 6,
    sku: "TM-CRN-MIX1400-011",
    imageSeed: "crown-construction-mixer-1400w",
    shortDescription: "მძლავრი მიქსერი საღებავის, წებოსა და ნარევების მოსამზადებლად.",
    description:
      "CROWN სამშენებლო მიქსერი განკუთვნილია სქელი ნარევების, წებოების და საღებავების თანაბრად მოსამზადებლად. ძლიერი ძრავი უზრუნველყოფს სტაბილურ მუშაობას.",
    rating: 4.7,
    reviewCount: 27,
    features: [
      "1400W სიმძლავრე",
      "ორი სახელური კონტროლისთვის",
      "სიჩქარის რეგულირება",
      "მძიმე ნარევებისთვის"
    ],
    specifications: {
      ბრენდი: "CROWN",
      სიმძლავრე: "1400W",
      ტიპი: "სამშენებლო მიქსერი",
      კვება: "220V",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "tolsen-tile-cutter-600mm",
    slug: "tolsen-filis-sachreli-600mm",
    name: "TOLSEN ფილის საჭრელი 600მმ",
    brand: "TOLSEN",
    category: "სამშენებლო მასალები",
    price: 215,
    stock: 9,
    sku: "TM-TOL-TC600-012",
    imageSeed: "tolsen-tile-cutter-600mm",
    shortDescription: "600მმ ფილის საჭრელი კერამიკული და კაფელის სამუშაოებისთვის.",
    description:
      "TOLSEN ფილის საჭრელი ეხმარება ხელოსანს სუფთა და ზუსტი ჭრის მიღებაში. გამოდგება კერამიკული ფილებისა და კაფელის მონტაჟის პროცესში.",
    rating: 4.6,
    reviewCount: 18,
    features: [
      "600მმ ჭრის სიგრძე",
      "მყარი ბაზა",
      "ზუსტი საჭრელი მექანიზმი",
      "კაფელის სამუშაოებისთვის"
    ],
    specifications: {
      ბრენდი: "TOLSEN",
      სიგრძე: "600მმ",
      ტიპი: "ფილის საჭრელი",
      გამოყენება: "კერამიკული ფილა",
      გარანტია: "12 თვე"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "decakila-silicone-sealant",
    slug: "decakila-silikonis-hermetik-i",
    name: "DECAKILA სილიკონის ჰერმეტიკი",
    brand: "DECAKILA",
    category: "სამშენებლო მასალები",
    price: 12.9,
    oldPrice: 16,
    stock: 80,
    sku: "TM-DEC-SIL300-013",
    imageSeed: "decakila-silicone-sealant",
    shortDescription: "უნივერსალური სილიკონის ჰერმეტიკი სველი და მშრალი სივრცეებისთვის.",
    description:
      "DECAKILA სილიკონის ჰერმეტიკი გამოიყენება ნაპრალების, კუთხეების და შეერთებების დასამუშავებლად. მას აქვს კარგი ელასტიურობა და მდგრადობა.",
    rating: 4.4,
    reviewCount: 35,
    features: [
      "ელასტიური მასა",
      "შიდა და გარე გამოყენება",
      "კარგი მიერთება ზედაპირთან",
      "სწრაფი გამოყენება სტანდარტული პისტოლეტით"
    ],
    specifications: {
      ბრენდი: "DECAKILA",
      მოცულობა: "300მლ",
      ტიპი: "სილიკონის ჰერმეტიკი",
      ფერი: "გამჭვირვალე",
      გამოყენება: "შიდა და გარე"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "decakila-ceramic-adhesive",
    slug: "decakila-keramikuli-filis-tsebo",
    name: "DECAKILA კერამიკული ფილის წებო",
    brand: "DECAKILA",
    category: "სამშენებლო მასალები",
    price: 28,
    stock: 44,
    sku: "TM-DEC-ADH25-014",
    imageSeed: "decakila-ceramic-adhesive",
    shortDescription: "ფილის წებო კერამიკული და კაფელის მონტაჟისთვის.",
    description:
      "DECAKILA ფილის წებო განკუთვნილია კერამიკული ფილების დასამაგრებლად. სტაბილური შემადგენლობა ხელს უწყობს საიმედო მიბმას და გრძელვადიან შედეგს.",
    rating: 4.5,
    reviewCount: 20,
    features: [
      "სტაბილური მიბმა",
      "კერამიკული ფილებისთვის",
      "მარტივი მომზადება",
      "სარემონტო და სამშენებლო სამუშაოებისთვის"
    ],
    specifications: {
      ბრენდი: "DECAKILA",
      წონა: "25კგ",
      ტიპი: "ფილის წებო",
      გამოყენება: "კერამიკა",
      შენახვა: "მშრალ ადგილას"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "topfine-wall-primer-5l",
    slug: "topfine-kedlis-grunti-5l",
    name: "TOPFINE კედლის გრუნტი 5ლ",
    brand: "TOPFINE",
    category: "სამშენებლო მასალები",
    price: 31,
    stock: 38,
    sku: "TM-TOP-PR5L-015",
    imageSeed: "topfine-wall-primer-5l",
    shortDescription: "გრუნტი კედლის მოსამზადებლად შეღებვამდე ან შპალერის გაკვრამდე.",
    description:
      "TOPFINE კედლის გრუნტი აუმჯობესებს ზედაპირის მომზადებას, ამცირებს შეწოვას და ხელს უწყობს საბოლოო საფარის თანაბარ გადანაწილებას.",
    rating: 4.3,
    reviewCount: 16,
    features: [
      "ზედაპირის გამყარება",
      "შეღებვამდე მოსამზადებლად",
      "5ლ მოცულობა",
      "შიდა სამუშაოებისთვის"
    ],
    specifications: {
      ბრენდი: "TOPFINE",
      მოცულობა: "5ლ",
      ტიპი: "გრუნტი",
      გამოყენება: "კედელი",
      ფერი: "თეთრი"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "tolsen-screw-assortment-300pcs",
    slug: "tolsen-shurupis-nakrebi-300",
    name: "TOLSEN შურუპების ნაკრები 300 ც",
    brand: "TOLSEN",
    category: "სამაგრები",
    price: 19.9,
    oldPrice: 26,
    stock: 64,
    sku: "TM-TOL-SCR300-016",
    imageSeed: "tolsen-screw-assortment-300pcs",
    shortDescription: "სხვადასხვა ზომის შურუპების ნაკრები მონტაჟისა და რემონტისთვის.",
    description:
      "TOLSEN 300-ცალიანი ნაკრები მოიცავს ხშირად გამოყენებად შურუპებს, რაც ამარტივებს მცირე და საშუალო სამუშაოების შესრულებას.",
    rating: 4.6,
    reviewCount: 47,
    features: [
      "300 ცალი ერთ ყუთში",
      "სხვადასხვა ზომა",
      "მყარი შესანახი კოლოფი",
      "ხის და ზოგადი მონტაჟისთვის"
    ],
    specifications: {
      ბრენდი: "TOLSEN",
      რაოდენობა: "300 ც",
      ტიპი: "შურუპების ნაკრები",
      მასალა: "ფოლადი",
      შეფუთვა: "ორგანაიზერი"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "hogert-wall-plugs-200pcs",
    slug: "hogert-dubelis-nakrebi-200",
    name: "HOGERT დუბელების ნაკრები 200 ც",
    brand: "HOGERT",
    category: "სამაგრები",
    price: 18.5,
    stock: 52,
    sku: "TM-HOG-DWL200-017",
    imageSeed: "hogert-wall-plugs-200pcs",
    shortDescription: "დუბელების ნაკრები კედლის და ჭერის სამაგრი სამუშაოებისთვის.",
    description:
      "HOGERT დუბელების ნაკრები განკუთვნილია მსუბუქი და საშუალო დატვირთვის დასამაგრებლად. ორგანიზებული შეფუთვა ამარტივებს საჭირო ზომის შერჩევას.",
    rating: 4.4,
    reviewCount: 25,
    features: [
      "200 ცალი ნაკრებში",
      "სხვადასხვა დიამეტრი",
      "სწრაფი შერჩევის ყუთი",
      "კედლისა და ჭერისთვის"
    ],
    specifications: {
      ბრენდი: "HOGERT",
      რაოდენობა: "200 ც",
      ტიპი: "დუბელი",
      მასალა: "ნეილონი",
      შეფუთვა: "ორგანაიზერი"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "crown-anchor-bolts-m10",
    slug: "crown-ankeruli-boltebi-m10",
    name: "CROWN ანკერული ბოლტები M10",
    brand: "CROWN",
    category: "სამაგრები",
    price: 21,
    stock: 40,
    sku: "TM-CRN-ANKM10-018",
    imageSeed: "crown-anchor-bolts-m10",
    shortDescription: "M10 ანკერული ბოლტები მყარი სამაგრი სამუშაოებისთვის.",
    description:
      "CROWN M10 ანკერები გამოიყენება მძიმე დეტალების ბეტონსა და მყარ ზედაპირზე დასამაგრებლად. პროდუქტი გამოდგება სამშენებლო და ტექნიკური სამუშაოებისთვის.",
    rating: 4.6,
    reviewCount: 21,
    features: [
      "M10 ზომა",
      "მყარი ფოლადის კონსტრუქცია",
      "ბეტონში დასამაგრებლად",
      "საშუალო და მძიმე დატვირთვისთვის"
    ],
    specifications: {
      ბრენდი: "CROWN",
      ზომა: "M10",
      ტიპი: "ანკერული ბოლტი",
      მასალა: "ფოლადი",
      გამოყენება: "ბეტონი"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "total-drywall-screws-1000pcs",
    slug: "total-gipsokardonis-shurupi-1000",
    name: "TOTAL გიფსოკარდონის შურუპი 1000 ც",
    brand: "TOTAL",
    category: "სამაგრები",
    price: 34,
    oldPrice: 42,
    stock: 27,
    sku: "TM-TOT-DWS1000-019",
    imageSeed: "total-drywall-screws-1000pcs",
    shortDescription: "გიფსოკარდონის შურუპები სარემონტო და მშრალი მშენებლობისთვის.",
    description:
      "TOTAL გიფსოკარდონის შურუპები განკუთვნილია პროფილებსა და ფურცლებთან სამუშაოდ. დიდი შეფუთვა ხელსაყრელია ობიექტისა და ბრიგადებისთვის.",
    rating: 4.5,
    reviewCount: 32,
    features: [
      "1000 ცალი შეფუთვაში",
      "გიფსოკარდონისთვის",
      "თანაბარი ხრახნი",
      "სამშენებლო ობიექტებისთვის"
    ],
    specifications: {
      ბრენდი: "TOTAL",
      რაოდენობა: "1000 ც",
      ტიპი: "გიფსოკარდონის შურუპი",
      ფერი: "შავი",
      გამოყენება: "მშრალი მშენებლობა"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "topfine-cable-ties-200pcs",
    slug: "topfine-kabelis-samagrebi-200",
    name: "TOPFINE კაბელის სამაგრები 200 ც",
    brand: "TOPFINE",
    category: "სამაგრები",
    price: 11.5,
    stock: 90,
    sku: "TM-TOP-CT200-020",
    imageSeed: "topfine-cable-ties-200pcs",
    shortDescription: "კაბელის პლასტმასის სამაგრები ელექტრო და საორგანიზაციო სამუშაოებისთვის.",
    description:
      "INGCO კაბელის სამაგრები გამოიყენება კაბელების, მილების და მსუბუქი დეტალების სწრაფად დასაფიქსირებლად. შეფუთვაში არის 200 ცალი.",
    rating: 4.4,
    reviewCount: 29,
    features: [
      "200 ცალი შეფუთვაში",
      "მტკიცე პლასტმასა",
      "კაბელების ორგანიზებისთვის",
      "სწრაფი გამოყენება"
    ],
    specifications: {
      ბრენდი: "TOPFINE",
      რაოდენობა: "200 ც",
      ტიპი: "კაბელის სამაგრი",
      მასალა: "პლასტმასა",
      ფერი: "შავი"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "topfine-pvc-tape-black",
    slug: "topfine-pvc-izolenta-shavi",
    name: "TOPFINE PVC იზოლენტა შავი",
    brand: "TOPFINE",
    category: "იზოლენტები",
    price: 4.9,
    stock: 120,
    sku: "TM-TOP-PVCT-021",
    imageSeed: "topfine-pvc-tape-black",
    shortDescription: "შავი PVC იზოლენტა ელექტრო კავშირებისა და ყოველდღიური გამოყენებისთვის.",
    description:
      "TOPFINE PVC იზოლენტა გამოიყენება ელექტრო კავშირების დასაცავად, საკაბელო სამუშაოებში და მცირე სარემონტო ამოცანებში.",
    rating: 4.5,
    reviewCount: 58,
    features: [
      "მოქნილი PVC მასალა",
      "კარგი წებვადობა",
      "ელექტრო სამუშაოებისთვის",
      "შავი ფერი"
    ],
    specifications: {
      ბრენდი: "TOPFINE",
      ტიპი: "PVC იზოლენტა",
      ფერი: "შავი",
      სიგანე: "19მმ",
      სიგრძე: "20მ"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "total-insulation-tape-red",
    slug: "total-izolenta-tsiteli",
    name: "TOTAL იზოლენტა წითელი",
    brand: "TOTAL",
    category: "იზოლენტები",
    price: 5.5,
    stock: 74,
    sku: "TM-TOT-TAPER-022",
    imageSeed: "total-insulation-tape-red",
    shortDescription: "ფერადი იზოლენტა მარკირებისა და ელექტრო იზოლაციისთვის.",
    description:
      "TOTAL წითელი იზოლენტა გამოიყენება ელექტრო ხაზების მარკირებისთვის, სარემონტო სამუშაოებისა და ორგანიზაციისთვის.",
    rating: 4.2,
    reviewCount: 17,
    features: [
      "წითელი მარკირების ფერი",
      "ელექტრო იზოლაცია",
      "მოქნილი მასალა",
      "კარგი მოჭიდება"
    ],
    specifications: {
      ბრენდი: "TOTAL",
      ტიპი: "იზოლენტა",
      ფერი: "წითელი",
      სიგანე: "19მმ",
      სიგრძე: "20მ"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "wadfow-duct-tape-silver",
    slug: "wadfow-armirebuli-lenta-50mm",
    name: "WADFOW არმირებული ლენტი 50მმ",
    brand: "WADFOW",
    category: "იზოლენტები",
    price: 13.9,
    oldPrice: 18,
    stock: 39,
    sku: "TM-WAD-DUCT50-023",
    imageSeed: "wadfow-duct-tape-silver",
    shortDescription: "ძლიერი არმირებული ლენტი დროებითი ფიქსაციისა და შეკეთებისთვის.",
    description:
      "WADFOW არმირებული ლენტი გამოდგება მილების, შეფუთვების და სხვადასხვა ზედაპირის დროებითი შეკეთებისთვის. მასალა გამძლეა და კარგად ეკვრის.",
    rating: 4.6,
    reviewCount: 34,
    features: [
      "50მმ სიგანე",
      "არმირებული სტრუქტურა",
      "ძლიერი წებვადობა",
      "სარემონტო გამოყენება"
    ],
    specifications: {
      ბრენდი: "WADFOW",
      ტიპი: "არმირებული ლენტი",
      სიგანე: "50მმ",
      ფერი: "ვერცხლისფერი",
      გამოყენება: "შეკეთება"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "hogert-heat-shrink-tubes",
    slug: "hogert-termokumshvadi-milakebi",
    name: "HOGERT თერმოკუმშვადი მილაკები",
    brand: "HOGERT",
    category: "იზოლენტები",
    price: 16,
    stock: 32,
    sku: "TM-HOG-HST01-024",
    imageSeed: "hogert-heat-shrink-tubes",
    shortDescription: "თერმოკუმშვადი მილაკების ნაკრები ელექტრო კავშირების დასაცავად.",
    description:
      "HOGERT თერმოკუმშვადი მილაკები გამოიყენება კაბელებისა და შეერთებების საიმედო იზოლაციისთვის. სხვადასხვა ზომა ამარტივებს საჭირო დიამეტრის შერჩევას.",
    rating: 4.5,
    reviewCount: 23,
    features: [
      "სხვადასხვა დიამეტრი",
      "თერმული შეკუმშვა",
      "კაბელების დასაცავად",
      "ორგანიზებული შეფუთვა"
    ],
    specifications: {
      ბრენდი: "HOGERT",
      ტიპი: "თერმოკუმშვადი მილაკი",
      რაოდენობა: "ნაკრები",
      ფერი: "შერეული",
      გამოყენება: "ელექტრობა"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "decakila-masking-tape-30mm",
    slug: "decakila-saghebis-lenta-30mm",
    name: "DECAKILA საღებავის ლენტი 30მმ",
    brand: "DECAKILA",
    category: "იზოლენტები",
    price: 7.5,
    stock: 66,
    sku: "TM-DEC-MT30-025",
    imageSeed: "decakila-masking-tape-30mm",
    shortDescription: "საღებავის ლენტი სუფთა ხაზებისა და ზედაპირის დასაცავად.",
    description:
      "INGCO საღებავის ლენტი გამოიყენება კედლების, კუთხეების და დეტალების დასაცავად შეღებვისას. მარტივად იხსნება და ამცირებს ლაქების რისკს.",
    rating: 4.3,
    reviewCount: 26,
    features: [
      "30მმ სიგანე",
      "სუფთა მოხსნა",
      "შეღებვისთვის",
      "კედლისა და დეტალებისთვის"
    ],
    specifications: {
      ბრენდი: "DECAKILA",
      ტიპი: "საღებავის ლენტი",
      სიგანე: "30მმ",
      ფერი: "ყვითელი",
      გამოყენება: "შეღებვა"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "hogert-work-gloves",
    slug: "hogert-samushao-kheltatmanebi",
    name: "HOGERT სამუშაო ხელთათმანები",
    brand: "HOGERT",
    category: "უსაფრთხოება",
    price: 14.5,
    oldPrice: 19,
    stock: 83,
    sku: "TM-HOG-GLV01-026",
    imageSeed: "hogert-work-gloves",
    shortDescription: "გამძლე სამუშაო ხელთათმანები მონტაჟისა და სამშენებლო პროცესებისთვის.",
    description:
      "HOGERT სამუშაო ხელთათმანები იცავს ხელებს მსუბუქი მექანიკური დაზიანებისგან და უზრუნველყოფს კომფორტულ მოჭიდებას სხვადასხვა სამუშაოს შესრულებისას.",
    rating: 4.8,
    reviewCount: 71,
    features: [
      "მოცურების საწინააღმდეგო ზედაპირი",
      "გამძლე ქსოვილი",
      "კომფორტული მორგება",
      "სამშენებლო და სახელოსნო სამუშაოებისთვის"
    ],
    specifications: {
      ბრენდი: "HOGERT",
      ტიპი: "სამუშაო ხელთათმანი",
      ზომა: "L",
      მასალა: "ქსოვილი და რეზინი",
      გამოყენება: "უსაფრთხოება"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "tolsen-safety-goggles",
    slug: "tolsen-damtsavi-satvale",
    name: "TOLSEN დამცავი სათვალე",
    brand: "TOLSEN",
    category: "უსაფრთხოება",
    price: 12,
    stock: 57,
    sku: "TM-TOL-GOG01-027",
    imageSeed: "tolsen-safety-goggles",
    shortDescription: "დამცავი სათვალე ჭრის, ხვრეტისა და მტვრიანი სამუშაოებისთვის.",
    description:
      "TOLSEN დამცავი სათვალე უზრუნველყოფს თვალის დაცვას ნაწილაკებისგან. გამჭვირვალე ლინზა სამუშაო სივრცის კარგ ხილვადობას ინარჩუნებს.",
    rating: 4.5,
    reviewCount: 38,
    features: [
      "გამჭვირვალე ლინზა",
      "მსუბუქი კონსტრუქცია",
      "კომფორტული მორგება",
      "სახელოსნო და სამშენებლო გამოყენება"
    ],
    specifications: {
      ბრენდი: "TOLSEN",
      ტიპი: "დამცავი სათვალე",
      ლინზა: "გამჭვირვალე",
      გამოყენება: "თვალის დაცვა",
      სტანდარტი: "სამუშაო"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "crown-respirator-mask",
    slug: "crown-damtsavi-respiratori",
    name: "CROWN დამცავი რესპირატორი",
    brand: "CROWN",
    category: "უსაფრთხოება",
    price: 26,
    stock: 24,
    sku: "TM-CRN-RSP01-028",
    imageSeed: "crown-respirator-mask",
    shortDescription: "რესპირატორი მტვრისა და მსუბუქი სამშენებლო ნაწილაკებისგან დასაცავად.",
    description:
      "CROWN რესპირატორი განკუთვნილია სარემონტო და სამშენებლო გარემოში სუნთქვის დაცვისთვის. კომფორტული ფორმა ხელს უწყობს ხანგრძლივ გამოყენებას.",
    rating: 4.4,
    reviewCount: 20,
    features: [
      "მტვრისგან დაცვა",
      "რეგულირებადი სამაგრები",
      "კომფორტული ფორმა",
      "სამშენებლო სამუშაოებისთვის"
    ],
    specifications: {
      ბრენდი: "CROWN",
      ტიპი: "რესპირატორი",
      გამოყენება: "მტვრისგან დაცვა",
      ზომა: "უნივერსალური",
      კატეგორია: "უსაფრთხოება"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "ingco-welding-mask",
    slug: "ingco-shedughebis-nighabi",
    name: "INGCO შედუღების ნიღაბი",
    brand: "INGCO",
    category: "უსაფრთხოება",
    price: 69,
    oldPrice: 89,
    stock: 11,
    sku: "TM-ING-WM01-029",
    imageSeed: "ingco-welding-mask",
    shortDescription: "შედუღების ნიღაბი თვალისა და სახის დასაცავად.",
    description:
      "INGCO შედუღების ნიღაბი იცავს სახეს ნაპერწკლებისა და ძლიერი ნათებისგან. რეგულირებადი სამაგრი კომფორტულ მორგებას უზრუნველყოფს.",
    rating: 4.7,
    reviewCount: 44,
    features: [
      "სახისა და თვალის დაცვა",
      "რეგულირებადი თავსამაგრი",
      "შედუღებისთვის განკუთვნილი",
      "გამძლე კორპუსი"
    ],
    specifications: {
      ბრენდი: "INGCO",
      ტიპი: "შედუღების ნიღაბი",
      გამოყენება: "შედუღება",
      რეგულირება: "დიახ",
      გარანტია: "12 თვე"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "total-safety-helmet",
    slug: "total-damtsavi-chabukhi",
    name: "TOTAL დამცავი ჩაფხუტი",
    brand: "TOTAL",
    category: "უსაფრთხოება",
    price: 29,
    stock: 33,
    sku: "TM-TOT-HLM01-030",
    imageSeed: "total-safety-helmet",
    shortDescription: "დამცავი ჩაფხუტი სამშენებლო და ტექნიკური სამუშაოებისთვის.",
    description:
      "TOTAL დამცავი ჩაფხუტი განკუთვნილია სამშენებლო ობიექტებზე თავის დაცვისთვის. მსუბუქი კორპუსი კომფორტულია ყოველდღიური გამოყენებისას.",
    rating: 4.5,
    reviewCount: 30,
    features: [
      "მსუბუქი კორპუსი",
      "რეგულირებადი ზომა",
      "სამშენებლო ობიექტისთვის",
      "ნათელი ფერი ხილვადობისთვის"
    ],
    specifications: {
      ბრენდი: "TOTAL",
      ტიპი: "დამცავი ჩაფხუტი",
      ფერი: "ყვითელი",
      ზომა: "რეგულირებადი",
      გამოყენება: "სამშენებლო"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "wadfow-grass-trimmer",
    slug: "wadfow-balakhis-satibi",
    name: "WADFOW ბალახის სათიბი",
    brand: "WADFOW",
    category: "ბაღი და ეზო",
    price: 199,
    oldPrice: 249,
    stock: 8,
    sku: "TM-WAD-GT01-031",
    imageSeed: "wadfow-grass-trimmer",
    shortDescription: "ბალახის სათიბი ეზოს მოვლისა და მსუბუქი ლანდშაფტური სამუშაოებისთვის.",
    description:
      "WADFOW ბალახის სათიბი ეხმარება მომხმარებელს ეზოს მოწესრიგებაში. მსუბუქი კორპუსი და მარტივი მართვა კომფორტულ გამოყენებას უზრუნველყოფს.",
    rating: 4.6,
    reviewCount: 27,
    features: [
      "მარტივი მართვა",
      "მსუბუქი კონსტრუქცია",
      "ეზოს მოვლისთვის",
      "მოსახერხებელი სახელური"
    ],
    specifications: {
      ბრენდი: "WADFOW",
      ტიპი: "ბალახის სათიბი",
      კვება: "ელექტრო",
      გამოყენება: "ეზო",
      გარანტია: "12 თვე"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "ingco-garden-pruner",
    slug: "ingco-baghis-sekatori",
    name: "INGCO ბაღის სეკატორი",
    brand: "INGCO",
    category: "ბაღი და ეზო",
    price: 24,
    stock: 51,
    sku: "TM-ING-PRN01-032",
    imageSeed: "ingco-garden-pruner",
    shortDescription: "სეკატორი ტოტების ჭრისა და ბაღის მოვლისთვის.",
    description:
      "INGCO ბაღის სეკატორი განკუთვნილია ტოტების სუფთა ჭრისთვის. გამძლე პირი და კომფორტული სახელური ამარტივებს ბაღის ყოველდღიურ მოვლას.",
    rating: 4.5,
    reviewCount: 33,
    features: [
      "ბასრი პირი",
      "კომფორტული სახელური",
      "ტოტების სუფთა ჭრა",
      "ბაღისა და ეზოსთვის"
    ],
    specifications: {
      ბრენდი: "INGCO",
      ტიპი: "სეკატორი",
      მასალა: "ფოლადი",
      გამოყენება: "ბაღი",
      ზომა: "სტანდარტული"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "tolsen-garden-hose-20m",
    slug: "tolsen-baghis-shlangi-20m",
    name: "TOLSEN ბაღის შლანგი 20მ",
    brand: "TOLSEN",
    category: "ბაღი და ეზო",
    price: 49,
    stock: 29,
    sku: "TM-TOL-HOSE20-033",
    imageSeed: "tolsen-garden-hose-20m",
    shortDescription: "20 მეტრიანი ბაღის შლანგი ეზოს მორწყვისთვის.",
    description:
      "TOLSEN ბაღის შლანგი გამოდგება ეზოს, ბაღისა და მცირე სასოფლო სივრცის მორწყვისთვის. მოქნილი მასალა ამარტივებს გამოყენებას.",
    rating: 4.4,
    reviewCount: 24,
    features: [
      "20მ სიგრძე",
      "მოქნილი მასალა",
      "მორწყვისთვის",
      "ეზოს მოვლისთვის"
    ],
    specifications: {
      ბრენდი: "TOLSEN",
      სიგრძე: "20მ",
      ტიპი: "ბაღის შლანგი",
      გამოყენება: "მორწყვა",
      ფერი: "მწვანე"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "decakila-pressure-sprayer-5l",
    slug: "decakila-safrqvevi-5l",
    name: "DECAKILA ბაღის საფრქვევი 5ლ",
    brand: "DECAKILA",
    category: "ბაღი და ეზო",
    price: 36,
    oldPrice: 45,
    stock: 17,
    sku: "TM-DEC-SPR5-034",
    imageSeed: "decakila-pressure-sprayer-5l",
    shortDescription: "5ლ საფრქვევი მცენარეების მოვლისა და ბაღის სამუშაოებისთვის.",
    description:
      "DECAKILA საფრქვევი გამოიყენება მცენარეების მოსავლელად, წყლისა და შესაბამისი ხსნარების თანაბრად გასანაწილებლად. აქვს მოსახერხებელი ტუმბო და მხრის ღვედი.",
    rating: 4.6,
    reviewCount: 19,
    features: [
      "5ლ მოცულობა",
      "ხელის ტუმბო",
      "რეგულირებადი საქშენი",
      "მცენარეების მოვლისთვის"
    ],
    specifications: {
      ბრენდი: "DECAKILA",
      მოცულობა: "5ლ",
      ტიპი: "საფრქვევი",
      გამოყენება: "ბაღი",
      საქშენი: "რეგულირებადი"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "topfine-garden-rake",
    slug: "topfine-baghis-fotskhi",
    name: "TOPFINE ბაღის ფოცხი",
    brand: "TOPFINE",
    category: "ბაღი და ეზო",
    price: 18,
    stock: 37,
    sku: "TM-TOP-RAKE01-035",
    imageSeed: "topfine-garden-rake",
    shortDescription: "ბაღის ფოცხი ფოთლებისა და ეზოს დასალაგებლად.",
    description:
      "TOPFINE ბაღის ფოცხი გამოიყენება ფოთლების, ბალახისა და მსუბუქი ნარჩენების მოსაგროვებლად. მსუბუქი კონსტრუქცია კომფორტულ მუშაობას უზრუნველყოფს.",
    rating: 4.2,
    reviewCount: 14,
    features: [
      "მსუბუქი კონსტრუქცია",
      "ეზოს დასუფთავებისთვის",
      "კომფორტული სახელური",
      "ყოველდღიური გამოყენება"
    ],
    specifications: {
      ბრენდი: "TOPFINE",
      ტიპი: "ბაღის ფოცხი",
      გამოყენება: "ეზო",
      მასალა: "მეტალი და პლასტიკი",
      ზომა: "სტანდარტული"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "ingco-drill-bit-set-16pcs",
    slug: "ingco-burghis-pirebis-nakrebi-16",
    name: "INGCO ბურღის პირების ნაკრები 16 ც",
    brand: "INGCO",
    category: "აქსესუარები",
    price: 32,
    oldPrice: 41,
    stock: 43,
    sku: "TM-ING-BIT16-036",
    imageSeed: "ingco-drill-bit-set-16pcs",
    shortDescription: "ბურღის პირების ნაკრები ხის, ლითონისა და კედლის სამუშაოებისთვის.",
    description:
      "INGCO 16-ცალიანი ბურღის პირების ნაკრები მოიცავს პრაქტიკულ ზომებს სხვადასხვა მასალისთვის. კომპლექტი მოთავსებულია მოსახერხებელ ქეისში.",
    rating: 4.7,
    reviewCount: 52,
    features: [
      "16 ცალი ნაკრებში",
      "ხის, ლითონისა და კედლისთვის",
      "კომპაქტური ქეისი",
      "ხშირად გამოყენებადი ზომები"
    ],
    specifications: {
      ბრენდი: "INGCO",
      რაოდენობა: "16 ც",
      ტიპი: "ბურღის პირები",
      მასალა: "HSS და masonry",
      ქეისი: "დიახ"
    },
    isFeatured: true,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "hogert-cutting-discs-125mm",
    slug: "hogert-sachreli-diskebi-125mm",
    name: "HOGERT საჭრელი დისკები 125მმ",
    brand: "HOGERT",
    category: "აქსესუარები",
    price: 15.5,
    stock: 96,
    sku: "TM-HOG-DISC125-037",
    imageSeed: "hogert-cutting-discs-125mm",
    shortDescription: "125მმ საჭრელი დისკები ლითონის სამუშაოებისთვის.",
    description:
      "TOTAL 125მმ საჭრელი დისკები განკუთვნილია კუთხსახეხთან გამოსაყენებლად. დისკები უზრუნველყოფს სწრაფ და სუფთა ჭრას ლითონზე.",
    rating: 4.6,
    reviewCount: 49,
    features: [
      "125მმ დიამეტრი",
      "ლითონის ჭრისთვის",
      "კუთხსახეხთან თავსებადი",
      "სუფთა ჭრის შედეგი"
    ],
    specifications: {
      ბრენდი: "HOGERT",
      დიამეტრი: "125მმ",
      ტიპი: "საჭრელი დისკი",
      გამოყენება: "ლითონი",
      რაოდენობა: "ნაკრები"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  }),
  createProduct({
    id: "crown-sanding-discs-10pcs",
    slug: "crown-saxexi-diskebi-10",
    name: "CROWN სახეხი დისკები 10 ც",
    brand: "CROWN",
    category: "აქსესუარები",
    price: 18,
    stock: 58,
    sku: "TM-CRN-SAND10-038",
    imageSeed: "crown-sanding-discs-10pcs",
    shortDescription: "სახეხი დისკების ნაკრები ზედაპირის მოსამზადებლად.",
    description:
      "CROWN სახეხი დისკები გამოიყენება ხის, ლითონისა და საღებავის ზედაპირების დასამუშავებლად. სხვადასხვა მარცვლოვნება ხელს უწყობს მოქნილ მუშაობას.",
    rating: 4.4,
    reviewCount: 18,
    features: [
      "10 ცალი ნაკრებში",
      "სხვადასხვა მარცვლოვნება",
      "ზედაპირის მოსამზადებლად",
      "კუთხსახეხთან თავსებადი"
    ],
    specifications: {
      ბრენდი: "CROWN",
      რაოდენობა: "10 ც",
      ტიპი: "სახეხი დისკი",
      გამოყენება: "ხე და ლითონი",
      დიამეტრი: "125მმ"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "decakila-organizer-box",
    slug: "decakila-organizeri-samagrerebistvis",
    name: "DECAKILA ორგანიზერი სამაგრებისთვის",
    brand: "DECAKILA",
    category: "აქსესუარები",
    price: 27,
    oldPrice: 34,
    stock: 21,
    sku: "TM-DEC-ORG01-039",
    imageSeed: "decakila-organizer-box",
    shortDescription: "ორგანაიზერი სამაგრების, თავაკებისა და მცირე აქსესუარებისთვის.",
    description:
      "DECAKILA ორგანიზერი ეხმარება ხელოსანს მცირე დეტალების მოწესრიგებაში. გამჭვირვალე თავსახური და განყოფილებები ამარტივებს სწრაფ შერჩევას.",
    rating: 4.5,
    reviewCount: 22,
    features: [
      "მრავალი განყოფილება",
      "გამჭვირვალე თავსახური",
      "სამაგრებისთვის და აქსესუარებისთვის",
      "კომპაქტური ფორმატი"
    ],
    specifications: {
      ბრენდი: "DECAKILA",
      ტიპი: "ორგანაიზერი",
      მასალა: "პლასტიკი",
      განყოფილება: "მრავალი",
      გამოყენება: "შენახვა"
    },
    isFeatured: false,
    isPopular: false,
    isNew: true
  }),
  createProduct({
    id: "wadfow-glue-sticks-12pcs",
    slug: "wadfow-tsheli-tsebos-chkhirebi-12",
    name: "WADFOW ცხელი წებოს ჩხირები 12 ც",
    brand: "WADFOW",
    category: "აქსესუარები",
    price: 9.9,
    stock: 72,
    sku: "TM-WAD-GLUE12-040",
    imageSeed: "wadfow-glue-sticks-12pcs",
    shortDescription: "ცხელი წებოს ჩხირები დეკორისა და მსუბუქი ფიქსაციისთვის.",
    description:
      "WADFOW ცხელი წებოს ჩხირები თავსებადია სტანდარტულ წებოს პისტოლეტებთან და გამოდგება დეკორატიული, საყოფაცხოვრებო და მსუბუქი სარემონტო სამუშაოებისთვის.",
    rating: 4.3,
    reviewCount: 26,
    features: [
      "12 ცალი შეფუთვაში",
      "სტანდარტული დიამეტრი",
      "სწრაფი დნობა",
      "დეკორისა და მსუბუქი ფიქსაციისთვის"
    ],
    specifications: {
      ბრენდი: "WADFOW",
      რაოდენობა: "12 ც",
      ტიპი: "წებოს ჩხირები",
      თავსებადობა: "ცხელი წებოს პისტოლეტი",
      ფერი: "გამჭვირვალე"
    },
    isFeatured: false,
    isPopular: true,
    isNew: false
  })
];

export const productDetails: ProductDetail[] = allProducts;
export const featuredProducts: Product[] = allProducts.filter((product) => product.isFeatured).slice(0, 8);
export const popularProducts: Product[] = allProducts.filter((product) => product.isPopular).slice(0, 8);
export const newArrivalProducts: Product[] = allProducts.filter((product) => product.isNew).slice(0, 8);
export const discountProducts: Product[] = allProducts.filter((product) => product.oldPrice).slice(0, 8);

export function getProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug);
}

export function getSimilarProducts(slug: string) {
  const product = getProductBySlug(slug);

  if (!product) {
    return allProducts.slice(0, 4);
  }

  const candidates = [
    ...allProducts.filter((item) => item.slug !== slug && item.category === product.category),
    ...allProducts.filter((item) => item.slug !== slug && item.brand === product.brand),
    ...allProducts.filter((item) => item.slug !== slug)
  ];

  return Array.from(new Map(candidates.map((item) => [item.id, item])).values()).slice(0, 4);
}

export function getRecentlyViewedProducts(slug: string) {
  return allProducts
    .filter((product) => product.slug !== slug)
    .sort((first, second) => Number(second.isPopular) - Number(first.isPopular))
    .slice(0, 8);
}
