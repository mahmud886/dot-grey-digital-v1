import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { benefits, jobs } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Careers", description: "Open roles at DotGrey Digital, a senior team in Dhaka working with clients worldwide.", path: "/careers" });

export default function CareersPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Want in?"
        label={`Careers — ${jobs.length} open roles`}
        title={
          <>
            Do the best work <Em>of your life.</Em>
          </>
        }
        lead="Small team, senior people, real responsibility. You will talk to clients, ship every week and know why your work matters."
      />
      <section className={`${s.wrap} ${s.sectionTight}`} aria-labelledby="roles">
        <h2 id="roles" className={s.label}>
          Open roles
        </h2>
        <ul className={s.craftList}>
          {jobs.map((j) => (
            <li key={j.slug}>
              <Link href={`/careers/${j.slug}`} className={s.jobRow}>
                <span className={s.craftTitle}>{j.title}</span>
                <span className={s.craftLine}>{j.summary}</span>
                <span className={s.jobMeta}>
                  {j.department} · {j.location} · {j.type}
                </span>
                <span className={s.serviceArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={s.dark} aria-labelledby="perks">
        <div className={s.wrap}>
          <div className={s.secHead}>
            <p className={s.label}>Working here</p>
            <h2 id="perks" className={s.h2}>
              What you <Em>get.</Em>
            </h2>
          </div>
          <ol className={s.approachDark}>
            {benefits.map((b, i) => (
              <li key={b.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className={`${s.wrap} ${s.contact}`}>
        <h2 className={s.ctaSmall}>
          Nothing that fits? <Em>Write anyway.</Em>
        </h2>
        <div className={s.ctas}>
          <a href="mailto:hello@dotgreydigital.com?subject=Open%20application" className={s.pillInk}>
            Send an open application <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
      <Footer signoff="Join us." />
    </>
  );
}
