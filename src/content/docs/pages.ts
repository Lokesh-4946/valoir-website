import type { DocPage } from "./types";

/**
 * The Rizz documentation, authored from `knowledge/docs-content.md`.
 * Honesty rule: features carry [now] / [preview] / [planned]
 * status; never present planned features as shipped.
 */
export const docsPages: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description: "The canonical definition and principles behind Rizz.",
    order: 1,
    blocks: [
      {
        type: "p",
        text: "**Rizz 0.3.0 is a local Project Intelligence Engine.** It maps repository architecture, relationships, evidence, and change impact before edits.",
      },
      { type: "h", level: 2, text: "Three principles" },
      {
        type: "ul",
        items: [
          "**Understand first** — connect routes, services, state, data, and dependencies before changing code.",
          "**Evidence-backed** — keep claims tied to files, flows, tests, configs, and risks.",
          "**Local-first** — keep the Project Knowledge Store and reports under `.rizz/` by default.",
        ],
      },
      {
        type: "p",
        text: "Open-core: Rizz Core is separate from Valoir's later hosted and enterprise layer.",
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    description: "Install the current Rizz 0.3.0 release with npm.",
    order: 2,
    blocks: [
      { type: "h", level: 2, text: "Install", status: "now" },
      {
        type: "p",
        text: "Use the same npm path on macOS, Linux, and Windows PowerShell.",
      },
      {
        type: "code",
        lang: "bash",
        code: "# macOS, Linux, or Windows PowerShell\nnpm install -g @valoir/rizz\nrizz understand",
      },
      { type: "p", text: "Rizz 0.3.0 is the current release." },
      { type: "p", text: "Requirements for all platforms: Node ≥ 22, npm, and git." },
      { type: "h", level: 2, text: "Understand a repository" },
      {
        type: "p",
        text: "Run `rizz understand` inside a repository. Rizz writes the Project Knowledge Store under `.rizz/brain`, research artifacts under `.rizz/research`, and Mission Control at `.rizz/reports/index.html`.",
      },
      {
        type: "p",
        text: "Provider details live in Model providers. Rizz setup keeps credential handling explicit.",
      },
      { type: "h", level: 2, text: "Inspect and review", status: "now" },
      {
        type: "code",
        lang: "text",
        code: "rizz explain <target>\nrizz explain flow <id>\nrizz review\nrizz review --json",
      },
    ],
  },
  {
    slug: "core-concepts",
    title: "Core concepts",
    description: "Project architecture, evidence, relationships, and review impact.",
    order: 3,
    blocks: [
      { type: "h", level: 2, text: "Architecture and data causality" },
      {
        type: "p",
        text: "Rizz connects entrypoints and routes through services, state/data operations, dependencies, and database surfaces, with evidence attached to the resulting project graph.",
      },
      {
        type: "ul",
        items: [
          "**Named database support** [now] — SQLAlchemy, Alembic, raw SQL, and Mongoose schema relationships.",
          "**Cross-table impact** [now] — foreign keys and relationship edges feed affected-flow and blast-radius analysis.",
          "**Relationship-aware review** [now] — review connects changed files to affected flows, data dependencies, and targeted verification.",
          "**Evidence governance** [now] — deterministic verification plans, evidence scoring, approval packets, CLI signoff, and fingerprint-bound signoff-history reuse.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        text: "Coverage is specific, not universal: current database relationship claims apply to SQLAlchemy, Alembic, raw SQL, and Mongoose. Rizz does not claim support for every ORM.",
      },
      { type: "h", level: 2, text: "Current surface now, Workspace later" },
      {
        type: "p",
        text: "The Project Knowledge Store ships under `.rizz/brain`. Workspace Mode, team features, hosted relay, and enterprise provider setup remain later tracks.",
      },
    ],
  },
  {
    slug: "model-providers",
    title: "Model providers",
    description: "Current provider routes and credential boundaries.",
    order: 4,
    blocks: [
      { type: "p", text: "Current routes:" },
      {
        type: "ul",
        items: [
          "**OpenRouter BYOK** [now] — `rizz setup` collects a masked key and stores it under the `openrouter` provider account.",
          "**Codex route** [now] — uses the local signed-in Codex CLI/app when available; Codex owns its own auth.",
          "**Enterprise providers** [planned] — governed setup belongs to the later Valoir offering.",
          "**Custom routes** [planned] — custom QA/eval and provider pipelines come later.",
        ],
      },
      {
        type: "p",
        text: "OpenAI and Anthropic direct setup entries exist, but are not full first-run credential flows yet.",
      },
      {
        type: "callout",
        tone: "note",
        text: "Never paste provider keys into chat, screenshots, shell history, GitHub, or logs.",
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
          ["`/login`", "Provider auth path", "[planned]"],
          ["`/status`", "Readiness, route, and cost signals", "[now]"],
          ["`/model`, `⌃L`", "Model route/profile picker", "[now]"],
          ["`/theme`", "List / set themes", "[now]"],
          ["`/workspace`", "Enter multi-agent Workspace mode", "[planned]"],
          ["`/plan`", "Plan-mode: draft a step list before editing", "[planned]"],
          ["`/session`, `/resume`", "List / switch / resume sessions (tree-structured)", "[planned]"],
          ["`/cost`", "Usage + budget signals", "[now]"],
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
    description: "Workspace Mode is planned opt-in power.",
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
        text: "`/workspace` is visible today as an honest stub. Later tracks include Workspace Mode, team features, hosted relay, and enterprise providers.",
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
          "**Auth-expired** [planned] — inline re-login, turn preserved.",
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
        tone: "preview",
        text: "TUI + print-mode are seeded now; RPC and SDK are planned.",
      },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    description:
      "Rizz dogfoods the discipline it ships: strict TypeScript, a footprint budget, and a local review-loop before merge.",
    order: 10,
    blocks: [
      {
        type: "p",
        text: "Rizz dogfoods the discipline it ships. Dev loop per change: **plan → git worktree per task → build → `pnpm check` → code-simplifier pass → PR via `gh` → local review-loop → merge to `develop`**.",
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
    description: "Current status, release path, and later tracks.",
    order: 11,
    blocks: [
      {
        type: "callout",
        tone: "note",
        text: "The lanes below separate what exists now from release work and later opt-in power.",
      },
      {
        type: "ul",
        items: [
          "**Now** — Rizz 0.3.0, architecture/data causality, relationship-aware review, evidence scoring, verification plans, approval packets, and CLI signoff.",
          "**Next** — native installers, complete direct-provider setup wiring, and fuller planning mode.",
          "**Later** — Workspace Mode, team features, hosted relay, and enterprise providers.",
          "**Valoir offering** — hosted relay, approval inbox, team audit logs, enterprise provider setup, workflow packs, custom QA/eval pipelines.",
        ],
      },
      {
        type: "p",
        text: "Repo: [github.com/Lokesh-4946/rizz](https://github.com/Lokesh-4946/rizz). Package: `npm install -g @valoir/rizz`.",
      },
    ],
  },
];
