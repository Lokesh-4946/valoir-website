/**
 * products.ts — the data-driven product catalog.
 *
 * Adding the next product after Rizz is ONE object edit in `products` below.
 * Future-ready slots:
 *   - demoVideoUrl: set a URL to auto-render a video player in the showcase.
 *   - tryItUrl:     set a URL to auto-render a "Try it yourself" live embed/CTA.
 * Both default to null and show a tasteful "Demo coming soon" empty state.
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
      "Rizz is a CLI-installable coding agent loop — model-call, tool-dispatch, tool-result, repeat, with interrupt, compression, budget, and fallback. Single-agent and minimal by default. Hermes-class power on demand behind an opt-in /workspace switch.",
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
          "Subscription /login, BYOK, or cloud creds across a curated catalog — Claude, Codex, OpenRouter, Bedrock, Ollama. Hot-swap models with no restart and no code changes.",
      },
      {
        title: "A hub, not an island",
        detail:
          "Callable by any tool — print/JSON, RPC, SDK, MCP/ACP — and connects to Cursor, Claude, and Codex rather than replacing them.",
      },
      {
        title: "Power on demand",
        detail:
          "Plan mode, parallel git-worktree agents, shared memory, and the greploop PR gate ship as opt-in /workspace power — never default bloat.",
      },
    ],
    repoUrl: "https://github.com/Lokesh-4946/rizz",
    repoPrivate: true,
    // Public distribution channel: Valoir Homebrew tap (decided 2026-06-14).
    installCommand: "brew install valoir/tap/rizz",
    usageSnippet: [
      "# install",
      "brew install valoir/tap/rizz",
      "",
      "# run the agent",
      "rizz              # interactive TUI — Simple mode by default",
      "/model            # switch provider (subscription or BYOK), no restart",
      "/workspace        # opt-in: parallel worktree agents + greploop gate",
      "",
      "# or build from source (contributors)",
      "pnpm install",
      "pnpm check        # lint · type-check · test · eval · footprint",
    ].join("\n"),
    docsUrl: "https://docs.valoir.com",
    // Repo is private during build, so there is no public star count to read yet.
    stars: null,
    language: "TypeScript",
    demoVideoUrl: null,
    tryItUrl: null,
    flagship: true,
    status: "Early build · M2 walking skeleton",
  },
];

export const flagship = products.find((p) => p.flagship) ?? products[0];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
