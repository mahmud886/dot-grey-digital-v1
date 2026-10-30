import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";
import { getMemberBySlug, posts } from "@/site/content";

// Written once at build time, so the static (cPanel) export can ship it as feed.xml.
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of every essay, newest first. */
export function GET() {
  const items = posts
    .map((p) => {
      const url = `${siteUrl}/insights/${p.slug}`;
      const author = getMemberBySlug(p.author)?.name ?? site.name;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00+06:00`).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <dc:creator>${esc(author)}</dc:creator>
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)} — Notes</title>
    <link>${siteUrl}/insights</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc("Short essays from the studio on design, engineering, automation, data and AI.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${posts[0].date}T09:00:00+06:00`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
