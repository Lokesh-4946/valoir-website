/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "Open-core agent infrastructure.",
  description: "Infrastructure for local-first coding agents and the teams that run them.",
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
    "Small by default.",
    "Routes you can see.",
    "Power only when asked.",
  ],
  body: "The default view should stay quiet. Routing, cost, and workspace power stay visible without turning the harness into the product.",
};

/**
 * Open-source repos. Adding a repo = one line here.
 * stars: null renders "—" while the repo has no public count.
 */
export const repos = [
  {
    name: "rizz",
    description: "Local agent harness for setup, routing, and visible control.",
    language: "TypeScript",
    stars: null as number | null,
    href: "https://github.com/Lokesh-4946/rizz",
    note: "Private alpha; source checkout.",
  },
];

export const sections = {
  products: { label: "02 — Products", title: "Products" },
  whyRizz: {
    label: "03 — Why Rizz",
    title: "Built against the usual failure modes.",
    body: "Rizz starts from the objections developers already have about agent tools.",
    items: [
      {
        title: "It will get heavy.",
        text: "Keep the front door small: one local harness, one current project, no hidden workspace machinery.",
      },
      {
        title: "Costs will hide.",
        text: "Expose route, approval, and budget signals where the work happens.",
      },
      {
        title: "The provider will own the workflow.",
        text: "Make routing a user choice, not a product lock-in.",
      },
      {
        title: "Power will sprawl.",
        text: "Keep larger modes behind an explicit switch.",
      },
    ],
  },
  roadmap: {
    label: "04 — Roadmap",
    title: "Now, next, later.",
    lanes: [
      {
        label: "Now",
        title: "Agent Light",
        items: ["local CLI", "setup flow", "route picker", "visible status"],
      },
      {
        label: "Next",
        title: "Release path",
        items: ["alpha dogfood", "release tag", "public package"],
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
  openSource: {
    label: "06 — Open Source",
    title: "Source first, package later.",
    body: "The repo stays private while the alpha hardens. Public packaging follows the release tag.",
  },
};
