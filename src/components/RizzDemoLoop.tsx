"use client";

const steps = [
  { label: "plan", text: "map the smallest safe change" },
  { label: "edit", text: "apply patch with verification" },
  { label: "build", text: "run checks and collect result" },
  { label: "ready", text: "ship only after it lands clean" },
];

export default function RizzDemoLoop() {
  return (
    <div
      role="img"
      aria-label="Animated four-second Rizz demo loop showing a prompt, tool steps, build progress, and a verified result."
      className="rizz-demo-loop relative aspect-video overflow-hidden rounded-xl border border-line bg-[var(--bg-2)]"
    >
      <div className="rizz-demo-field absolute inset-0" />
      <div className="rizz-demo-scan absolute inset-x-0 top-0 h-20" />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              harness mode
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-bone">rizz operator</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-teal px-3 py-1 font-mono text-[10px] uppercase tracking-eyebrow text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_var(--teal)]" />
            live loop
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 pt-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-0 flex-col justify-between">
            <div className="space-y-2 font-mono text-[11px] leading-relaxed sm:text-xs">
              <p className="rizz-demo-row rizz-demo-row-1 text-bone">
                <span className="text-accent">you</span> make the product page cleaner
              </p>
              <p className="rizz-demo-row rizz-demo-row-2 text-muted">
                <span className="text-teal">rizz</span> I will remove noise, keep the core signal,
                and verify the result.
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
                <span className="text-teal">rizz</span> verified. The page is lighter, and the demo
                loop is live.
              </p>
            </div>

            <div className="mt-3">
              <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-3)]">
                <div className="rizz-demo-progress h-full origin-left rounded-full bg-accent" />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                <span>tools safe</span>
                <span>edits verified</span>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-0 rounded-lg border border-line bg-[var(--bg)] p-3 md:block">
            <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-eyebrow text-faint">
              <span>session graph</span>
              <span>4s loop</span>
            </div>
            <div className="rizz-demo-node rizz-demo-node-1 left-[18%] top-[42%]" />
            <div className="rizz-demo-node rizz-demo-node-2 left-[45%] top-[24%]" />
            <div className="rizz-demo-node rizz-demo-node-3 left-[70%] top-[55%]" />
            <div className="absolute left-[20%] top-[46%] h-px w-[52%] rotate-[-13deg] bg-line" />
            <div className="absolute left-[46%] top-[30%] h-px w-[32%] rotate-[33deg] bg-line" />
            <div className="absolute bottom-3 left-3 right-3 rounded-md border border-line bg-[var(--bg-2)] px-3 py-2 font-mono text-[10px] text-muted">
              verified patch · build green · ready for review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
