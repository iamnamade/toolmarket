import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Building2,
  Handshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wrench
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const values = [
  {
    title: "ხარისხიანი პროდუქცია",
    description: "კატალოგში ვაერთიანებთ სამუშაო პროცესისთვის გამძლე და პრაქტიკულ პროდუქტებს.",
    icon: Award
  },
  {
    title: "სანდო ბრენდები",
    description: "ვმუშაობთ ისეთ ბრენდებთან, რომლებსაც პროფესიონალები ყოველდღიურად ენდობიან.",
    icon: ShieldCheck
  },
  {
    title: "სწრაფი მომსახურება",
    description: "შეკვეთის დამუშავება და კონსულტაცია მაქსიმალურად მარტივი და სწრაფია.",
    icon: Truck
  },
  {
    title: "მომხმარებელზე ორიენტირებული მიდგომა",
    description: "გეხმარებით სწორი პროდუქტის შერჩევაში, როგორც სახლისთვის, ისე სამუშაო ობიექტისთვის.",
    icon: Handshake
  }
];

const offerItems = [
  "პროფესიონალური და საოჯახო ხელსაწყოები",
  "სამშენებლო მასალები და სამუშაო აქსესუარები",
  "ელექტროობა, განათება და ტექნიკური პროდუქტები"
];

export const metadata: Metadata = {
  title: "ჩვენ შესახებ | ToolMarket.ge",
  description:
    "ToolMarket.ge არის ონლაინ სივრცე ხელსაწყოების, სამშენებლო მასალებისა და ტექნიკური პროდუქტებისთვის."
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />

      <section className="overflow-hidden border-b border-[#E5EAF0] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_0.85fr] lg:px-6 lg:py-16">
          <div className="max-w-3xl">
            <span className="text-sm font-black text-[#F58220]">ToolMarket.ge</span>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-[#041C32] sm:text-4xl lg:text-5xl">
              ჩვენ შესახებ
            </h1>
            <p className="mt-5 text-base leading-8 text-[#6B7280] sm:text-lg">
              ToolMarket.ge არის ონლაინ სივრცე ხელსაწყოების, სამშენებლო მასალებისა და
              ტექნიკური პროდუქტებისთვის.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-md bg-[#F58220] px-6 text-sm font-black text-white transition hover:bg-[#de741d]"
              >
                პროდუქტების ნახვა
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-md border border-[#E5EAF0] bg-white px-6 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#041C32]"
              >
                კონტაქტი
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5EAF0] bg-[#041C32] p-5 text-white shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard value="8" label="ბრენდი" />
              <StatCard value="40+" label="დემო პროდუქტი" />
              <StatCard value="24/7" label="ონლაინ სივრცე" />
              <StatCard value="100%" label="კატალოგის ტესტირება" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-2 lg:px-6">
          <InfoPanel
            icon={<Building2 className="size-6" />}
            title="ვინ ვართ"
            text="ToolMarket.ge იქმნება როგორც სანდო ecommerce პლატფორმა პროფესიონალებისთვის, ოსტატებისთვის და ყველასთვის, ვისაც ხარისხიანი სამუშაო პროდუქტი სჭირდება ერთ სივრცეში."
          />
          <div className="rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-md bg-[#FFF3E8] text-[#F58220]">
                <Wrench className="size-6" />
              </span>
              <h2 className="text-2xl font-black text-[#041C32]">რას გთავაზობთ</h2>
            </div>
            <ul className="mt-5 grid gap-3">
              {offerItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-[#6B7280]">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#F58220] text-white">
                    <ShieldCheck className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-10 lg:pb-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-6 max-w-2xl">
            <span className="text-sm font-black text-[#F58220]">ღირებულებები</span>
            <h2 className="mt-2 text-2xl font-black text-[#041C32] sm:text-3xl">
              რა გვამოძრავებს
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 lg:pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
          <div className="rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-sm">
            <span className="text-sm font-black text-[#F58220]">ლოკაცია და კონტაქტი</span>
            <h2 className="mt-2 text-2xl font-black text-[#041C32]">
              დაგვიკავშირდით სამუშაო დეტალებისთვის
            </h2>
            <div className="mt-6 grid gap-3">
              <ContactPreview icon={<MapPin className="size-5" />} label="მისამართი" value="თბილისი, საქართველო" />
              <ContactPreview icon={<Phone className="size-5" />} label="ტელეფონი" value="+995 32 2 00 33 33" />
              <ContactPreview icon={<Mail className="size-5" />} label="ელ. ფოსტა" value="info@toolmarket.ge" />
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-sm">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(#E5EAF0 1px, transparent 1px), linear-gradient(90deg, #E5EAF0 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
              aria-hidden="true"
            />
            <div className="relative grid h-full min-h-[300px] place-items-center p-6 text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid size-14 place-items-center rounded-md bg-[#072B4D] text-white ring-8 ring-[#F7F8FA]">
                  <MapPin className="size-7" />
                </div>
                <h2 className="mt-5 text-xl font-black text-[#041C32]">ToolMarket.ge რუკაზე</h2>
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  რუკა დაემატება მისამართის დაზუსტების შემდეგ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/8 p-5">
      <span className="block text-3xl font-black text-white">{value}</span>
      <span className="mt-1 block text-sm font-bold text-white/65">{label}</span>
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-md bg-[#EEF5FB] text-[#072B4D]">
          {icon}
        </span>
        <h2 className="text-2xl font-black text-[#041C32]">{title}</h2>
      </div>
      <p className="mt-5 text-sm leading-7 text-[#6B7280]">{text}</p>
    </div>
  );
}

function ValueCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: typeof Award;
}) {
  return (
    <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#F58220]">
      <div className="grid size-12 place-items-center rounded-md bg-[#FFF3E8] text-[#F58220]">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-5 text-lg font-black text-[#041C32]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#6B7280]">{description}</p>
    </article>
  );
}

function ContactPreview({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-[#E5EAF0] bg-[#F7F8FA] p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-white text-[#F58220]">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-bold text-[#6B7280]">{label}</span>
        <span className="block text-sm font-black text-[#102033]">{value}</span>
      </span>
    </div>
  );
}
