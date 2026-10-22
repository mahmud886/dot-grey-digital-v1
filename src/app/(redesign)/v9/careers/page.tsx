import type { Metadata } from "next";
import Link from "next/link";
import { benefits, jobs } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Careers" };

export default function V9Careers() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(jobs.length).padStart(2, "0")}) open roles`}
        title={
          <>
            Do the best work <G name="arrow" /> of your life
          </>
        }
        lede="Small team, senior people, real responsibility. You will talk to clients, ship every week and know why your work matters."
      />

      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <SectionHead n="01" title="Open roles" aside="Dhaka or remote" />
        </div>
        <ol className={s.rows}>
          {jobs.map((j, i) => (
            <li key={j.slug}>
              <Link href={`/v9/careers/${j.slug}`} className={s.row}>
                <span className={s.rowMeta}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{j.department}</span>
                </span>
                <span className={`${s.rowTitle} ${s.rowTitleSm}`}>{j.title}</span>
                <span className={`${s.rowMeta} ${s.rowMetaEnd}`}>
                  <span>{j.location}</span>
                  <span>{j.type}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="What you get" aside={`(${String(benefits.length).padStart(2, "0")})`} dark />
          <ol className={s.steps}>
            {benefits.map((b, i) => (
              <li key={b.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>{b.title}</h3>
                <p className={s.stepBody}>{b.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
