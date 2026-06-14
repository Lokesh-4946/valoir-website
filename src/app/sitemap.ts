import type { MetadataRoute } from "next";
import { site } from "@/content/content";

// Single-page marketing site today. When real routes are added (e.g. /blog,
// /changelog), list them here — one entry per route.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
