/**
 * content.ts — site-wide copy and config (the brand voice in one place).
 * Voice: sharp, confident, precise. Short declarative sentences. No fluff.
 */

export const site = {
  name: "Valoir",
  wordmark: "Valoir",
  tagline: "AI harnesses & dev tools.",
  description:
    "Valoir builds developer tools — AI harnesses and dev tooling, open-source and premium. Built by a developer, for developers.",
  url: "https://valoir.com", // production domain (owned; registered at Hover)
  github: "https://github.com/Lokesh-4946",
  socials: [
    { label: "GitHub", href: "https://github.com/Lokesh-4946" },
    // No public X/other social yet — intentionally omitted so we never ship a dead "#" link.
  ],
};

export const nav = {
  links: [
    { label: "Products", href: "#products" },
    { label: "Open Source", href: "#open-source" },
    { label: "Docs", href: "#developers" },
  ],
  cta: { label: "Get Rizz", href: "#developers" },
};

export const hero = {
  eyebrow: "AI harnesses & dev tools",
  headline: ["Tools for people", "who build", "with agents."],
  sub: "Valoir ships AI harnesses and developer tooling — lean, opinionated, frictionless to connect. Open-source core, premium power.",
  primary: { label: "Explore Rizz", href: "#products" },
  secondary: { label: "View on GitHub", href: "https://github.com/Lokesh-4946/rizz" },
};

export const manifesto = {
  label: "01 — Manifesto",
  lines: [
    "Built by a developer, for developers.",
    "The heavy machinery should be one toggle away — never shipped into the default view.",
    "Open-source at the core. Premium where the work earns it.",
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
    body: "Code lives in Git, not in slideware. The Rizz core flips to open-source (MIT, like Pi) at v1, with any paid layer kept separate — classic open-core.",
  },
  developers: {
    label: "04 — For developers",
    title: "Install. Run. Connect.",
    body: "One command to install, one command to run, and your existing model subscription or key. The loop gets out of the way.",
  },
  roadmap: {
    label: "05 — Roadmap",
    title: "Rizz is the first, not the last.",
    body: "The product config is built so the next tool is one object edit. Demos and live 'try it yourself' embeds slot in when they ship.",
    items: [
      { tag: "Now", text: "Rizz — walking skeleton: one-command install, TUI, the loop on a Claude subscription." },
      { tag: "Next", text: "Connectivity: Claude / Codex / Cursor / MCP adapters, and the eval harness." },
      { tag: "Then", text: "/workspace: parallel worktree agents, shared memory, the greploop merge gate." },
      { tag: "Later", text: "v1: core flips to open (MIT). More Valoir tools. Live demos on this site." },
    ],
  },
};

export const footer = {
  bigLine: "Build with agents.\nKeep your tools light.",
  cta: { label: "Get Rizz", href: "#developers" },
  legal: `© ${new Date().getFullYear()} Valoir. Built by a developer, for developers.`,
};
