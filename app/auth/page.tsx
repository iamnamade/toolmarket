import { AuthCard } from "@/components/auth/AuthCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default async function AuthPage({
  searchParams
}: {
  searchParams: Promise<{
    mode?: string | string[];
    callbackUrl?: string | string[];
  }>;
}) {
  const { mode, callbackUrl: requestedCallbackUrl } = await searchParams;
  const initialMode = mode === "register" ? "register" : "login";
  const callbackUrl =
    typeof requestedCallbackUrl === "string" &&
    requestedCallbackUrl.startsWith("/") &&
    !requestedCallbackUrl.startsWith("//")
      ? requestedCallbackUrl
      : "/profile";

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="text-sm font-black text-[#F58220]">ანგარიში</span>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-[#041C32] sm:text-4xl">
            შესვლა და რეგისტრაცია
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            მართეთ თქვენი შეკვეთები, რჩეული პროდუქტები და საკონტაქტო ინფორმაცია ერთ სივრცეში.
          </p>
        </div>
        <AuthCard initialMode={initialMode} callbackUrl={callbackUrl} />
      </section>
      <Footer />
    </main>
  );
}
