"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "accent" | "ghost" | "line";
  external?: boolean;
  className?: string;
};

/** A magnetic CTA — content drifts toward the cursor, snaps back on leave. */
export default function MagneticButton({
  href = "#",
  children,
  variant = "accent",
  external = false,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  const styles: Record<string, string> = {
    accent:
      "bg-accent text-[var(--accent-ink)] hover:brightness-105 font-semibold",
    ghost: "bg-bg-3 text-fg border border-line hover:border-muted",
    line: "text-fg border border-line hover:border-accent hover:text-accent",
  };

  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="grow"
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm transition-[transform,background,border-color,filter] duration-200 ease-out will-change-transform ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
