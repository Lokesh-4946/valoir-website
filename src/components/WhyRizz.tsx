"use client";

import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

export default function WhyRizz() {
  const section = sections.whyRizz;

  return (
    <section id="why-rizz" className="shell scroll-mt-20 border-t border-line py-28 sm:py-36">
      <Reveal className="mb-6">
        <p className="eyebrow">{section.label}</p>
      </Reveal>
      <MaskReveal
        as="h2"
        lines={[section.title]}
        className="display max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)] font-semibold text-fg"
      />
      <Reveal delay={0.05} className="mt-6 max-w-xl">
        <p className="font-mono text-base leading-relaxed text-muted">{section.body}</p>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {section.items.map((item) => (
          <Reveal key={item.title} className="bg-[var(--bg)] p-6">
            <p className="font-mono text-sm font-semibold text-fg">{item.title}</p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
