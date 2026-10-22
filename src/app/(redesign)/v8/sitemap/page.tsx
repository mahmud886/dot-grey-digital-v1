import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, jobs, posts, team, works } from "@/redesign/content";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import { V8_MAP } from "@/redesign/v8/nav";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Sitemap" };

const children: Record<string, { href: string; label: string }[]> = {
  "/v8/work": works.map((w) => ({ href: `/v8/work/${w.slug}`, label: w.title })),
  "/v8/services": disciplines.map((d) => ({ href: `/v8/services/${d.id}`, label: d.title })),
  "/v8/about": team.map((m) => ({ href: `/v8/team/${m.slug}`, label: m.name })),
  "/v8/insights": posts.map((p) => ({ href: `/v8/insights/${p.slug}`, label: p.title })),
  "/v8/careers": jobs.map((j) => ({ href: `/v8/careers/${j.slug}`, label: j.title })),
};

export default function V8Sitemap() {
  return (
    <>
      <main id="main">
        <PageCover kicker="Sitemap" title="Index." lead="Every page on this version of the site, in one place." />
        <nav className={s.mapGrid} aria-label="Sitemap">
          {V8_MAP.map((col) => (
            <div key={col.label}>
              <h2>
                {col.label}
                <span className={s.stop}>.</span>
              </h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                    {children[l.href] && (
                      <ul>
                        {children[l.href].map((c) => (
                          <li key={c.href}>
                            <Link href={c.href}>{c.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </main>
      <Footer signoff="That's all." />
    </>
  );
}
