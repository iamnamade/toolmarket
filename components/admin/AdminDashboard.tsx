"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  ClipboardList,
  Package,
  ShoppingBag,
  TrendingUp,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/price";
import type { LucideIcon } from "lucide-react";

const AdminDashboardCharts = dynamic(
  () =>
    import("@/components/admin/AdminDashboardCharts").then(
      (module) => module.AdminDashboardCharts
    ),
  {
    ssr: false,
    loading: () => <DashboardChartsSkeleton />,
  }
);

type OrderStatus = "ახალი" | "დამუშავებაშია" | "გზაშია" | "დასრულებულია";

type DashboardOrder = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
};

const metrics: Array<{
  label: string;
  value: string;
  growth: string;
  comparison: string;
  icon: LucideIcon;
  color: string;
  background: string;
}> = [
  { label: "ჯამური შემოსავალი", value: "128,240 ₾", growth: "+12.5%", comparison: "წინა პერიოდთან", icon: CircleDollarSign, color: "#0B63CE", background: "#EAF2FF" },
  { label: "შეკვეთები", value: "342", growth: "+8.7%", comparison: "წინა პერიოდთან", icon: ClipboardList, color: "#1473E6", background: "#EAF2FF" },
  { label: "აქტიური მომხმარებლები", value: "127", growth: "+15.3%", comparison: "წინა პერიოდთან", icon: Users, color: "#168A50", background: "#EAF8EF" },
  { label: "პროდუქტები", value: "1,258", growth: "+3.1%", comparison: "წინა პერიოდთან", icon: Package, color: "#F58220", background: "#FFF0E3" },
  { label: "საშუალო შეკვეთა", value: "374.25 ₾", growth: "+5.8%", comparison: "წინა პერიოდთან", icon: ShoppingBag, color: "#7C4DCC", background: "#F3EDFF" }
];

const recentOrders: DashboardOrder[] = [
  { id: "TM-10523", customer: "გიორგი მაისურაძე", date: "2026-06-21", total: 499, status: "ახალი" },
  { id: "TM-10522", customer: "ლაშა კახიძე", date: "2026-06-21", total: 247.5, status: "დასრულებულია" },
  { id: "TM-10521", customer: "ირაკლი ბერიძე", date: "2026-06-21", total: 145.8, status: "დამუშავებაშია" },
  { id: "TM-10520", customer: "ანა დვალიშვილი", date: "2026-06-20", total: 512.35, status: "გზაშია" },
  { id: "TM-10519", customer: "მარიამ კობახიძე", date: "2026-06-20", total: 89, status: "დასრულებულია" }
];

const statusStyles: Record<OrderStatus, string> = {
  ახალი: "bg-[#EAF2FF] text-[#0B63CE]",
  დამუშავებაშია: "bg-[#FFF0E3] text-[#B95D14]",
  გზაშია: "bg-[#F3EDFF] text-[#6E4BC6]",
  დასრულებულია: "bg-[#EAF8EF] text-[#176B45]"
};

export function AdminDashboard() {
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-21");
  const [period, setPeriod] = useState("current");
  const [query, setQuery] = useState("");
  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ka-GE");
    if (!normalized) return recentOrders;
    return recentOrders.filter((order) =>
      [order.id, order.customer, order.date, order.status].some((value) =>
        value.toLocaleLowerCase("ka-GE").includes(normalized)
      )
    );
  }, [query]);

  return (
    <AdminShell
      title="დეშბორდი"
      description="მაღაზიის მთავარი მაჩვენებლები, გაყიდვები და შეკვეთების მდგომარეობა ერთ სივრცეში."
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="შეკვეთა ან მომხმარებელი..."
      actions={
        <>
          <label className="grid gap-1 text-xs font-bold text-[#6B7280]">
            <span className="sr-only">საწყისი თარიღი</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="focus-ring h-10 rounded-md border border-[#E6EBEB] bg-white px-3 text-xs font-semibold text-[#102033]" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#6B7280]">
            <span className="sr-only">საბოლოო თარიღი</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="focus-ring h-10 rounded-md border border-[#E6EBEB] bg-white px-3 text-xs font-semibold text-[#102033]" />
          </label>
          <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="საანგარიშო პერიოდი" className="focus-ring h-10 rounded-md border border-[#072B4D] bg-[#072B4D] px-3 text-xs font-bold text-white">
            <option value="current">მიმდინარე</option>
            <option value="previous">წინა პერიოდი</option>
            <option value="year">მიმდინარე წელი</option>
          </select>
        </>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <AdminDashboardCharts startDate={startDate} endDate={endDate} />

      <section className="mt-6 overflow-hidden rounded-xl border border-[#E6EBEB] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E6EBEB] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0D1B2A]">ბოლო შეკვეთები</h2>
            <p className="mt-1 text-sm text-[#6B7280]">უახლესი აქტივობა და მიმდინარე სტატუსები</p>
          </div>
          <Link href="/admin/orders" className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-[#0B3A68] transition hover:bg-[#F5F6F8] hover:text-[#F58220]">
            ყველა შეკვეთა <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#F8F9FB] text-xs uppercase text-[#6B7280]">
              <tr>
                <th className="px-5 py-3 font-bold">შეკვეთა</th>
                <th className="px-5 py-3 font-bold">მომხმარებელი</th>
                <th className="px-5 py-3 font-bold">თარიღი</th>
                <th className="px-5 py-3 font-bold">თანხა</th>
                <th className="px-5 py-3 font-bold">სტატუსი</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBEB]">
              {filteredOrders.length ? filteredOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-[#FAFBFC]">
                  <td className="px-5 py-4 font-black text-[#0D1B2A]">#{order.id}</td>
                  <td className="px-5 py-4 font-medium text-[#102033]">{order.customer}</td>
                  <td className="px-5 py-4 text-[#6B7280]">{order.date}</td>
                  <td className="px-5 py-4 font-black text-[#0D1B2A]">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-[#6B7280]">ძიების შესაბამისი შეკვეთა ვერ მოიძებნა.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}

function MetricCard({ label, value, growth, comparison, icon: Icon, color, background }: (typeof metrics)[number]) {
  return (
    <article className="min-w-0 rounded-xl border border-[#E6EBEB] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ color, backgroundColor: background }}><Icon className="size-5" /></span>
        <TrendingUp className="size-4 text-[#1A9A5B]" />
      </div>
      <p className="mt-4 text-xs font-medium text-[#6B7280]">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-[#0D1B2A]">{value}</p>
      <p className="mt-2 text-xs"><span className="font-bold text-[#1A9A5B]">{growth}</span> <span className="text-[#6B7280]">{comparison}</span></p>
    </article>
  );
}

function DashboardChartsSkeleton() {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <div className="min-h-[372px] animate-pulse rounded-xl border border-[#E6EBEB] bg-white p-5 shadow-sm" />
      <div className="min-h-[372px] animate-pulse rounded-xl border border-[#E6EBEB] bg-white p-5 shadow-sm" />
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={["inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", statusStyles[status]].join(" ")}>{status}</span>;
}
