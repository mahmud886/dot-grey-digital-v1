import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, posts, works } from "@/redesign/content";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import { V9_MAP } from "@/redesign/v9/nav";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Sitemap" };

/** Second-level pages listed under the section they belong to. */
const SUB: Record<string, { href: string; label: string }[]> = {
  "/v9/services": disciplines.map((d) => ({ href: `/v9/services/${d.id}`, label: d.short })),
  "/v9/work": works.map((w) => ({ href: `/v9/work/${w.slug}`, label: w.title })),
  "/v9/insights": posts.map((p) => ({ href: `/v9/insights/${p.slug}`, label: p.title })),
};

export default function V9Sitemap() {
  const total = V9_MAP.reduce((n, c) => n + c.links.length, 0) + Object.values(SUB).reduce((n, l) => n + l.length, 0);
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${total}) pages`}
        title={
          <>
            The <G name="asterisk" /> index
          </>
        }
        lede="Every page on this site, in one place."
      />
      <section className={s.sectionTight}>
        <div className={`${s.wrap} ${m.mapCols}`}>
          {V9_MAP.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <h2>{col.label}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      {l.label} <G name="arrow" />
                    </Link>
                    {SUB[l.href] && (
                      <ul className={m.mapSub}>
                        {SUB[l.href].map((x) => (
                          <li key={x.href}>
                            <Link href={x.href}>{x.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
    </main>
  );
}
