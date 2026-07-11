"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/content/content";

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const element = document.createElement("div");
    element.dataset.mobileMenuPortal = "";
    document.body.appendChild(element);
    setPortalElement(element);

    return () => element.remove();
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");

    function closeMenuOnDesktop(event: MediaQueryListEvent) {
      if (!event.matches) return;

      returnFocusRef.current = false;
      setOpen(false);
    }

    desktopQuery.addEventListener("change", closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!open || !portalElement) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const outsideElements = Array.from(document.body.children)
      .filter((element): element is HTMLElement => {
        return element instanceof HTMLElement && element !== portalElement;
      })
      .map((element) => ({
        element,
        inert: element.inert,
        inertAttribute: element.getAttribute("inert"),
      }));
    document.body.style.overflow = "hidden";
    outsideElements.forEach(({ element }) => {
      element.inert = true;
    });
    closeButtonRef.current?.focus();

    function handleMenuKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        returnFocusRef.current = true;
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) return;

      const leavingStart = event.shiftKey && document.activeElement === firstElement;
      const leavingEnd = !event.shiftKey && document.activeElement === lastElement;
      if (!leavingStart && !leavingEnd) return;

      event.preventDefault();
      if (event.shiftKey) {
        lastElement.focus();
        return;
      }
      firstElement.focus();
    }

    window.addEventListener("keydown", handleMenuKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      outsideElements.forEach(({ element, inert, inertAttribute }) => {
        element.inert = inert;
        if (inertAttribute === null) {
          element.removeAttribute("inert");
        } else {
          element.setAttribute("inert", inertAttribute);
        }
      });
      window.removeEventListener("keydown", handleMenuKeyDown);
      if (returnFocusRef.current) {
        returnFocusRef.current = false;
        menuButton?.focus();
      }
    };
  }, [open, portalElement]);

  function closeMenuAndRestoreFocus() {
    returnFocusRef.current = true;
    setOpen(false);
  }

  const mobileMenu = portalElement && open
    ? createPortal(
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[70] bg-bg xl:hidden"
        >
          <div className="shell flex min-h-full flex-col gap-1 py-4">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={closeMenuAndRestoreFocus}
              className="ml-auto flex min-h-11 min-w-11 items-center justify-center font-mono text-sm text-fg"
            >
              Close
            </button>
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center font-mono text-base text-fg"
              >
                {link.label}
              </a>
            ))}
            <a
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-accent px-4 py-3 text-center font-mono text-sm font-semibold text-[var(--accent-ink)]"
            >
              {nav.cta.label}
            </a>
          </div>
        </div>,
        portalElement,
      )
    : null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line glass backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between">
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tightest text-fg"
        >
          {site.wordmark}
        </a>

        <div className="hidden items-center gap-6 xl:flex">
          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline font-mono text-sm text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-fg"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={nav.cta.href}
            data-cursor="grow"
            className="rounded-full bg-accent px-4 py-2 font-mono text-sm font-semibold text-[var(--accent-ink)] transition-[filter] hover:brightness-105"
          >
            {nav.cta.label}
          </a>
        </div>

        <button
          ref={menuButtonRef}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center xl:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-6 bg-fg transition-transform ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-fg transition-transform ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {mobileMenu}
    </header>
  );
}
