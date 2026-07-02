"use client";

import { useState } from "react";
import { products, type Product } from "@/content/products";
import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";
import TerminalMock from "./TerminalMock";
import CopyButton from "./CopyButton";
import MagneticButton from "./MagneticButton";
import RizzDemoLoop from "./RizzDemoLoop";

type InstallOption = Product["installOptions"][number];
type InstallNote = Product["installNotes"][number];

/** Future-ready media slot: renders a player / live embed when a URL is set. */
function MediaSlot({ product }: { product: Product }) {
  if (product.demoVideoUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-line">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={product.demoVideoUrl}
          controls
          playsInline
          className="aspect-video w-full bg-black"
        />
      </div>
    );
  }
  if (product.tryItUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-line">
        <iframe
          src={product.tryItUrl}
          title={`Try ${product.name}`}
          className="aspect-video w-full bg-black"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <RizzDemoLoop />
  );
}

function ActionRow({ product }: { product: Product }) {
  const isPremium = product.license === "premium";

  if (isPremium) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <MagneticButton href={product.docsUrl ?? "#products"} variant="accent">
          Request access
        </MagneticButton>
        <span className="font-mono text-xs text-muted">Premium · pricing on request</span>
      </div>
    );
  }

  if (product.installOptions.length === 0) return null;

  return <InstallPanel product={product} />;
}

function InstallPanel({ product }: { product: Product }) {
  const firstOption = product.installOptions[0];
  const [selectedPlatform, setSelectedPlatform] = useState(firstOption.platform);
  const selectedOption =
    product.installOptions.find((option) => option.platform === selectedPlatform) ?? firstOption;

  return (
    <div className="rounded-xl border border-line bg-[var(--bg-2)] p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          {product.installTitle && (
            <p className="font-mono text-sm font-semibold text-fg">{product.installTitle}</p>
          )}
          {product.installIntro && (
            <p className="mt-1 max-w-md font-mono text-sm leading-relaxed text-muted">
              {product.installIntro}
            </p>
          )}
        </div>
        {product.installRequirement && (
          <p className="font-mono text-xs leading-relaxed text-accent sm:text-right">
            {product.installRequirement}
          </p>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Install platform"
        className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-line bg-[var(--bg)]"
      >
        {product.installOptions.map((option) => (
          <PlatformTab
            key={option.platform}
            option={option}
            selected={option.platform === selectedOption.platform}
            onSelect={() => setSelectedPlatform(option.platform)}
          />
        ))}
      </div>

      <InstallCommand option={selectedOption} />

      {product.installNotes.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {product.installNotes.map((note) => (
            <InstallNoteItem key={note.label} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlatformTab({
  option,
  selected,
  onSelect,
}: {
  option: InstallOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const selectedClass = selected
    ? "bg-[var(--bg-3)] text-accent"
    : "text-muted hover:text-fg";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`min-w-0 border-r border-line px-3 py-2.5 text-left font-mono text-[11px] font-semibold transition-colors last:border-r-0 sm:text-xs ${selectedClass}`}
    >
      <span className="block truncate">{option.tabLabel ?? option.platform}</span>
    </button>
  );
}

function InstallCommand({ option }: { option: InstallOption }) {
  return (
    <div className="mt-3 rounded-lg border border-line bg-[var(--bg)] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold text-fg">
          {option.platform}
        </p>
        <CopyButton text={option.command} label="copy" />
      </div>
      <pre className="overflow-x-auto whitespace-pre rounded-md bg-[var(--bg-3)] p-3 font-mono text-[12px] leading-relaxed text-bone">
        <code>{option.command}</code>
      </pre>
    </div>
  );
}

function InstallNoteItem({ note }: { note: InstallNote }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
        {note.label}
      </p>
      <p className="mt-1 font-mono text-xs leading-relaxed text-muted">{note.value}</p>
    </div>
  );
}

function ProductPanel({ product, index }: { product: Product; index: number }) {
  return (
    <div className="grid gap-12 border-t border-line py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* sticky visual column */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
        <div className="min-w-0 space-y-6">
          <TerminalMock />
          <MediaSlot product={product} />
        </div>
      </div>

      {/* details column */}
      <div className="min-w-0">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-sm text-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          {product.flagship && (
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
              Flagship
            </span>
          )}
        </div>

        <h3 className="display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold text-fg">
          {product.name}
        </h3>
        <p className="mt-3 font-mono text-lg text-accent">{product.tagline}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-eyebrow text-faint">
          {product.status}
        </p>
        {product.badges.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-line bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[11px] text-bone"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <p className="mt-6 max-w-xl font-mono text-base leading-relaxed text-muted">
          {product.description}
        </p>

        <ul className="mt-10 space-y-6">
          {product.capabilities.map((cap) => (
            <li key={cap.title} className="border-l border-line pl-5">
              <p className="font-mono text-sm font-semibold text-fg">{cap.title}</p>
              <p className="mt-1 max-w-md font-mono text-sm leading-relaxed text-muted">
                {cap.detail}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <ActionRow product={product} />
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  return (
    <section id="products" className="shell scroll-mt-20 py-28 sm:py-36">
      <Reveal className="mb-6">
        <p className="eyebrow">{sections.products.label}</p>
      </Reveal>
      <MaskReveal
        as="h2"
        lines={[sections.products.title]}
        className="display text-[clamp(2.4rem,7vw,5rem)] font-semibold text-fg"
      />
      <Reveal delay={0.05} className="mt-6 max-w-2xl">
        <p className="font-mono text-base leading-relaxed text-muted">
          {sections.products.body}
        </p>
      </Reveal>

      <div className="mt-10">
        {products.map((p, i) => (
          <ProductPanel key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
