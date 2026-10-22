import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/redesign/v11/Chrome";
import { SITE_MAP } from "@/redesign/v11/agency-extra";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Sitemap" };

export default function V11Sitemap() {
  const total = SITE_MAP.reduce((n, g) => n + g.links.length, 0);
  return (
    <main>
      <PageHead label="Sitemap" title="Index. ● Every page." count={total} />
      <section className={s.sectionTight}>
        <div className={s.siteMap}>
          {SITE_MAP.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className={s.label}>
                {g.title} <span className={s.count}>({String(g.links.length).padStart(2, "0")})</span>
              </p>
              <ul>
                {g.links.map((l) => (
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
