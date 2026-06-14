/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // No ESLint config is shipped; don't let an optional lint step block builds.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
