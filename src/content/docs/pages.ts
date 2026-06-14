import type { DocPage } from "./types";

/**
 * The Rizz documentation, authored from `knowledge/docs-content.md`.
 * Honesty rule: Rizz is an early build — features carry [now] / [m3] / [planned]
 * status; never present planned features as shipped.
 */
export const docsPages: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description:
      "Rizz is the lightest, most connectable coding agent harness — a CLI agent loop that's minimal by default with power on demand.",
    order: 1,
    blocks: [
      {
        type: "p",
        text: "**Rizz is the lightest, most connectable coding agent harness.** It's a CLI-installable coding agent loop — model-call → tool-dispatch → tool-result → repeat — with interrupt, compression, budget, and fallback. Single-agent and minimal by default (the “Pi-class front door”); Hermes-class power on demand behind an opt-in `/workspace` switch.",
      },
      { type: "h", level: 2, text: "Three principles" },
      {
        type: "ul",
        items: [
          "**Extremely lightweight** — minimal dependencies, fast cold start, small footprint, enforced by a CI footprint budget (the build fails if size/cold-start regress).",
          "**Provider-agnostic** — subscription `/login`, bring-your-own-key, or cloud creds across a curated catalog. No model lock-in; switching never touches your code or sessions.",
          "**A hub, not an island** — callable by any tool (print/JSON, RPC, SDK; MCP/ACP) and connects *to* Cursor / Claude / Codex rather than replacing them.",
        ],
      },
      {
        type: "p",
        text: "Open-core: the core flips to open source (MIT) at v1; any paid layer stays separate.",
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    description:
      "Install Rizz from source today (Homebrew tap planned for v1), launch the TUI, and connect a model provider.",
    order: 2,
    blocks: [
      { type: "h", level: 2, text: "Install", status: "m3" },
      {
        type: "p",
        text: "The Homebrew tap ships at v1. Today, during the early build, install from source.",
      },
      {
        type: "code",
        lang: "bash",
        code: "# At v1 (planned): one command via the Valoir Homebrew tap\nbrew install valoir/tap/rizz\n\n# Today (early build) — from source:\ngit clone https://github.com/Lokesh-4946/rizz\ncd rizz\npnpm install\npnpm build        # or: scripts/install.sh  → links `rizz` onto PATH",
      },
      { type: "p", text: "Requires Node ≥ 22 (CI pins 24 LTS) and pnpm." },
      { type: "h", level: 2, text: "First run" },
      { type: "code", lang: "bash", code: "rizz              # launches the interactive TUI (Simple mode)" },
      {
        type: "p",
        text: "On first launch you pick a model provider and a theme — no Rizz account required. Press `esc` to explore in demo mode with a canned transcript.",
      },
      { type: "h", level: 2, text: "Connect a model", status: "m3" },
      {
        type: "code",
        lang: "text",
        code: "/login            # sign in to a subscription (Claude / Codex / …) or paste an API key\n/model            # or ⌃L — pick provider + model; hot-swaps with no restart",
      },
    ],
  },
  {
    slug: "core-concepts",
    title: "Core concepts",
    description:
      "The Rizz loop, the reliability guarantees built into it, and the two run modes — Simple and Workspace.",
    order: 3,
    blocks: [
      { type: "h", level: 2, text: "The loop" },
      {
        type: "p",
        text: "Each turn: call the model → dispatch any tool calls → feed results back → repeat, until done or a limit hits. Built in for reliability:",
      },
      {
        type: "ul",
        items: [
          "**Interrupt** [now] — `esc` (or Ctrl+C) stops a running turn; typing mid-stream queues a redirect (the loop finishes the current tool, then takes the new instruction).",
          "**Budget** [now] — per-session turn/token caps; exceeding returns `BUDGET_EXCEEDED`. Cost is always visible (shows `$0.00 (sub)` on subscriptions).",
          "**Compression** [planned] — auxiliary-model summarization that protects head & tail context; never silently drops critical info.",
          "**Fallback** [planned] — on rate-limit / outage, fall to the next model in the chain, shown to you, with a manual override.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        text: "**Reliability rule (binding):** every edit is verified after write — the apply path re-reads and confirms the change landed byte-for-byte before reporting success. A write that can't be verified is a failure, not a warning.",
      },
      { type: "h", level: 2, text: "Two modes" },
      {
        type: "p",
        text: "Simple (default): one agent, four tools (read / write / edit / bash), the loop. Workspace (opt-in via `/workspace`): parallel git-worktree agents + coordination — see Workspace mode.",
      },
    ],
  },
  {
    slug: "model-providers",
    title: "Model providers",
    description:
      "Rizz is provider-agnostic: use a subscription, bring your own key, or cloud creds across a curated catalog. Credentials live in the OS keychain.",
    order: 4,
    blocks: [
      { type: "p", text: "Rizz is provider-agnostic. Auth paths per provider:" },
      {
        type: "ul",
        items: [
          "**Use a subscription** — browser OAuth / device-code; token stored in the OS keychain.",
          "**Paste an API key (BYOK)** — masked field, validated with a 1-line test call, stored in the keychain (never the repo).",
          "**Cloud creds** — e.g. Amazon Bedrock via AWS profile/role + region (“governed”).",
          "**Custom** — any OpenAI-compatible or Anthropic-messages base URL.",
        ],
      },
      {
        type: "p",
        text: "Curated catalog (subscription and/or key): Claude, Codex, GitHub Copilot, OpenRouter, Nvidia NIM, Amazon Bedrock, Anthropic, OpenAI, Google, Groq, Mistral, xAI, and Ollama (local/offline). After auth, a searchable model sub-list appears (tool-capable filtered in, recents pinned, default starred). Selecting a model hot-swaps with **no restart**. Credentials live in the OS keychain by default; env vars are honored; nothing is written to the repo or vault.",
      },
      {
        type: "callout",
        tone: "m3",
        text: "The catalog is the product intent; live provider adapters land in M3.",
      },
    ],
  },
  {
    slug: "commands-and-keys",
    title: "Commands & keys",
    description:
      "The Rizz command palette and keyboard shortcuts, with the build status of each command.",
    order: 5,
    blocks: [
      { type: "h", level: 2, text: "Commands" },
      {
        type: "table",
        head: ["Command", "Does", "Status"],
        rows: [
          ["`/login`", "Provider auth (subscription or key)", "[m3]"],
          ["`/model`, `⌃L`", "Model picker", "[m3]"],
          ["`/theme`", "List / set themes", "[now]"],
          ["`/workspace`", "Enter multi-agent Workspace mode", "[planned]"],
          ["`/plan`", "Plan-mode: draft a step list before editing", "[planned]"],
          ["`/session`, `/resume`", "List / switch / resume sessions (tree-structured)", "[planned]"],
          ["`/cost`", "Usage + budget this session", "[now]"],
          ["`/skills`, `/mcp`", "Manage installed skills / MCP servers", "[planned]"],
          ["`/account`", "Optional Rizz account (sync, evals, team)", "[planned]"],
          ["`/help`, `/exit`", "Keys + commands; quit", "[now]"],
        ],
      },
      { type: "h", level: 2, text: "Keys" },
      {
        type: "p",
        text: "`↵` send · `⇧↵` newline · `esc` interrupt · `⌃L` model picker · `⌃K` command palette [planned].",
      },
    ],
  },
  {
    slug: "workspace-mode",
    title: "Workspace mode",
    description:
      "Workspace mode (planned): opt-in parallel git-worktree agents, shared memory, and a per-branch greploop merge gate. Power summoned, not shipped.",
    order: 6,
    blocks: [
      { type: "h", level: 2, text: "Workspace mode", status: "planned" },
      {
        type: "callout",
        tone: "planned",
        text: "Workspace mode is planned — it is not in the current build.",
      },
      {
        type: "p",
        text: "Opt-in via `/workspace`. Parallel **git-worktree agents** (isolated, so they never collide), a shared decision/warning memory, conflict status, a per-branch **greploop** merge gate, and a shared budget meter. `rizz workspace finish` merges greploop-passed branches and collapses back to Simple. None of this loads in the default path — power is summoned, not shipped.",
      },
    ],
  },
  {
    slug: "themes",
    title: "Themes",
    description:
      "Built-in Rizz themes hot-swap with no restart. A theme defines only the token palette and a few glyphs; layout is theme-independent.",
    order: 7,
    blocks: [
      { type: "h", level: 2, text: "Themes", status: "now" },
      {
        type: "p",
        text: "Built-ins: `valoir` (default), `gruvbox`, `nord`, `paper` (light), `high-contrast`. `/theme set <name>` hot-swaps with no restart. A theme defines only the token palette + a few glyphs; layout is theme-independent. Themes are shareable packages.",
      },
    ],
  },
  {
    slug: "states",
    title: "States you'll see",
    description:
      "The interface states in Rizz — empty, loading, offline, rate-limited, auth-expired, and bad-edit — and which are shipped vs planned.",
    order: 8,
    blocks: [
      {
        type: "p",
        text: "Rizz is explicit about its states — it never shows a blank screen:",
      },
      {
        type: "ul",
        items: [
          "**Empty** [now] — a one-line invitation, never a blank screen.",
          "**Loading** [now] — a thinking line + quiet spinner.",
          "**Offline** [planned] — banner offering a local model.",
          "**Rate-limited** [planned] — fallback shown.",
          "**Auth-expired** [m3] — inline re-login, turn preserved.",
          "**Bad edit** [now] — rejected diff + reason + retry.",
        ],
      },
    ],
  },
  {
    slug: "run-modes",
    title: "Run modes",
    description:
      "One Rizz binary, four run modes: interactive TUI, print/JSON, RPC, and SDK.",
    order: 9,
    blocks: [
      {
        type: "p",
        text: "One binary, four modes: **interactive TUI** (the focus), **print/JSON** (scriptable), **RPC** (process integration), **SDK** (embed).",
      },
      {
        type: "callout",
        tone: "m3",
        text: "TUI + print-mode are seeded now; RPC and SDK are planned.",
      },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    description:
      "Rizz dogfoods the discipline it ships: a worktree-per-task dev loop, strict TypeScript, a footprint budget, and greploop to 5/5 before merge.",
    order: 10,
    blocks: [
      {
        type: "p",
        text: "Rizz dogfoods the discipline it ships. Dev loop per change: **plan → git worktree per task → build → `pnpm check` → code-simplifier pass → PR via `gh` → greploop to 5/5 → merge to `develop`**.",
      },
      {
        type: "p",
        text: "TypeScript strict, ESM-only, Node ≥ 22; conventional commits; service-layer split (orchestration in `core`/`cli`, mechanics in `providers`). A new dependency in `core`/`providers` must be justified — the footprint budget is a gate.",
      },
      {
        type: "p",
        text: "Local check: `pnpm check` (lint · typecheck · test · eval · footprint).",
      },
    ],
  },
  {
    slug: "status-and-roadmap",
    title: "Status & roadmap",
    description:
      "Where Rizz is today (M2 walking skeleton) and the milestone path to v1, when the core flips to MIT.",
    order: 11,
    blocks: [
      {
        type: "callout",
        tone: "note",
        text: "Rizz is an early build. The milestones below show what's done and what's ahead — features tied to later milestones are not shipped yet.",
      },
      {
        type: "ul",
        items: [
          "**M0** ✅ repo + standards (monorepo, CI: lint · type-check · test · eval · footprint).",
          "**M2** walking skeleton — one-command install, TUI, empty loop on a stub provider.",
          "**M3** single-agent core — the loop + 4 tools + provider layer (`/login`, `/model`, themes).",
          "**M4** connectivity · **M5** eval harness · **M6** `/workspace` · **M7** v1 (core → MIT).",
        ],
      },
      {
        type: "p",
        text: "Repo: [github.com/Lokesh-4946/rizz](https://github.com/Lokesh-4946/rizz) (private during build; MIT at v1).",
      },
    ],
  },
];
