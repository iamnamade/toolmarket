import {
  BadgeCheck,
  BellRing,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

const contactRows = [
  { label: "მაღაზიის სახელი", value: "ToolMarket.ge", icon: Store },
  { label: "ტელეფონი", value: "+995 32 2 00 33 33", icon: Phone },
  { label: "ელ. ფოსტა", value: "info@toolmarket.ge", icon: Mail },
  { label: "მისამართი", value: "თბილისი, საქართველო", icon: MapPin },
];

const operationsRows = [
  { label: "ადმინისტრატორის შეტყობინებები", value: "orders@toolmarket.ge", tone: "navy" as const },
  { label: "მიწოდების რეჟიმი", value: "თბილისი 1-2 დღე / რეგიონები შეთანხმებით", tone: "success" as const },
  { label: "კონტენტის განახლება", value: "ხელით კონტროლდება", tone: "warning" as const },
];

const integrationRows = [
  { label: "Google Auth", value: "კონფიგურირებულია", tone: "success" as const },
  { label: "reCAPTCHA", value: "რეგისტრაციაზე აქტიურია", tone: "success" as const },
  { label: "Resend email helper", value: "მომზადებულია", tone: "success" as const },
  { label: "სრული settings persistence", value: "გეგმაშია", tone: "warning" as const },
];

export function AdminSettingsOverview() {
  return (
    <AdminShell
      title="პარამეტრები"
      eyebrow="მაღაზიის კონფიგურაცია"
      description="ეს გვერდი აჩვენებს მაღაზიის ძირითადი ინფორმაციის, ოპერაციების და ინტეგრაციების ამჟამინდელ მდგომარეობას."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#FFF4EA] text-[#F58220]">
                <Store className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">საკონტაქტო ინფორმაცია</h2>
                <p className="mt-1 text-sm text-[#6B7280]">საჯარო storefront-ზე გამოსაჩენი ძირითადი მაღაზიის მონაცემები.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contactRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-[#EAF0F5] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2 text-[#072B4D]">
                    <row.icon className="size-4" />
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6B7280]">{row.label}</p>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#102033]">{row.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF2FA] text-[#072B4D]">
                <Settings className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">ოპერაციული პარამეტრები</h2>
                <p className="mt-1 text-sm text-[#6B7280]">მთავარი ადმინისტრაციული არხები და სერვისის მიმდინარე რეჟიმი.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {operationsRows.map((row) => (
                <StatusCard key={row.label} label={row.label} value={row.value} tone={row.tone} />
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#EAF8EF] text-[#176B45]">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">ინტეგრაციების სტატუსი</h2>
                <p className="mt-1 text-sm text-[#6B7280]">შედგენილია მხოლოდ იმ integrations საფუძველზე, რომლებიც უკვე workspace-ში ჩანს.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {integrationRows.map((row) => (
                <StatusCard key={row.label} label={row.label} value={row.value} tone={row.tone} />
              ))}
            </div>
          </article>

          <article className="space-y-4 rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-[#0D1B2A]">სისტემური შენიშვნები</h2>
              <p className="mt-1 text-sm text-[#6B7280]">კლაიენტის პრეზენტაციისთვის საკვანძო მდგომარეობა ერთ ბლოკში.</p>
            </div>

            <MiniNote icon={BellRing} title="შეტყობინებები" text="საკონტაქტო და საოპერაციო ელ. ფოსტის მიმართულება განსაზღვრულია, მაგრამ სრული automation ჯერ არაა მიბმული." />
            <MiniNote icon={Truck} title="მიწოდება" text="მიწოდების ტექსტები და რეჟიმი უკვე ჩამოყალიბებულია, ამიტომ ოპერაციული flow მკაფიოდ არის აღწერილი." />
            <MiniNote icon={BadgeCheck} title="მზადყოფნა" text="UI უკვე სტაბილურია და შემდეგ ეტაპზე შეიძლება დაემატოს რეალური შენახვა მონაცემთა ბაზაში." />
          </article>
        </section>
      </div>
    </AdminShell>
  );
}

function StatusCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "navy" | "success" | "warning";
}) {
  const styles =
    tone === "success"
      ? "bg-[#EAF8EF] text-[#176B45]"
      : tone === "warning"
        ? "bg-[#FFF4EA] text-[#B95D14]"
        : "bg-[#EAF2FA] text-[#072B4D]";

  return (
    <div className="rounded-xl border border-[#EAF0F5] p-4">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6B7280]">{label}</p>
      <span className={["mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-black", styles].join(" ")}>
        {value}
      </span>
    </div>
  );
}

function MiniNote({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BellRing;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#EAF0F5] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2 text-[#072B4D]">
        <Icon className="size-4.5" />
        <h3 className="text-sm font-semibold text-[#102033]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{text}</p>
    </div>
  );
}
