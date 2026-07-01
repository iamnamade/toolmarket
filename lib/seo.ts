import type { Metadata } from "next";

type MetadataImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

type CreatePageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  images?: MetadataImage[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export const siteConfig = {
  name: "ToolMarket.ge",
  url: "https://toolmarket.vercel.app",
  locale: "ka_GE",
  description:
    "პროფესიონალური ხელსაწყოები, სამშენებლო მასალები და ტექნიკური პროდუქტები საქართველოში.",
  ogImage: "/images/cover.png",
  logo: "/logo/toolmarket.png",
  phone: "+995 32 2 00 33 33",
  email: "info@toolmarket.ge",
  addressLocality: "თბილისი",
  addressCountry: "GE"
} as const;

export const defaultOgImages = [
  {
    url: siteConfig.ogImage,
    width: 1200,
    height: 630,
    alt: siteConfig.name
  }
] satisfies MetadataImage[];

export function getAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  images = defaultOgImages,
  type = "website",
  noIndex = false
}: CreatePageMetadataInput = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const resolvedImages = images.map((image) => ({
    ...image,
    alt: image.alt ?? siteConfig.name
  }));

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: resolvedImages
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [resolvedImages[0]?.url ?? siteConfig.ogImage]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  image: getAbsoluteUrl(siteConfig.ogImage),
  logo: getAbsoluteUrl(siteConfig.logo),
  telephone: siteConfig.phone,
  email: siteConfig.email,
  openingHours: ["Mo-Sa 10:00-19:00"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.addressLocality,
    addressCountry: siteConfig.addressCountry
  },
  areaServed: {
    "@type": "Country",
    name: "Georgia"
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    availableLanguage: ["ka", "en"]
  }
} as const;
