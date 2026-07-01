/** Release banner shown on every docs page. */
export default function DocsBanner() {
  return (
    <div className="mb-8 rounded-xl border border-l-2 border-accent bg-[var(--bg-2)] px-5 py-4">
      <p className="font-mono text-sm leading-relaxed text-muted">
        <span className="font-semibold text-fg">
          Rizz 0.2.0 is the public npm release of the local Project Intelligence Engine.
        </span>{" "}
        Current and planned surfaces are labeled on each page.{" "}
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
