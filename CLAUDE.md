# CLAUDE.md — Valoir website house style

> This repo is the **Valoir company website** (Next.js App Router + TS). It is the public face of
> a developer-tools company — *built by a developer, for developers*. Flagship product: **Rizz**.
> The site must read as award-winning, motion-led, and taste-forward — **clean first, charismatic
> second. Every animation earns its place.**

## The product brain (read before non-trivial work)

The strategy, copy source-of-truth, brand tokens, and open questions live in a separate knowledge
vault — **not in this repo**. Load these first:

```
/Users/lokesh/Documents/Personal/My Labs/Valoir/valoir-website/
  README.md                      index — start here
  knowledge/rizz-facts.md        SOURCE OF TRUTH for all site copy
  knowledge/open-questions.md     the [NEEDS INPUT] list — never invent these
  strategy/positioning.md         voice + anti-overclaim guardrail
  strategy/site-architecture.md   sections, motion plan, a11y/perf floor
  notes/brand-tokens.md           locked palette / type / motion
  context/claude-code-context.md  how Claude Code works in this repo
  handoffs/                       dated tasks to pick up (work the latest open one)
  runbooks/                       repo setup · dev loop · shiploop · deploy
```

**Rule:** every fact on the site traces to `knowledge/rizz-facts.md`. If it isn't there or in the
Rizz repo, it is `[NEEDS INPUT]` — flag it (rose in UI), do not invent it.

## Mandatory quality loop (every change after bootstrap)

Three skills are bundled in `.claude/skills/` and are **required**, not optional:

1. **code-structure** — apply the service-layer split. Orchestration (the "why/when": data
   selection, page composition, business rules) lives in `app/` route code and section components;
   reusable mechanics (the "how": clipboard, scroll/animation setup, data shaping) live in
   `src/lib/` services with explicit params and structured returns. Extract to a service **only**
   when logic repeats across 2+ callers — no premature abstraction.
2. **code-simplifier** — run after every logical chunk of code. Clarity over brevity. No nested
   ternaries (use `if`/`switch`). Preserve functionality exactly. Don't delete helpful
   abstractions.
3. **shiploop** — every PR receives exact-head-SHA independent review, deterministic CI and
   preview validation, zero unresolved blocking findings, and a valid merge-readiness certificate.
   Repairs are bounded to five iterations; an unclean fifth iteration is `BLOCKED`, never approved.
   See `runbooks/shiploop.md` in the brain.

**Dev loop for every task:** plan → branch (`feature/*`) → build → **code-structure** check →
**code-simplifier** pass → `npm run build` green → open PR via `gh` → **Shiploop APPROVE for the
exact PR head SHA** → verify a current merge-readiness certificate → authorized merge to `main`.
Any new commit invalidates prior review and certification. Write a dated handoff note back to the
brain at the end of each task.

## Stack & conventions

- **Next.js (App Router) + TypeScript strict.** Vercel-ready. No `any` without a `// reason:`.
- **Tailwind** with CSS-variable design tokens in `src/app/globals.css`. Colors are tokens; never
  hardcode hex in components. Avoid Tailwind opacity modifiers on CSS-variable colors — use the
  `glass`/`glass-strong` utilities or solid tokens.
- **GSAP + ScrollTrigger** + **Lenis** (motion engine); **Three.js** via r3f/drei (hero only);
  **Framer Motion** for component enter/exit + hover only. Fonts via **next/font**.
- **Accessibility & performance are acceptance criteria, not polish:** honor
  `prefers-reduced-motion` (disable pin/parallax/cursor/reveals; never leave content hidden),
  semantic HTML, visible focus, alt/aria, responsive to 360px. Targets: Lighthouse **perf ≥ 90,
  a11y ≥ 95**.
- 3D: lazy-load, pause off-screen, DPR-cap `[1,1.6]`, low-poly.

## Data-driven content

- Products render from `src/content/products.ts`. **Adding a product = one object edit.**
- `demoVideoUrl` / `tryItUrl` are future slots: set a URL to auto-render a player / live embed;
  null shows a tasteful "Demo coming soon" state. Don't hardcode media into components.
- The open-source list reads from `repos` in `src/content/content.ts` — one line per repo.

## Git & PRs

- **Conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`).
- Branches: `feature/*`, `fix/*` off `main`. `main` protected + always deployable.
- One logical change per PR. PR description states what changed and why; Shiploop runs before merge.
- Implementation agents cannot approve their own work. Reviewer reports are evidence, not merge
  authority; an independent adjudicator owns the final review artifact.
- Merge readiness does not authorize merge or deployment. Dev verification and production approval
  remain separate post-merge gates.
