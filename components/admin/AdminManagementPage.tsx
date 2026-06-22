"use client";

import {
  ArrowDownAZ,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export type AdminModuleKey =
  | "categories"
  | "orders"
  | "customers"
  | "brands"
  | "coupons"
  | "reviews"
  | "banners"
  | "notifications"
  | "logs";

type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  amount: string;
  status: "active" | "pending" | "inactive" | "completed";
  date: string;
};

type ModuleConfig = {
  title: string;
  eyebrow: string;
  description: string;
  primaryColumn: string;
  detailColumn: string;
  amountColumn: string;
  createLabel: string;
  allowCreate: boolean;
  rows: AdminRecord[];
};

const statusLabels: Record<AdminRecord["status"], string> = {
  active: "აქტიური",
  pending: "მოლოდინში",
  inactive: "გათიშული",
  completed: "დასრულებული"
};

const configs: Record<AdminModuleKey, ModuleConfig> = {
  categories: {
    title: "კატეგორიები",
    eyebrow: "კატალოგის სტრუქტურა",
    description: "მართეთ ძირითადი მიმართულებები, ქვეკატეგორიები და მათი გამოჩენის რიგითობა.",
    primaryColumn: "კატეგორია",
    detailColumn: "იერარქია",
    amountColumn: "პროდუქტები",
    createLabel: "კატეგორიის დამატება",
    allowCreate: true,
    rows: [
      { id: "CAT-101", title: "ხელის ხელსაწყოები", subtitle: "320+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "324", status: "active", date: "2026-06-21" },
      { id: "CAT-102", title: "ელექტრობა და განათება", subtitle: "180+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "186", status: "active", date: "2026-06-20" },
      { id: "CAT-103", title: "სამშენებლო მასალები", subtitle: "240+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "248", status: "active", date: "2026-06-19" },
      { id: "CAT-104", title: "სანტექნიკა", subtitle: "130+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "137", status: "active", date: "2026-06-18" },
      { id: "CAT-105", title: "უსაფრთხოება", subtitle: "95+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "98", status: "pending", date: "2026-06-17" },
      { id: "CAT-106", title: "ეზო და ბაღი", subtitle: "110+ პროდუქტი", detail: "ძირითადი კატეგორია", amount: "114", status: "active", date: "2026-06-16" }
    ]
  },
  orders: {
    title: "შეკვეთები",
    eyebrow: "გაყიდვების მართვა",
    description: "გააკონტროლეთ შეკვეთის სტატუსი, მომხმარებელი, თანხა და შესრულების თარიღი.",
    primaryColumn: "შეკვეთა / მომხმარებელი",
    detailColumn: "მიწოდება",
    amountColumn: "თანხა",
    createLabel: "შეკვეთის დამატება",
    allowCreate: false,
    rows: [
      { id: "TM-10523", title: "გიორგი მაისურაძე", subtitle: "3 პროდუქტი", detail: "თბილისი, საბურთალო", amount: "499.00 ₾", status: "pending", date: "2026-06-21" },
      { id: "TM-10522", title: "ლაშა ბერიძე", subtitle: "2 პროდუქტი", detail: "რუსთავი", amount: "247.50 ₾", status: "active", date: "2026-06-21" },
      { id: "TM-10521", title: "ირაკლი ჩხეიძე", subtitle: "1 პროდუქტი", detail: "ქუთაისი", amount: "145.80 ₾", status: "completed", date: "2026-06-20" },
      { id: "TM-10520", title: "ნინო კაპანაძე", subtitle: "4 პროდუქტი", detail: "თბილისი, ვაკე", amount: "512.35 ₾", status: "completed", date: "2026-06-20" },
      { id: "TM-10519", title: "დავით ლომიძე", subtitle: "2 პროდუქტი", detail: "ბათუმი", amount: "89.00 ₾", status: "inactive", date: "2026-06-19" },
      { id: "TM-10518", title: "ანა მჭედლიშვილი", subtitle: "5 პროდუქტი", detail: "გორი", amount: "680.40 ₾", status: "active", date: "2026-06-18" }
    ]
  },
  customers: {
    title: "მომხმარებლები",
    eyebrow: "ანგარიშები და როლები",
    description: "იხილეთ მომხმარებლის პროფილი, შეკვეთების ისტორია, სტატუსი და მინიჭებული როლი.",
    primaryColumn: "მომხმარებელი",
    detailColumn: "ელფოსტა / როლი",
    amountColumn: "შეკვეთები",
    createLabel: "მომხმარებლის დამატება",
    allowCreate: true,
    rows: [
      { id: "USR-001", title: "გიორგი მაისურაძე", subtitle: "USER", detail: "giorgi@example.com", amount: "12", status: "active", date: "2026-06-21" },
      { id: "USR-002", title: "ლაშა ბერიძე", subtitle: "USER", detail: "lasha@example.com", amount: "8", status: "active", date: "2026-06-20" },
      { id: "USR-003", title: "ანა მჭედლიშვილი", subtitle: "USER", detail: "ana@example.com", amount: "4", status: "active", date: "2026-06-19" },
      { id: "USR-004", title: "ნინო კაპანაძე", subtitle: "USER", detail: "nino@example.com", amount: "17", status: "pending", date: "2026-06-18" },
      { id: "USR-005", title: "Admin ToolMarket", subtitle: "ADMIN", detail: "admin@toolmarket.ge", amount: "-", status: "active", date: "2026-06-17" },
      { id: "USR-006", title: "დავით ლომიძე", subtitle: "USER", detail: "dato@example.com", amount: "2", status: "inactive", date: "2026-06-16" }
    ]
  },
  brands: {
    title: "ბრენდები",
    eyebrow: "ბრენდების კატალოგი",
    description: "მართეთ მწარმოებლები, მათი აღწერები და პროდუქტებთან კავშირი.",
    primaryColumn: "ბრენდი",
    detailColumn: "წარმოშობა",
    amountColumn: "პროდუქტები",
    createLabel: "ბრენდის დამატება",
    allowCreate: true,
    rows: [
      { id: "BR-01", title: "CROWN", subtitle: "Power tools", detail: "China", amount: "125", status: "active", date: "2026-06-21" },
      { id: "BR-02", title: "TOTAL", subtitle: "Tools and more", detail: "China", amount: "148", status: "active", date: "2026-06-20" },
      { id: "BR-03", title: "HOGERT", subtitle: "Technik", detail: "Poland", amount: "96", status: "active", date: "2026-06-19" },
      { id: "BR-04", title: "WADFOW", subtitle: "Professional tools", detail: "China", amount: "87", status: "active", date: "2026-06-18" },
      { id: "BR-05", title: "INGCO", subtitle: "Make the world in your hands", detail: "China", amount: "119", status: "active", date: "2026-06-17" },
      { id: "BR-06", title: "DECAKILA", subtitle: "by TOTAL", detail: "China", amount: "64", status: "pending", date: "2026-06-16" }
    ]
  },
  coupons: {
    title: "კუპონები",
    eyebrow: "აქციები და ფასდაკლებები",
    description: "შექმენით ფასდაკლების კოდები, განსაზღვრეთ ვადა და გამოყენების პირობები.",
    primaryColumn: "კოდი",
    detailColumn: "პირობა",
    amountColumn: "ფასდაკლება",
    createLabel: "კუპონის დამატება",
    allowCreate: true,
    rows: [
      { id: "CP-101", title: "WELCOME10", subtitle: "ახალი მომხმარებელი", detail: "მინ. 100 ₾", amount: "10%", status: "active", date: "2026-07-01" },
      { id: "CP-102", title: "SALE20", subtitle: "სეზონური აქცია", detail: "ყველა პროდუქტი", amount: "20 ₾", status: "active", date: "2026-06-30" },
      { id: "CP-103", title: "TOOLS15", subtitle: "ხელის ხელსაწყოები", detail: "მინ. 250 ₾", amount: "15%", status: "pending", date: "2026-07-15" },
      { id: "CP-104", title: "FREESHIP", subtitle: "უფასო მიწოდება", detail: "თბილისი", amount: "100%", status: "active", date: "2026-06-25" },
      { id: "CP-105", title: "OLD10", subtitle: "დასრულებული კამპანია", detail: "ყველა პროდუქტი", amount: "10%", status: "inactive", date: "2026-05-31" }
    ]
  },
  reviews: {
    title: "რევიუები",
    eyebrow: "შეფასებების მოდერაცია",
    description: "გადახედეთ მომხმარებლის შეფასებებს, გამოაქვეყნეთ ან დამალეთ არასასურველი კომენტარები.",
    primaryColumn: "ავტორი / პროდუქტი",
    detailColumn: "კომენტარი",
    amountColumn: "შეფასება",
    createLabel: "რევიუს დამატება",
    allowCreate: false,
    rows: [
      { id: "REV-201", title: "გიორგი მაისურაძე", subtitle: "CROWN პერფორატორი", detail: "ძლიერი და მოსახერხებელი ხელსაწყოა.", amount: "5 / 5", status: "active", date: "2026-06-21" },
      { id: "REV-202", title: "ანა მჭედლიშვილი", subtitle: "WADFOW დრელი", detail: "მიწოდება დროული იყო, პროდუქტი ხარისხიანია.", amount: "5 / 5", status: "active", date: "2026-06-20" },
      { id: "REV-203", title: "დავით ლომიძე", subtitle: "TOTAL ნაკრები", detail: "შეფუთვა დაზიანებული მოვიდა.", amount: "3 / 5", status: "pending", date: "2026-06-19" },
      { id: "REV-204", title: "ნინო კაპანაძე", subtitle: "INGCO სანათი", detail: "კარგი განათება და კომპაქტური დიზაინი.", amount: "4 / 5", status: "active", date: "2026-06-18" },
      { id: "REV-205", title: "ლაშა ბერიძე", subtitle: "HOGERT აქსესუარი", detail: "აღწერას ზუსტად შეესაბამება.", amount: "5 / 5", status: "active", date: "2026-06-17" }
    ]
  },
  banners: {
    title: "ბანერები",
    eyebrow: "მთავარი გვერდის კონტენტი",
    description: "მართეთ მთავარი სლაიდერის ბანერები, მათი თანმიმდევრობა და გამოქვეყნების სტატუსი.",
    primaryColumn: "ბანერი",
    detailColumn: "ბმული / პოზიცია",
    amountColumn: "რიგითობა",
    createLabel: "ბანერის დამატება",
    allowCreate: true,
    rows: [
      { id: "BAN-01", title: "პროფესიონალური ხელსაწყოები", subtitle: "მთავარი სლაიდერი", detail: "/products", amount: "1", status: "active", date: "2026-06-21" },
      { id: "BAN-02", title: "ზაფხულის ფასდაკლებები", subtitle: "მთავარი სლაიდერი", detail: "/products?discounted=true", amount: "2", status: "active", date: "2026-06-20" },
      { id: "BAN-03", title: "ახალი ბრენდები", subtitle: "მთავარი სლაიდერი", detail: "/#brands", amount: "3", status: "pending", date: "2026-06-19" },
      { id: "BAN-04", title: "უფასო მიწოდება", subtitle: "მობილური ბანერი", detail: "/delivery", amount: "4", status: "inactive", date: "2026-06-18" }
    ]
  },
  notifications: {
    title: "შეტყობინებები",
    eyebrow: "განცხადებები და სისტემური ამბები",
    description: "შექმენით ადმინისტრაციული განცხადებები და აკონტროლეთ მათი გამოქვეყნება.",
    primaryColumn: "შეტყობინება",
    detailColumn: "აუდიტორია",
    amountColumn: "არხი",
    createLabel: "შეტყობინების შექმნა",
    allowCreate: true,
    rows: [
      { id: "NTF-401", title: "ახალი შეკვეთა #TM-10523", subtitle: "სისტემური", detail: "ადმინისტრატორები", amount: "Panel", status: "pending", date: "2026-06-21" },
      { id: "NTF-402", title: "ზაფხულის ფასდაკლება დაიწყო", subtitle: "მარკეტინგი", detail: "ყველა მომხმარებელი", amount: "Email", status: "active", date: "2026-06-20" },
      { id: "NTF-403", title: "მარაგის დაბალი დონე", subtitle: "საწყობი", detail: "ადმინისტრატორები", amount: "Panel", status: "active", date: "2026-06-19" },
      { id: "NTF-404", title: "გეგმიური ტექნიკური სამუშაოები", subtitle: "სისტემური", detail: "ყველა მომხმარებელი", amount: "Site", status: "inactive", date: "2026-06-18" }
    ]
  },
  logs: {
    title: "აქტივობის ლოგები",
    eyebrow: "სისტემური აუდიტი",
    description: "იხილეთ ადმინისტრაციული მოქმედებების ისტორია, ავტორი და შესრულების დრო.",
    primaryColumn: "მოქმედება",
    detailColumn: "ავტორი / ობიექტი",
    amountColumn: "IP",
    createLabel: "ლოგის დამატება",
    allowCreate: false,
    rows: [
      { id: "LOG-901", title: "პროდუქტის განახლება", subtitle: "Admin", detail: "TM-CRN-RH850-002", amount: "127.0.0.1", status: "completed", date: "2026-06-21" },
      { id: "LOG-902", title: "შეკვეთის სტატუსის შეცვლა", subtitle: "Admin", detail: "TM-10523", amount: "127.0.0.1", status: "completed", date: "2026-06-21" },
      { id: "LOG-903", title: "ახალი კუპონის შექმნა", subtitle: "Admin", detail: "WELCOME10", amount: "127.0.0.1", status: "completed", date: "2026-06-20" },
      { id: "LOG-904", title: "მომხმარებლის როლის შეცვლა", subtitle: "Admin", detail: "USR-005", amount: "127.0.0.1", status: "completed", date: "2026-06-19" },
      { id: "LOG-905", title: "ბანერის გამორთვა", subtitle: "Admin", detail: "BAN-04", amount: "127.0.0.1", status: "completed", date: "2026-06-18" }
    ]
  }
};

const pageSize = 5;

export function AdminManagementPage({ module }: { module: AdminModuleKey }) {
  const config = configs[module];
  const [rows, setRows] = useState(config.rows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [deleting, setDeleting] = useState<AdminRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; detail?: string }>({});

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ka");
    return rows
      .filter((row) => status === "all" || row.status === status)
      .filter((row) =>
        [row.id, row.title, row.subtitle, row.detail, row.amount]
          .join(" ")
          .toLocaleLowerCase("ka")
          .includes(normalizedQuery)
      )
      .sort((a, b) => sortAscending ? a.title.localeCompare(b.title, "ka") : b.title.localeCompare(a.title, "ka"));
  }, [query, rows, sortAscending, status]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);

  const openCreate = () => {
    setErrors({});
    setEditing({
      id: `${module.toUpperCase().slice(0, 3)}-${String(rows.length + 1).padStart(3, "0")}`,
      title: "",
      subtitle: "",
      detail: "",
      amount: "",
      status: "active",
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const saveRecord = () => {
    if (!editing) return;
    const nextErrors = {
      title: editing.title.trim() ? undefined : "შეიყვანეთ დასახელება",
      detail: editing.detail.trim() ? undefined : "შეიყვანეთ დეტალი"
    };
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.detail) return;

    setRows((current) => {
      const exists = current.some((row) => row.id === editing.id);
      return exists ? current.map((row) => row.id === editing.id ? editing : row) : [editing, ...current];
    });
    setEditing(null);
    setToast("ჩანაწერი წარმატებით შეინახა");
  };

  const deleteRecord = () => {
    if (!deleting) return;
    setRows((current) => current.filter((row) => row.id !== deleting.id));
    setDeleting(null);
    setToast("ჩანაწერი წაიშალა");
  };

  return (
    <AdminShell
      title={config.title}
      eyebrow={config.eyebrow}
      description={config.description}
      searchValue={query}
      searchPlaceholder={`${config.title} - ძიება...`}
      onSearchChange={(value) => { setQuery(value); setPage(1); }}
      actions={config.allowCreate ? (
        <button type="button" onClick={openCreate} className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[#F58220] px-4 text-sm font-bold text-white transition hover:bg-[#E77514]">
          <Plus className="size-4" /> {config.createLabel}
        </button>
      ) : undefined}
    >
      <div className="mx-auto max-w-[1320px] space-y-5">
        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="სულ ჩანაწერი" value={String(rows.length)} />
          <SummaryCard label="აქტიური" value={String(rows.filter((row) => row.status === "active" || row.status === "completed").length)} tone="success" />
          <SummaryCard label="საჭიროებს ყურადღებას" value={String(rows.filter((row) => row.status === "pending" || row.status === "inactive").length)} tone="warning" />
        </section>

        <section className="overflow-hidden rounded-lg border border-[#E5EAF0] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E5EAF0] p-4 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A95A8]" />
              <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="ცხრილში ძიება..." className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] pl-10 pr-3 text-sm" />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
              <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="focus-ring h-11 min-w-44 appearance-none rounded-md border border-[#DDE4EC] bg-white pl-10 pr-8 text-sm font-semibold text-[#102033]">
                <option value="all">ყველა სტატუსი</option>
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => { setSortAscending((current) => !current); setPage(1); }} className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#DDE4EC] px-3 text-sm font-semibold text-[#072B4D] transition hover:border-[#F58220]">
              <ArrowDownAZ className="size-4" /> {sortAscending ? "A-Z" : "Z-A"}
            </button>
          </div>

          {visibleRows.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead className="bg-[#F7F8FA] text-xs font-bold uppercase text-[#6B7280]">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">{config.primaryColumn}</th>
                      <th className="px-4 py-3">{config.detailColumn}</th>
                      <th className="px-4 py-3">{config.amountColumn}</th>
                      <th className="px-4 py-3">სტატუსი</th>
                      <th className="px-4 py-3">თარიღი</th>
                      <th className="px-4 py-3 text-right">ქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF0F4]">
                    {visibleRows.map((row) => (
                      <tr key={row.id} className="transition hover:bg-[#FAFBFC]">
                        <td className="whitespace-nowrap px-4 py-4 text-xs font-bold text-[#6B7280]">#{row.id}</td>
                        <td className="max-w-64 px-4 py-4"><p className="truncate text-sm font-bold text-[#102033]">{row.title}</p><p className="mt-1 truncate text-xs text-[#6B7280]">{row.subtitle}</p></td>
                        <td className="max-w-64 px-4 py-4 text-sm text-[#4B5563]"><span className="line-clamp-2">{row.detail}</span></td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-[#072B4D]">{row.amount}</td>
                        <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#6B7280]">{row.date}</td>
                        <td className="px-4 py-4"><RowActions row={row} onEdit={setEditing} onDelete={setDeleting} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#EDF0F4] md:hidden">
                {visibleRows.map((row) => (
                  <article key={row.id} className="p-4">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold text-[#8A95A8]">#{row.id}</p><h2 className="mt-1 break-words text-sm font-bold text-[#102033]">{row.title}</h2><p className="mt-1 text-xs text-[#6B7280]">{row.subtitle}</p></div><StatusBadge status={row.status} /></div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-[#8A95A8]">{config.detailColumn}</dt><dd className="mt-1 break-words font-semibold text-[#4B5563]">{row.detail}</dd></div><div><dt className="text-[#8A95A8]">{config.amountColumn}</dt><dd className="mt-1 font-bold text-[#072B4D]">{row.amount}</dd></div></dl>
                    <div className="mt-4 flex items-center justify-between border-t border-[#EDF0F4] pt-3"><span className="text-xs text-[#6B7280]">{row.date}</span><RowActions row={row} onEdit={setEditing} onDelete={setDeleting} /></div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="grid min-h-72 place-items-center p-8 text-center"><div><CircleAlert className="mx-auto size-9 text-[#F58220]" /><h2 className="mt-3 text-base font-bold text-[#102033]">ჩანაწერი ვერ მოიძებნა</h2><p className="mt-1 text-sm text-[#6B7280]">შეცვალეთ საძიებო სიტყვა ან ფილტრი.</p></div></div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#E5EAF0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-[#6B7280]">ნაჩვენებია {visibleRows.length} / {filteredRows.length} ჩანაწერი</p>
            <div className="flex items-center gap-1" aria-label="გვერდების ნავიგაცია">
              <button type="button" disabled={activePage === 1} onClick={() => setPage(activePage - 1)} className="focus-ring grid size-9 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} aria-current={activePage === pageNumber ? "page" : undefined} className={["focus-ring grid size-9 place-items-center rounded-md border text-xs font-bold", activePage === pageNumber ? "border-[#072B4D] bg-[#072B4D] text-white" : "border-[#DDE4EC] text-[#072B4D] hover:border-[#F58220]"].join(" ")}>{pageNumber}</button>)}
              <button type="button" disabled={activePage === totalPages} onClick={() => setPage(activePage + 1)} className="focus-ring grid size-9 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </div>
          </div>
        </section>
      </div>

      {editing ? <RecordModal record={editing} config={config} errors={errors} onChange={setEditing} onClose={() => setEditing(null)} onSave={saveRecord} /> : null}
      {deleting ? <DeleteDialog record={deleting} onClose={() => setDeleting(null)} onConfirm={deleteRecord} /> : null}
      {toast ? <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-[110] flex max-w-sm items-center gap-3 rounded-lg border border-[#CBE8D5] bg-white px-4 py-3 text-sm font-bold text-[#176B45] shadow-lg"><span className="size-2 rounded-full bg-[#20A464]" />{toast}<button type="button" onClick={() => setToast(null)} aria-label="შეტყობინების დახურვა" className="ml-auto"><X className="size-4" /></button></div> : null}
    </AdminShell>
  );
}

function SummaryCard({ label, value, tone = "navy" }: { label: string; value: string; tone?: "navy" | "success" | "warning" }) {
  const colors = tone === "success" ? "bg-[#EAF8EF] text-[#176B45]" : tone === "warning" ? "bg-[#FFF4EA] text-[#B95D14]" : "bg-[#EAF2FA] text-[#072B4D]";
  return <div className="rounded-lg border border-[#E5EAF0] bg-white p-4 shadow-sm"><span className={["inline-flex rounded-md px-2 py-1 text-xs font-bold", colors].join(" ")}>{label}</span><p className="mt-3 text-2xl font-semibold text-[#102033]">{value}</p></div>;
}

function StatusBadge({ status }: { status: AdminRecord["status"] }) {
  const styles = status === "active" || status === "completed" ? "bg-[#EAF8EF] text-[#176B45]" : status === "pending" ? "bg-[#FFF4EA] text-[#B95D14]" : "bg-[#F0F2F5] text-[#6B7280]";
  return <span className={["inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold", styles].join(" ")}>{statusLabels[status]}</span>;
}

function RowActions({ row, onEdit, onDelete }: { row: AdminRecord; onEdit: (row: AdminRecord) => void; onDelete: (row: AdminRecord) => void }) {
  return <div className="flex justify-end gap-1"><button type="button" onClick={() => onEdit({ ...row })} aria-label={`${row.title} - ნახვა ან რედაქტირება`} className="focus-ring grid size-9 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]">{row.status === "completed" ? <Eye className="size-4" /> : <Pencil className="size-4" />}</button><button type="button" onClick={() => onDelete(row)} aria-label={`${row.title} - წაშლა`} className="focus-ring grid size-9 place-items-center rounded-md border border-[#F2D5D5] text-[#C5221F] transition hover:bg-[#FFF5F5]"><Trash2 className="size-4" /></button></div>;
}

function RecordModal({ record, config, errors, onChange, onClose, onSave }: { record: AdminRecord; config: ModuleConfig; errors: { title?: string; detail?: string }; onChange: (row: AdminRecord) => void; onClose: () => void; onSave: () => void }) {
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { firstInputRef.current?.focus(); }, []);
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEscape); };
  }, [onClose]);

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="record-dialog-title" className="w-full max-w-xl rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4"><div><p className="text-xs font-bold uppercase text-[#F58220]">#{record.id}</p><h2 id="record-dialog-title" className="mt-1 text-lg font-semibold text-[#102033]">ჩანაწერის რედაქტირება</h2></div><button type="button" onClick={onClose} aria-label="ფანჯრის დახურვა" className="focus-ring grid size-10 place-items-center rounded-md border border-[#DDE4EC]"><X className="size-4" /></button></div><div className="grid gap-4 p-5 sm:grid-cols-2"><Field label={config.primaryColumn} error={errors.title}><input ref={firstInputRef} value={record.title} onChange={(event) => onChange({ ...record, title: event.target.value })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm" /></Field><Field label="ქვესათაური"><input value={record.subtitle} onChange={(event) => onChange({ ...record, subtitle: event.target.value })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm" /></Field><Field label={config.detailColumn} error={errors.detail}><input value={record.detail} onChange={(event) => onChange({ ...record, detail: event.target.value })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm" /></Field><Field label={config.amountColumn}><input value={record.amount} onChange={(event) => onChange({ ...record, amount: event.target.value })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm" /></Field><Field label="სტატუსი"><select value={record.status} onChange={(event) => onChange({ ...record, status: event.target.value as AdminRecord["status"] })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] bg-white px-3 text-sm">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="თარიღი"><input type="date" value={record.date} onChange={(event) => onChange({ ...record, date: event.target.value })} className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm" /></Field></div><div className="flex justify-end gap-2 border-t border-[#E5EAF0] px-5 py-4"><button type="button" onClick={onClose} className="focus-ring h-11 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D]">გაუქმება</button><button type="button" onClick={onSave} className="focus-ring h-11 rounded-md bg-[#072B4D] px-4 text-sm font-bold text-white transition hover:bg-[#0B3A68]">შენახვა</button></div></div></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-bold text-[#102033]">{label}{children}{error ? <span className="text-xs font-semibold text-[#C5221F]">{error}</span> : null}</label>;
}

function DeleteDialog({ record, onClose, onConfirm }: { record: AdminRecord; onClose: () => void; onConfirm: () => void }) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  return <div className="fixed inset-0 z-[105] grid place-items-center bg-black/45 p-4"><div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl"><span className="grid size-11 place-items-center rounded-full bg-[#FFF1F1] text-[#C5221F]"><Trash2 className="size-5" /></span><h2 className="mt-4 text-lg font-semibold text-[#102033]">ჩანაწერის წაშლა?</h2><p className="mt-2 text-sm leading-6 text-[#6B7280]">„{record.title}“ ამ სიიდან წაიშლება. მოქმედების გაუქმება შეუძლებელი იქნება.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="focus-ring h-11 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D]">გაუქმება</button><button type="button" onClick={onConfirm} className="focus-ring h-11 rounded-md bg-[#C5221F] px-4 text-sm font-bold text-white">წაშლა</button></div></div></div>;
}
