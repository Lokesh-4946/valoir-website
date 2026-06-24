"use client";

import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

export default function Roadmap() {
  const section = sections.roadmap;

  return (
    <section id="roadmap" className="shell scroll-mt-20 border-t border-line py-28 sm:py-36">
      <Reveal className="mb-6">
        <p className="eyebrow">{section.label}</p>
      </Reveal>
      <MaskReveal
        as="h2"
        lines={[section.title]}
        className="display max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)] font-semibold text-fg"
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {section.lanes.map((lane) => (
          <Reveal key={lane.label} className="bg-[var(--bg)] p-6">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
              {lane.label}
            </p>
            <p className="mt-4 font-mono text-lg font-semibold text-fg">{lane.title}</p>
            <ul className="mt-6 space-y-3">
              {lane.items.map((item) => (
                <li key={item} className="border-l border-line pl-4 font-mono text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
