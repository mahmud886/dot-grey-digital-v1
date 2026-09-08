import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /docs is the internal build reference, not marketing content.
    rules: { userAgent: "*", allow: "/", disallow: "/docs" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
