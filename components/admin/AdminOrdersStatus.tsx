import { AlertTriangle, Database, ListChecks } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

const implementationSteps = [
  "დაემატოს `Order` მოდელი შეკვეთის ძირითად ველებთან ერთად.",
  "დაემატოს `OrderItem` სტრუქტურა პროდუქტებისა და რაოდენობების შესანახად.",
  "checkout flow-მ შეკვეთა რეალურად ჩაწეროს ბაზაში და არა მხოლოდ UI state-ში.",
  "ადმინის API-მ უზრუნველყოს სტატუსის ცვლილება: მომლოდინე, დამუშავებაში, დასრულებული, გაუქმებული.",
];

export function AdminOrdersStatus() {
  return (
    <AdminShell
      title="შეკვეთები"
      eyebrow="ოპერაციული სტატუსი"
      description="შეკვეთების გვერდი შემოწმებულია რეალურ მონაცემთა მოდელზე. მიმდინარე კოდბაზაში შეკვეთების Prisma მოდელი ჯერ არ არის კონფიგურირებული."
    >
      <div className="space-y-5">
        <section className="rounded-xl border border-[#F3D3D1] bg-white shadow-sm">
          <div className="border-b border-[#F3D3D1] p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#FFF3E8] text-[#F58220]">
                <AlertTriangle className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-[#0D1B2A]">შეკვეთების რეალური ბაზა ჯერ არ არის ჩართული</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">
                  მიმდინარე `prisma/schema.prisma` არ შეიცავს `Order` მოდელს, ამიტომ შეკვეთების ცხრილის რეალური წამოღება და
                  სტატუსის შეცვლა უსაფრთხოდ ვერ ჩაირთვება ამ ეტაპზე დამატებითი მონაცემთა მოდელის გარეშე.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <article className="rounded-xl border border-[#E5EAF0] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-2">
                <Database className="size-5 text-[#072B4D]" />
                <h3 className="text-base font-semibold text-[#102033]">დაფიქსირებული ბლოკერი</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                შეკვეთების მოდელი, შეკვეთის ერთეულები და სტატუსის სერვერული განახლების endpoint-ები ჯერ არ არსებობს. ამის
                გარეშე admin გვერდზე რეალური შეკვეთების ჩვენება ფეიქ მონაცემების გარეშე შეუძლებელია.
              </p>
            </article>

            <article className="rounded-xl border border-[#E5EAF0] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-2">
                <ListChecks className="size-5 text-[#072B4D]" />
                <h3 className="text-base font-semibold text-[#102033]">მინიმალური უსაფრთხო გეგმა</h3>
              </div>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#4B5563]">
                {implementationSteps.map((step) => (
                  <li key={step} className="rounded-lg bg-white px-3 py-2">
                    {step}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
