import type { Metadata } from "next";
import Link from "next/link";
import { disciplines } from "@/redesign/content";
import { V10_MAP } from "@/redesign/v10/agency-extra";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Sitemap" };

export default function V10Sitemap() {
  const count = V10_MAP.reduce((n, g) => n + g.links.length, 0) + disciplines.length;
  return (
    <Page>
      <PageHero kicker={`Map · ${count} routes`} title="Map" form="dust" lede="Every page in this version, in one place." />
      <section className={s.block} aria-label="All pages">
        <div className={s.xMap}>
          {V10_MAP.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <p className={s.label}>{g.label}</p>
              <ul className={s.list}>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={s.inlineLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {g.label === "Services" &&
                  disciplines.map((d) => (
                    <li key={d.id}>
                      <Link href={`/v10/services/${d.id}`} className={s.inlineLink}>
                        <span className={s.rowNum}>{d.number}</span> {d.short}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
    </Page>
  );
}
