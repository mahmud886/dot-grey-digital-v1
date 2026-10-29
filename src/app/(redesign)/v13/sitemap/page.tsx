import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, posts, works } from "@/redesign/content";
import { V13_MAP } from "@/redesign/v13/nav";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "Sitemap" };

export default function V13Sitemap() {
  const deep = [
    { label: "Case studies", links: works.map((w) => ({ href: `/v13/work/${w.slug}`, label: w.title })) },
    { label: "Services", links: disciplines.map((d) => ({ href: `/v13/services/${d.id}`, label: d.title })) },
    { label: "Essays", links: posts.map((p) => ({ href: `/v13/insights/${p.slug}`, label: p.title })) },
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
          {[...V13_MAP, ...deep].map((col) => (
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
