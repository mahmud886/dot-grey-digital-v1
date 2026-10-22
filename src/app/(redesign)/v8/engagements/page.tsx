import type { Metadata } from "next";
import Link from "next/link";
import { engagementCompare, engagementFaq, engagements, pricingNotes } from "@/redesign/agency";
import { Footer, PageCover, SecHead } from "@/redesign/v8/Chrome";
import { FaqTabs } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "Work with us" };

export default function V8Engagements() {
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`Engagements · ${engagements.length} ways in`}
          title="Work with us."
          lead="Four ways to work together, from a two-week study to a team that stays. Every one is scoped on a call before anything is signed."
        />

        <section className={s.indexSec} aria-label="Engagement models">
          <ul className={s.engGrid}>
            {engagements.map((e, i) => (
              <li key={e.id}>
                <article className={s.engCard} aria-labelledby={`e-${e.id}`}>
                  <div className={s.engTop}>
                    <h2 id={`e-${e.id}`} className={s.engName}>
                      {e.name}
                      <span className={s.stop}>.</span>
                    </h2>
                    <span className={s.kicker}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className={s.engLine}>{e.line}</p>
                  <p>{e.bestFor}</p>
                  <ul className={s.dashList}>
                    {e.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <dl className={s.engMeta}>
                    <div>
                      <dt>Team</dt>
                      <dd>{e.team}</dd>
                    </div>
                    <div>
                      <dt>Length</dt>
                      <dd>{e.length}</dd>
                    </div>
                    <div>
                      <dt>Pricing</dt>
                      <dd>{e.pricing}</dd>
                    </div>
                  </dl>
                  <p className={s.engFrom}>
                    <small>Indicative starting point — not a quote</small>
                    <b>From {e.from}</b>
                  </p>
                </article>
              </li>
            ))}
          </ul>
          <ul className={s.noteList}>
            {pricingNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="c-title">
          <SecHead id="c-title" title="Side by side." note="The same four models, compared on what usually decides it." />
          <div className={s.tableWrap}>
            <table className={s.compare}>
              <thead>
                <tr>
                  <td />
                  {engagements.map((e) => (
                    <th key={e.id} scope="col">
                      {e.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engagementCompare.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {engagements.map((e) => (
                      <td key={e.id}>{row.values[e.id]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.process} aria-labelledby="q-title">
          <SecHead id="q-title" title="Before you ask." />
          <FaqTabs groups={[{ id: "Engagements", items: engagementFaq }]} />
        </section>

        <div className={s.ctaBand}>
          <p>Not sure which one? Tell us the problem.</p>
          <Link href="/v8/start" className={s.pillAccent}>
            Start a project →
          </Link>
        </div>
      </main>
      <Footer signoff="Let's go." />
    </>
  );
}
