import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";
import { CommerceProvider } from "@/components/commerce/CommerceProvider";
import { defaultOgImages, organizationStructuredData, siteConfig } from "@/lib/seo";
import "./globals.css";

const siteFont = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: "variable",
  display: "swap",
  fallback: ["Noto Sans", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: defaultOgImages
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={siteFont.className}>
      {/* Suppress mismatches caused only by browser extension-injected body attributes. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <AuthSessionProvider>
          <CommerceProvider>{children}</CommerceProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
