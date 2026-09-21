import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keystatic's GitHub mode redirects localhost to 127.0.0.1 (GitHub needs a loopback IP for
  // the OAuth callback). Newer Next 16 releases block dev resources from origins they do not
  // recognise, and when that refuses the HMR connection the client never hydrates: /keystatic
  // is a blank page and every client component goes dead, with nothing in the console. The
  // version pinned here does not block yet; this keeps an upgrade from bringing that in.
  // Dev only — production builds ignore it.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // Placeholder art is first-party generated SVG (scripts/generate-placeholders.mjs).
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
