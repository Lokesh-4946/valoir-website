/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Open-core agent infrastructure.",
  description:
    "Valoir builds open-core agent infrastructure. Rizz is the first product.",
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
    { label: "Open Source", href: "/#open-source" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Get Rizz", href: "/#products" },
};

export const hero = {
  headline: ["Valoir builds", "open-core agent", "infrastructure."],
  primary: { label: "Explore Rizz", href: "#products" },
  secondary: { label: "View on GitHub", href: "https://github.com/Lokesh-4946/rizz" },
};

export const manifesto = {
  label: "01 — Manifesto",
  lines: [
    "Open-core agent infrastructure.",
    "Rizz is the first product.",
    "Power stays opt-in.",
  ],
  body: "Valoir builds open-core agent infrastructure. Rizz is the first product. Rizz Core stays light, inspectable, and open-core; larger workflow power lives outside the default path.",
};

/**
 * Open-source repos. Adding a repo = one line here.
 * stars: null renders "—" (e.g. private alpha).
 */
export const repos = [
  {
    name: "rizz",
    description:
      "Private alpha Agent Light: local CLI, OpenRouter BYOK, Codex secondary route, visible status/model controls.",
    language: "TypeScript",
    stars: null as number | null,
    href: "https://github.com/Lokesh-4946/rizz",
    note: "Private alpha from source checkout",
  },
];

export const sections = {
  products: { label: "02 — Products", title: "Products" },
  whyRizz: {
    label: "03 — Why Rizz",
    title: "A harness you can see.",
    body: "Rizz is built for developers who want a local agent loop they can inspect, interrupt, and route deliberately.",
    items: [
      {
        title: "Lightweight harness",
        text: "Agent Light keeps the default path local, small, and focused on one project.",
      },
      {
        title: "Visible approvals and costs",
        text: "Status, route, and budget signals stay visible instead of disappearing behind a black box.",
      },
      {
        title: "Provider choice",
        text: "OpenRouter BYOK is the alpha fast path; Codex is available as a secondary local route.",
      },
      {
        title: "Opt-in power",
        text: "Workspace Mode and larger connective tissue stay off until the user asks for them.",
      },
    ],
  },
  roadmap: {
    label: "04 — Roadmap",
    title: "Three lanes, no pretend shipping.",
    lanes: [
      {
        label: "Now",
        title: "Agent Light",
        items: ["Agent Light", "local CLI", "OpenRouter BYOK", "Codex route"],
      },
      {
        label: "Next",
        title: "Private alpha",
        items: ["private alpha dogfood", "release tag", "public package"],
      },
      {
        label: "Later",
        title: "Opt-in power",
        items: ["Workspace Mode", "Repo Brain", "OS/Jarvis connectors", "enterprise providers"],
      },
    ],
  },
  offering: {
    label: "05 — Valoir offering",
    title: "Separate from open-source Rizz Core.",
    body: "Rizz Core is the local harness. Valoir's commercial layer is the connective tissue around it for teams that need managed approvals, routing, and auditability.",
    items: [
      "hosted relay",
      "approval inbox",
      "team audit logs",
      "enterprise provider setup",
      "workflow packs",
      "custom QA/eval pipelines",
    ],
  },
  openSource: {
    label: "06 — Open Source",
    title: "Open at the core.",
    body: "Rizz Core stays distinct from Valoir's hosted and enterprise layer. Today the private alpha runs from a source checkout; public packaging comes after the release tag.",
  },
};
