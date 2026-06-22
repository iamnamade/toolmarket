"use client";

import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Truck,
  UserRound
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/price";

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AddressInfo = {
  address: string;
  city: string;
};

type PasswordDraft = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type OrderStatus =
  | "ახალი"
  | "დამუშავებაშია"
  | "გზაშია"
  | "დასრულებულია"
  | "გაუქმებულია";

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type ProfileOrder = {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  productsCount: number;
  estimatedDelivery: string;
  deliveryAddress: string;
  items: OrderItem[];
};

const initialPersonalInfo: PersonalInfo = {
  firstName: "ნიკა",
  lastName: "ბერიძე",
  email: "nika@toolmarket.ge",
  phone: "+995 599 12 34 56"
};

const initialAddressInfo: AddressInfo = {
  address: "რუსთაველის გამზირი 24, ბინა 18",
  city: "თბილისი"
};

const emptyPasswordDraft: PasswordDraft = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

const mockOrders: ProfileOrder[] = [
  {
    id: "tm-10483",
    number: "TM-10483",
    date: "2026-06-09",
    status: "ახალი",
    total: 329.9,
    productsCount: 3,
    estimatedDelivery: "მიწოდება 2-3 სამუშაო დღეში",
    deliveryAddress: "თბილისი, რუსთაველის გამზირი 24, ბინა 18",
    items: [
      { name: "INGCO აკუმულატორული დრელი 20V", quantity: 1, unitPrice: 189.0 },
      { name: "TOTAL სახრახნისების ნაკრები 32 ც", quantity: 1, unitPrice: 68.9 },
      { name: "TOLSEN მეტალის რულეტი 5მ", quantity: 1, unitPrice: 72.0 }
    ]
  },
  {
    id: "tm-10421",
    number: "TM-10421",
    date: "2026-06-05",
    status: "დამუშავებაშია",
    total: 247.5,
    productsCount: 2,
    estimatedDelivery: "მიწოდება 3-5 სამუშაო დღეში",
    deliveryAddress: "თბილისი, რუსთაველის გამზირი 24, ბინა 18",
    items: [
      { name: "CROWN პერფორატორი 850W", quantity: 1, unitPrice: 189.0 },
      { name: "HOGERT სამუშაო ხელთათმანები", quantity: 2, unitPrice: 29.25 }
    ]
  },
  {
    id: "tm-10376",
    number: "TM-10376",
    date: "2026-05-28",
    status: "გზაშია",
    total: 145.8,
    productsCount: 4,
    estimatedDelivery: "მიწოდება ხვალამდე",
    deliveryAddress: "თბილისი, ვაჟა-ფშაველას გამზირი 18",
    items: [
      { name: "WADFOW უსაფრთხოების სათვალე", quantity: 2, unitPrice: 17.4 },
      { name: "DECAKILA სამზარეულოს თერმომეტრი", quantity: 1, unitPrice: 39.0 },
      { name: "TOTAL სამშენებლო დონე 60სმ", quantity: 1, unitPrice: 71.0 }
    ]
  },
  {
    id: "tm-10311",
    number: "TM-10311",
    date: "2026-05-20",
    status: "დასრულებულია",
    total: 512.35,
    productsCount: 5,
    estimatedDelivery: "ჩაბარებულია",
    deliveryAddress: "თბილისი, წერეთლის გამზირი 91",
    items: [
      { name: "INGCO კუთხსახეხი 125მმ", quantity: 1, unitPrice: 153.0 },
      { name: "TOLSEN სამუშაო ზურგჩანთა", quantity: 1, unitPrice: 88.5 },
      { name: "CROWN ინსტრუმენტების ნაკრები", quantity: 1, unitPrice: 270.85 }
    ]
  },
  {
    id: "tm-10258",
    number: "TM-10258",
    date: "2026-05-12",
    status: "გაუქმებულია",
    total: 89.0,
    productsCount: 1,
    estimatedDelivery: "შეკვეთა გაუქმდა",
    deliveryAddress: "თბილისი, საბურთალო",
    items: [
      { name: "WADFOW კომპაქტური ბურღი 650W", quantity: 1, unitPrice: 89.0 }
    ]
  }
];

const statusMeta: Record<
  OrderStatus,
  {
    className: string;
  }
> = {
  ახალი: {
    className: "bg-[#EEF5FB] text-[#072B4D]"
  },
  დამუშავებაშია: {
    className: "bg-[#FFF4EA] text-[#B95D14]"
  },
  გზაშია: {
    className: "bg-[#EAF8EF] text-[#176B45]"
  },
  დასრულებულია: {
    className: "bg-[#EAF8EF] text-[#176B45]"
  },
  გაუქმებულია: {
    className: "bg-[#FFF1F1] text-[#C5221F]"
  }
};

const passwordRules = [
  {
    label: "მინიმუმ 8 სიმბოლო",
    test: (value: string) => value.length >= 8
  },
  {
    label: "დიდი ასო",
    test: (value: string) => /[A-Z]/.test(value)
  },
  {
    label: "პატარა ასო",
    test: (value: string) => /[a-z]/.test(value)
  },
  {
    label: "ციფრი",
    test: (value: string) => /\d/.test(value)
  },
  {
    label: "სპეციალური სიმბოლო",
    test: (value: string) => /[^A-Za-z0-9]/.test(value)
  }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordStrength(password: string) {
  const score = passwordRules.reduce((total, rule) => total + Number(rule.test(password)), 0);

  if (score <= 2) {
    return {
      label: password.length ? "სუსტი" : "სუსტი",
      barClass: "bg-[#D92D20]",
      textClass: "text-[#D92D20]",
      progress: 1,
      score
    };
  }

  if (score <= 4) {
    return {
      label: "საშუალო",
      barClass: "bg-[#F58220]",
      textClass: "text-[#F58220]",
      progress: 2,
      score
    };
  }

  return {
    label: "ძლიერი",
    barClass: "bg-[#157347]",
    textClass: "text-[#157347]",
    progress: 3,
    score
  };
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ProfileDashboard() {
  const [personalDraft, setPersonalDraft] = useState(initialPersonalInfo);
  const [savedPersonal, setSavedPersonal] = useState(initialPersonalInfo);
  const [personalErrors, setPersonalErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>(
    {}
  );

  const [addressDraft, setAddressDraft] = useState(initialAddressInfo);
  const [savedAddress, setSavedAddress] = useState(initialAddressInfo);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressInfo, string>>>(
    {}
  );

  const [passwordDraft, setPasswordDraft] = useState(emptyPasswordDraft);
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordDraft, string>>>(
    {}
  );

  const [expandedOrders, setExpandedOrders] = useState<string[]>([mockOrders[0].id]);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [savingSection, setSavingSection] = useState<"personal" | "address" | "password" | null>(
    null
  );

  const orders = mockOrders;
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );
  const completedOrders = orders.filter((order) => order.status === "დასრულებულია").length;
  const activeOrders = orders.filter(
    (order) =>
      order.status === "ახალი" ||
      order.status === "დამუშავებაშია" ||
      order.status === "გზაშია"
  ).length;
  const latestOrder = orders[0];
  const strength = useMemo(
    () => getPasswordStrength(passwordDraft.newPassword),
    [passwordDraft.newPassword]
  );

  const updateNotice = (tone: NoticeTone, text: string) => {
    setNotice({ tone, text });
  };

  const handlePersonalSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingSection) {
      return;
    }

    const nextErrors: Partial<Record<keyof PersonalInfo, string>> = {};

    if (!personalDraft.firstName.trim()) {
      nextErrors.firstName = "სახელი აუცილებელია";
    }

    if (!personalDraft.lastName.trim()) {
      nextErrors.lastName = "გვარი აუცილებელია";
    }

    if (!personalDraft.email.trim()) {
      nextErrors.email = "ელ. ფოსტა აუცილებელია";
    } else if (!isValidEmail(personalDraft.email)) {
      nextErrors.email = "გთხოვთ მიუთითოთ სწორი ელ. ფოსტა";
    }

    if (!personalDraft.phone.trim()) {
      nextErrors.phone = "ტელეფონი აუცილებელია";
    }

    setPersonalErrors(nextErrors);
    setNotice(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSavingSection("personal");
    await delay(350);
    setSavedPersonal(personalDraft);
    setSavingSection(null);
    updateNotice("success", "პირადი ინფორმაცია შენახულია");
  };

  const handlePersonalCancel = () => {
    setPersonalDraft(savedPersonal);
    setPersonalErrors({});
    updateNotice("info", "პირადი ინფორმაცია აღდგენილია");
  };

  const handleAddressSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingSection) {
      return;
    }

    const nextErrors: Partial<Record<keyof AddressInfo, string>> = {};

    if (!addressDraft.address.trim()) {
      nextErrors.address = "მისამართი აუცილებელია";
    }

    if (!addressDraft.city.trim()) {
      nextErrors.city = "ქალაქი აუცილებელია";
    }

    setAddressErrors(nextErrors);
    setNotice(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSavingSection("address");
    await delay(350);
    setSavedAddress(addressDraft);
    setSavingSection(null);
    updateNotice("success", "მისამართი შენახულია");
  };

  const handleAddressCancel = () => {
    setAddressDraft(savedAddress);
    setAddressErrors({});
    updateNotice("info", "მისამართი აღდგენილია");
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingSection) {
      return;
    }

    const nextErrors: Partial<Record<keyof PasswordDraft, string>> = {};

    if (!passwordDraft.currentPassword.trim()) {
      nextErrors.currentPassword = "მიმდინარე პაროლი აუცილებელია";
    }

    if (!passwordDraft.newPassword.trim()) {
      nextErrors.newPassword = "ახალი პაროლი აუცილებელია";
    } else if (strength.score < passwordRules.length) {
      nextErrors.newPassword = "პაროლი არ აკმაყოფილებს ყველა მოთხოვნას";
    }

    if (!passwordDraft.confirmPassword.trim()) {
      nextErrors.confirmPassword = "გაიმეორეთ ახალი პაროლი";
    } else if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      nextErrors.confirmPassword = "პაროლები არ ემთხვევა";
    }

    setPasswordErrors(nextErrors);
    setNotice(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSavingSection("password");
    await delay(350);
    setPasswordDraft(emptyPasswordDraft);
    setPasswordErrors({});
    setSavingSection(null);
    updateNotice("success", "პაროლის ცვლილების მოთხოვნა მზად არის");
  };

  const handlePasswordCancel = () => {
    setPasswordDraft(emptyPasswordDraft);
    setPasswordErrors({});
    updateNotice("info", "პაროლის ფორმა გასუფთავდა");
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((current) => toggleValue(current, orderId));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 lg:px-6 lg:pb-16">
      {notice ? (
        <NoticeBanner tone={notice.tone} text={notice.text} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="grid content-start gap-6">
          <SectionCard
            icon={<UserRound className="size-5" />}
            title="პირადი ინფორმაცია"
            description="განაახლეთ საკონტაქტო მონაცემები და პირადი დეტალები."
          >
            <form className="grid gap-4" onSubmit={handlePersonalSave} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="სახელი"
                  value={personalDraft.firstName}
                  onChange={(value) => {
                    setPersonalDraft((current) => ({ ...current, firstName: value }));
                    setPersonalErrors((current) => ({ ...current, firstName: undefined }));
                    setNotice(null);
                  }}
                  placeholder="სახელი"
                  error={personalErrors.firstName}
                />
                <TextField
                  label="გვარი"
                  value={personalDraft.lastName}
                  onChange={(value) => {
                    setPersonalDraft((current) => ({ ...current, lastName: value }));
                    setPersonalErrors((current) => ({ ...current, lastName: undefined }));
                    setNotice(null);
                  }}
                  placeholder="გვარი"
                  error={personalErrors.lastName}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="ელ. ფოსტა"
                  type="email"
                  value={personalDraft.email}
                  onChange={(value) => {
                    setPersonalDraft((current) => ({ ...current, email: value }));
                    setPersonalErrors((current) => ({ ...current, email: undefined }));
                    setNotice(null);
                  }}
                  placeholder="name@example.com"
                  error={personalErrors.email}
                />
                <TextField
                  label="ტელეფონი"
                  value={personalDraft.phone}
                  onChange={(value) => {
                    setPersonalDraft((current) => ({ ...current, phone: value }));
                    setPersonalErrors((current) => ({ ...current, phone: undefined }));
                    setNotice(null);
                  }}
                  placeholder="+995 ..."
                  error={personalErrors.phone}
                />
              </div>

              <ActionRow
                primaryLabel="შენახვა"
                secondaryLabel="გაუქმება"
                loading={savingSection === "personal"}
                onCancel={handlePersonalCancel}
              />
            </form>
          </SectionCard>

          <SectionCard
            icon={<MapPin className="size-5" />}
            title="მისამართი"
            description="მიწოდების მისამართი და ქალაქი."
          >
            <form className="grid gap-4" onSubmit={handleAddressSave} noValidate>
              <TextAreaField
                label="მისამართი"
                value={addressDraft.address}
                onChange={(value) => {
                  setAddressDraft((current) => ({ ...current, address: value }));
                  setAddressErrors((current) => ({ ...current, address: undefined }));
                  setNotice(null);
                }}
                placeholder="ქუჩა, კორპუსი, ბინა"
                error={addressErrors.address}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="ქალაქი"
                  value={addressDraft.city}
                  onChange={(value) => {
                    setAddressDraft((current) => ({ ...current, city: value }));
                    setAddressErrors((current) => ({ ...current, city: undefined }));
                    setNotice(null);
                  }}
                  placeholder="თბილისი"
                  error={addressErrors.city}
                />

                <div className="rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">
                    მიმდინარე მისამართი
                  </span>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#041C32]">
                    {savedAddress.address}
                  </p>
                  <p className="mt-1 text-sm text-[#6B7280]">{savedAddress.city}</p>
                </div>
              </div>

              <ActionRow
                primaryLabel="შენახვა"
                secondaryLabel="გაუქმება"
                loading={savingSection === "address"}
                onCancel={handleAddressCancel}
              />
            </form>
          </SectionCard>

          <SectionCard
            icon={<LockKeyhole className="size-5" />}
            title="პაროლის შეცვლა"
            description="შექმენით ახალი ძლიერი პაროლი თქვენი ანგარიშისთვის."
          >
            <form className="grid gap-4" onSubmit={handlePasswordSave} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="მიმდინარე პაროლი"
                  type="password"
                  autoComplete="current-password"
                  value={passwordDraft.currentPassword}
                  onChange={(value) => {
                    setPasswordDraft((current) => ({ ...current, currentPassword: value }));
                    setPasswordErrors((current) => ({
                      ...current,
                      currentPassword: undefined
                    }));
                    setNotice(null);
                  }}
                  placeholder="მიმდინარე პაროლი"
                  error={passwordErrors.currentPassword}
                />
                <div className="rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-[#041C32]">პაროლის სიძლიერე</span>
                    <span className={["text-sm font-black", strength.textClass].join(" ")}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className={[
                          "h-2 rounded-full transition",
                          index < strength.progress ? strength.barClass : "bg-[#E5EAF0]"
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#6B7280]">
                    მინიმუმ 8 სიმბოლო, დიდი და პატარა ასო, ციფრი და სპეციალური სიმბოლო.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="ახალი პაროლი"
                  type="password"
                  autoComplete="new-password"
                  value={passwordDraft.newPassword}
                  onChange={(value) => {
                    setPasswordDraft((current) => ({ ...current, newPassword: value }));
                    setPasswordErrors((current) => ({ ...current, newPassword: undefined }));
                    setNotice(null);
                  }}
                  placeholder="ახალი პაროლი"
                  error={passwordErrors.newPassword}
                />
                <TextField
                  label="გაიმეორეთ ახალი პაროლი"
                  type="password"
                  autoComplete="new-password"
                  value={passwordDraft.confirmPassword}
                  onChange={(value) => {
                    setPasswordDraft((current) => ({ ...current, confirmPassword: value }));
                    setPasswordErrors((current) => ({
                      ...current,
                      confirmPassword: undefined
                    }));
                    setNotice(null);
                  }}
                  placeholder="გაიმეორეთ ახალი პაროლი"
                  error={passwordErrors.confirmPassword}
                />
              </div>

              <div className="grid gap-2 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] p-4 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                  const passed = rule.test(passwordDraft.newPassword);

                  return (
                    <div
                      key={rule.label}
                      className={[
                        "flex items-center gap-2 text-xs font-bold",
                        passed ? "text-[#176B45]" : "text-[#6B7280]"
                      ].join(" ")}
                    >
                      <Check className="size-4 shrink-0" />
                      {rule.label}
                    </div>
                  );
                })}
              </div>

              <ActionRow
                primaryLabel="შენახვა"
                secondaryLabel="გაუქმება"
                loading={savingSection === "password"}
                onCancel={handlePasswordCancel}
              />
            </form>
          </SectionCard>
        </div>

        <div className="grid content-start gap-6">
          <SectionCard
            icon={<BadgeCheck className="size-5" />}
            title="პროფილის შეჯამება"
            description="მიმდინარე მონაცემები და შეკვეთების მოკლე სტატისტიკა."
            accent="dark"
          >
            <div className="grid gap-5">
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                  <span className="text-lg font-black">
                    {savedPersonal.firstName.slice(0, 1)}
                    {savedPersonal.lastName.slice(0, 1)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-black text-white">
                    {savedPersonal.firstName} {savedPersonal.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-white/72">{savedPersonal.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                      {savedPersonal.phone}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                      {savedAddress.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat icon={<Package className="size-4" />} label="შეკვეთები" value={String(orders.length)} />
                <MiniStat
                  icon={<CheckCircle2 className="size-4" />}
                  label="დასრულებული"
                  value={String(completedOrders)}
                />
                <MiniStat
                  icon={<Truck className="size-4" />}
                  label="აქტიური"
                  value={String(activeOrders)}
                />
              </div>

              <div className="grid gap-3 rounded-xl border border-white/12 bg-white/8 p-4 text-sm text-white/82 sm:grid-cols-2">
                <SummaryLine icon={<Mail className="size-4" />} label="ელ. ფოსტა" value={savedPersonal.email} />
                <SummaryLine icon={<Phone className="size-4" />} label="ტელეფონი" value={savedPersonal.phone} />
                <SummaryLine
                  icon={<MapPin className="size-4" />}
                  label="მისამართი"
                  value={savedAddress.address}
                />
                <SummaryLine
                  icon={<CalendarDays className="size-4" />}
                  label="ბოლო შეკვეთა"
                  value={latestOrder.date}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoPill
                  icon={<ShieldCheck className="size-4" />}
                  text={`ჯამური დახარჯული: ${formatPrice(totalSpent)}`}
                />
                <InfoPill
                  icon={<Clock3 className="size-4" />}
                  text={`ბოლო სტატუსი: ${latestOrder.status}`}
                />
              </div>
            </div>
          </SectionCard>

        </div>

        <div className="min-w-0 lg:col-span-2">
          <SectionCard
            id="orders"
            icon={<Package className="size-5" />}
            title="შეკვეთების ისტორია"
            description={`${orders.length} შეკვეთა თქვენს ანგარიშში`}
          >
            {orders.length ? (
              <div className="grid gap-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    expanded={expandedOrders.includes(order.id)}
                    onToggle={() => toggleOrder(order.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#D7DEE8] bg-[#F7F9FC] px-5 py-10 text-center">
                <Package className="mx-auto size-8 text-[#F58220]" />
                <h3 className="mt-4 text-lg font-black text-[#041C32]">შეკვეთები ჯერ არ არის</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  შეკვეთების ისტორია აქ გამოჩნდება, როგორც კი პირველი შეკვეთა დაემატება.
                </p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

function SectionCard({
  id,
  title,
  description,
  icon,
  children,
  accent = "light"
}: {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: "light" | "dark";
}) {
  const isDark = accent === "dark";

  return (
    <section
      id={id}
      className={[
        "scroll-mt-32 rounded-xl border p-5 shadow-sm sm:p-6",
        isDark
          ? "border-[#0E3C69] bg-[#062B4F] text-white"
          : "border-[#E5EAF0] bg-white text-[#041C32]"
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "grid size-11 shrink-0 place-items-center rounded-lg",
            isDark ? "bg-white/10 text-white" : "bg-[#F7F9FC] text-[#072B4D]"
          ].join(" ")}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className={["text-xl font-black sm:text-2xl", isDark ? "text-white" : "text-[#041C32]"].join(" ")}>
            {title}
          </h2>
          <p className={["mt-1 text-sm leading-6", isDark ? "text-white/72" : "text-[#6B7280]"].join(" ")}>
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[#102033]">{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={[
          "focus-ring h-12 rounded-md border bg-white px-4 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]",
          error ? "border-[#F2B8B5]" : "border-[#E5EAF0]"
        ].join(" ")}
        aria-invalid={Boolean(error)}
      />
      {error ? <InlineError text={error} /> : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[#102033]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className={[
          "focus-ring resize-none rounded-md border bg-white px-4 py-3 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]",
          error ? "border-[#F2B8B5]" : "border-[#E5EAF0]"
        ].join(" ")}
        aria-invalid={Boolean(error)}
      />
      {error ? <InlineError text={error} /> : null}
    </label>
  );
}

function InlineError({ text }: { text: string }) {
  return (
    <span className="text-xs font-bold text-[#D92D20]">
      {text}
    </span>
  );
}

function ActionRow({
  primaryLabel,
  secondaryLabel,
  loading,
  onCancel
}: {
  primaryLabel: string;
  secondaryLabel: string;
  loading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="focus-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#E5EAF0] bg-white px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#041C32]"
      >
        <RotateCcw className="size-4" />
        {secondaryLabel}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="focus-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#F58220] px-5 text-sm font-black text-white transition hover:bg-[#de741d] disabled:cursor-not-allowed disabled:opacity-75"
      >
        {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {loading ? "იტვირთება..." : primaryLabel}
      </button>
    </div>
  );
}

function NoticeBanner({
  tone,
  text
}: {
  tone: NoticeTone;
  text: string;
}) {
  const config =
    tone === "success"
      ? {
          className: "border-[#B7E4C7] bg-[#F0FFF4] text-[#176B45]",
          icon: <CheckCircle2 className="size-5 shrink-0" />
        }
      : tone === "error"
        ? {
            className: "border-[#F2B8B5] bg-[#FFF7F7] text-[#D92D20]",
            icon: <AlertCircle className="size-5 shrink-0" />
          }
        : {
            className: "border-[#F7CFA7] bg-[#FFF8F1] text-[#C65F0B]",
            icon: <ShieldCheck className="size-5 shrink-0" />
          };

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold",
        config.className
      ].join(" ")}
    >
      {config.icon}
      {text}
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/8 p-4">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
        {icon}
        {label}
      </span>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function SummaryLine({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/12 bg-white/8 px-3 py-3">
      <span className="mt-0.5 text-white/70">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-[0.12em] text-white/55">
          {label}
        </span>
        <span className="mt-1 block truncate text-sm font-bold text-white">{value}</span>
      </span>
    </div>
  );
}

function InfoPill({
  icon,
  text
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-3 py-3 text-sm font-bold text-white/88">
      <span className="text-white/70">{icon}</span>
      {text}
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle
}: {
  order: ProfileOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-sm transition duration-300 hover:border-[#F58220] hover:shadow-[0_12px_28px_rgba(6,43,79,0.07)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black text-[#041C32]">{order.number}</h3>
            <span className={["rounded-full px-2.5 py-1 text-xs font-black", statusMeta[order.status].className].join(" ")}>
              {order.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-[#F58220]" />
              {order.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Package className="size-4 text-[#F58220]" />
              {order.productsCount} პროდუქტი
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-4 text-[#F58220]" />
              {order.estimatedDelivery}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="text-right">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">
              ჯამი
            </span>
            <span className="block text-xl font-black text-[#041C32]">
              {formatPrice(order.total)}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-[#E5EAF0] bg-[#F7F9FC] px-3 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#041C32]"
          >
            {expanded ? "დამალვა" : "დეტალები"}
            <ChevronDown className={["size-4 transition-transform", expanded ? "rotate-180" : ""].join(" ")} />
          </button>
        </div>
      </div>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="min-h-0 min-w-0 overflow-hidden pt-4">
          <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 rounded-lg border border-[#E5EAF0] bg-[#F7F9FC] p-4">
              <h4 className="text-sm font-black text-[#041C32]">პროდუქტები</h4>
              <div className="mt-3 grid gap-2">
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="min-w-0 rounded-md border border-white bg-white px-3 py-2.5"
                  >
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold leading-6 text-[#102033]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#6B7280]">
                          რაოდენობა: {item.quantity}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="whitespace-nowrap text-sm font-black text-[#041C32]">
                          {formatPrice(item.unitPrice)}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-xs text-[#6B7280]">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-lg border border-[#E5EAF0] bg-white p-4">
              <h4 className="text-sm font-black text-[#041C32]">მიწოდება</h4>
              <div className="mt-3 grid gap-3 text-sm text-[#102033]">
                <div className="flex min-w-0 items-start gap-3 rounded-md bg-[#F7F9FC] p-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#F58220]" />
                  <span className="min-w-0 break-words leading-6">{order.deliveryAddress}</span>
                </div>
                <div className="flex min-w-0 items-start gap-3 rounded-md bg-[#F7F9FC] p-3">
                  <Truck className="mt-0.5 size-4 shrink-0 text-[#F58220]" />
                  <span className="min-w-0 break-words leading-6">{order.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
