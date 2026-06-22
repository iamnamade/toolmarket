"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgePlus,
  BellRing,
  Box,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CloudUpload,
  FileText,
  Globe2,
  Home,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  RotateCcw,
  Save,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Tags,
  Users,
  X
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import type { LucideIcon } from "lucide-react";

type SettingsState = {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredProductsEnabled: boolean;
  adminNotificationEmail: string;
  orderConfirmationText: string;
  deliveryNote: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  returnPolicyUrl: string;
  deliveryPolicyUrl: string;
};

type NoticeState = {
  title: string;
  text: string;
  tone: "success" | "info";
} | null;

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Orders", icon: ShoppingBag },
  { label: "Users", icon: Users },
  { label: "Categories", icon: Tags },
  { label: "Brands", icon: BadgePlus },
  { label: "Reviews", icon: Star },
  { label: "Analytics", icon: Box },
  { label: "Settings", icon: Settings, href: "/admin/settings" }
];

const defaultSettings: SettingsState = {
  storeName: "ToolMarket.ge",
  phone: "+995 32 2 00 33 33",
  email: "info@toolmarket.ge",
  address: "თბილისი, საქართველო",
  workingHours: "ორშაბათი - შაბათი, 09:00 - 19:00",
  facebook: "https://facebook.com/toolmarket.ge",
  instagram: "https://instagram.com/toolmarket.ge",
  whatsapp: "https://wa.me/995322003333",
  heroTitle: "პროფესიონალური ხელსაწყოები და მასალები",
  heroSubtitle: "ხარისხიანი პროდუქცია მშენებლობისთვის, რემონტისა და ყოველდღიური სამუშაოებისთვის.",
  featuredProductsEnabled: true,
  adminNotificationEmail: "orders@toolmarket.ge",
  orderConfirmationText: "თქვენი შეკვეთა მიღებულია და მალე დაიწყება მისი დამუშავება.",
  deliveryNote: "თბილისში მიწოდება 1-2 სამუშაო დღეში. რეგიონებში ვადა შეთანხმდება ოპერატორთან.",
  privacyPolicyUrl: "/privacy-policy",
  termsUrl: "/terms",
  returnPolicyUrl: "/return-policy",
  deliveryPolicyUrl: "/delivery-policy"
};

const noticeStyles: Record<NonNullable<NoticeState>["tone"], string> = {
  success: "border-[#CBE8D5] bg-[#F0FBF4] text-[#176B45]",
  info: "border-[#DDE6F2] bg-[#F5F9FD] text-[#072B4D]"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminSettings() {
  // TODO(backend): replace local settings state with persisted admin settings.
  // See docs/admin-backend-readiness.md before connecting database, uploads, email, or roles.
  const [settings, setSettings] = useState<SettingsState>({ ...defaultSettings });
  const [savedSettings, setSavedSettings] = useState<SettingsState>({ ...defaultSettings });
  const [errors, setErrors] = useState<Partial<Record<keyof SettingsState, string>>>({});
  const [notice, setNotice] = useState<NoticeState>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [savedSettings, settings]
  );

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const updateSetting = <Key extends keyof SettingsState>(
    key: Key,
    value: SettingsState[Key]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof SettingsState, string>> = {};

    if (!settings.storeName.trim()) {
      nextErrors.storeName = "მაღაზიის სახელი სავალდებულოა";
    }

    if (!settings.phone.trim()) {
      nextErrors.phone = "ტელეფონი სავალდებულოა";
    }

    if (!emailPattern.test(settings.email.trim())) {
      nextErrors.email = "მიუთითეთ სწორი ელ. ფოსტა";
    }

    if (!settings.address.trim()) {
      nextErrors.address = "მისამართი სავალდებულოა";
    }

    if (!settings.workingHours.trim()) {
      nextErrors.workingHours = "სამუშაო საათები სავალდებულოა";
    }

    if (!emailPattern.test(settings.adminNotificationEmail.trim())) {
      nextErrors.adminNotificationEmail = "მიუთითეთ სწორი შეტყობინების ელ. ფოსტა";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setNotice({
        title: "შეამოწმეთ ფორმა",
        text: "რამდენიმე აუცილებელი ველი შესასწორებელია.",
        tone: "info"
      });
      return;
    }

    setSavedSettings({ ...settings });
    setNotice({
      title: "პარამეტრები შენახულია",
      text: "ცვლილებები ამ სესიის განმავლობაში ადგილობრივ React state-ში ინახება.",
      tone: "success"
    });
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    setSavedSettings({ ...defaultSettings });
    setErrors({});
    setNotice({
      title: "ნაგულისხმევი პარამეტრები აღდგა",
      text: "ყველა ველი დაბრუნდა საწყის mock მნიშვნელობებზე.",
      tone: "info"
    });
  };

  const showUploadPlaceholder = () => {
    setNotice({
      title: "ბანერების ატვირთვა ჯერ არ არის დაკავშირებული",
      text: "Cloudinary ინტეგრაცია მომავალ ფაზაში დაემატება. ამ ეტაპზე ღილაკი მხოლოდ UX placeholder-ია.",
      tone: "info"
    });
  };

  const showComingSoon = (label: string) => {
    setMobileSidebarOpen(false);
    setNotice({
      title: label,
      text: "ეს ადმინისტრაციული მოდული მომავალ ფაზაში დაემატება.",
      tone: "info"
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F6F9]">
      <AdminSidebar onComingSoon={showComingSoon} />

      {mobileSidebarOpen ? (
        <MobileAdminSidebar
          onClose={() => setMobileSidebarOpen(false)}
          onComingSoon={showComingSoon}
        />
      ) : null}

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-[#E5EAF0] bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center gap-3 px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="focus-ring grid size-11 shrink-0 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] lg:hidden"
              aria-label="ადმინისტრაციის მენიუს გახსნა"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-[#F58220]">
                ადმინისტრაციის პანელი
              </p>
              <h1 className="truncate text-lg font-black text-[#041C32] sm:text-xl">
                პარამეტრები
              </h1>
            </div>

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <span
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-black",
                  isDirty
                    ? "bg-[#FFF4EA] text-[#B95D14]"
                    : "bg-[#EAF8EF] text-[#176B45]"
                ].join(" ")}
              >
                {isDirty ? "შეუნახავი ცვლილებები" : "ყველაფერი შენახულია"}
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-6 lg:py-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            className="mx-auto max-w-[1440px]"
          >
            {notice ? (
              <NoticeBanner
                notice={notice}
                onClose={() => setNotice(null)}
              />
            ) : null}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#F58220]">Store configuration</p>
                <h2 className="mt-1 text-2xl font-black text-[#041C32] sm:text-3xl">
                  მაღაზიის პარამეტრები
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                  მართეთ საჯარო ინფორმაცია, მთავარი გვერდის ტექსტები, შეკვეთის შეტყობინებები
                  და იურიდიული ბმულები.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                >
                  <RotateCcw className="size-4" />
                  აღდგენა
                </button>
                <button
                  type="submit"
                  className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[#F58220] px-5 text-sm font-black text-white transition hover:bg-[#E77514]"
                >
                  <Save className="size-4" />
                  შენახვა
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)]">
              <div className="space-y-6">
                <SettingsSection
                  icon={Store}
                  title="მაღაზიის ინფორმაცია"
                  description="საკონტაქტო და სამუშაო ინფორმაცია, რომელიც მომხმარებელს საჯაროდ გამოუჩნდება."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="მაღაზიის სახელი"
                      icon={<Store className="size-4" />}
                      value={settings.storeName}
                      error={errors.storeName}
                      onChange={(event) => updateSetting("storeName", event.target.value)}
                    />
                    <TextField
                      label="ტელეფონი"
                      icon={<Phone className="size-4" />}
                      value={settings.phone}
                      error={errors.phone}
                      onChange={(event) => updateSetting("phone", event.target.value)}
                    />
                    <TextField
                      label="ელ. ფოსტა"
                      icon={<Mail className="size-4" />}
                      type="email"
                      value={settings.email}
                      error={errors.email}
                      onChange={(event) => updateSetting("email", event.target.value)}
                    />
                    <TextField
                      label="სამუშაო საათები"
                      icon={<Clock3 className="size-4" />}
                      value={settings.workingHours}
                      error={errors.workingHours}
                      onChange={(event) => updateSetting("workingHours", event.target.value)}
                    />
                    <div className="sm:col-span-2">
                      <TextField
                        label="მისამართი"
                        icon={<MapPin className="size-4" />}
                        value={settings.address}
                        error={errors.address}
                        onChange={(event) => updateSetting("address", event.target.value)}
                      />
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection
                  icon={Home}
                  title="მთავარი გვერდის პარამეტრები"
                  description="Hero ტექსტები და კატალოგის გამორჩეული პროდუქტების ვიზუალური კონტროლი."
                >
                  <div className="grid gap-4">
                    <TextField
                      label="Hero სათაური"
                      value={settings.heroTitle}
                      onChange={(event) => updateSetting("heroTitle", event.target.value)}
                    />
                    <TextareaField
                      label="Hero ქვესათაური"
                      value={settings.heroSubtitle}
                      onChange={(event) => updateSetting("heroSubtitle", event.target.value)}
                      rows={4}
                    />
                    <ToggleRow
                      label="გამორჩეული პროდუქტები"
                      description="მთავარ გვერდზე featured პროდუქტების სექციის ჩვენების mock კონტროლი."
                      checked={settings.featuredProductsEnabled}
                      onChange={(checked) => updateSetting("featuredProductsEnabled", checked)}
                    />
                    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F7F9FC] p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-[#F58220] shadow-sm">
                          <CloudUpload className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-[#041C32]">მთავარი ბანერები</p>
                          <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                            სურათების ატვირთვა Cloudinary-ის ინტეგრაციის შემდეგ ჩაირთვება.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={showUploadPlaceholder}
                          className="focus-ring inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#DDE4EC] bg-white px-3 text-xs font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                        >
                          <CloudUpload className="size-4" />
                          ატვირთვა
                        </button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection
                  icon={ShoppingBag}
                  title="შეკვეთის პარამეტრები"
                  description="ადმინისტრაციული შეტყობინებები და მომხმარებლის შეკვეთის ტექსტები."
                >
                  <div className="grid gap-4">
                    <TextField
                      label="ადმინისტრატორის შეტყობინების ელ. ფოსტა"
                      type="email"
                      value={settings.adminNotificationEmail}
                      error={errors.adminNotificationEmail}
                      onChange={(event) =>
                        updateSetting("adminNotificationEmail", event.target.value)
                      }
                    />
                    <TextareaField
                      label="შეკვეთის დადასტურების ტექსტი"
                      value={settings.orderConfirmationText}
                      onChange={(event) =>
                        updateSetting("orderConfirmationText", event.target.value)
                      }
                      rows={4}
                    />
                    <TextareaField
                      label="მიწოდების შენიშვნა"
                      value={settings.deliveryNote}
                      onChange={(event) => updateSetting("deliveryNote", event.target.value)}
                      rows={4}
                    />
                  </div>
                </SettingsSection>
              </div>

              <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                <SettingsSection
                  icon={Globe2}
                  title="სოციალური ბმულები"
                  description="მაღაზიის ოფიციალური სოციალური არხები."
                >
                  <div className="grid gap-4">
                    <TextField
                      label="Facebook"
                      icon={<Globe2 className="size-4" />}
                      type="url"
                      value={settings.facebook}
                      onChange={(event) => updateSetting("facebook", event.target.value)}
                    />
                    <TextField
                      label="Instagram"
                      icon={<Camera className="size-4" />}
                      type="url"
                      value={settings.instagram}
                      onChange={(event) => updateSetting("instagram", event.target.value)}
                    />
                    <TextField
                      label="WhatsApp"
                      icon={<Phone className="size-4" />}
                      type="url"
                      value={settings.whatsapp}
                      onChange={(event) => updateSetting("whatsapp", event.target.value)}
                    />
                  </div>
                </SettingsSection>

                <SettingsSection
                  icon={FileText}
                  title="იურიდიული ბმულები"
                  description="საჯარო წესები და პოლიტიკის გვერდები."
                >
                  <div className="grid gap-4">
                    <TextField
                      label="კონფიდენციალურობის პოლიტიკა"
                      value={settings.privacyPolicyUrl}
                      onChange={(event) =>
                        updateSetting("privacyPolicyUrl", event.target.value)
                      }
                    />
                    <TextField
                      label="წესები და პირობები"
                      value={settings.termsUrl}
                      onChange={(event) => updateSetting("termsUrl", event.target.value)}
                    />
                    <TextField
                      label="დაბრუნების პოლიტიკა"
                      value={settings.returnPolicyUrl}
                      onChange={(event) =>
                        updateSetting("returnPolicyUrl", event.target.value)
                      }
                    />
                    <TextField
                      label="მიწოდების პოლიტიკა"
                      value={settings.deliveryPolicyUrl}
                      onChange={(event) =>
                        updateSetting("deliveryPolicyUrl", event.target.value)
                      }
                    />
                  </div>
                </SettingsSection>

                <section className="rounded-xl border border-[#DDE6F2] bg-[#F5F9FD] p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-[#072B4D]">
                      <BellRing className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-[#041C32]">
                        Backend readiness
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                        ეს გვერდი შეგნებულად იყენებს მხოლოდ local state-ს. მომავალი სერვისების
                        პასუხისმგებლობები აღწერილია დოკუმენტში.
                      </p>
                      <Link
                        href="/admin/settings"
                        onClick={(event) => {
                          event.preventDefault();
                          setNotice({
                            title: "ინტეგრაციის ჩანაწერი",
                            text: "დეველოპერული TODO განთავსებულია docs/admin-backend-readiness.md ფაილში.",
                            tone: "info"
                          });
                        }}
                        className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md text-xs font-black text-[#072B4D] transition hover:text-[#F58220]"
                      >
                        ჩანაწერის მდებარეობა
                        <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </section>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                  >
                    <RotateCcw className="size-4" />
                    ნაგულისხმევზე დაბრუნება
                  </button>
                  <button
                    type="submit"
                    className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#F58220] px-4 text-sm font-black text-white transition hover:bg-[#E77514]"
                  >
                    <Save className="size-4" />
                    პარამეტრების შენახვა
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  onComingSoon
}: {
  onComingSoon: (label: string) => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#041C32] text-white lg:flex">
      <div className="border-b border-white/10 px-5 py-4">
        <Link href="/" className="focus-ring inline-flex rounded-md">
          <Logo inverted />
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
          Admin control panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="ადმინისტრაციის ნავიგაცია">
        <div className="grid gap-1">
          {sidebarItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              onComingSoon={onComingSoon}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-white/80 transition hover:border-[#F58220] hover:text-white"
        >
          <Store className="size-5 text-[#F58220]" />
          მაღაზიაში დაბრუნება
          <ArrowUpRight className="ml-auto size-4" />
        </Link>
      </div>
    </aside>
  );
}

function MobileAdminSidebar({
  onClose,
  onComingSoon
}: {
  onClose: () => void;
  onComingSoon: (label: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="მენიუს დახურვა"
        onClick={onClose}
        className="absolute inset-0 bg-[#041C32]/45 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(320px,88vw)] flex-col bg-[#041C32] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Logo inverted />
          <button
            type="button"
            aria-label="მენიუს დახურვა"
            onClick={onClose}
            className="focus-ring grid size-10 place-items-center rounded-md border border-white/12 text-white"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="მობილური ნავიგაცია">
          <div className="grid gap-1">
            {sidebarItems.map((item) => (
              <SidebarLink
                key={item.label}
                item={item}
                onComingSoon={onComingSoon}
              />
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}

function SidebarLink({
  item,
  onComingSoon
}: {
  item: SidebarItem;
  onComingSoon: (label: string) => void;
}) {
  const Icon = item.icon;
  const active = item.href === "/admin/settings";

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={[
          "focus-ring flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-black transition",
          active
            ? "bg-[#0B3A68] text-white shadow-[inset_3px_0_0_#F58220]"
            : "text-white/72 hover:bg-white/6 hover:text-white"
        ].join(" ")}
      >
        <Icon className={["size-5", active ? "text-[#F58220]" : "text-white/48"].join(" ")} />
        {item.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onComingSoon(item.label)}
      className="focus-ring flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-white/68 transition hover:bg-white/7 hover:text-white"
    >
      <Icon className="size-5 text-white/48" />
      {item.label}
      <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-white/40">
        მალე
      </span>
    </button>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E5EAF0] bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-[#E5EAF0] p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#FFF4EA] text-[#F58220]">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-black text-[#041C32]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#6B7280]">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function TextField({
  label,
  icon,
  error,
  ...props
}: {
  label: string;
  icon?: ReactNode;
  error?: string;
} & Omit<ComponentProps<"input">, "className">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[#102033]">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A95A8]">
            {icon}
          </span>
        ) : null}
        <input
          {...props}
          className={[
            "focus-ring h-12 w-full rounded-md border bg-white px-4 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]",
            icon ? "pl-11" : "",
            error ? "border-[#D92D20]" : "border-[#DDE4EC]"
          ].join(" ")}
        />
      </span>
      {error ? <span className="mt-1.5 block text-xs font-semibold text-[#D92D20]">{error}</span> : null}
    </label>
  );
}

function TextareaField({
  label,
  ...props
}: {
  label: string;
} & Omit<ComponentProps<"textarea">, "className">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[#102033]">{label}</span>
      <textarea
        {...props}
        className="focus-ring w-full resize-y rounded-md border border-[#DDE4EC] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#102033] placeholder:text-[#8A95A8]"
      />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E5EAF0] bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-[#041C32]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#6B7280]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "focus-ring relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-[#F58220]" : "bg-[#CBD5E1]"
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 size-5 rounded-full bg-white shadow-sm transition",
            checked ? "left-6" : "left-1"
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function NoticeBanner({
  notice,
  onClose
}: {
  notice: NonNullable<NoticeState>;
  onClose: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 shadow-sm",
        noticeStyles[notice.tone]
      ].join(" ")}
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-black">{notice.title}</p>
        <p className="mt-1 text-sm leading-6">{notice.text}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="focus-ring ml-auto grid size-8 shrink-0 place-items-center rounded-md transition hover:bg-white/70"
        aria-label="შეტყობინების დახურვა"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
