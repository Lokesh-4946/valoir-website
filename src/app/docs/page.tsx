import type { Metadata } from "next";
import Link from "next/link";
import { docHref, getAllDocs } from "@/lib/docs";
import { docsBreadcrumb } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Rizz documentation",
  description:
    "Documentation for Rizz Agent Light: private-alpha setup, OpenRouter BYOK, Codex route, commands, and roadmap.",
  alternates: { canonical: "/docs" },
};

export default function DocsIndex() {
  const docs = getAllDocs();

  return (
    <div>
      <JsonLd data={docsBreadcrumb()} />
      <p className="eyebrow mb-4">Documentation</p>
      <h1 className="display text-[clamp(2rem,5vw,3.4rem)] font-semibold text-fg">Rizz docs</h1>
      <p className="mt-5 max-w-xl font-mono text-base leading-relaxed text-muted">
        Rizz Agent Light is the private-alpha local CLI/TUI for OpenRouter BYOK, Codex routing,
        visible approvals, and visible costs. Start with the Quickstart, or jump to a section.
      </p>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {docs.map((doc) => (
          <li key={doc.slug} className="bg-[var(--bg)]">
            <Link href={docHref(doc.slug)} className="group block h-full p-6 transition-colors hover:bg-[var(--bg-2)]">
              <p className="font-mono text-sm font-semibold text-fg transition-colors group-hover:text-accent">
                {doc.title}
              </p>
              <p className="mt-2 font-mono text-sm leading-relaxed text-muted">{doc.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
