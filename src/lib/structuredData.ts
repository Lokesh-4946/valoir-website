import { site } from "@/content/content";
import { flagship } from "@/content/products";

/**
 * Schema.org JSON-LD builders. Routes inject these via the <JsonLd> component.
 * Everything traces to the same content as the visible copy — no invented data
 * (no ratings, download counts, or prices we can't stand behind).
 */

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

type Json = Record<string, unknown>;

function organization(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    description: site.description,
    sameAs: [site.github],
  };
}

function website(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    publisher: { "@id": ORG_ID },
  };
}

// Rizz as both a developer application and a source-code project (open-core).
function software(): Json {
  return {
    "@type": ["SoftwareApplication", "SoftwareSourceCode"],
    name: flagship.name,
    description: flagship.tagline,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux",
    programmingLanguage: flagship.language,
    codeRepository: flagship.repoUrl,
    license: "https://opensource.org/license/mit",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    url: `${site.url}/docs`,
  };
}

/** Site-wide graph: Organization + WebSite + the Rizz product. */
export function siteGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(), website(), software()],
  };
}

type Crumb = { name: string; url: string };

/** A BreadcrumbList from a trail in order (Home → … → leaf). */
export function breadcrumb(trail: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Docs breadcrumb rooted at Home → Docs, with an optional leaf page. */
export function docsBreadcrumb(leaf?: Crumb): Json {
  const trail: Crumb[] = [
    { name: "Home", url: site.url },
    { name: "Docs", url: `${site.url}/docs` },
  ];
  if (leaf) trail.push(leaf);
  return breadcrumb(trail);
}
