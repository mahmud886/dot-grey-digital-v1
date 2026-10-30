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
  poweredByHeader: false,
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
  // Headers only exist on the Node build; the static build sets the same ones in .htaccess
  // (scripts/build-static.mjs). Hashed /_next/static files are already cached immutably by Next.
  ...(!isStatic && {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          ],
        },
        {
          // Unhashed files from /public: a month, then revalidate in the background.
          // Add new folders of static assets here.
          source: "/logo.:ext(svg|png)",
          headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
        },
      ];
    },
  }),
};

export default nextConfig;
