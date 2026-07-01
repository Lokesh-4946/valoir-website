import type { DocPage } from "./types";

/**
 * The Rizz documentation, authored from `knowledge/docs-content.md`.
 * Honesty rule: shipped and planned surfaces stay labeled; never present
 * planned features as shipped.
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
        text: "**Rizz is a local Project Intelligence Engine.** It scans a repository, builds a structured Project Knowledge Store under `.rizz/brain`, emits research artifacts under `.rizz/research`, and renders Mission Control as a local HTML portal.",
      },
      { type: "h", level: 2, text: "Principles" },
      {
        type: "ul",
        items: [
          "**Understand before changing** — build project context before editing.",
          "**Evidence-backed claims** — tie findings to files, commands, tests, and reconstructed flows.",
          "**Local-first Project Knowledge Store** — keep the project brain under `.rizz/brain` by default.",
          "**Research artifacts for evaluation** — write coverage, confidence, evidence quality, benchmark readiness, and PIE acceptance data under `.rizz/research`.",
          "**Opt-in model/chat power** — model routes and chat stay explicit, not hidden in the default scan.",
        ],
      },
      {
        type: "p",
        text: "Rizz is the local Project Intelligence Engine for understanding repositories before changing them. Valoir's later hosted and enterprise layer stays separate from the default install.",
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    description: "Install Rizz with npm and generate your first Project Intelligence Layer.",
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
        code: "npm install -g @valoir/rizz\ncd path/to/your/repo\nrizz\nopen .rizz/reports/index.html",
      },
      { type: "p", text: "Requirement for all: Node >= 22 and npm." },
      { type: "h", level: 2, text: "Explain, review, ask" },
      {
        type: "code",
        lang: "bash",
        code: "rizz explain README.md\nrizz review --json\nrizz ask \"what should I read first?\"",
      },
      {
        type: "p",
        text: "`rizz ask` and chat-style model power are gated. Run `rizz setup` when you intentionally want to configure a provider route.",
      },
      { type: "h", level: 2, text: "Optional TUI commands" },
      {
        type: "code",
        lang: "text",
        code: "/status           # readiness and route state\n/model            # switch route/profile\n/workspace        # future Workspace Mode\n/help",
      },
    ],
  },
  {
    slug: "core-concepts",
    title: "Core concepts",
    description: "The shipped Project Intelligence concepts behind Rizz.",
    order: 3,
    blocks: [
      { type: "h", level: 2, text: "Project Intelligence Layer" },
      {
        type: "p",
        text: "A local layer of project understanding: components, flows, commands, tests, dependencies, risks, and evidence extracted from the repository before edits begin.",
      },
      { type: "h", level: 2, text: "Project Knowledge Store" },
      {
        type: "p",
        text: "The structured brain Rizz writes under `.rizz/brain`, including the latest project graph and supporting data.",
      },
      { type: "h", level: 2, text: "Mission Control" },
      {
        type: "p",
        text: "The local HTML portal at `.rizz/reports/index.html` for reading the project map, evidence, risks, commands, tests, and review context.",
      },
      { type: "h", level: 2, text: "Explain" },
      {
        type: "p",
        text: "`rizz explain <target>` explains files, components, and flows before you change them.",
      },
      { type: "h", level: 2, text: "Review" },
      {
        type: "p",
        text: "`rizz review` connects the current git diff to affected components, flows, tests, configs, and risks. `rizz review --json` returns automation-friendly output.",
      },
      { type: "h", level: 2, text: "Research artifacts" },
      {
        type: "p",
        text: "Rizz writes coverage, confidence, evidence quality, architecture reasoning, benchmark readiness, and PIE acceptance data under `.rizz/research`.",
      },
      { type: "h", level: 2, text: "Gated Ask" },
      {
        type: "p",
        text: "`rizz ask <question>` lets you query the local Project Intelligence Layer with explicit, opt-in model power.",
      },
      { type: "h", level: 2, text: "Current concepts" },
      {
        type: "ul",
        items: [
          "**Project Intelligence Layer** [now] — the local understanding layer Rizz builds from a repo.",
          "**Project Knowledge Store** [now] — `.rizz/brain` stores the structured local brain.",
          "**Mission Control** [now] — `.rizz/reports/index.html` renders the local portal.",
          "**Explain** [now] — file, component, and flow explanations.",
          "**Review** [now] — diff review with blast radius.",
          "**Research artifacts** [now] — evaluation and evidence files under `.rizz/research`.",
          "**Gated Ask** [now] — explicit question-answering over the local project layer.",
        ],
      },
    ],
  },
  {
    slug: "model-providers",
    title: "Model providers",
    description: "Opt-in provider routes and credential boundaries.",
    order: 4,
    blocks: [
      { type: "p", text: "Model routes are opt-in power for Ask and chat surfaces:" },
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
    description: "Shipped Rizz commands, optional TUI commands, and keyboard shortcuts.",
    order: 5,
    blocks: [
      { type: "h", level: 2, text: "CLI commands" },
      {
        type: "table",
        head: ["Command", "Does", "Status"],
        rows: [
          ["`rizz` / `rizz understand`", "Generate project intelligence", "[now]"],
          ["`rizz brain`", "Refresh the Project Knowledge Store", "[now]"],
          ["`rizz explain <target>`", "Explain a file or component", "[now]"],
          ["`rizz explain flow <id>`", "Explain a reconstructed flow", "[now]"],
          ["`rizz review`", "Review the current git diff with blast radius", "[now]"],
          ["`rizz review --json`", "Return automation-friendly review output", "[now]"],
          ["`rizz ask <question>`", "Ask a gated Project Intelligence question", "[now]"],
          ["`rizz setup`", "Configure an opt-in model route", "[now]"],
          ["`rizz chat`", "Open the opt-in model TUI", "[now]"],
        ],
      },
      { type: "h", level: 2, text: "TUI commands" },
      {
        type: "table",
        head: ["Command", "Does", "Status"],
        rows: [
          ["`/status`", "Readiness and route state", "[now]"],
          ["`/model`, `Ctrl+L`", "Model route/profile picker", "[now]"],
          ["`/workspace`", "Enter multi-agent Workspace Mode", "[planned]"],
          ["`/help`, `/exit`", "Keys + commands; quit", "[now]"],
        ],
      },
      { type: "h", level: 2, text: "Keys" },
      {
        type: "p",
        text: "`Enter` send · `Shift+Enter` newline · `esc` interrupt · `Ctrl+L` model picker.",
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
        text: "Workspace Mode is planned — it is not in the current build.",
      },
      {
        type: "p",
        text: "Later tracks include Workspace Mode, team collaboration, hosted relay, enterprise provider setup, and native installers.",
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
      "Interface states in Rizz, including empty, loading, offline, rate-limited, auth-expired, and review states.",
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
          "**Loading** [now] — visible scan and report progress.",
          "**Offline** [planned] — banner offering a local model path.",
          "**Rate-limited** [planned] — fallback shown for opt-in model surfaces.",
          "**Auth-expired** [planned] — inline re-login for configured providers.",
          "**Review state** [now] — diff context, blast radius, risks, and JSON output.",
        ],
      },
    ],
  },
  {
    slug: "run-modes",
    title: "Run modes",
    description: "One Rizz binary, with current CLI/report modes and planned integration modes.",
    order: 9,
    blocks: [
      {
        type: "p",
        text: "Current surfaces focus on the local CLI, Mission Control report, Explain, Review, and gated Ask. Interactive chat, RPC, and SDK paths remain opt-in or planned integration surfaces.",
      },
      {
        type: "callout",
        tone: "note",
        text: "CLI understanding, local reports, Explain, Review, and gated Ask are current. RPC and SDK remain planned.",
      },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    description:
      "Rizz dogfoods strict TypeScript, evidence-backed review, and local validation before merge.",
    order: 10,
    blocks: [
      {
        type: "p",
        text: "Rizz dogfoods the discipline it ships. Dev loop per change: **plan → git worktree per task → build → `pnpm check` → code-simplifier pass → PR via `gh` → local review-loop → merge to `develop`**.",
      },
      {
        type: "p",
        text: "TypeScript strict, ESM-only, Node >= 22; conventional commits; service-layer split (orchestration in `core`/`cli`, mechanics in `providers`). A new dependency in `core`/`providers` must be justified — the footprint budget is a gate.",
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
    description: "Current release, shipped surfaces, and later tracks.",
    order: 11,
    blocks: [
      {
        type: "callout",
        tone: "note",
        text: "The lanes below separate the current npm release from validation work and later team power.",
      },
      {
        type: "ul",
        items: [
          "**Current** — Rizz 0.2.0 public npm release.",
          "**Shipped** — Project Intelligence Engine, Project Knowledge Store under `.rizz/brain`, research artifacts, Mission Control, Explain, Review, gated Ask.",
          "**Next** — real-repo validation, PI-Bench expansion, reliability benchmark seeds, evidence quality calibration, release/docs polish.",
          "**Later** — Workspace Mode, hosted/team layer, enterprise setup, native installers.",
        ],
      },
      {
        type: "p",
        text: "Repo: [github.com/Lokesh-4946/rizz](https://github.com/Lokesh-4946/rizz). Package: `npm install -g @valoir/rizz`.",
      },
    ],
  },
];
