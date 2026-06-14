import type { MetadataRoute } from "next";
import { site } from "@/content/content";
import { DOCS_BASE, docHref, getAllDocs } from "@/lib/docs";

// Home + the docs index + one entry per docs page. Adding a docs page to
// `src/content/docs` automatically lists it here.
export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}${DOCS_BASE}`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const docs: MetadataRoute.Sitemap = getAllDocs().map((doc) => ({
    url: `${site.url}${docHref(doc.slug)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...home, ...docs];
}
