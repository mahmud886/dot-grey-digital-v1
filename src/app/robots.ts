import type { MetadataRoute } from "next";

// Design prototypes for review: keep the whole project out of search engines.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
