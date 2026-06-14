"use client";

import { repos, sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";

function langDot(lang: string) {
  const map: Record<string, string> = {
    TypeScript: "#5FB3A1",
    JavaScript: "#E3B341",
    Rust: "#D98A7A",
    Python: "#5FB3A1",
  };
  return map[lang] ?? "var(--muted)";
}

export default function OpenSource() {
  return (
    <section id="open-source" className="scroll-mt-20 border-t border-line py-28 sm:py-36">
      <div className="shell">
        <Reveal className="mb-6">
          <p className="eyebrow">{sections.openSource.label}</p>
        </Reveal>
        <MaskReveal
          as="h2"
          lines={[sections.openSource.title]}
          className="display max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)] font-semibold text-fg"
        />
        <Reveal delay={0.05} className="mt-6 max-w-xl">
          <p className="font-mono text-base leading-relaxed text-muted">
            {sections.openSource.body}
          </p>
        </Reveal>

        <div className="mt-14 border-t border-line">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="grow"
              className="group grid grid-cols-1 gap-3 border-b border-line py-7 transition-colors hover:bg-[var(--bg-2)] sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-8 sm:px-2"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-lg text-fg transition-colors group-hover:text-accent">
                  {repo.name}
                </span>
              </div>
              <div>
                <p className="font-mono text-sm leading-relaxed text-muted">
                  {repo.description}
                </p>
                {repo.note && (
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                    {repo.note}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-6 font-mono text-sm text-muted">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: langDot(repo.language) }}
                  />
                  {repo.language}
                </span>
                <span>{repo.stars != null ? `★ ${repo.stars}` : "★ —"}</span>
                <span className="text-faint transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
