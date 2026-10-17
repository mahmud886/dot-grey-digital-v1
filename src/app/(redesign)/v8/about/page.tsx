import type { Metadata } from "next";
import Link from "next/link";
import { offices, site, stats, team, values } from "@/redesign/content";
import { Footer, PageCover, Portrait, SecHead, Stop } from "@/redesign/v8/Chrome";
import { Clocks, ScrubText } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "About" };

export default function V8About() {
  return (
    <>
      <main id="main">
        <PageCover kicker="About" title={`Since ${site.founded}.`} lead="A small, senior studio in Dhaka. The people you meet in the first workshop are the people who build the thing." />

        <section className={s.statement} aria-label="Story">
          <div className={s.statementBody} style={{ marginTop: 0 }}>
            <ScrubText text="DotGrey started as a design studio and kept being asked the same question: can you build it too? Then: can it run on its own? Then: can it learn? So we hired the engineers, the data people and the machine-learning people, and put them in the same room as the designers. That room is the company." />
            <ul className={s.arrowList}>
              <li>
                <Link href="/v8/work">See the work</Link>
              </li>
              <li>
                <Link href="/v8/careers">Join the team</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className={`${s.chapterDark} ${s.numbers}`} aria-labelledby="n-title">
          <SecHead id="n-title" title="In numbers." note="Counted, not rounded up." />
          <dl className={s.statGrid}>
            {stats.map((st) => (
              <div key={st.label} className={s.stat}>
                <dt>{st.label}</dt>
                <dd>
                  {st.value}
                  {st.suffix && <sup>{st.suffix}</sup>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={s.process} aria-labelledby="v-title">
          <SecHead id="v-title" title="What we value." note="Six rules we actually use to make decisions." />
          <ol className={s.valueGrid}>
            {values.map((v, i) => (
              <li key={v.title}>
                <span className={s.valueNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.valueTitle}>
                  <Stop>{`${v.title}.`}</Stop>
                </h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="t-title">
          <SecHead id="t-title" title="The team." note="Portraits are generated artwork, not photos." />
          <ul className={s.teamGrid}>
            {team.map((m) => (
              <li key={m.slug}>
                <Link href={`/v8/team/${m.slug}`} className={s.teamCard}>
                  <Portrait slug={m.slug} name={m.name} />
                  <span className={s.teamName}>{m.name}</span>
                  <span className={s.teamRole}>{m.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="w-title">
          <SecHead id="w-title" title="Where we are." note="One studio, four time zones of clients." />
          <div className={s.placeGrid}>
            {offices.map((o) => (
              <div key={o.label} className={s.place}>
                <h3 className={s.placeName}>
                  <Stop>{`${o.label}.`}</Stop>
                </h3>
                <p>{o.lines.join(", ")}</p>
              </div>
            ))}
            <Clocks />
          </div>
        </section>
      </main>
      <Footer signoff="See you." />
    </>
  );
}
