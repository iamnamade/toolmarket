import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const contactCards = [
  {
    title: "ტელეფონი",
    value: "+995 32 2 00 33 33",
    description: "კონსულტაცია და შეკვეთის მხარდაჭერა",
    icon: Phone
  },
  {
    title: "ელ. ფოსტა",
    value: "info@toolmarket.ge",
    description: "პარტნიორობა და ზოგადი კითხვები",
    icon: Mail
  },
  {
    title: "მისამართი",
    value: "თბილისი, საქართველო",
    description: "მისამართი დაზუსტდება მომდევნო ფაზაში",
    icon: MapPin
  },
  {
    title: "სამუშაო საათები",
    value: "10:00 - 19:00",
    description: "ორშაბათი - შაბათი",
    icon: Clock
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          <div className="max-w-3xl">
            <span className="text-sm font-black text-[#F58220]">კონტაქტი</span>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-[#041C32] sm:text-4xl">
              როგორ დაგვიკავშირდეთ
            </h1>
            <p className="mt-4 text-base leading-7 text-[#6B7280]">
              მოგვწერეთ შეკვეთაზე, პროდუქტზე ან თანამშრომლობაზე. ჩვენი გუნდი დაგეხმარებათ
              სწორი პროდუქტის შერჩევასა და შეკვეთის დეტალების დაზუსტებაში.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="relative grid min-h-[340px] overflow-hidden rounded-lg border border-[#E5EAF0] bg-white">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(#E5EAF0 1px, transparent 1px), linear-gradient(90deg, #E5EAF0 1px, transparent 1px)",
                backgroundSize: "42px 42px"
              }}
              aria-hidden="true"
            />
            <div className="relative grid place-items-center p-6 text-center">
              <div className="max-w-md">
                <div className="mx-auto grid size-14 place-items-center rounded-md bg-[#072B4D] text-white ring-8 ring-[#F7F8FA]">
                  <MapPin className="size-7" />
                </div>
                <h2 className="mt-5 text-2xl font-black text-[#041C32]">
                  ToolMarket.ge რუკაზე
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  რუკა დაემატება მისამართის დაზუსტების შემდეგ
                </p>
                <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-4 py-2 text-sm font-black text-[#0B3A68]">
                  <Navigation className="size-4 text-[#F58220]" />
                  თბილისი, საქართველო
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <article
                key={card.title}
                className="rounded-lg border border-[#E5EAF0] bg-white p-5 transition hover:border-[#F58220]"
              >
                <div className="mb-4 grid size-11 place-items-center rounded-md bg-[#F7F8FA] text-[#072B4D] ring-1 ring-[#E5EAF0]">
                  <card.icon className="size-5" />
                </div>
                <h2 className="text-sm font-black text-[#102033]">{card.title}</h2>
                <p className="mt-2 text-lg font-black text-[#041C32]">{card.value}</p>
                <p className="mt-1 text-sm leading-6 text-[#6B7280]">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
