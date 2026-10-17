import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // The v1–v7 case-study art is first-party SVG placeholders in public/img/works.
    // SVG optimisation is off by default because remote SVGs can carry script; ours are
    // served sandboxed with scripting disabled.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Kept from v1 so real photography can still be dropped in without a config change.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
