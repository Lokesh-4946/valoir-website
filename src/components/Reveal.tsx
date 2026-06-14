"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
 */
export function MaskReveal({
  lines,
  className = "",
  lineClassName = "",
  start = "top 80%",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const targets = root.querySelectorAll<HTMLElement>("[data-line-inner]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root, start },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [start]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="clip-line">
          <span
            data-line-inner
            className={`block translate-y-[110%] ${lineClassName}`}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}
