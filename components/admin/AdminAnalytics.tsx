import { CircleDollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

const metricCards = [
  { label: "შემოსავალი 30 დღეში", value: "128,240 ₾", delta: "+12.5%", tone: "navy" as const, icon: CircleDollarSign },
  { label: "საშუალო შეკვეთა", value: "374.25 ₾", delta: "+5.8%", tone: "success" as const, icon: ShoppingBag },
  { label: "აქტიური მომხმარებლები", value: "127", delta: "+15.3%", tone: "success" as const, icon: Users },
  { label: "კონვერსიის ტენდენცია", value: "4.8%", delta: "+0.6%", tone: "warning" as const, icon: TrendingUp },
];

const revenueTrend = [
  { label: "1 ივნ", value: 6200 },
  { label: "5 ივნ", value: 18400 },
  { label: "9 ივნ", value: 22100 },
  { label: "13 ივნ", value: 13800 },
  { label: "17 ივნ", value: 26400 },
  { label: "21 ივნ", value: 31740 },
  { label: "25 ივნ", value: 34800 },
];

const channelRows = [
  { label: "ორგანული ძიება", value: "41%", note: "მთავარი წყარო პროდუქტების კატალოგზე გადასვლებისთვის" },
  { label: "პირდაპირი ტრეფიკი", value: "27%", note: "ბრენდის ცნობადობის სტაბილური არხი" },
  { label: "სოციალური ქსელები", value: "18%", note: "აქციები, ვიდეოები და ახალი შემოთავაზებები" },
  { label: "რეფერალები", value: "14%", note: "პარტნიორული ბმულები და მესენჯერები" },
];

const insightRows = [
  "ელექტრო ინსტრუმენტები და სამაგრები ინარჩუნებს ყველაზე მაღალ მოთხოვნას სამუშაო დღეებში.",
  "მიტოვებული შეკვეთების შესამცირებლად ყველაზე ეფექტურია მიწოდების ვადების უფრო მკაფიო ჩვენება რეგიონებში.",
  "ფასდაკლების ტეგები და ფასის მკაფიო ჩვენება ზრდის პროდუქტის ბარათიდან კატალოგურ ჩართულობას.",
];

const maxRevenue = Math.max(...revenueTrend.map((item) => item.value));

export function AdminAnalytics() {
  return (
    <AdminShell
      title="ანალიტიკა"
      eyebrow="გაყიდვების სურათი"
      description="ანალიტიკის გვერდი აერთიანებს შემოსავლის, მომხმარებელთა აქტივობისა და ტრეფიკის ძირითად მაჩვენებლებს ერთ სივრცეში."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">შემოსავლის დინამიკა</h2>
                <p className="mt-1 text-sm text-[#6B7280]">ვიზუალური ტენდენცია ბოლო 30 დღის პერიოდისთვის.</p>
              </div>
              <span className="rounded-full bg-[#EAF2FA] px-3 py-1 text-xs font-black text-[#072B4D]">30 დღე</span>
            </div>

            <div className="mt-6 flex h-[280px] items-end gap-3">
              {revenueTrend.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#0B3A68] via-[#174B78] to-[#4B84B8]"
                      style={{ height: `${Math.max(18, (item.value / maxRevenue) * 100)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-[#102033]">{item.label}</p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">{item.value.toLocaleString("en-US")} ₾</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">ტრეფიკის არხები</h2>
            <p className="mt-1 text-sm text-[#6B7280]">რომელი წყაროები მოაქვს ყველაზე მეტ დაინტერესებულ მომხმარებელს.</p>

            <div className="mt-5 space-y-4">
              {channelRows.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[#102033]">{row.label}</p>
                    <span className="text-sm font-black text-[#072B4D]">{row.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#EAF0F5]">
                    <div className="h-full rounded-full bg-[#F58220]" style={{ width: row.value }} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6B7280]">{row.note}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">კომერციული შენიშვნები</h2>
            <p className="mt-1 text-sm text-[#6B7280]">მოკლე შეჯამებები იმ ტენდენციებზე, რომლებიც აქტიურად ჩანს მიმდინარე პერიოდში.</p>

            <div className="mt-5 space-y-3">
              {insightRows.map((row, index) => (
                <div key={row} className="rounded-xl border border-[#EAF0F5] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#F58220]">Insight {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">{row}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">ანალიტიკის შეჯამება</h2>
            <p className="mt-1 text-sm text-[#6B7280]">გვერდზე გაერთიანებულია მთავარი KPI-ები, შემოსავლის დინამიკა და ტრეფიკის სურათი.</p>

            <div className="mt-5 space-y-3">
              <StatusRow label="Dashboard cards" value="მზადაა" tone="success" />
              <StatusRow label="Sales trend" value="აქტიური" tone="success" />
              <StatusRow label="Traffic attribution" value="გახსნილი" tone="navy" />
              <StatusRow label="Realtime sync" value="ფოკუსშია" tone="warning" />
            </div>
          </article>
        </section>
      </div>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  delta,
  tone,
  icon: Icon,
}: (typeof metricCards)[number]) {
  const styles =
    tone === "success"
      ? "bg-[#EAF8EF] text-[#176B45]"
      : tone === "warning"
        ? "bg-[#FFF4EA] text-[#B95D14]"
        : "bg-[#EAF2FA] text-[#072B4D]";

  return (
    <article className="rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className={["grid size-10 shrink-0 place-items-center rounded-full", styles].join(" ")}>
          <Icon className="size-5" />
        </span>
        <span className="text-xs font-black text-[#1A9A5B]">{delta}</span>
      </div>
      <p className="mt-4 text-xs font-medium text-[#6B7280]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0D1B2A]">{value}</p>
    </article>
  );
}

function StatusRow({
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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#EAF0F5] px-3 py-3">
      <span className="text-sm font-semibold text-[#102033]">{label}</span>
      <span className={["rounded-full px-2.5 py-1 text-xs font-black", styles].join(" ")}>{value}</span>
    </div>
  );
}
