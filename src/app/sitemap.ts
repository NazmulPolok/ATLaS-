import type { MetadataRoute } from "next";
import { services } from "@/content/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const paths = [
    "",
    "/about",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/work",
    "/products",
    "/insights",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.65,
  }));
}
