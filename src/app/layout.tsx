import type { Metadata, Viewport } from "next";
import { display, mono } from "@/lib/fonts";
import { site } from "@/content/content";
import { siteGraph } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const pageTitle = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: site.description,
  metadataBase: new URL(site.url),
  applicationName: site.name,
  keywords: [
    "Valoir",
    "Rizz",
    "coding agent harness",
    "lightweight coding agent",
    "CLI coding agent loop",
    "provider-agnostic AI agent",
    "open-source coding agent",
    "developer tools",
    "open-core",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: pageTitle,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[var(--accent-ink)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
