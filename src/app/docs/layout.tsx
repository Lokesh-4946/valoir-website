import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsBanner from "@/components/docs/DocsBanner";
import { getDocsNav } from "@/lib/docs";

export const metadata: Metadata = {
  title: {
    template: "%s — Rizz docs — Valoir",
    default: "Rizz documentation — Valoir",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getDocsNav();

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="shell scroll-mt-20 pb-28 pt-28 outline-none sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside>
            <DocsSidebar items={nav} />
          </aside>
          <article className="min-w-0 max-w-3xl">
            <DocsBanner />
            {children}
          </article>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-10 font-mono text-sm text-muted">
          <Link href="/" className="link-underline text-fg">
            ← Valoir
          </Link>
          <a
            href="https://github.com/Lokesh-4946/rizz"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Rizz on GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
