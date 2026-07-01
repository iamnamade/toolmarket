"use client";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/price";

const revenueData = [
  { date: "1 ივნ", revenue: 6200 },
  { date: "4 ივნ", revenue: 18400 },
  { date: "7 ივნ", revenue: 22100 },
  { date: "10 ივნ", revenue: 13800 },
  { date: "13 ივნ", revenue: 26400 },
  { date: "16 ივნ", revenue: 15800 },
  { date: "19 ივნ", revenue: 34800 },
  { date: "21 ივნ", revenue: 31740 },
];

const orderDistribution = [
  { name: "ახალი", value: 120, color: "#2878D0" },
  { name: "დამუშავებაშია", value: 98, color: "#0A98C6" },
  { name: "გზაშია", value: 65, color: "#42A86B" },
  { name: "დასრულებულია", value: 42, color: "#F6A436" },
  { name: "გაუქმებული", value: 17, color: "#E25E55" },
];

export function AdminDashboardCharts({
  endDate,
  startDate,
}: {
  endDate: string;
  startDate: string;
}) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <DashboardChartCard title="გაყიდვების დინამიკა" description={`${startDate} - ${endDate}`}>
        <MeasuredChartContainer className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <LineChart data={revenueData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#E6EBEB" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
              <Tooltip formatter={(value) => formatPrice(Number(value))} contentStyle={{ borderRadius: 8, borderColor: "#E6EBEB", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#1473E6" strokeWidth={3} dot={{ r: 3, fill: "#FFFFFF", strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </MeasuredChartContainer>
      </DashboardChartCard>

      <DashboardChartCard title="შეკვეთების სტატუსი" description="მიმდინარე პერიოდში">
        <div className="grid min-h-[300px] items-center gap-4 sm:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[180px_minmax(0,1fr)]">
          <MeasuredChartContainer className="h-[190px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <PieChart>
                <Pie data={orderDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                  {orderDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} შეკვეთა`} contentStyle={{ borderRadius: 8, borderColor: "#E6EBEB", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </MeasuredChartContainer>
          <div className="grid gap-2">
            {orderDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="min-w-0 flex-1 truncate text-[#6B7280]">{entry.name}</span>
                <span className="font-black text-[#102033]">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardChartCard>
    </section>
  );
}

function MeasuredChartContainer({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const syncSize = () => {
      const { height, width } = node.getBoundingClientRect();
      setIsReady(width > 0 && height > 0);
    };

    syncSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(syncSize);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isReady ? children : <div className="h-full w-full animate-pulse rounded-lg bg-[#F7F9FC]" />}
    </div>
  );
}

function DashboardChartCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-[#E6EBEB] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#0D1B2A]">{title}</h2>
        <p className="mt-1 text-xs text-[#6B7280]">{description}</p>
      </div>
      {children}
    </article>
  );
}
