/**
 * products.ts — the data-driven product catalog.
 *
 * Adding the next product after Rizz is ONE object edit in `products` below.
 * Future-ready slots:
 *   - demoVideoUrl: set a URL to auto-render a video player in the showcase.
 *   - tryItUrl:     set a URL to auto-render a "Try it yourself" live embed/CTA.
 * Both default to null and show the animated Rizz project-intelligence loop.
 *
 * Facts sourced from the Valoir product brain and the Rizz 0.2.0 public npm
 * release brief. Missing product facts must be marked [NEEDS INPUT].
 */

export type License = "open-source" | "premium" | "open-core";

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
  badges: string[];
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
    tagline: "Repository intelligence for codebase understanding",
    description:
      "Rizz maps repository structure into inspectable local artifacts before you edit: .rizz/brain, Mission Control, Explain, Review, gated Ask, and research files.",
    license: "open-core",
    licenseLabel: "Open-core Project Intelligence Engine",
    badges: [
      "First Valoir product",
      "Public npm release",
      "Local-first",
      "Evidence-backed",
    ],
    capabilities: [
      {
        title: "Project Knowledge Store",
        detail:
          "Rizz writes a structured project store under .rizz/brain so the repo can be explained and reviewed from local evidence.",
      },
      {
        title: "Mission Control",
        detail:
          "The local report in .rizz/reports/index.html gives components, flows, commands, tests, risks, and evidence in one place.",
      },
      {
        title: "Explain and Review",
        detail:
          "`rizz explain` explains files, components, and flows. `rizz review` connects diffs to affected code, tests, configs, and risks.",
      },
      {
        title: "Gated Ask and research",
        detail:
          "`rizz ask` stays explicit and opt-in. Research artifacts under .rizz/research show coverage, confidence, evidence quality, and architecture reasoning.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: false,
    installTitle: "Install Rizz",
    installIntro:
      "Install the public npm release and generate your first local project map.",
    installRequirement: "Requires Node >= 22 and npm.",
    installOptions: [
      {
        platform: "macOS",
        command: ["npm install -g @valoir/rizz", "cd your-repo", "rizz understand"].join("\n"),
      },
      {
        platform: "Linux",
        command: ["npm install -g @valoir/rizz", "cd your-repo", "rizz understand"].join("\n"),
      },
      {
        platform: "Windows PowerShell",
        tabLabel: "Windows",
        command: ["npm install -g @valoir/rizz", "cd your-repo", "rizz understand"].join("\n"),
      },
    ],
    installNotes: [
      { label: "Package", value: "@valoir/rizz on npm" },
      { label: "Core", value: "repository understanding before edits" },
      { label: "Team layer", value: "separate from the default install" },
    ],
    usageSnippet: [
      "# install",
      "npm install -g @valoir/rizz",
      "",
      "# understand the current repo",
      "cd your-repo",
      "rizz understand",
      "",
      "# explain and review",
      "rizz explain README.md",
      "rizz review --json",
      "rizz ask \"what should I read first?\"",
      "",
      "open .rizz/reports/index.html",
    ].join("\n"),
    docsUrl: "https://valoir.space/docs",
    // Repo has no public star count yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Rizz 0.2.0 · Public npm release",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
