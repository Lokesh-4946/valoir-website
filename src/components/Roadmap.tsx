"use client";

import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

export default function Roadmap() {
  const { roadmap } = sections;
  return (
    <section id="roadmap" className="scroll-mt-20 border-t border-line py-28 sm:py-36">
      <div className="shell">
        <Reveal className="mb-6">
          <p className="eyebrow">{roadmap.label}</p>
        </Reveal>
        <MaskReveal
          as="h2"
          lines={[roadmap.title]}
          className="display max-w-3xl text-[clamp(2rem,5.5vw,4rem)] font-semibold text-fg"
        />
        <Reveal delay={0.05} className="mt-6 max-w-xl">
          <p className="font-mono text-base leading-relaxed text-muted">{roadmap.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.items.map((item) => (
            <Reveal key={item.tag} className="bg-[var(--bg)] p-6">
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                  {item.tag}
                </p>
                <p className="font-mono text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
