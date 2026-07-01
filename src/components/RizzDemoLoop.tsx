"use client";

const steps = [
  { label: "map", text: "extract components, flows, tests, and commands" },
  { label: "explain", text: "summarize the files that matter first" },
  { label: "review", text: "connect the diff to blast radius and risks" },
  { label: "report", text: "write Mission Control and research artifacts" },
];

export default function RizzDemoLoop() {
  return (
    <div
      role="img"
      aria-label="Animated four-second Rizz demo loop showing project understanding, explanation, review, and a local report."
      className="rizz-demo-loop relative aspect-video overflow-hidden rounded-xl border border-line bg-[var(--bg-2)]"
    >
      <div className="rizz-demo-field absolute inset-0" />
      <div className="rizz-demo-scan absolute inset-x-0 top-0 h-20" />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="border-b border-line pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              project intelligence
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-bone">rizz mission control</p>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 pt-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-0 flex-col">
            <div className="space-y-2 font-mono text-[11px] leading-relaxed sm:text-xs">
              <p className="rizz-demo-row rizz-demo-row-1 text-bone">
                <span className="text-accent">you</span> what should I understand before changing
                the auth flow?
              </p>
              <p className="rizz-demo-row rizz-demo-row-2 text-muted">
                <span className="text-teal">rizz</span> I will map the repo, explain the affected
                files, and surface evidence before edits.
              </p>
              <div className="rizz-demo-row rizz-demo-row-3 space-y-1 text-muted">
                {steps.map((step) => (
                  <div key={step.label} className="grid grid-cols-[3.5rem_1fr] gap-2">
                    <span className="text-teal">→ {step.label}</span>
                    <span className="text-bone">{step.text}</span>
                  </div>
                ))}
              </div>
              <p className="rizz-demo-row rizz-demo-row-4 text-bone">
                <span className="text-teal">rizz</span> report ready. Open
                .rizz/reports/index.html for the local project brain.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-0 rounded-lg border border-line bg-[var(--bg)] p-3 md:block">
            <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              <span>project trace</span>
              <span>evidence visible</span>
            </div>
            <div className="rizz-demo-node rizz-demo-node-1 left-[18%] top-[42%]" />
            <div className="rizz-demo-node rizz-demo-node-2 left-[45%] top-[24%]" />
            <div className="rizz-demo-node rizz-demo-node-3 left-[70%] top-[55%]" />
            <div className="absolute left-[20%] top-[46%] h-px w-[52%] rotate-[-13deg] bg-line" />
            <div className="absolute left-[46%] top-[30%] h-px w-[32%] rotate-[33deg] bg-line" />
            <div className="absolute bottom-3 left-3 right-3 rounded-md border border-line bg-[var(--bg-2)] px-3 py-2 font-mono text-[10px] text-muted">
              brain ready · blast radius mapped · research written
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
