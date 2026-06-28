import Link from "next/link";
import { Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { footerLinks } from "@/data/site";

export function Footer() {
  return (
    <footer id="footer" className="bg-[#041C32] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.7fr] lg:px-6">
        <div>
          <p className="max-w-sm text-sm leading-7 text-white/70">
            პროფესიონალური ხელსაწყოები, სამშენებლო მასალები და ტექნიკური პროდუქტები
            სანდო ecommerce სივრცეში.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">კონტაქტი</h2>
          <div className="mt-5 grid gap-3 text-sm text-white/78">
            <ContactLine icon={<Phone className="size-4" />} label="ტელეფონი" value="+995 32 2 00 33 33" />
            <ContactLine icon={<Mail className="size-4" />} label="ელ.ფოსტა" value="info@toolmarket.ge" />
            <ContactLine icon={<MapPin className="size-4" />} label="მისამართი" value="თბილისი, საქართველო" />
          </div>
        </div>

        <FooterColumn title="მომხმარებელი" links={footerLinks.customer} />
        <FooterColumn title="კომპანია" links={footerLinks.company} />

        <div>
          <h2 className="text-base font-black">სოციალური ბმულები</h2>
          <div className="mt-5 flex gap-2">
            <SocialLink label="ვებგვერდი" icon={<Globe className="size-4" />} />
            <SocialLink label="გაზიარება" icon={<Share2 className="size-4" />} />
            <SocialLink label="მესიჯი" icon={<MessageCircle className="size-4" />} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>Copyright © 2026 ToolMarket.ge. All rights reserved.</p>
          <p>შექმნილია ToolMarket.ge გუნდისთვის</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h2 className="text-base font-black">{title}</h2>
      <nav className="mt-5 grid gap-3" aria-label={title}>
        {links.map((link) => (
          <Link
            key={link}
            href="#"
            className="footer-nav-link focus-ring w-fit rounded-md text-sm text-white/65 transition hover:text-white"
          >
            {link}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ContactLine({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-md bg-white/10 text-[#F58220]" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-bold text-white/45">{label}</span>
        <span className="block font-bold text-white">{value}</span>
      </span>
    </div>
  );
}

function SocialLink({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="focus-ring grid size-10 place-items-center rounded-md border border-white/15 bg-white/8 text-white transition hover:border-[#F58220] hover:text-[#F58220]"
    >
      {icon}
    </Link>
  );
}
