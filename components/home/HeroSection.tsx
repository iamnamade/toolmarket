import Image from "next/image";
import Link from "next/link";
import { heroStats } from "@/data/site";
export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-0 lg:px-6">
        <div className="overflow-hidden rounded-lg bg-[#041C32]">
          <div className="grid min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
              <span className="mb-4 inline-flex w-fit items-center rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                ToolMarket.ge
              </span>
              <h1 className="max-w-xl break-words text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl lg:text-5xl">
                პროფესიონალური ხელსაწყოები და მასალები
              </h1>
              <p className="mt-5 max-w-lg break-words text-base font-medium leading-7 text-white/78 sm:text-lg">
                ყველაფერი მშენებლობისთვის, რემონტისთვის და ყოველდღიური სამუშაოებისთვის.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#products"
                  className="focus-ring inline-flex items-center justify-center rounded-lg bg-[#F58220] px-6 py-3 text-sm font-black text-white shadow-sm transition duration-300 ease-in-out hover:scale-105 hover:bg-[#de741d] hover:shadow-[0_12px_24px_rgba(245,130,32,0.28)]"
                >
                  პროდუქტის ნახვა
                </Link>
                <Link
                  href="#brands"
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-md border border-white/45 bg-white px-5 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:bg-[#FFF4EA] hover:text-[#041C32]"
                >
                  ბრენდების ნახვა
                </Link>
              </div>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-white/12 bg-white/8 p-3">
                    <div className="text-lg font-black text-white">{stat.value}</div>
                    <div className="mt-1 truncate text-xs font-semibold text-white/65">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px] bg-[#072B4D] lg:min-h-full">
              <Image
                src="/images/cover.png"
                alt="პროფესიონალური ხელსაწყოები"
                fill
                priority
                quality={82}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
