import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { offices, stats, team, values } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead, Portrait } from "@/site/Bits";
import { DhakaTime } from "@/site/Client";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "About", description: "A small, senior studio in Dhaka: the people, the values and the numbers behind DotGrey Digital.", path: "/about" });

export default function AboutPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Since 2019."
        label="About"
        title={
          <>
            Small on purpose, <Em>senior by design.</Em>
          </>
        }
        lead="DotGrey is an independent studio in Dhaka. The people you meet in the first workshop are the people who build the thing."
      />

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`}>
        <div>
          <p className={s.label}>Why we exist</p>
          <p className={s.prose}>
            Products fail in the gaps — between the designer and the engineer, between the dashboard and the data under it.
            We started DotGrey to close those gaps by keeping every craft on the same team, on the same call, from day one.
          </p>
        </div>
        <div>
          <p className={s.label}>How that feels</p>
          <p className={s.prose}>
            No account layers, no hand-over decks. Working software every week, decisions written down, and a team small
            enough that everyone knows why a line of code exists.
          </p>
        </div>
      </section>

      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="In numbers">
        <dl className={s.stats}>
          {stats.map((st) => (
            <div key={st.label}>
              <dt>{st.label}</dt>
              <dd>
                {st.value}
                {st.suffix && <sup>{st.suffix}</sup>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="values">
        <div className={s.secHead}>
          <p className={s.label}>What we hold to</p>
          <h2 id="values" className={s.h2}>
            Six <Em>habits.</Em>
          </h2>
        </div>
        <ol className={s.values}>
          {values.map((v, i) => (
            <li key={v.title}>
              <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="people">
        <div className={s.secHead}>
          <p className={s.label}>People</p>
          <h2 id="people" className={s.h2}>
            Who you&apos;ll <Em>meet.</Em>
          </h2>
          <p className={s.note}>Portraits are generated artwork until real photography is in.</p>
        </div>
        <ul className={s.people}>
          {team.map((m) => (
            <li key={m.slug}>
              <Link href={`/team/${m.slug}`} className={s.person} data-cursor="view">
                <Portrait slug={m.slug} name={m.name} />
                <span className={s.personName}>{m.name}</span>
                <span className={s.personRole}>{m.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.dark} aria-labelledby="where">
        <div className={s.wrap}>
          <div className={s.secHead}>
            <p className={s.label}>Where</p>
            <h2 id="where" className={s.h2}>
              Dhaka, <Em>opened.</Em>
            </h2>
          </div>
          <div className={s.offices}>
            {offices.map((o) => (
              <div key={o.label}>
                <h3>{o.label}</h3>
                <p>{o.lines.join(", ")}</p>
                {o.label === "Dhaka" && (
                  <p className={s.clock}>
                    It&apos;s <DhakaTime /> here now.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.wrap} ${s.contact}`}>
        <h2 className={s.ctaSmall}>
          Want to work with us, <Em>or here?</Em>
        </h2>
        <div className={s.ctas}>
          <Link href="/contact" className={s.pillInk}>
            Start a project <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/careers" className={s.textLink}>
            See open roles
          </Link>
        </div>
      </section>
    </main>
      <Footer signoff="Cheers." />
    </>
  );
}
