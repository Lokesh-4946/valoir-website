"use client";

/**
 * A faithful-feeling miniature of the rizz TUI (from rizz_experience.html).
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
          <span className="font-mono text-[11px] text-bone">profile: deep</span>
          <span className="font-mono text-[11px] text-faint">⌃L</span>
        </div>
      </div>

      {/* transcript */}
      <div className="space-y-1 p-5 font-mono text-[12.5px] leading-relaxed">
        <Line who="you" whoClass="text-accent">
          add a <span className="text-accent">/theme</span> command that hot-swaps at runtime
        </Line>
        <Line who="rizz" whoClass="text-teal">
          <span className="text-muted">thinking · planning the change</span>
        </Line>
        <Tool verb="read" path="src/commands/index.ts" meta="12 lines" />
        <Tool verb="edit" path="src/commands/theme.ts" meta="+28 −0" />
        <Tool verb="bash" path="npm test -- theme" meta="✓ 6 passed" ok />
        <Line who="rizz" whoClass="text-teal">
          Added <span className="text-accent">/theme</span>. Hot-swaps at runtime, no restart.
        </Line>
        <div className="flex items-center gap-2 pt-2">
          <span className="text-accent">›</span>
          <span className="text-bone">/model</span>
          <span className="inline-block h-3.5 w-2 animate-blink bg-accent align-middle" />
        </div>
      </div>

      {/* status bar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
        <span>
          <span className="text-accent">deep profile</span> · connected
        </span>
        <span className="text-faint">│</span>
        <span>ctx 12%</span>
        <span className="ml-auto">
          1,840 tok · <span className="text-accent">budget ok</span>
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
      <span className="flex-1 text-bone">{children}</span>
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
      <span className="w-12 text-bone">{verb}</span>
      <span className="text-bone">{path}</span>
      <span className={`ml-auto ${ok ? "text-teal" : "text-faint"}`}>{meta}</span>
    </div>
  );
}
