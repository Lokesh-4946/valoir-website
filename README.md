# Valoir — marketing site

A motion-led, single-page (with anchor sub-routes) marketing site for **Valoir**, a
developer-tools company — *built by a developer, for developers* — shipping AI harnesses and
dev tooling in open-source and premium tiers. Flagship product: **Rizz**.

Editorial, spacious, taste-forward. Dark by default, warm light variant ready. Every animation
earns its place; everything degrades gracefully under `prefers-reduced-motion`.

## Stack

- **Next.js (App Router) + TypeScript** — Vercel-ready
- **Tailwind CSS** with CSS-variable design tokens (`src/app/globals.css`)
- **GSAP + ScrollTrigger** (motion engine) + **Lenis** (smooth scroll)
- **Three.js** via **@react-three/fiber** + **@react-three/drei** (hero object)
- **Framer Motion** — component enter/exit + hover only
- Fonts via **next/font** (Space Grotesk display + JetBrains Mono), no layout shift

## Run

```bash
npm install      # (or pnpm install / yarn)
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

> Note: the first `npm install` / `next build` needs network access to the npm registry and to
> Google Fonts (next/font fetches the font files at build time). Run it on your machine — it was
> not run in the build sandbox, which has the package registry blocked.

## Project shape

```
src/
  app/
    layout.tsx        root layout, fonts, metadata, skip-link
    page.tsx          assembles every section
    globals.css       design tokens (dark + light), utilities, reduced-motion safety
  components/
    Nav, Hero, HeroScene (three.js), Manifesto, ProductShowcase, TerminalMock,
    OpenSource, ForDevelopers, Roadmap, FooterCTA,
    SmoothScroll (Lenis), ScrollProgress, Cursor, MagneticButton, Reveal, CopyButton
  content/
    products.ts       the data-driven product catalog  ← edit this to add a product
    content.ts        site copy + open-source repo list
  lib/
    fonts.ts          next/font setup
    useReducedMotion.ts
```

## Adding the next product (one object edit)

Open `src/content/products.ts` and add an object to the `products` array. The showcase renders
each product automatically — name, tagline, capabilities, license badge, and the right action
row (OSS gets a copyable install command + repo + stars + docs; `premium` gets an access CTA).

```ts
{
  slug: "next-tool",
  name: "Next Tool",
  by: "by Valoir",
  tagline: "One line of positioning.",
  description: "A sharp paragraph.",
  license: "open-source",          // "open-source" | "open-core" | "premium"
  licenseLabel: "MIT",
  capabilities: [
    { title: "Capability", detail: "What it does and why it matters." },
  ],
  repoUrl: "https://github.com/Lokesh-4946/next-tool",
  repoPrivate: false,
  installCommand: "brew install next-tool",
  usageSnippet: "next-tool --help",
  docsUrl: "https://docs.valoir.dev/next-tool",
  stars: 0,
  language: "TypeScript",
  demoVideoUrl: null,
  tryItUrl: null,
  flagship: false,
  status: "v0.1",
}
```

To list it under **Open Source** too, add one line to the `repos` array in `src/content/content.ts`.

## Turning on a demo video or a "Try it yourself" embed later

Both are future-ready slots on each product. They default to `null` and render a tasteful
*"Demo coming soon"* empty state.

- **Demo video:** set `demoVideoUrl` to a video URL → a `<video controls>` player renders.
- **Live demo:** set `tryItUrl` to an embeddable URL → an `<iframe>` "Try it yourself" renders.

No component changes needed — the `MediaSlot` in `ProductShowcase.tsx` picks the right surface.

## Design tokens & theming

All colors are CSS variables in `src/app/globals.css`. Dark is default; a warm light variant is
defined under `[data-theme="light"]` (set `data-theme="light"` on `<html>` to switch). Structure
never depends on color — the palette is swappable.

Palette (from the Rizz UI/UX spec): Valoir gold `#E3B341` on deep warm ink, bone text, teal for
tool/system accents, rose for alerts.

## Accessibility & performance

- Honors `prefers-reduced-motion`: smooth scroll, pinning, parallax, custom cursor, and reveal
  animations all disable; content is forced visible (no hidden states).
- Semantic HTML, visible focus rings, skip-link, alt/aria where needed, responsive to 360px.
- 3D scene is lazy-loaded, paused off-screen (IntersectionObserver), DPR-capped (`[1, 1.6]`),
  and low-poly.

## `[NEEDS INPUT]` — facts not present in the source files

- **Public install command** for Rizz (Homebrew tap / npm / PyPI is an open decision in the briefs).
- **Public docs URL** and **GitHub star count** (repo is private during the build).
- **Production domain** and non-GitHub **social links**.

Each is flagged in `products.ts` / `content.ts` and surfaces clearly (in rose) in the UI so it's
easy to find and fill in.
