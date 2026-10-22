import type { Metadata } from "next";
import Link from "next/link";
import { benefits, jobs } from "@/redesign/content";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Careers" };

export default function V10Careers() {
  return (
    <Page>
      <PageHero
        kicker={`Open processes · ${String(jobs.length).padStart(2, "0")} roles`}
        title="Careers"
        form="development"
        lede="Small team, senior people, real responsibility. You talk to clients, ship every week and know why your work matters."
      />
      <section className={s.block} aria-labelledby="roles-h">
        <SecHead id="roles-h" title="Roles" />
        <ol className={s.rows}>
          {jobs.map((j, i) => (
            <li key={j.slug}>
              <Link href={`/v10/careers/${j.slug}`} className={`${s.row} ${s.jobRow}`}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.rowTitle}>{j.title}</span>
                <span className={s.rowMeta}>
                  {j.department} · {j.location} · {j.type}
                </span>
                <span className={s.rowStat} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.block} aria-labelledby="ben-h">
        <SecHead id="ben-h" title="Perks" note="What you get, written plainly." />
        <ol className={s.ruleGrid}>
          {benefits.map((b, i) => (
            <li key={b.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}
