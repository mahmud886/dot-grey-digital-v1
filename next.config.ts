import type { NextConfig } from "next";

/**
 * Two builds from one codebase:
 * - `npm run build` — Node hosting (Vercel). Forms post to the Resend route handler.
 * - `npm run build:static` — STATIC_EXPORT=1, plain files for cPanel/shared hosting in `out/`.
 *   Forms post to the PHP endpoint instead (php/forms.php, copied to out/api/).
 *
 * Files that need a running server are named `*.server.ts(x)` and only count as routes in
 * the Node build: the form route handler and the catch-all that renders the site 404 for
 * unknown URLs (the static build gets 404.html, served by .htaccess, instead).
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: isStatic ? ["tsx", "ts"] : ["tsx", "ts", "server.tsx", "server.ts"],
  // No trailing slashes: pages export as about.html and .htaccess serves /about, so URLs and canonicals match the Node build.
  ...(isStatic && { output: "export" as const }),
  images: {
    // Static hosting has no image optimiser; the Node build keeps it.
    unoptimized: isStatic,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Kept so real photography can be dropped in without a config change.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
