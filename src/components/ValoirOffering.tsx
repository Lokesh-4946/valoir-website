"use client";

import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

export default function ValoirOffering() {
  const section = sections.offering;

  return (
    <section id="offering" className="shell scroll-mt-20 border-t border-line py-28 sm:py-36">
      <Reveal className="mb-6">
        <p className="eyebrow">{section.label}</p>
      </Reveal>
      <MaskReveal
        as="h2"
        lines={[section.title]}
        className="display max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)] font-semibold text-fg"
      />
      <Reveal delay={0.05} className="mt-6 max-w-2xl">
        <p className="font-mono text-base leading-relaxed text-muted">{section.body}</p>
      </Reveal>

      <div className="mt-14 flex flex-wrap gap-3">
        {section.items.map((item) => (
          <Reveal key={item}>
            <span className="inline-flex rounded-full border border-line bg-[var(--bg-2)] px-4 py-2 font-mono text-sm text-bone">
              {item}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
