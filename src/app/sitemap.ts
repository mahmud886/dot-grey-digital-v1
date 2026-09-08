import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { works } from "@/data/works";
import { team } from "@/data/team";
import { jobs } from "@/data/jobs";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/services", priority: 0.9 },
    { path: "/works", priority: 0.9 },
    { path: "/team", priority: 0.7 },
    { path: "/pricing", priority: 0.8 },
    { path: "/faq", priority: 0.6 },
    { path: "/careers", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  const dynamicPaths = [
    ...services.map((s) => `/services/${s.slug}`),
    ...works.map((w) => `/works/${w.slug}`),
    ...team.map((m) => `/team/${m.slug}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      priority,
    })),
    ...dynamicPaths.map((path) => ({ url: `${site.url}${path}`, lastModified: now, priority: 0.6 })),
  ];
}
