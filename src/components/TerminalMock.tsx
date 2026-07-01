"use client";

/**
 * A faithful-feeling miniature of Rizz's local Project Intelligence flow.
 * Static, decorative, and aria-hidden — the real story is in the copy.
 */
export default function TerminalMock() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-xl border border-line bg-[var(--bg-2)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-faint" />
          <span className="h-2.5 w-2.5 rounded-full bg-faint" />
          <span className="h-2.5 w-2.5 rounded-full bg-faint" />
        </div>
        <div className="ml-1 flex items-baseline gap-2">
          <b className="font-mono text-sm font-semibold text-accent">rizz</b>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
            by Valoir
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-md border border-line bg-[var(--bg-3)] px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_var(--teal)]" />
          <span className="font-mono text-[11px] text-bone">local PIE</span>
        </div>
      </div>

      {/* transcript */}
      <div className="space-y-1 p-5 font-mono text-[12.5px] leading-relaxed">
        <Line who="you" whoClass="text-accent">
          npm install -g @valoir/rizz
        </Line>
        <Line who="you" whoClass="text-accent">
          cd your-repo
        </Line>
        <Line who="you" whoClass="text-accent">
          rizz
        </Line>
        <Line who="rizz" whoClass="text-teal">
          <span className="text-muted">understood 136 file(s)</span>
        </Line>
        <Tool verb="brain" path=".rizz/brain/latest.json" meta="ready" ok />
        <Tool verb="research" path=".rizz/research" meta="evidence" ok />
        <Tool verb="report" path=".rizz/reports/index.html" meta="local" />
        <Tool verb="components" path="10" meta="mapped" />
        <Tool verb="flows" path="17" meta="rebuilt" />
        <Tool verb="commands" path="16" meta="found" />
        <Tool verb="tests" path="31" meta="linked" />
        <div className="flex items-center gap-2 pt-2">
          <span className="text-accent">›</span>
          <span className="min-w-0 truncate text-bone">rizz explain src/auth/session.ts</span>
          <span className="inline-block h-3.5 w-2 animate-blink bg-accent align-middle" />
        </div>
        <Tool verb="review" path="rizz review --json" meta="blast radius" />
        <Tool verb="ask" path="what should I read first?" meta="gated" />
      </div>

      {/* status bar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
        <span>
          <span className="text-accent">Rizz 0.2.0</span> · Project Intelligence
        </span>
        <span className="text-faint">│</span>
        <span>.rizz/brain</span>
        <span className="ml-auto">
          local report · <span className="text-accent">evidence backed</span>
        </span>
        <span className="text-faint">│</span>
        <span>⎇ main</span>
      </div>
    </div>
  );
}

function Line({
  who,
  whoClass,
  children,
}: {
  who: string;
  whoClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className={`w-10 shrink-0 text-right ${whoClass}`}>{who}</span>
      <span className="min-w-0 flex-1 break-words text-bone">{children}</span>
    </div>
  );
}

function Tool({
  verb,
  path,
  meta,
  ok = false,
}: {
  verb: string;
  path: string;
  meta: string;
  ok?: boolean;
}) {
  return (
    <div className="flex gap-3 text-muted">
      <span className="w-10 shrink-0 text-right text-teal">→</span>
      <span className="w-20 shrink-0 text-bone">{verb}</span>
      <span className="min-w-0 flex-1 truncate text-bone">{path}</span>
      <span className={`ml-auto shrink-0 ${ok ? "text-teal" : "text-faint"}`}>{meta}</span>
    </div>
  );
}
