"use client";

import { RefreshCw, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type CustomerRow = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: string;
  status: string;
};

export function AdminCustomersManager() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ka");

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.role, customer.status]
        .join(" ")
        .toLocaleLowerCase("ka")
        .includes(normalizedQuery)
    );
  }, [customers, query]);

  const adminCount = customers.filter((customer) => customer.role === "ADMIN").length;
  const activeCount = customers.filter((customer) => customer.status === "აქტიური").length;

  useEffect(() => {
    void loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/customers", {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; users?: CustomerRow[] }
        | null;

      if (!response.ok || !payload?.users) {
        setError(payload?.error ?? "მომხმარებლების ჩატვირთვა ვერ მოხერხდა.");
        return;
      }

      setCustomers(payload.users);
    } catch {
      setError("მომხმარებლების ჩატვირთვა ვერ მოხერხდა.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell
      title="მომხმარებლები"
      eyebrow="ანგარიშები და როლები"
      description="მომხმარებელთა სია იტვირთება ავტორიზაციის მონაცემთა ბაზიდან და აჩვენებს ძირითად სტატუსებსა და როლებს."
      searchValue={query}
      searchPlaceholder="სახელის, ელფოსტის ან როლის ძიება..."
      onSearchChange={setQuery}
      actions={
        <button
          type="button"
          onClick={() => void loadCustomers()}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
        >
          <RefreshCw className="size-4" />
          განახლება
        </button>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="სულ მომხმარებელი" value={String(customers.length)} tone="navy" />
          <SummaryCard label="აქტიური" value={String(activeCount)} tone="success" />
          <SummaryCard label="ADMIN" value={String(adminCount)} tone="warning" />
        </section>

        {error ? (
          <div className="rounded-xl border border-[#F3D3D1] bg-[#FFF7F7] px-4 py-3 text-sm font-semibold text-[#A32A24]">
            {error}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-sm">
          <div className="border-b border-[#E5EAF0] p-4">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">მომხმარებლების სია</h2>
            <p className="mt-1 text-sm text-[#6B7280]">ნაჩვენებია რეგისტრირებული მომხმარებლები და მათი მიმდინარე როლები.</p>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-[#F4F6F9]" />
              ))}
            </div>
          ) : filteredCustomers.length ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-[#F8F9FB] text-xs uppercase text-[#6B7280]">
                    <tr>
                      <th className="px-5 py-3 font-bold">მომხმარებელი</th>
                      <th className="px-5 py-3 font-bold">ელფოსტა</th>
                      <th className="px-5 py-3 font-bold">როლი</th>
                      <th className="px-5 py-3 font-bold">სტატუსი</th>
                      <th className="px-5 py-3 font-bold">შექმნის თარიღი</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EBEB]">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="transition hover:bg-[#FAFBFC]">
                        <td className="px-5 py-4 font-bold text-[#102033]">{customer.name}</td>
                        <td className="px-5 py-4 text-[#4B5563]">{customer.email}</td>
                        <td className="px-5 py-4 font-semibold text-[#072B4D]">{customer.role}</td>
                        <td className="px-5 py-4">
                          <StatusChip label={customer.status} />
                        </td>
                        <td className="px-5 py-4 text-[#6B7280]">{formatAdminDate(customer.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#E6EBEB] lg:hidden">
                {filteredCustomers.map((customer) => (
                  <article key={customer.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-bold text-[#102033]">{customer.name}</h3>
                        <p className="mt-1 break-all text-xs text-[#6B7280]">{customer.email}</p>
                      </div>
                      <StatusChip label={customer.status} />
                    </div>
                    <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                      <div>
                        <dt className="text-[#8A95A8]">როლი</dt>
                        <dd className="mt-1 text-sm font-semibold text-[#102033]">{customer.role}</dd>
                      </div>
                      <div>
                        <dt className="text-[#8A95A8]">შექმნილია</dt>
                        <dd className="mt-1 text-sm font-semibold text-[#102033]">{formatAdminDate(customer.createdAt)}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <SearchX className="mx-auto size-10 text-[#F58220]" />
                <h3 className="mt-4 text-lg font-bold text-[#102033]">მომხმარებელი ვერ მოიძებნა</h3>
                <p className="mt-2 max-w-md text-sm text-[#6B7280]">
                  შეცვალეთ საძიებო სიტყვა ან განაახლეთ სია, რომ შესაბამისი ჩანაწერები გამოჩნდეს.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function SummaryCard({
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
    <article className="rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
      <span className={["inline-flex rounded-md px-2 py-1 text-xs font-bold", styles].join(" ")}>
        {label}
      </span>
      <p className="mt-3 text-2xl font-semibold text-[#102033]">{value}</p>
    </article>
  );
}

function StatusChip({ label }: { label: string }) {
  const active = label === "აქტიური";

  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold",
        active ? "bg-[#EAF8EF] text-[#176B45]" : "bg-[#FFF4EA] text-[#B95D14]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("ka-GE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
