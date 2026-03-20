import type { MetadataRoute } from "next";
import { airportRoutes } from "@/lib/routes";

const BASE = "https://antalyaviptransfer.com";
const locales = ["tr", "en", "de", "ru"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of locales) {
    pages.push({
      url: `${BASE}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  // Route pages
  for (const lang of locales) {
    for (const route of airportRoutes) {
      pages.push({
        url: `${BASE}/${lang}/${route.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return pages;
}
