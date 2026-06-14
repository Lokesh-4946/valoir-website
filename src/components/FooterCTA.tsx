"use client";

import { footer, site } from "@/content/content";
import { MaskReveal } from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function FooterCTA() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="shell py-28 sm:py-40">
        <MaskReveal
          lines={footer.bigLine.split("\n")}
          className="display text-[clamp(2.6rem,9vw,7rem)] font-semibold text-fg"
        />

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <MagneticButton href={footer.cta.href} variant="accent">
            {footer.cta.label}
          </MagneticButton>
          <MagneticButton href={site.github} variant="line" external>
            GitHub ↗
          </MagneticButton>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base font-semibold tracking-tightest text-fg">
            {site.wordmark}
          </span>
          <div className="flex flex-wrap gap-6">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-mono text-sm text-muted hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
          <span className="font-mono text-xs text-faint">{footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}
