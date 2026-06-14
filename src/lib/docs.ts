import { docsPages } from "@/content/docs/pages";
import type { DocPage } from "@/content/docs/types";

/**
 * Docs service — the reusable read/sort/select mechanics for the docs content.
 * Routes orchestrate (which page, how to render); this owns the data shaping.
 */

export const DOCS_BASE = "/docs";

/** All docs pages, ascending by `order`. */
export function getAllDocs(): DocPage[] {
  return [...docsPages].sort((a, b) => a.order - b.order);
}

/** A single page by slug, or undefined if it doesn't exist. */
export function getDoc(slug: string): DocPage | undefined {
  return docsPages.find((page) => page.slug === slug);
}

/** Sidebar/sitemap nav entries (slug + title + href), ordered. */
export function getDocsNav(): { slug: string; title: string; href: string }[] {
  return getAllDocs().map((page) => ({
    slug: page.slug,
    title: page.title,
    href: docHref(page.slug),
  }));
}

/** The site path for a docs page. */
export function docHref(slug: string): string {
  return `${DOCS_BASE}/${slug}`;
}

/** Stable id for a heading, used for in-page anchors. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`[^`]*`/g, (m) => m.replace(/`/g, ""))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
