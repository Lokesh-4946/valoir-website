"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { hero } from "@/content/content";
import CopyButton from "./CopyButton";
import MagneticButton from "./MagneticButton";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";

// 3D scene is client-only and lazy — never blocks first paint.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// Only mount the WebGL scene where it pays off: a wide enough viewport with a
// fine pointer and motion allowed. On phones/touch we render the static orb and
// never even download the Three.js chunk — a big mobile-performance win.
const SCENE_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

function ArrowOut() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 11 L11 5 M6 5 h5 v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const sceneAllowed = useMediaQuery(SCENE_QUERY);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-h-line]");
    const rest = el.querySelectorAll<HTMLElement>("[data-h-fade]");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(
        lines,
        { yPercent: 18, duration: 1.1, stagger: 0.1, immediateRender: false },
        0.15,
      ).from(
        rest,
        { opacity: 0.7, y: 8, duration: 0.8, stagger: 0.08, immediateRender: false },
        0.6,
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Decorative visual: WebGL scene on capable viewports, static orb otherwise. */}
      <div aria-hidden className="absolute inset-0 -z-0">
        {sceneAllowed && !reduced ? (
          <HeroScene />
        ) : (
          <div
            className="absolute right-[8%] top-1/2 h-[46vmin] w-[46vmin] -translate-y-1/2 rounded-full opacity-70 blur-[2px]"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #E3B341, #7a5a12 45%, transparent 72%)",
            }}
          />
        )}
        {/* readability scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg to-transparent" />
      </div>

      <div className="shell relative z-10 w-full">
        <h1 className="display max-w-4xl text-[clamp(2.6rem,8vw,6.4rem)] font-semibold text-fg">
          {hero.headline.map((line, i) => (
            <span key={i} className="clip-line">
              <span data-h-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-h-fade
          data-hero-subhead
          className="mt-6 max-w-2xl text-base leading-7 text-bone sm:text-lg sm:leading-8"
        >
          {hero.subhead}
        </p>

        <div data-h-fade className="mt-10">
          <div
            data-hero-actions
            className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <MagneticButton
              href={hero.primary.href}
              variant="accent"
              className="justify-center"
            >
              <span data-action-priority="primary">{hero.primary.label}</span>
            </MagneticButton>
            <MagneticButton
              href={hero.secondary.href}
              variant="line"
              className="justify-center"
            >
              <span data-action-priority="secondary">{hero.secondary.label}</span>
            </MagneticButton>
          </div>

          <div
            data-hero-supporting-actions
            className="mt-4 flex max-w-full flex-col items-stretch gap-3 font-mono text-sm leading-6 text-muted sm:flex-row sm:flex-wrap sm:items-center"
          >
            <div className="flex min-w-0 max-w-full items-center rounded-full border border-line bg-[var(--bg-2)] py-1 pl-4 pr-1">
              <code className="min-w-0 flex-1 truncate text-bone">
                {hero.supporting.installCommand}
              </code>
              <CopyButton
                text={hero.supporting.installCommand}
                label="copy"
                className="ml-2 rounded-full"
              />
            </div>
            <a
              href={hero.supporting.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 px-3 text-muted transition-colors hover:text-fg sm:justify-start"
            >
              {hero.supporting.github.label} <ArrowOut />
            </a>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-h-fade
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-eyebrow text-faint"
      >
        scroll
      </div>
    </section>
  );
}
