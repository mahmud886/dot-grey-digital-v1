import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // /docs is the internal build reference, not marketing content.
    rules: { userAgent: "*", allow: "/", disallow: "/docs" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
