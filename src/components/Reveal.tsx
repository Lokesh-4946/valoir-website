"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function rootMarginFromStart(start: string): string {
  const match = /^top\s+(\d+(?:\.\d+)?)%$/.exec(start.trim());
  if (!match) return "0px 0px -20% 0px";

  const viewportPercent = Number.parseFloat(match[1] ?? "80");
  const bottomMargin = Math.min(100, Math.max(0, 100 - viewportPercent));
  return `0px 0px -${bottomMargin}% 0px`;
}

/**
 * Generic on-scroll reveal. Under reduced-motion the element is simply shown
 * (no transform), so content is never hidden from anyone.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    });
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <Tag ref={ref as never} data-reveal className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/**
 * Mask-reveal headline. Pass an array of lines; each rises out of an
 * overflow-hidden mask, staggered, on scroll into view.
 *
 * Polymorphic via `as` so section titles render as real headings (e.g. `h2`)
 * for a correct document outline — the visual effect is identical.
 */
export function MaskReveal({
  lines,
  as: Tag = "div",
  className = "",
  lineClassName = "",
  start = "top 80%",
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-line-inner]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    let tween: gsap.core.Tween | undefined;
    let observer: IntersectionObserver | undefined;
    const ctx = gsap.context(() => {
      gsap.set(targets, { yPercent: 110 });
    }, root);

    const play = () => {
      if (tween) return;
      tween = gsap.to(targets, {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.09,
      });
      observer?.disconnect();
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
      },
      { rootMargin: rootMarginFromStart(start), threshold: 0 },
    );
    observer.observe(root);

    return () => {
      observer?.disconnect();
      tween?.kill();
      ctx.revert();
    };
  }, [start]);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="clip-line">
          <span data-line-inner className={`block ${lineClassName}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
