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
  /** private alpha repo access → true hides/contextualizes the repo link */
  repoPrivate: boolean;
  installCommand: string | null;
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
      "Rizz is Valoir's first product: a private-alpha local agent harness for setup, provider routing, visible status, and an inspectable CLI/TUI loop.",
    license: "open-core",
    licenseLabel: "Open-core Rizz Core",
    capabilities: [
      {
        title: "Extremely lightweight",
        detail:
          "Agent Light keeps the current surface local and focused: one CLI, one TUI, and a small harness around the model route.",
      },
      {
        title: "Provider-agnostic",
        detail:
          "OpenRouter BYOK is the alpha fast path. Codex is available as a secondary local route through the signed-in Codex CLI/app.",
      },
      {
        title: "Visible control loop",
        detail:
          "`/status`, `/model`, `/workspace`, and setup checks keep routing, readiness, and limits visible.",
      },
      {
        title: "Local review-loop",
        detail:
          "The current discipline is local verification and review-loop dogfood. Custom QA/eval pipelines belong to the later Valoir layer.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: true,
    // Public installers are deferred; private alpha runs from a source checkout for now.
    installCommand: "Private alpha from source checkout",
    usageSnippet: [
      "# private alpha from the rizz checkout",
      "cd /Users/lokesh/Downloads/rizz",
      "pnpm install",
      "pnpm link:local",
      "",
      "# setup and route",
      "rizz setup --dry-run",
      "rizz setup          # choose OpenRouter BYOK or Codex",
      "",
      "# inside the TUI",
      "/status             # readiness, route, and cost signals",
      "/model              # switch route/profile",
      "/workspace          # visible stub; future Workspace Mode",
      "",
      "pnpm check          # local review-loop gate",
    ].join("\n"),
    docsUrl: "https://valoir.space/docs",
    // Repo is in private alpha, so there is no public star count to read yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Private Alpha · Agent Light",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
