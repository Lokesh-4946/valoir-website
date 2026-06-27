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

      <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        <div className="grid min-w-[640px] grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line md:min-w-0">
          {section.lanes.map((lane) => (
            <Reveal key={lane.label} className="bg-[var(--bg)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                {lane.label}
              </p>
              <p className="mt-3 font-mono text-base font-semibold text-fg">{lane.title}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {lane.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-snug text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
