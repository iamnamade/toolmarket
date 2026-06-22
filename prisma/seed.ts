import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed categories.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl
});

const prisma = new PrismaClient({ adapter });

type SubcategorySeed = {
  name: string;
  slug: string;
};

type CategorySeed = {
  name: string;
  slug: string;
  children: SubcategorySeed[];
};

const categories: CategorySeed[] = [
  {
    name: "ხელსაწყოები",
    slug: "tools",
    children: [
      { name: "ჯაჭვური ხერხი", slug: "chain-saws" },
      { name: "პნევმატური ინსტრუმენტები", slug: "pneumatic-tools" },
      { name: "ელექტრო სახრახნისები", slug: "electric-screwdrivers" },
      { name: "მექანიკური ინსტრუმენტები", slug: "mechanical-tools" },
      { name: "ელექტრო ინსტრუმენტების", slug: "electric-tools" },
      { name: "ხელსაწყოების ნაკრები", slug: "tool-kits" },
      { name: "სახრახნისი ინსტრუმენტები", slug: "screwdrivers" },
      { name: "დასარტყამი ინსტრუმენტები", slug: "impact-tools" },
      { name: "სპეციალური ინსტრუმენტები", slug: "special-tools" }
    ]
  },
  {
    name: "ელექტროობა და განათება",
    slug: "electrical-lighting",
    children: [
      { name: "ელექტრო სამონტაჟო ინსტრუმენტები", slug: "electrical-installation-tools" },
      { name: "ტექნიკური ფენები", slug: "heat-guns" }
    ]
  },
  {
    name: "სამშენებლო მასალები",
    slug: "building-materials",
    children: [
      { name: "ხის და ბეტონის დასამუშავებელი ინსტრუმენტები", slug: "wood-concrete-processing" },
      { name: "მეტალის საჭრელი და დასამუშავებელი ინსტრუმენტები", slug: "metal-cutting-processing" }
    ]
  },
  {
    name: "სამაგრები",
    slug: "fasteners-fixings",
    children: [
      { name: "ხის შურუპები", slug: "wood-screws" },
      { name: "რკინის შურუპები", slug: "iron-screws" },
      { name: "დუბელები", slug: "wall-plugs" },
      { name: "დამჭერი ინსტრუმენტები", slug: "clamping-tools" }
    ]
  },
  {
    name: "იზოლანტები",
    slug: "insulators-adhesives",
    children: [
      { name: "წებვადი ლენტები", slug: "adhesive-tapes" },
      { name: "სილიკონები", slug: "silicones" }
    ]
  },
  {
    name: "სანტექნიკა",
    slug: "plumbing",
    children: [
      { name: "სამონტაჟო ინსტრუმენტები და სანტექნიკის აქსესუარები", slug: "plumbing-installation-accessories" }
    ]
  },
  {
    name: "უსაფრთხოება",
    slug: "safety-workwear",
    children: [
      { name: "სპეციალური ტანსაცმელი", slug: "workwear-clothing" }
    ]
  },
  {
    name: "ბაღი და ეზო",
    slug: "garden-yard",
    children: [
      { name: "საბაღე ხელის ინსტრუმენტები", slug: "garden-hand-tools" },
      { name: "ჰაერის შესაფრქვევები", slug: "air-sprayers" },
      { name: "სასოფლო სამეურნეო იარაღები", slug: "agricultural-tools" }
    ]
  },
  {
    name: "შედუღება",
    slug: "welding",
    children: [
      { name: "შედუღებლის ინსტრუმენტები", slug: "welder-tools" },
      { name: "შედუღების აპარატები", slug: "welding-machines" }
    ]
  },
  {
    name: "აქსესუარები და სხვა",
    slug: "accessories-storage",
    children: [
      { name: "ლაზერული მანძილმზომები", slug: "laser-measurers" },
      { name: "სამღებრო ინსტრუმენტები", slug: "painting-tools" },
      { name: "ბორბალი გორგოლაჭი", slug: "caster-wheels" },
      { name: "საჭრელი ინსტრუმენტები", slug: "cutting-tools" },
      { name: "სამღებრო და ქვაზე სამუშაო ინსტრუმენტები", slug: "painting-stone-tools" },
      { name: "ინსტრუმენტების ყუთები და ჩანთები", slug: "tool-boxes-bags" },
      { name: "კიბეები და ურიკები", slug: "ladders-trolleys" },
      { name: "საზომი ერთეულები", slug: "measuring-tools" }
    ]
  }
];

async function main() {
  for (const [categoryIndex, category] of categories.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        parentId: null,
        sortOrder: categoryIndex,
        isActive: true
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: categoryIndex,
        isActive: true
      }
    });

    for (const [subcategoryIndex, subcategory] of category.children.entries()) {
      await prisma.category.upsert({
        where: { slug: subcategory.slug },
        update: {
          name: subcategory.name,
          parentId: parent.id,
          sortOrder: subcategoryIndex,
          isActive: true
        },
        create: {
          name: subcategory.name,
          slug: subcategory.slug,
          parentId: parent.id,
          sortOrder: subcategoryIndex,
          isActive: true
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
