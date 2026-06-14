import { ImageResponse } from "next/og";
import { site } from "@/content/content";

// Shared social-card renderer used by both the Open Graph and Twitter image
// routes. On-brand: Valoir gold on deep warm ink, mono voice, the gold orb motif.
export const ogAlt = `${site.name} — ${site.tagline}`;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#14130f";
const GOLD = "#e3b341";
const BONE = "#ede6d6";
const MUTED = "#8a8a85";

export function renderOgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: INK,
          backgroundImage:
            "radial-gradient(circle at 92% 8%, rgba(227,179,65,0.28), transparent 55%)",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: BONE }}>
            {site.wordmark}
          </span>
          <span style={{ fontSize: 18, letterSpacing: 6, color: MUTED }}>
            DEV TOOLS
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              color: BONE,
              maxWidth: 900,
            }}
          >
            Tools for people who build with agents.
          </div>
          <div style={{ fontSize: 28, color: GOLD }}>
            Rizz — the lightest, most connectable coding agent harness.
          </div>
        </div>

        <div style={{ fontSize: 22, color: MUTED }}>
          Open-source core. Premium where the work earns it.
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
