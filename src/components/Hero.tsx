"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { hero } from "@/content/content";
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

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-h-line]");
    const rest = el.querySelectorAll<HTMLElement>("[data-h-fade]");

    if (reduced) {
      gsap.set(lines, { yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.15)
        .fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.6);
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
        <p data-h-fade className="eyebrow mb-6 opacity-0">
          00 — {hero.eyebrow}
        </p>

        <h1 className="display max-w-4xl text-[clamp(2.6rem,8vw,6.4rem)] font-semibold text-fg">
          {hero.headline.map((line, i) => (
            <span key={i} className="clip-line">
              <span data-h-line className="block translate-y-[115%]">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-h-fade
          className="mt-8 max-w-xl font-mono text-base leading-relaxed text-muted opacity-0 sm:text-lg"
        >
          {hero.sub}
        </p>

        <div data-h-fade className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
          <MagneticButton href={hero.primary.href} variant="accent">
            {hero.primary.label}
          </MagneticButton>
          <MagneticButton href={hero.secondary.href} variant="line" external>
            {hero.secondary.label} <ArrowOut />
          </MagneticButton>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-h-fade
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-eyebrow text-faint opacity-0"
      >
        scroll
      </div>
    </section>
  );
}
