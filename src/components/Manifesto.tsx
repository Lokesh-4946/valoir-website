"use client";

import { manifesto } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

export default function Manifesto() {
  return (
    <section id="manifesto" className="shell border-t border-line py-28 sm:py-40">
      <p className="eyebrow mb-12">{manifesto.label}</p>

      <MaskReveal
        lines={manifesto.lines}
        className="display max-w-5xl text-[clamp(1.8rem,4.4vw,3.4rem)] font-medium leading-[1.08] text-fg"
        lineClassName="py-1"
      />

      <Reveal delay={0.1} className="mt-14 max-w-2xl">
        <p className="font-mono text-base leading-relaxed text-muted">
          {manifesto.body}
        </p>
      </Reveal>
    </section>
  );
}
