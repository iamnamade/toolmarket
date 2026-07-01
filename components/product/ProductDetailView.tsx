import {
  BadgeCheck,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  Star,
  Truck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DeferredRecentlyViewedProducts } from "@/components/product/DeferredRecentlyViewedProducts";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchaseCard } from "@/components/product/ProductPurchaseCard";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { formatPrice } from "@/lib/price";
import type { Product, ProductAvailability, ProductDetail } from "@/types/catalog";

type ProductDetailViewProps = {
  product: ProductDetail;
  similarProducts: Product[];
  recentlyViewedProducts: Product[];
};

const availabilityConfig: Record<
  ProductAvailability,
  {
    label: string;
    className: string;
  }
> = {
  in_stock: {
    label: "მარაგში",
    className: "bg-[#EAF8EF] text-[#176B45] ring-[#BFE8CD]"
  },
  limited: {
    label: "შეზღუდული რაოდენობა",
    className: "bg-[#FFF4EA] text-[#B95D14] ring-[#FFD8B4]"
  },
  made_to_order: {
    label: "შეკვეთით",
    className: "bg-[#FFF1F1] text-[#C5221F] ring-[#F5C2C0]"
  }
};

const benefits = [
  {
    title: "სწრაფი მიწოდება",
    description: "შეკვეთები მუშავდება სამუშაო საათებში და იგზავნება შეთანხმებული პირობებით.",
    icon: Truck
  },
  {
    title: "ოფიციალური გარანტია",
    description: "პროდუქტებზე მოქმედებს ბრენდისა და მაღაზიის საგარანტიო პირობები.",
    icon: ShieldCheck
  },
  {
    title: "ორიგინალი პროდუქცია",
    description: "კატალოგი აგებულია სანდო ბრენდებისა და პროფესიონალური ხელსაწყოების გარშემო.",
    icon: BadgeCheck
  },
  {
    title: "მხარდაჭერა 24/7",
    description: "კონსულტაცია პროდუქტის შერჩევასა და შეკვეთის პირობებზე.",
    icon: Headphones
  }
];

export function ProductDetailView({
  product,
  similarProducts,
  recentlyViewedProducts
}: ProductDetailViewProps) {
  const availability = availabilityConfig[product.availability];
  const galleryImages = product.images.length ? product.images : [product.image];

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:gap-12">
            <ProductGallery
              title={product.title}
              images={galleryImages}
              discount={product.discount}
            />

            <div className="min-w-0 self-stretch">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#062B4F] px-3 py-1.5 text-xs font-black text-white">
                    {product.brand}
                  </span>
                  <span
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-black ring-1",
                      availability.className
                    ].join(" ")}
                  >
                    {availability.label}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-black leading-tight tracking-normal text-[#041C32] sm:text-4xl lg:text-[42px]">
                  {product.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[#6B7280]">
                  <span>SKU: {product.sku}</span>
                  <span className="hidden h-4 w-px bg-[#DCE3EA] sm:block" />
                  <span>{product.category}</span>
                  <span className="hidden h-4 w-px bg-[#DCE3EA] sm:block" />
                  <span className="inline-flex items-center gap-1 text-[#F58220]">
                    <Star className="size-4 fill-current" />
                    {product.rating.toFixed(1)} / {product.reviewCount} შეფასება
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-black text-[#041C32] sm:text-5xl">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice ? (
                    <span className="pb-1 text-lg font-bold text-[#8A95A8] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  ) : null}
                  {product.discount ? (
                    <span className="mb-1 rounded-md bg-[#FFF1F1] px-3 py-1.5 text-xs font-black text-[#D92D20]">
                      {product.discount}
                    </span>
                  ) : null}
                </div>

                <p className="mt-6 text-base leading-8 text-[#536274]">
                  {product.shortDescription}
                </p>

                <div className="mt-7 grid gap-3">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex gap-3 text-sm font-bold text-[#102033]">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#176B45]" />
                      <span className="leading-6">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <ProductPurchaseCard product={product} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5EAF0] bg-[#F7F9FC]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          <ProductTabs product={product} />
        </div>
      </section>

      <section className="border-y border-[#E5EAF0] bg-[#F7F9FC]">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          <RelatedProducts products={similarProducts} />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          <DeferredRecentlyViewedProducts products={recentlyViewedProducts} />
        </div>
      </section>
    </>
  );
}

function BenefitCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-xl border border-[#DCE3EA] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#F58220] hover:shadow-[0_12px_28px_rgba(6,43,79,0.08)]">
      <span className="grid size-12 place-items-center rounded-lg bg-[#FFF4EA] text-[#F58220]">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 text-base font-black text-[#102033]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
    </article>
  );
}
