import type { Metadata } from "next";
import Link from "next/link";
import { disciplines, posts, works } from "@/redesign/content";
import { V12_MAP } from "@/redesign/v12/agency-extra";
import { Em, PageHead } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

export const metadata: Metadata = { title: "Sitemap" };

export default function V12Sitemap() {
  const deep = [
    { label: "Case studies", links: works.map((w) => ({ href: `/v12/work/${w.slug}`, label: w.title })) },
    { label: "Services", links: disciplines.map((d) => ({ href: `/v12/services/${d.id}`, label: d.title })) },
    { label: "Essays", links: posts.map((p) => ({ href: `/v12/insights/${p.slug}`, label: p.title })) },
  ];
  return (
    <main>
      <PageHead
        label="Sitemap"
        title={
          <>
            Every <Em>page.</Em>
          </>
        }
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <div className={s.mapGrid}>
          {[...V12_MAP, ...deep].map((col) => (
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
  );
}
