import type { Metadata } from "next";
import Link from "next/link";
import { benefits, jobs } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { Accordion } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Careers" };

export default function V11Careers() {
  const departments = [...new Set(jobs.map((j) => j.department))];
  return (
    <main>
      <PageHead label="Careers" title="Make good work. ● Get paid." count={jobs.length} lede="Small team, senior people, real responsibility. You will talk to clients, ship every week and know why your work matters." />

      <section className={s.sectionTight} aria-labelledby="roles">
        <SectionHead title="Open roles" count={jobs.length} id="roles" />
        <Accordion
          first
          items={departments.map((dep) => {
            const list = jobs.filter((j) => j.department === dep);
            return {
              id: dep.toLowerCase().replace(/\W+/g, "-"),
              title: dep,
              meta: `(${String(list.length).padStart(2, "0")})`,
              body: (
                <ol className={s.news}>
                  {list.map((j) => (
                    <li key={j.slug}>
                      <Link href={`/v11/careers/${j.slug}`} className={`${s.newsRow} ${s.newsRowBare}`}>
                        <span className={s.newsMeta}>
                          {j.location} ● {j.type}
                        </span>
                        <span className={s.newsTitle}>{j.title}</span>
                        <span className={s.newsExcerpt}>{j.summary}</span>
                        <span className={s.rowArrow} aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ),
            };
          })}
        />
      </section>

      <section className={s.dark} aria-labelledby="perks">
        <p className={s.label}>(02) What you get</p>
        <h2 id="perks" className={s.darkTitle}>
          The fine print, <span className={s.dot} aria-hidden="true">●</span> up front.
        </h2>
        <ol className={s.steps}>
          {benefits.map((b, i) => (
            <li key={b.title}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <SectionHead title="Not listed?">
          <Link href="/v11/contact" className={s.arrowLink}>
            Write to us <span aria-hidden="true">→</span>
          </Link>
        </SectionHead>
        <p className={s.lede}>If you are very good at one of our six crafts, we would rather hear from you now than when the role exists.</p>
      </section>
    </main>
  );
}
