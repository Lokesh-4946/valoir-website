"use client";

import { products, type Product } from "@/content/products";
import { sections } from "@/content/content";
import { MaskReveal, Reveal } from "./Reveal";
import TerminalMock from "./TerminalMock";
import CopyButton from "./CopyButton";
import MagneticButton from "./MagneticButton";
import RizzDemoLoop from "./RizzDemoLoop";

type InstallOption = Product["installOptions"][number];

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

      <div className="mt-5 grid gap-3 2xl:grid-cols-3">
        {product.installOptions.map((option) => (
          <InstallCard key={option.platform} option={option} />
        ))}
      </div>
    </div>
  );
}

function InstallCard({ option }: { option: InstallOption }) {
  return (
    <div className="rounded-lg border border-line bg-[var(--bg)] p-3">
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

function ProductPanel({ product, index }: { product: Product; index: number }) {
  return (
    <div className="grid gap-12 border-t border-line py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* sticky visual column */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="space-y-6">
          <TerminalMock />
          <MediaSlot product={product} />
        </div>
      </div>

      {/* details column */}
      <div>
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

      <div className="mt-10">
        {products.map((p, i) => (
          <ProductPanel key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
