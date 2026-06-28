"use client";

import { AlertCircle, Check, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { RecaptchaCheckbox } from "@/components/auth/RecaptchaCheckbox";
import { Logo } from "@/components/ui/Logo";

type AuthMode = "login" | "register";
type NoticeTone = "info" | "error";
type NoticeState = {
  text: string;
  tone: NoticeTone;
} | null;

type LoginErrors = {
  email?: string;
  password?: string;
};

type RegisterErrors = {
  captcha?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  repeatPassword?: string;
};

type RegisterResponse = {
  error?: string;
  field?: keyof RegisterErrors;
  user?: {
    email: string | null;
  };
};

const emptyRegisterValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatPassword: ""
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AuthCard({
  initialMode = "login",
  callbackUrl = "/profile"
}: {
  initialMode?: AuthMode;
  callbackUrl?: string;
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: ""
  });
  const [registerValues, setRegisterValues] = useState(emptyRegisterValues);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [registerCaptchaReady, setRegisterCaptchaReady] = useState(false);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<string | null>(null);
  const [registerCaptchaResetNonce, setRegisterCaptchaResetNonce] = useState(0);

  const strength = useMemo(
    () => getPasswordStrength(registerValues.password),
    [registerValues.password]
  );
  const passwordsMatch =
    registerValues.repeatPassword.length > 0 &&
    registerValues.password === registerValues.repeatPassword;
  const hasMismatch =
    registerValues.repeatPassword.length > 0 &&
    registerValues.password !== registerValues.repeatPassword;
  const registerSubmitDisabled =
    registerLoading || !recaptchaSiteKey || !registerCaptchaReady || !registerCaptchaToken;

  const resetRegisterCaptcha = () => {
    setRegisterCaptchaToken(null);
    setRegisterCaptchaResetNonce((current) => current + 1);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setLoginErrors({});
    setRegisterErrors({});
    setNotice(null);

    if (nextMode !== "register") {
      resetRegisterCaptcha();
    }
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginLoading) {
      return;
    }

    const nextErrors: LoginErrors = {};

    if (!loginValues.email.trim()) {
      nextErrors.email = "ელ. ფოსტა აუცილებელია";
    } else if (!isValidEmail(loginValues.email)) {
      nextErrors.email = "გთხოვთ მიუთითოთ სწორი ელ. ფოსტა";
    }

    if (!loginValues.password) {
      nextErrors.password = "პაროლი აუცილებელია";
    }

    setLoginErrors(nextErrors);
    setNotice(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginValues.email.trim(),
        password: loginValues.password,
        redirect: false,
        redirectTo: callbackUrl
      });

      if (result?.error) {
        setNotice({
          tone: "error",
          text: "ელ. ფოსტა ან პაროლი არასწორია"
        });
        return;
      }

      window.location.assign(result?.url ?? callbackUrl);
    } catch {
      setNotice({
        tone: "error",
        text: "ავტორიზაცია ვერ შესრულდა. სცადეთ თავიდან."
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerLoading) {
      return;
    }

    const nextErrors: RegisterErrors = {};

    if (!registerValues.firstName.trim()) {
      nextErrors.firstName = "სახელი აუცილებელია";
    }

    if (!registerValues.lastName.trim()) {
      nextErrors.lastName = "გვარი აუცილებელია";
    }

    if (!registerValues.email.trim()) {
      nextErrors.email = "ელ. ფოსტა აუცილებელია";
    } else if (!isValidEmail(registerValues.email)) {
      nextErrors.email = "გთხოვთ მიუთითოთ სწორი ელ. ფოსტა";
    }

    if (!registerValues.password) {
      nextErrors.password = "პაროლი აუცილებელია";
    } else if (strength.score < passwordRules.length) {
      nextErrors.password = "პაროლი არ აკმაყოფილებს ყველა მოთხოვნას";
    }

    if (!registerValues.repeatPassword) {
      nextErrors.repeatPassword = "გაიმეორეთ პაროლი";
    } else if (registerValues.password !== registerValues.repeatPassword) {
      nextErrors.repeatPassword = "პაროლები არ ემთხვევა";
    }

    if (!recaptchaSiteKey) {
      nextErrors.captcha = "reCAPTCHA-ის კონფიგურაცია ვერ მოიძებნა.";
    } else if (!registerCaptchaToken) {
      nextErrors.captcha = "გთხოვთ დაადასტუროთ, რომ რობოტი არ ხართ.";
    }

    setRegisterErrors(nextErrors);
    setNotice(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: registerValues.firstName.trim(),
          lastName: registerValues.lastName.trim(),
          email: registerValues.email.trim(),
          password: registerValues.password,
          captchaToken: registerCaptchaToken
        })
      });
      const payload = (await response.json().catch(() => null)) as RegisterResponse | null;

      resetRegisterCaptcha();

      if (!response.ok) {
        const field = payload?.field;

        if (field) {
          setRegisterErrors((current) => ({
            ...current,
            [field]: payload.error ?? "რეგისტრაცია ვერ შესრულდა."
          }));
        } else {
          setNotice({
            tone: "error",
            text: payload?.error ?? "რეგისტრაცია ვერ შესრულდა. გთხოვთ სცადოთ თავიდან."
          });
        }

        return;
      }

      const registeredEmail = payload?.user?.email ?? registerValues.email.trim().toLowerCase();

      setRegisterValues(emptyRegisterValues);
      setRegisterErrors({});
      setLoginValues({
        email: registeredEmail,
        password: ""
      });
      setMode("login");
      setNotice({
        tone: "info",
        text: "ანგარიში წარმატებით შეიქმნა. ახლა შეგიძლიათ შეხვიდეთ."
      });
    } catch {
      resetRegisterCaptcha();
      setNotice({
        tone: "error",
        text: "რეგისტრაცია ვერ შესრულდა. გთხოვთ სცადოთ თავიდან."
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) {
      return;
    }

    setGoogleLoading(true);
    setNotice(null);
    try {
      await signIn("google", { callbackUrl: "/profile" });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[520px] rounded-lg border border-[#E5EAF0] bg-white p-5 sm:p-7">
      <div className="mb-6 flex flex-col items-center text-center">
        <Logo />
        <div className="mt-5 inline-flex rounded-md border border-[#E5EAF0] bg-[#F7F9FC] p-1">
          <TabButton active={mode === "login"} onClick={() => switchMode("login")}>
            შესვლა
          </TabButton>
          <TabButton active={mode === "register"} onClick={() => switchMode("register")}>
            რეგისტრაცია
          </TabButton>
        </div>
      </div>

      {mode === "login" ? (
        <form className="grid gap-4" noValidate onSubmit={handleLoginSubmit}>
          <Field label="ელ. ფოსტა" id="login-email" error={loginErrors.email}>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={loginValues.email}
              onChange={(event) => {
                setLoginValues((current) => ({
                  ...current,
                  email: event.target.value
                }));
                setLoginErrors((current) => ({ ...current, email: undefined }));
                setNotice(null);
              }}
              aria-invalid={Boolean(loginErrors.email)}
              className="form-input"
              placeholder="name@example.com"
            />
          </Field>
          <Field label="პაროლი" id="login-password" error={loginErrors.password}>
            <PasswordInput
              id="login-password"
              name="password"
              visible={loginPasswordVisible}
              onToggle={() => setLoginPasswordVisible((value) => !value)}
              value={loginValues.password}
              onChange={(value) => {
                setLoginValues((current) => ({ ...current, password: value }));
                setLoginErrors((current) => ({ ...current, password: undefined }));
                setNotice(null);
              }}
              placeholder="შეიყვანეთ პაროლი"
              autoComplete="current-password"
              invalid={Boolean(loginErrors.password)}
            />
          </Field>
          <div className="flex justify-end">
            <button
              type="button"
              className="focus-ring w-fit rounded-md font-black text-[#072B4D] hover:text-[#F58220]"
            >
              დაგავიწყდათ პაროლი?
            </button>
          </div>
          <SubmitButton label="შესვლა" loading={loginLoading} />
          <GoogleButton loading={googleLoading} onClick={handleGoogleLogin} />
          {notice ? <NoticeMessage text={notice.text} tone={notice.tone} /> : null}
        </form>
      ) : (
        <form className="grid gap-4" noValidate onSubmit={handleRegisterSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="სახელი" id="first-name" error={registerErrors.firstName}>
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={registerValues.firstName}
                onChange={(event) => {
                  setRegisterValues((current) => ({
                    ...current,
                    firstName: event.target.value
                  }));
                  setRegisterErrors((current) => ({
                    ...current,
                    firstName: undefined
                  }));
                  setNotice(null);
                }}
                aria-invalid={Boolean(registerErrors.firstName)}
                className="form-input"
              />
            </Field>
            <Field label="გვარი" id="last-name" error={registerErrors.lastName}>
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={registerValues.lastName}
                onChange={(event) => {
                  setRegisterValues((current) => ({
                    ...current,
                    lastName: event.target.value
                  }));
                  setRegisterErrors((current) => ({
                    ...current,
                    lastName: undefined
                  }));
                  setNotice(null);
                }}
                aria-invalid={Boolean(registerErrors.lastName)}
                className="form-input"
              />
            </Field>
          </div>
          <Field label="ელ. ფოსტა" id="register-email" error={registerErrors.email}>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={registerValues.email}
              onChange={(event) => {
                setRegisterValues((current) => ({
                  ...current,
                  email: event.target.value
                }));
                setRegisterErrors((current) => ({ ...current, email: undefined }));
                setNotice(null);
              }}
              aria-invalid={Boolean(registerErrors.email)}
              className="form-input"
              placeholder="name@example.com"
            />
          </Field>
          <Field label="პაროლი" id="register-password" error={registerErrors.password}>
            <PasswordInput
              id="register-password"
              name="password"
              visible={passwordVisible}
              onToggle={() => setPasswordVisible((value) => !value)}
              value={registerValues.password}
              onChange={(value) => {
                setRegisterValues((current) => ({
                  ...current,
                  password: value
                }));
                setRegisterErrors((current) => ({
                  ...current,
                  password: undefined
                }));
                setNotice(null);
              }}
              placeholder="შექმენით პაროლი"
              autoComplete="new-password"
              invalid={Boolean(registerErrors.password)}
            />
          </Field>
          <PasswordStrength password={registerValues.password} strength={strength} />
          <Field
            label="გაიმეორეთ პაროლი"
            id="repeat-password"
            error={registerErrors.repeatPassword}
          >
            <PasswordInput
              id="repeat-password"
              name="repeatPassword"
              visible={repeatPasswordVisible}
              onToggle={() => setRepeatPasswordVisible((value) => !value)}
              value={registerValues.repeatPassword}
              onChange={(value) => {
                setRegisterValues((current) => ({
                  ...current,
                  repeatPassword: value
                }));
                setRegisterErrors((current) => ({
                  ...current,
                  repeatPassword: undefined
                }));
                setNotice(null);
              }}
              placeholder="გაიმეორეთ პაროლი"
              autoComplete="new-password"
              invalid={hasMismatch || Boolean(registerErrors.repeatPassword)}
            />
          </Field>
          {passwordsMatch ? (
            <p className="text-sm font-bold text-[#157347]">პაროლები ემთხვევა</p>
          ) : null}
          {hasMismatch ? (
            <p className="text-sm font-bold text-[#D92D20]">პაროლები არ ემთხვევა</p>
          ) : null}
          <div>
            <div className="rounded-md border border-[#E5EAF0] bg-[#F7F8FA] px-3 py-3">
              <RecaptchaCheckbox
                siteKey={recaptchaSiteKey}
                resetNonce={registerCaptchaResetNonce}
                onReadyChange={setRegisterCaptchaReady}
                onTokenChange={(token) => {
                  setRegisterCaptchaToken(token);
                  setRegisterErrors((current) => ({
                    ...current,
                    captcha: undefined
                  }));
                  setNotice(null);
                }}
              />
            </div>
            {registerErrors.captcha ? <InlineError text={registerErrors.captcha} /> : null}
          </div>
          <SubmitButton
            label="რეგისტრაცია"
            loading={registerLoading}
            disabled={registerSubmitDisabled}
          />
          <GoogleButton loading={googleLoading} onClick={handleGoogleLogin} />
          {notice ? <NoticeMessage text={notice.text} tone={notice.tone} /> : null}
        </form>
      )}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "focus-ring h-10 rounded-md px-4 text-sm font-black transition",
        active ? "bg-[#072B4D] text-white" : "text-[#6B7280] hover:text-[#072B4D]"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  id,
  children,
  error
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-[#102033]">
        {label}
      </label>
      {children}
      {error ? <InlineError text={error} /> : null}
    </div>
  );
}

function PasswordInput({
  id,
  name,
  visible,
  onToggle,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  invalid = false
}: {
  id: string;
  name: string;
  visible: boolean;
  onToggle: () => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={invalid}
        className="form-input pr-12"
        placeholder={placeholder}
      />
      <button
        type="button"
        aria-label={visible ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
        onClick={onToggle}
        className="focus-ring absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-[#072B4D] transition hover:bg-white hover:text-[#F58220]"
      >
        {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

function PasswordStrength({
  password,
  strength
}: {
  password: string;
  strength: ReturnType<typeof getPasswordStrength>;
}) {
  return (
    <div className="rounded-md border border-[#E5EAF0] bg-[#F7F9FC] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-[#102033]">პაროლის სიძლიერე</span>
        <span className={["text-sm font-black", strength.textClass].join(" ")}>
          {strength.label}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={[
              "h-2 rounded-full transition",
              index < strength.level ? strength.barClass : "bg-[#E5EAF0]"
            ].join(" ")}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.label}
              className={[
                "flex items-center gap-2 text-xs font-bold",
                passed ? "text-[#157347]" : "text-[#6B7280]"
              ].join(" ")}
            >
              <Check className="size-4 shrink-0" />
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubmitButton({
  label,
  loading,
  disabled = false
}: {
  label: string;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      aria-busy={loading}
      className="focus-ring inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#F58220] px-5 text-sm font-black text-white transition hover:bg-[#de741d] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <LockKeyhole className="size-4" />
      )}
      {loading ? "იტვირთება..." : label}
    </button>
  );
}

function GoogleButton({
  loading,
  onClick
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      aria-busy={loading}
      className="focus-ring inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-md border border-[#E5EAF0] bg-white px-5 text-sm font-black text-[#102033] transition hover:border-[#F58220] hover:text-[#072B4D] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? <LoaderCircle className="size-5 animate-spin" /> : <GoogleIcon />}
      {loading ? "იტვირთება..." : "Google-ით გაგრძელება"}
    </button>
  );
}

function NoticeMessage({ text, tone }: { text: string; tone: NoticeTone }) {
  const toneClass =
    tone === "error"
      ? "border-[#FFD1D1] bg-[#FFF7F7] text-[#D92D20]"
      : "border-[#F7CFA7] bg-[#FFF8F1] text-[#C65F0B]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={["flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-bold", toneClass].join(" ")}
    >
      <AlertCircle className="size-5 shrink-0" />
      {text}
    </div>
  );
}

function InlineError({ text }: { text: string }) {
  return <p className="mt-2 text-xs font-bold text-[#D92D20]">{text}</p>;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.73-.07-1.43-.19-2.11H12v3.99h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.41z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.4l-3.23-2.51c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A9.99 9.99 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.92a6.01 6.01 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.5 3.82 1.49l2.87-2.87C16.95 2.96 14.7 2 12 2a9.99 9.99 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96z"
      />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  const score = passwordRules.reduce((total, rule) => total + Number(rule.test(password)), 0);

  if (score <= 2) {
    return {
      level: password.length ? 1 : 0,
      score,
      label: "სუსტი",
      barClass: "bg-[#D92D20]",
      textClass: "text-[#D92D20]"
    };
  }

  if (score <= 4) {
    return {
      level: 2,
      score,
      label: "საშუალო",
      barClass: "bg-[#F58220]",
      textClass: "text-[#F58220]"
    };
  }

  return {
    level: 3,
    score,
    label: "ძლიერი",
    barClass: "bg-[#157347]",
    textClass: "text-[#157347]"
  };
}
