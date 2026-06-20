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
  /** currently private during build → true hides/contextualizes the repo link */
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
      "Rizz is a local coding-agent harness for model turns, tool calls, verified edits, visible budget, fallback, and resumable sessions. It starts as a single-agent TUI and grows into opt-in workspace power only when you ask.",
    license: "open-core",
    licenseLabel: "Open-core · MIT at v1",
    capabilities: [
      {
        title: "Extremely lightweight",
        detail:
          "Minimal dependencies, fast cold start, small footprint — enforced by a CI footprint budget, not by good intentions.",
      },
      {
        title: "Provider-agnostic",
        detail:
          "Bring account auth, API key, cloud credential, or a local model when that route is available. Switch profiles without changing code or restarting the session.",
      },
      {
        title: "A hub, not an island",
        detail:
          "Callable by tools and scripts through print, JSON, RPC, SDK, and protocol surfaces, so Rizz can fit into the workflow you already use.",
      },
      {
        title: "Power on demand",
        detail:
          "Planning, worktree agents, shared memory, and reviewed merge gates stay behind explicit workspace power — never default bloat.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: true,
    // Public installers are deferred; contributors dogfood from the repo for now.
    installCommand: "pnpm link:local",
    usageSnippet: [
      "# from the rizz checkout",
      "pnpm install",
      "pnpm link:local     # build and link the local shim",
      "",
      "# run the agent",
      "rizz                # interactive TUI — demo mode until connected",
      "rizz setup --dry-run",
      "/model              # switch provider/profile, no restart",
      "/workspace          # opt-in workspace power when it ships",
      "",
      "pnpm check        # lint · type-check · test · eval · footprint",
    ].join("\n"),
    docsUrl: "https://valoir.space/docs",
    // Repo is private during build, so there is no public star count to read yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Local harness dogfood",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
