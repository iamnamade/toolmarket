import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";
import { CommerceProvider } from "@/components/commerce/CommerceProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolmarket.ge"),
  title: "ToolMarket.ge",
  description: "პროფესიონალური ხელსაწყოები და სამშენებლო მასალები"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      {/* Suppress mismatches caused only by browser extension-injected body attributes. */}
      <body suppressHydrationWarning>
        <AuthSessionProvider>
          <CommerceProvider>{children}</CommerceProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
