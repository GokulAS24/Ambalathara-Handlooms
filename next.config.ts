import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // Vercel's smaller build containers were dying (no catchable error, just
  // a silent stop) during the prerender phase — this is Next's documented
  // mitigation for prerender-phase OOM crashes on next build.
  enablePrerenderSourceMaps: false,
};

export default nextConfig;
