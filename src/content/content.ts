/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Applied AI systems for real workflows.",
  description:
    "Valoir builds applied AI systems for real workflows. Rizz is the first product: repository intelligence for understanding codebases before changing them.",
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
    { label: "Why Rizz", href: "/#why-rizz" },
    { label: "Roadmap", href: "/#roadmap" },
    { label: "Valoir", href: "/#offering" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "See Rizz", href: "/#products" },
};

export const hero = {
  headline: [
    "Valoir builds",
    "applied AI systems",
    "for real workflows.",
  ],
  subhead:
    "Rizz is the first product: repository intelligence for understanding codebases before changing them.",
  primary: { label: "Explore products", href: "#products" },
  command: "npm install -g @valoir/rizz",
  secondary: [
    { label: "Read docs", href: "/docs", external: false },
    { label: "View on GitHub", href: "https://github.com/Lokesh-4946/rizz", external: true },
  ],
};

export const manifesto = {
  label: "01 — How Valoir builds",
  lines: [
    "Start with the workflow.",
    "Keep the evidence visible.",
    "Make power opt-in.",
  ],
  body:
    "Valoir products are built around specific work, not generic demos. Rizz applies that method to software repositories first: local context, inspectable artifacts, and model power only when asked.",
};

export const sections = {
  products: {
    label: "02 — Products",
    title: "Products by Valoir",
    body:
      "Rizz is the first product. The product catalog is built to hold more Valoir systems when those products are real.",
  },
  whyRizz: {
    label: "03 — Why Rizz",
    title: "Repository intelligence before production risk.",
    body: "Rizz gives developers a local map of the system before a change becomes a guess.",
    items: [
      {
        title: "Map the change surface",
        text: "Components, flows, commands, tests, dependencies, risks, and evidence are extracted before edits begin.",
      },
      {
        title: "Explain files and flows",
        text: "Use rizz explain to read the paths that matter before touching them.",
      },
      {
        title: "Review diffs with context",
        text: "Use rizz review to connect a change to affected areas, configs, risks, and available tests.",
      },
      {
        title: "Keep artifacts inspectable",
        text: "Mission Control, .rizz/brain, and .rizz/research stay in the repo workspace so the reasoning can be inspected.",
      },
    ],
  },
  roadmap: {
    label: "04 — Roadmap",
    title: "What is real, what is next.",
    lanes: [
      {
        label: "Now",
        title: "Rizz 0.2.0",
        items: [
          "npm install",
          "Project Knowledge Store",
          "Mission Control",
          "Explain",
          "Review",
          "gated Ask",
          "research artifacts",
        ],
      },
      {
        label: "Next",
        title: "Validation and polish",
        items: [
          "real-repo validation",
          "evidence quality checks",
          "benchmark seeds",
          "docs polish",
        ],
      },
      {
        label: "Later",
        title: "Valoir product layer",
        items: [
          "Workspace Mode",
          "team layer",
          "hosted relay",
          "enterprise provider setup",
          "native installers",
          "future workflow products",
        ],
      },
    ],
  },
  offering: {
    label: "05 — Valoir",
    title: "One company, more than one product.",
    body:
      "Rizz is the first proof of Valoir's approach: applied AI systems that understand real workflow context, show their evidence, and keep people in control. Future products can carry the same pattern into other workflow domains when the facts are ready.",
    items: [
      "applied AI systems",
      "repository intelligence first",
      "evidence-backed outputs",
      "human-in-the-loop workflows",
      "future products when defined",
      "team layer later",
    ],
    ctas: [
      { label: "Explore Rizz", href: "#products", variant: "accent" },
      { label: "Read docs", href: "/docs", variant: "line" },
    ] as const,
  },
};
