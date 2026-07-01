import type { MetadataRoute } from "next";
import { allProducts } from "@/data/products";
import { getAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: getAbsoluteUrl("/products"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: getAbsoluteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: getAbsoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6
    }
  ];

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: getAbsoluteUrl(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...staticRoutes, ...productRoutes];
}
