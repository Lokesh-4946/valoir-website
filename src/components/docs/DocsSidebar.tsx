"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = { slug: string; title: string; href: string };

function linkClass(active: boolean): string {
  const base = "block rounded-md px-3 py-1.5 font-mono text-sm transition-colors";
  return active ? `${base} bg-[var(--bg-2)] text-accent` : `${base} text-muted hover:text-fg`;
}

/**
 * Docs navigation: sticky list on desktop, collapsible on mobile.
 * Receives the nav from the server (built via the docs service) so it stays
 * content-driven. The "Overview" (/docs index) entry is prepended so every
 * link renders through the same path.
 */
export default function DocsSidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: NavItem[] = [{ slug: "__overview", title: "Overview", href: "/docs" }, ...items];

  return (
    <nav aria-label="Docs" className="lg:sticky lg:top-24">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-lg border border-line px-4 py-2.5 font-mono text-sm text-fg lg:hidden"
      >
        Documentation
        <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <ul className={`${open ? "block" : "hidden"} space-y-1 lg:block`}>
        {links.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className={linkClass(pathname === item.href)}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
