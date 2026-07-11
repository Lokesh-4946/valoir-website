/**
 * products.ts — the data-driven product catalog.
 *
 * Adding the next product after Rizz is ONE object edit in `products` below.
 * Future-ready slots:
 *   - demoVideoUrl: set a URL to auto-render a video player in the showcase.
 *   - tryItUrl:     set a URL to auto-render a "Try it yourself" live embed/CTA.
 * Both default to null and show the animated Rizz demo loop.
 *
 * Facts sourced from: rizz_cowork_brief.md, rizz_cowork_brief_5.md,
 * rizz_ui_ux_spec.md, rizz_experience.html, and the rizz repo
 * (README.md, CLAUDE.md, package.json). Where a public fact is genuinely
 * undecided in those files it is marked [NEEDS INPUT].
 */

export type License = "unlicensed" | "premium";

export type Capability = {
  title: string;
  detail: string;
};

export type InstallOption = {
  platform: string;
  tabLabel?: string;
  command: string;
};

export type InstallNote = {
  label: string;
  value: string;
};

export type Product = {
  slug: string;
  name: string;
  /** parent brand label, e.g. "by Valoir" */
  by: string;
  tagline: string;
  description: string;
  license: License;
  /** short badge label shown in the UI */
  licenseLabel: string;
  capabilities: Capability[];
  repoUrl: string | null;
  /** private repo access → true hides/contextualizes the repo link */
  repoPrivate: boolean;
  installTitle: string | null;
  installIntro: string | null;
  installRequirement: string | null;
  installOptions: InstallOption[];
  installNotes: InstallNote[];
  /** a minimal usage snippet for the For Developers section */
  usageSnippet: string | null;
  docsUrl: string | null;
  stars: number | null;
  language: string;
  demoVideoUrl: string | null; // future: set to auto-render player
  tryItUrl: string | null; // future: set to auto-render live demo
  flagship: boolean;
  status: string;
};

export const products: Product[] = [
  {
    slug: "rizz",
    name: "Rizz",
    by: "by Valoir",
    tagline: "Understand the system before changing it.",
    description:
      "Rizz 0.3.0 is a local Project Intelligence Engine that maps architecture, evidence, and change impact before edits.",
    license: "unlicensed",
    licenseLabel: "License not declared",
    capabilities: [
      {
        title: "Architecture causality",
        detail:
          "Trace routes, services, state and data dependencies, and database surfaces back to source evidence.",
      },
      {
        title: "Database relationships",
        detail:
          "Recognizes SQLAlchemy, Alembic, raw SQL, and Mongoose relationships, including foreign keys and cross-table impact.",
      },
      {
        title: "Relationship-aware review",
        detail:
          "Review follows project and data relationships into affected flows, cross-table blast radius, and targeted verification.",
      },
      {
        title: "Evidence and signoff",
        detail:
          "Shipped deterministic verification plans, evidence scoring, approval packets, CLI signoff, and fingerprint-bound history reuse.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: false,
    installTitle: "Install Rizz",
    installIntro: "Install Rizz 0.3.0 on macOS, Linux, or Windows PowerShell.",
    installRequirement: "Requires Node >= 22, npm, and git.",
    installOptions: [
      {
        platform: "macOS",
        command: ["npm install -g @valoir/rizz", "rizz understand"].join("\n"),
      },
      {
        platform: "Linux",
        command: ["npm install -g @valoir/rizz", "rizz understand"].join("\n"),
      },
      {
        platform: "Windows PowerShell",
        tabLabel: "Windows",
        command: ["npm install -g @valoir/rizz", "rizz understand"].join("\n"),
      },
    ],
    installNotes: [
      { label: "Package", value: "@valoir/rizz" },
      { label: "Release", value: "0.3.0" },
      { label: "License", value: "License not declared" },
    ],
    usageSnippet: [
      "# install",
      "npm install -g @valoir/rizz",
      "",
      "# understand the current repository",
      "rizz understand",
      "",
      "# inspect and review with local evidence",
      "rizz explain flow <id>",
      "rizz review --json",
    ].join("\n"),
    docsUrl: "https://valoir.space/docs",
    // Repo has no public star count yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Rizz 0.3.0",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
