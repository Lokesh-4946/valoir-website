import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/content";
import { docHref, getAllDocs, getDoc } from "@/lib/docs";
import { docsBreadcrumb } from "@/lib/structuredData";
import DocContent from "@/components/docs/DocContent";
import JsonLd from "@/components/JsonLd";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: docHref(doc.slug) },
  };
}

function pagination(slug: string) {
  const docs = getAllDocs();
  const i = docs.findIndex((d) => d.slug === slug);
  return { prev: docs[i - 1], next: docs[i + 1] };
}

export default function DocPage({ params }: { params: Params }) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();

  const { prev, next } = pagination(doc.slug);

  return (
    <div>
      <JsonLd data={docsBreadcrumb({ name: doc.title, url: `${site.url}${docHref(doc.slug)}` })} />
      <h1 className="display text-[clamp(1.8rem,4.5vw,3rem)] font-semibold text-fg">{doc.title}</h1>
      <DocContent blocks={doc.blocks} />

      <nav className="mt-16 flex justify-between gap-6 border-t border-line pt-8 font-mono text-sm">
        {prev ? (
          <Link href={docHref(prev.slug)} className="link-underline text-muted hover:text-fg">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={docHref(next.slug)} className="link-underline text-right text-muted hover:text-fg">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
