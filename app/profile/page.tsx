import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";

export const metadata: Metadata = {
  title: "პროფილი | ToolMarket.ge",
  description:
    "ToolMarket.ge პროფილი: პირადი ინფორმაცია, მისამართი, პაროლი და შეკვეთების ისტორია."
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />

      <section className="border-b border-[#E5EAF0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-12">
          <span className="text-sm font-black text-[#F58220]">ანგარიში</span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-[#041C32] sm:text-4xl">
            პროფილი
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#6B7280]">
            განაახლეთ პირადი ინფორმაცია, მისამართი და შეკვეთების ისტორია ერთ კომპაქტურ და
            მკაფიო სივრცეში.
          </p>
        </div>
      </section>

      <ProfileDashboard />
      <Footer />
    </main>
  );
}
