/** Honesty banner shown on every docs page — Rizz is in private alpha. */
export default function DocsBanner() {
  return (
    <div className="mb-8 rounded-xl border border-l-2 border-accent bg-[var(--bg-2)] px-5 py-4">
      <p className="font-mono text-sm leading-relaxed text-muted">
        <span className="font-semibold text-fg">Rizz is Private Alpha · Agent Light.</span>{" "}
        OpenRouter BYOK and the Codex route are current; Workspace Mode, Repo Brain, OS/Jarvis
        connectors, and enterprise providers are later tracks.{" "}
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
