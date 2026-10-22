import type { Metadata } from "next";
import Link from "next/link";
import { offices, site, stats, team, values } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { LiveTime } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "About" };

const initials = (name: string) =>
  name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

export default function V11About() {
  return (
    <main>
      <PageHead label="About" title={`Since ${site.founded}. ● Still small on purpose.`} lede="A senior studio in Dhaka. The people you meet in the first workshop are the people who build the thing." />

      <section className={s.statement} aria-label="Manifesto">
        <p className={s.label}>(01) Manifesto</p>
        <p className={s.mission}>
          No account layers. <Dot /> No hand-over decks. <Dot /> Working software every week, decisions written down, and a number we
          agree to move.
        </p>
      </section>

      <section className={s.dark} aria-labelledby="numbers">
        <p className={s.label}>(02) In numbers</p>
        <h2 id="numbers" className={s.darkTitle}>
          Eighteen people. <Dot /> Four time zones.
        </h2>
        <dl className={s.stats}>
          {stats.map((st) => (
            <div key={st.label}>
              <dt>{st.label}</dt>
              <dd>
                {st.value}
                {st.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.section} aria-labelledby="values">
        <SectionHead title="How we behave" count={values.length} id="values" />
        <ol className={s.values}>
          {values.map((v, i) => (
            <li key={v.title}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.valueTitle}>{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="people">
        <SectionHead title="The team" count={team.length} id="people">
          <p className={s.headNote}>Portraits are generated artwork, not photos.</p>
        </SectionHead>
        <ol className={s.teamGrid}>
          {team.map((m, i) => (
            <li key={m.slug}>
              <Link href={`/v11/team/${m.slug}`} className={s.workCard}>
                <span className={s.workArt}>
                  <ProjectArt
                    slug={`person-${m.slug}`}
                    variant={i % 2 ? "rings" : "contour"}
                    ink={i % 2 ? "var(--art-l-ink)" : "var(--art-d-ink)"}
                    paper={i % 2 ? "var(--art-l-paper)" : "var(--art-d-paper)"}
                    ratio={0.8}
                  />
                  <span className={s.monogram} aria-hidden="true">
                    {initials(m.name)}
                  </span>
                </span>
                <span className={s.fourMeta}>
                  <span className={s.fourNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.fourTitle}>{m.name}</span>
                  <span className={s.fourCat}>{m.role}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="where">
        <SectionHead title="Where" count={offices.length} id="where" />
        <ol className={s.offices}>
          {offices.map((o) => (
            <li key={o.label}>
              <h3 className={s.valueTitle}>{o.label}</h3>
              <p>{o.lines.join(", ")}</p>
              {o.label === "Dhaka" && (
                <p className={s.clockInk}>
                  <LiveTime tz="Asia/Dhaka" /> <span className={s.muted}>local time</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
