"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useState, type PointerEvent } from "react";

type ProductGalleryProps = {
  title: string;
  images: string[];
  discount?: string;
};

export function ProductGallery({ title, images, discount }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const selectedImage = images[activeIndex] ?? images[0];

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <section aria-label="პროდუქტის გალერეა" className="min-w-0">
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-xl border border-[#E5EAF0] bg-white"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setZoomOrigin("50% 50%")}
      >
        {discount ? (
          <span className="absolute left-4 top-4 z-10 rounded-md bg-[#D92D20] px-3 py-1.5 text-xs font-black text-white">
            {discount}
          </span>
        ) : null}
        <span className="pointer-events-none absolute right-4 top-4 z-10 hidden items-center gap-2 rounded-md border border-[#E5EAF0] bg-white/90 px-3 py-2 text-xs font-bold text-[#6B7280] backdrop-blur md:inline-flex">
          <ZoomIn className="size-4 text-[#F58220]" />
          გასადიდებლად მიიტანეთ კურსორი
        </span>
        <Image
          key={selectedImage}
          src={selectedImage}
          alt={title}
          fill
          priority
          quality={82}
          sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 50vw, 100vw"
          style={{ transformOrigin: zoomOrigin }}
          className="animate-[product-image-fade_250ms_ease] object-contain p-7 transition-transform duration-300 ease-out md:group-hover:scale-[1.4] lg:p-10"
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5" role="list">
        {images.map((image, index) => {
          const active = activeIndex === index;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`პროდუქტის სურათი ${index + 1}`}
              aria-pressed={active}
              onClick={() => setActiveIndex(index)}
              className={[
                "focus-ring relative aspect-square min-w-0 overflow-hidden rounded-lg border-2 bg-white transition duration-200",
                active
                  ? "border-[#F58220] shadow-[0_0_0_3px_rgba(245,130,32,0.12)]"
                  : "border-[#E5EAF0] hover:border-[#AEB8C5]"
              ].join(" ")}
            >
              <Image
                src={image}
                alt={`${title} - ხედი ${index + 1}`}
                fill
                sizes="120px"
                quality={70}
                className="object-contain p-2"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
