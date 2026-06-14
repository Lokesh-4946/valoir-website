/** @type {import('next').NextConfig} */

// Conservative, framework-native security headers. Applied to every route by
// Vercel and `next start`. No CSP here — the marketing site is static and a
// strict CSP would need per-asset auditing; revisit if forms/analytics land.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // No ESLint config is shipped; don't let an optional lint step block builds.
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
