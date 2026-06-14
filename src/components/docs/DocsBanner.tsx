/** Honesty banner shown on every docs page — Rizz is an early build. */
export default function DocsBanner() {
  return (
    <div className="mb-8 rounded-xl border border-l-2 border-accent bg-[var(--bg-2)] px-5 py-4">
      <p className="font-mono text-sm leading-relaxed text-muted">
        <span className="font-semibold text-fg">Rizz is an early build (M2 walking skeleton).</span>{" "}
        Some features below are marked{" "}
        <span className="text-accent">m3</span> / <span className="text-rose">planned</span> and
        aren&apos;t shipped yet.{" "}
        <a
          href="https://github.com/Lokesh-4946/rizz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-line underline-offset-2 hover:decoration-accent"
        >
          See the repo →
        </a>
      </p>
    </div>
  );
}
