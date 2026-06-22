"use client";

import { PackageCheck, Star } from "lucide-react";
import { useState } from "react";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import type { ProductDetail } from "@/types/catalog";

const tabs = [
  { id: "description", label: "აღწერა" },
  { id: "specifications", label: "მახასიათებლები" },
  { id: "shipping", label: "მიწოდება" },
  { id: "warranty", label: "გარანტია" },
  { id: "reviews", label: "შეფასებები" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductTabs({ product }: { product: ProductDetail }) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <section aria-labelledby="product-information-heading">
      <h2 id="product-information-heading" className="text-2xl font-black text-[#041C32]">
        პროდუქტის ინფორმაცია
      </h2>
      <div className="mt-6 border-b border-[#DCE3EA]">
        <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="პროდუქტის ინფორმაცია">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`product-tab-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "focus-ring relative h-[52px] shrink-0 px-1 text-sm font-black transition-colors duration-200",
                  active ? "text-[#062B4F]" : "text-[#6B7280] hover:text-[#062B4F]",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:bg-[#F58220] after:transition-transform after:duration-300",
                  active ? "after:scale-x-100" : "after:scale-x-0"
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={activeTab}
        id={`product-tab-panel-${activeTab}`}
        role="tabpanel"
        className="animate-[product-content-fade_250ms_ease] pt-6"
      >
        {activeTab === "description" ? (
          <div className="max-w-4xl">
            <p className="text-base leading-8 text-[#536274]">{product.description}</p>
            <div className="mt-6 rounded-xl border border-[#DCE3EA] bg-white p-5">
              <h3 className="text-base font-black text-[#102033]">ვისთვის არის ეს პროდუქტი</h3>
              <p className="mt-2 text-sm leading-7 text-[#6B7280]">
                პროდუქტი შეეფერება პროფესიონალ ხელოსნებს, ტექნიკურ გუნდებსა და მომხმარებლებს,
                რომლებსაც სჭირდებათ საიმედო ინსტრუმენტი რეგულარული სამუშაოებისთვის.
              </p>
            </div>
          </div>
        ) : null}

        {activeTab === "specifications" ? (
          <div className="max-w-4xl">
            <ProductSpecs specifications={product.specifications} />
          </div>
        ) : null}

        {activeTab === "shipping" ? (
          <InfoList title="მიწოდების პირობები" items={product.deliveryNotes} />
        ) : null}

        {activeTab === "warranty" ? (
          <InfoList title="საგარანტიო პირობები" items={product.warrantyNotes} />
        ) : null}

        {activeTab === "reviews" ? (
          <div className="grid max-w-4xl gap-5 md:grid-cols-[220px_1fr]">
            <div className="rounded-xl border border-[#DCE3EA] bg-white p-5 text-center">
              <p className="text-4xl font-black text-[#041C32]">{product.rating.toFixed(1)}</p>
              <div className="mt-3 flex justify-center gap-1 text-[#F58220]">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={[
                      "size-4",
                      index < Math.round(product.rating) ? "fill-current" : ""
                    ].join(" ")}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs font-bold text-[#6B7280]">
                {product.reviewCount} შეფასება
              </p>
            </div>
            <div className="rounded-xl border border-[#DCE3EA] bg-white p-5">
              <h3 className="text-base font-black text-[#102033]">მომხმარებელთა შეფასებები</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                შეფასებების დეტალური მოდული დაემატება რეალურ მონაცემებთან ინტეგრაციისას.
                მიმდინარე ქულა წარმოდგენილია დემო მონაცემებით.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="max-w-4xl rounded-xl border border-[#DCE3EA] bg-white p-5 sm:p-6">
      <h3 className="text-lg font-black text-[#102033]">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-[#6B7280]">
            <PackageCheck className="mt-1 size-4 shrink-0 text-[#F58220]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
