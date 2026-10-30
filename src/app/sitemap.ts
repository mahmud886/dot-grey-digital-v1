import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { disciplines, jobs, posts, team, works } from "@/site/content";
import { SITE_MAP } from "@/site/nav";

// Rendered once at build time, so the static (cPanel) export can write it as a file.
export const dynamic = "force-static";

/** Every page: the static ones from the site map, then each case study, service, essay, role and person. */
export default function sitemap(): MetadataRoute.Sitemap {
  const statics = [...new Set(SITE_MAP.flatMap((col) => col.links.map((l) => l.href as string)))];
  const dynamic = [
    ...works.map((w) => `/work/${w.slug}`),
    ...disciplines.map((d) => `/services/${d.id}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
    ...team.map((m) => `/team/${m.slug}`),
  ];
  const essays = posts.map((p) => ({ url: `${siteUrl}/insights/${p.slug}`, lastModified: p.date }));

  return [
    ...statics.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}`, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...dynamic.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...essays,
  ];
}
