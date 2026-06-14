"use client";

import { flagship } from "@/content/products";
import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";
import CopyButton from "./CopyButton";

/** Lightweight comment/command highlighting — no heavy syntax lib needed. */
function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-[var(--bg-2)] p-5 font-mono text-[13px] leading-relaxed">
      <code>
        {lines.map((line, i) => {
          const isComment = line.trimStart().startsWith("#");
          const isSlash = line.trimStart().startsWith("/");
          return (
            <span
              key={i}
              className={
                isComment
                  ? "block text-faint"
                  : isSlash
                    ? "block text-accent"
                    : "block text-bone"
              }
            >
              {line || " "}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

export default function ForDevelopers() {
  const snippet = flagship.usageSnippet ?? "";

  return (
    <section id="developers" className="scroll-mt-20 border-t border-line py-28 sm:py-36">
      <div className="shell">
        <Reveal className="mb-6">
          <p className="eyebrow">{sections.developers.label}</p>
        </Reveal>
        <MaskReveal
          lines={[sections.developers.title]}
          className="display max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)] font-semibold text-fg"
        />
        <Reveal delay={0.05} className="mt-6 max-w-xl">
          <p className="font-mono text-base leading-relaxed text-muted">
            {sections.developers.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-eyebrow text-faint">
                Install
              </p>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-[var(--bg-2)] px-4 py-3.5">
                <span className="select-none font-mono text-sm text-faint">$</span>
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-bone">
                  {flagship.installCommand}
                </code>
                {flagship.installCommand &&
                  !flagship.installCommand.includes("[NEEDS INPUT]") && (
                    <CopyButton text={flagship.installCommand} />
                  )}
              </div>
              <p className="mt-4 max-w-sm font-mono text-xs leading-relaxed text-muted">
                Public install channel (Homebrew · npm · PyPI) is being locked for v1. Until then, build from the monorepo on the right.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={flagship.repoUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-mono text-sm text-fg"
                >
                  {flagship.repoPrivate ? "Repo (private) ↗" : "GitHub ↗"}
                </a>
                <a
                  href={flagship.docsUrl ?? "#"}
                  className="link-underline font-mono text-sm text-muted"
                >
                  {flagship.docsUrl ? "Read the docs ↗" : "Docs (coming soon)"}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-eyebrow text-faint">
                  Quick start
                </p>
                {snippet && <CopyButton text={snippet} label="copy all" />}
              </div>
              <CodeBlock code={snippet} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
