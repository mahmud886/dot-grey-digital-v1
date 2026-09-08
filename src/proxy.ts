import { NextResponse } from "next/server";

/**
 * Safety guard for the CMS. (Next 16 renamed the `middleware` convention to `proxy`.)
 *
 * keystatic.config.ts falls back to `local` storage when no GitHub repo is configured,
 * which is right for development but would expose an unauthenticated editor if it ever
 * shipped to production. So in production the CMS routes 404 until
 * NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO is set, at which point GitHub handles authentication
 * and only people with write access to the repo can save.
 */
export function proxy() {
  const repoConfigured = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);

  if (process.env.NODE_ENV === "production" && !repoConfigured) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
