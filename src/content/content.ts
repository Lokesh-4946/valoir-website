/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Tools for people who build with agents.",
  description:
    "Valoir builds lightweight tools for people who build with agents. Built by a developer, for developers.",
  url: "https://valoir.space", // production domain (owned; registered at Namecheap, 2026-06-14)
  github: "https://github.com/Lokesh-4946",
  socials: [
    { label: "GitHub", href: "https://github.com/Lokesh-4946" },
    // No public X/other social yet — intentionally omitted so we never ship a dead "#" link.
  ],
};

export const nav = {
  // Absolute paths so the nav works from any route (e.g. /docs), not just home.
  links: [
    { label: "Products", href: "/#products" },
    { label: "Open Source", href: "/#open-source" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Get Rizz", href: "/#products" },
};

export const hero = {
  headline: ["Tools for people", "who build", "with agents."],
  primary: { label: "Explore Rizz", href: "#products" },
  secondary: { label: "View on GitHub", href: "https://github.com/Lokesh-4946/rizz" },
};

export const manifesto = {
  label: "01 — Manifesto",
  lines: [
    "Small by default.",
    "Power only when you ask for it.",
    "Built for developers who care what lands.",
  ],
  body: "Most agent harnesses are broad and heavy. Valoir bets the other way: the lightest front door that still scales to hard projects. The moat is execution, taste, and the lightweight constraint held honestly — not a patentable trick. We say that plainly.",
};

/**
 * Open-source repos. Adding a repo = one line here.
 * stars: null renders "—" (e.g. private during build).
 */
export const repos = [
  {
    name: "rizz",
    description:
      "The lightest, most connectable coding agent harness. Single-agent minimal by default; /workspace multi-agent on demand.",
    language: "TypeScript",
    stars: null as number | null,
    href: "https://github.com/Lokesh-4946/rizz",
    note: "Private during build · MIT at v1",
  },
];

export const sections = {
  products: { label: "02 — Products", title: "Products" },
  openSource: {
    label: "03 — Open Source",
    title: "Open at the core.",
    body: "Code lives in Git, not in slideware. The Rizz core flips to open-source at v1, with any paid layer kept separate — classic open-core.",
  },
};
