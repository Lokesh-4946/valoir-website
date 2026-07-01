/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Project Intelligence infrastructure.",
  description:
    "Valoir builds Project Intelligence infrastructure. Rizz is the local Project Intelligence Engine for understanding repositories before changing them.",
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
    { label: "Offering", href: "/#offering" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Install Rizz", href: "/#products" },
};

export const hero = {
  headline: [
    "Valoir builds",
    "Project Intelligence",
    "infrastructure.",
  ],
  subhead:
    "Rizz is the local Project Intelligence Engine for understanding repositories before changing them.",
  primary: { label: "Install Rizz", href: "#products" },
  command: "npm install -g @valoir/rizz",
  secondary: [
    { label: "View docs", href: "/docs", external: false },
    { label: "View on GitHub", href: "https://github.com/Lokesh-4946/rizz", external: true },
  ],
};

export const manifesto = {
  label: "01 — Manifesto",
  lines: [
    "Understand first.",
    "Change second.",
    "Power stays opt-in.",
  ],
  body:
    "Rizz turns a repository into a local Project Intelligence Layer: components, flows, evidence, risks, reviews, and research artifacts. Local-first by default; model and workspace power only when asked.",
};

export const sections = {
  products: { label: "02 — Products", title: "Products" },
  whyRizz: {
    label: "03 — Why Rizz",
    title: "Understand the repo before you touch it.",
    body: "Rizz turns scattered project knowledge into a local, inspectable layer you can explain, review, and question.",
    items: [
      {
        title: "Understand the system",
        text: "Components, flows, commands, tests, dependencies, risks, and evidence are extracted into a local Project Intelligence Layer.",
      },
      {
        title: "Explain before editing",
        text: "Use rizz explain for files, components, and flows before changing code.",
      },
      {
        title: "Review with blast radius",
        text: "Use rizz review to connect a diff to affected components, flows, tests, configs, and risks.",
      },
      {
        title: "Research-grade artifacts",
        text: "Rizz emits coverage, confidence, evidence quality, architecture reasoning, benchmark readiness, and PIE acceptance data under .rizz/research.",
      },
    ],
  },
  roadmap: {
    label: "04 — Roadmap",
    title: "Now, next, later.",
    lanes: [
      {
        label: "Now",
        title: "Project Intelligence Engine",
        items: [
          "Project Knowledge Store",
          "Mission Control",
          "Explain",
          "Review",
          "gated Ask",
          "research artifacts",
          "npm install",
        ],
      },
      {
        label: "Next",
        title: "Validation path",
        items: [
          "real-repo validation",
          "PI-Bench expansion",
          "reliability benchmark seeds",
          "evidence calibration",
          "release/docs polish",
        ],
      },
      {
        label: "Later",
        title: "Team power",
        items: [
          "Workspace Mode",
          "team layer",
          "hosted relay",
          "enterprise provider setup",
          "native installers",
        ],
      },
    ],
  },
  offering: {
    label: "05 — Valoir offering",
    title: "A team layer on top of local intelligence.",
    body:
      "Valoir's commercial layer will build on Rizz's Project Intelligence Layer for teams that need managed review, shared architecture intelligence, auditability, and benchmark-backed software understanding.",
    items: [
      "hosted relay",
      "managed review",
      "team audit logs",
      "enterprise provider setup",
      "workflow packs",
      "custom QA/eval pipelines",
    ],
  },
};
