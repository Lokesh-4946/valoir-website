/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Applied AI systems for real workflows.",
  description: "Developer tools for understanding real systems before changing them.",
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
  headline: ["Valoir builds", "applied AI", "for real workflows."],
  subhead: "Developer tools for understanding real systems before changing them.",
  primary: { label: "Explore Rizz", href: "#products" },
  secondary: { label: "Read docs", href: "/docs" },
  supporting: {
    installCommand: "npm install -g @valoir/rizz",
    github: { label: "GitHub", href: "https://github.com/Lokesh-4946/rizz" },
  },
};

export const manifesto = {
  label: "01 — Manifesto",
  lines: [
    "Trace the architecture.",
    "Follow the evidence.",
    "Review the whole impact.",
  ],
  body: "Rizz connects routes, services, state, data, and source evidence so a change starts with the system around it.",
};

export const sections = {
  products: { label: "02 — Products", title: "Products" },
  whyRizz: {
    label: "03 — Why Rizz",
    title: "See beyond the changed file.",
    body: "Local architecture intelligence turns repository evidence into a reviewable change surface.",
    items: [
      {
        title: "Maps causality",
        text: "Routes, services, state, data, and dependencies stay connected.",
      },
      {
        title: "Understands relationships",
        text: "SQLAlchemy, Alembic, raw SQL, and Mongoose links reveal cross-table impact.",
      },
      {
        title: "Reviews blast radius",
        text: "Changed files lead to affected flows, data dependencies, and targeted tests.",
      },
      {
        title: "Keeps evidence inspectable",
        text: "Verification plans, approval packets, and signoff stay tied to local artifacts.",
      },
    ],
  },
  roadmap: {
    label: "04 — Roadmap",
    title: "Now, next, later.",
    lanes: [
      {
        label: "Now",
        title: "Rizz 0.3.1",
        items: [
          "architecture causality",
          "database relationships",
          "relationship-aware review",
          "verification plans",
          "evidence scoring",
          "approval packets",
          "CLI signoff",
          "signoff expiry and revocation",
          "review precision",
        ],
      },
      {
        label: "Next",
        title: "Distribution polish",
        items: ["native installers", "provider setup wiring", "planning mode"],
      },
      {
        label: "Later",
        title: "Opt-in power",
        items: ["Workspace Mode", "team layer", "hosted relay", "enterprise providers"],
      },
    ],
  },
  offering: {
    label: "05 — Valoir offering",
    title: "Team layer, not Rizz Core.",
    body: "Rizz Core stays local. Valoir's paid layer is for teams that need managed routing, approvals, and auditability.",
    items: [
      "hosted relay",
      "approval inbox",
      "team audit logs",
      "enterprise provider setup",
      "workflow packs",
      "custom QA/eval pipelines",
    ],
  },
};
