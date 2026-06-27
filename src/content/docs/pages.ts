import type { DocPage } from "./types";

/**
 * The Rizz documentation, authored from `knowledge/docs-content.md`.
 * Honesty rule: Rizz is preview software — features carry [now] / [preview] / [planned]
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
        text: "**Rizz is a local coding-agent harness.** It wraps setup, model routing, tool calls, visible status, and an inspectable CLI/TUI loop.",
      },
      { type: "h", level: 2, text: "Three principles" },
      {
        type: "ul",
        items: [
          "**Small harness** — local CLI, small TUI, visible setup checks, and a footprint budget.",
          "**Visible routing** — the active route and cost signals stay inspectable.",
          "**Opt-in power** — larger workspace features stay out of the default path.",
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
    description: "Install Rizz with npm and launch the current preview.",
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
        code: "# macOS, Linux, or Windows PowerShell\nnpm install -g @valoir/rizz\nrizz setup\nrizz",
      },
      { type: "p", text: "Requirement for all: Node ≥ 22 and npm." },
      { type: "h", level: 2, text: "Setup" },
      {
        type: "p",
        text: "Run `rizz setup` once to choose a model route and handle credentials explicitly. `rizz` launches the TUI.",
      },
      {
        type: "p",
        text: "Provider details live in Model providers. Rizz setup keeps credential handling explicit.",
      },
      { type: "h", level: 2, text: "Inside the TUI", status: "now" },
      {
        type: "code",
        lang: "text",
        code: "/status           # readiness, route, and cost signals\n/model            # switch route/profile\n/workspace        # visible stub; future Workspace Mode\n/help",
      },
    ],
  },
  {
    slug: "core-concepts",
    title: "Core concepts",
    description: "The Rizz loop, visible controls, and planned workspace power.",
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
          "**Visible cost** [now] — the active route and cost/budget signals are visible in the TUI.",
          "**Compression** [planned] — auxiliary-model summarization that protects head & tail context; never silently drops critical info.",
          "**Fallback** [planned] — on rate-limit / outage, fall to the next model in the chain, shown to you, with a manual override.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        text: "**Reliability rule (binding):** every edit is verified after write — the apply path re-reads and confirms the change landed byte-for-byte before reporting success. A write that can't be verified is a failure, not a warning.",
      },
      { type: "h", level: 2, text: "Current surface now, Workspace later" },
      {
        type: "p",
        text: "`/workspace` is visible but not connected. Workspace Mode, Repo Brain, and OS/Jarvis connectors are later tracks.",
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
        text: "`/workspace` is visible today as an honest stub. Later tracks include Workspace Mode, Repo Brain, OS/Jarvis connectors, and enterprise providers.",
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
          "**Now** — Agent Light, local CLI, setup flow, route picker, visible status.",
          "**Next** — preview dogfood, release tag, native installers.",
          "**Later** — Workspace Mode, Repo Brain, OS/Jarvis connectors, enterprise providers.",
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
