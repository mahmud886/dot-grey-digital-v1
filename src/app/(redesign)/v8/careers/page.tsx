import type { Metadata } from "next";
import Link from "next/link";
import { benefits, jobs } from "@/redesign/content";
import { Footer, PageCover, SecHead, Stop } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Careers" };

export default function V8Careers() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`Careers · ${jobs.length} open roles`}
          title="Want in?"
          lead="Small team, senior people, real responsibility. You will talk to clients, ship every week and know why your work matters."
        />

        <section className={s.indexSec} aria-labelledby="roles-title">
          <SecHead id="roles-title" title="Open roles." />
          <ul className={s.roleList}>
            {jobs.map((j) => (
              <li key={j.slug}>
                <Link href={`/v8/careers/${j.slug}`} className={s.roleRow}>
                  <span className={s.roleTitle}>{j.title}</span>
                  <span className={s.roleMeta}>
                    {j.department} · {j.location} · {j.type}
                  </span>
                  <span className={s.svcArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${s.chapterDark} ${s.numbers}`} aria-labelledby="perks-title">
          <SecHead id="perks-title" title="What you get." note="The basics, done properly." />
          <ol className={s.perkGrid}>
            {benefits.map((b, i) => (
              <li key={b.title}>
                <span className={s.perkNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.valueTitle}>
                  <Stop>{`${b.title}.`}</Stop>
                </h3>
                <p>{b.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="none-title">
          <SecHead id="none-title" title="Not listed?" note="We hire for people as much as for roles. If you are good at something on this site, tell us." />
          <a href="mailto:hello@dotgreydigital.com?subject=Speculative%20application" className={s.pillAccent}>
            Write to us →
          </a>
        </section>
      </main>
      <Footer signoff="Join us." />
    </>
  );
}
