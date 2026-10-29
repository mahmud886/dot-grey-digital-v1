import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { disciplines, posts, works } from "@/site/content";
import { SITE_MAP } from "@/site/nav";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Sitemap", description: "Every page on the DotGrey Digital site.", path: "/site-map" });

export default function SitemapPage() {
  const deep = [
    { label: "Case studies", links: works.map((w) => ({ href: `/work/${w.slug}`, label: w.title })) },
    { label: "Services", links: disciplines.map((d) => ({ href: `/services/${d.id}`, label: d.title })) },
    { label: "Essays", links: posts.map((p) => ({ href: `/insights/${p.slug}`, label: p.title })) },
  ];
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Index."
        label="Sitemap"
        title={
          <>
            Every <Em>page.</Em>
          </>
        }
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <div className={s.mapGrid}>
          {[...SITE_MAP, ...deep].map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className={s.label}>{col.label}</p>
              <ul className={s.plainList}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
    </main>
      <Footer signoff="Lost?" />
    </>
  );
}
