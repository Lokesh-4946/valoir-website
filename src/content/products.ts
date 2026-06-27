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

export type License = "open-source" | "premium" | "open-core";

export type Capability = {
  title: string;
  detail: string;
};

export type InstallOption = {
  platform: string;
  command: string;
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
    tagline: "The lightest, most connectable coding agent harness.",
    description:
      "Rizz is the first product: a local Agent Light harness for setup, routing, and an inspectable CLI/TUI loop.",
    license: "open-core",
    licenseLabel: "Open-core Rizz Core",
    capabilities: [
      {
        title: "Small harness",
        detail:
          "The current surface is a local CLI/TUI wrapped around setup, one active route, and the agent loop.",
      },
      {
        title: "Provider-agnostic",
        detail:
          "OpenRouter BYOK is the fast path. Codex is available as a secondary local route through the signed-in Codex CLI/app.",
      },
      {
        title: "Visible control loop",
        detail:
          "`/status`, `/model`, `/workspace`, and setup checks keep routing, readiness, and limits visible.",
      },
      {
        title: "Local review-loop",
        detail:
          "The current discipline is local verification and review-loop dogfood. Custom QA/eval pipelines belong in the later Valoir layer.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: true,
    installTitle: "Install Rizz",
    installIntro: "Run the current Rizz preview on macOS, Linux, or Windows PowerShell.",
    installRequirement: "Requires Node >= 22 and npm.",
    installOptions: [
      {
        platform: "macOS",
        command: ["npm install -g @valoir/rizz", "rizz setup", "rizz"].join("\n"),
      },
      {
        platform: "Linux",
        command: ["npm install -g @valoir/rizz", "rizz setup", "rizz"].join("\n"),
      },
      {
        platform: "Windows PowerShell",
        command: ["npm install -g @valoir/rizz", "rizz setup", "rizz"].join("\n"),
      },
    ],
    usageSnippet: [
      "# install",
      "npm install -g @valoir/rizz",
      "",
      "# setup and launch",
      "rizz setup",
      "rizz",
      "",
      "# inside the TUI",
      "/status             # readiness, route, and cost signals",
      "/model              # switch route/profile",
      "/workspace          # visible stub; future Workspace Mode",
      "",
      "pnpm check          # local review-loop gate",
    ].join("\n"),
    docsUrl: "https://valoir.space/docs",
    // Repo has no public star count yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Preview · Agent Light",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
