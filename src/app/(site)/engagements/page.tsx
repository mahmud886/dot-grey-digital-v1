import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import { engagementCompare, engagementFaq, engagements, pricingNotes } from "@/site/agency";
import { Closing, Head } from "@/site/Bits";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "Work with us", description: "Discovery, sprints, product teams and embedded squads: how engagements with DotGrey work and how pricing is set.", path: "/engagements" });

export default function EngagementsPage() {
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Work with us."
        label="Engagements — four ways in"
        title={
          <>
            Four ways in, <Em>one team.</Em>
          </>
        }
        lead="Start small with a Discovery, ship a fixed scope, or keep a team on an outcome. Every engagement is scoped after a call."
      />

      <section className={`${s.wrap} ${s.sectionTight}`} aria-label="Engagement models">
        <ol className={s.models}>
          {engagements.map((e, i) => (
            <li key={e.id} className={s.model}>
              <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
              <h2 className={s.modelName}>{e.name}</h2>
              <p className={s.modelLine}>{e.line}</p>
              <p className={s.modelBest}>
                <span className={s.label}>Best for</span>
                {e.bestFor}
              </p>
              <ul className={s.plainList}>
                {e.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <dl className={s.modelFacts}>
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
              <p className={s.modelFrom}>
                <span className={s.label}>Indicative starting point — not a quote</span>
                <b>From {e.from}</b>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${s.wrap} ${s.section}`} aria-labelledby="compare">
        <Head id="compare" label="Side by side" title="Choose" turn="calmly." />
        <div className={s.tableWrap}>
          <table className={s.compare}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={s.srOnly}>Compare</span>
                </th>
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

      <section className={s.dark} aria-labelledby="pricing">
        <div className={`${s.wrap} ${s.twoUp}`}>
          <Head id="pricing" label="How pricing works" title="No" turn="surprises." />
          <ol className={s.approachDark} style={{ gridTemplateColumns: "1fr" }}>
            {pricingNotes.map((n, i) => (
              <li key={n}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <p>{n}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.wrap} ${s.section} ${s.faqWrap}`} aria-labelledby="faq">
        <Head id="faq" label="Questions" title="Fair" turn="questions." />
        <div className={s.faq}>
          {engagementFaq.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Closing title="Not sure which" turn="fits?" secondary={{ href: "/contact", label: "Ask us instead" }} />
    </main>
      <Footer signoff="Your move." />
    </>
  );
}
