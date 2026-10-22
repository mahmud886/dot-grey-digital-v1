import type { Metadata } from "next";
import Link from "next/link";
import { engagementCompare, engagementFaq, engagements, pricingNotes } from "@/redesign/agency";
import { Dot, PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { Accordion } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "Work with us" };

export default function V11Engagements() {
  return (
    <main>
      <PageHead label="Engagements" title="Work with us. ● Four ways in." lede="Start small and fixed, or bring us in for the long run. Every engagement is scoped after a call." count={engagements.length} />

      <section className={s.sectionTight} aria-label="Engagement models">
        <ol className={s.models}>
          {engagements.map((e, i) => (
            <li key={e.id} id={e.id} className={s.model}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <h2 className={s.modelName}>{e.name}</h2>
              <p className={s.modelLine}>{e.line}</p>
              <dl className={s.modelMeta}>
                <div>
                  <dt>Best for</dt>
                  <dd>{e.bestFor}</dd>
                </div>
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
              <ul className={s.plainList}>
                {e.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className={s.modelFrom}>
                <span className={s.label}>Indicative, not a quote</span>
                <span className={s.modelPrice}>From {e.from}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="compare">
        <p className={s.label}>(02) Side by side</p>
        <h2 id="compare" className={s.darkTitle}>
          Pick the shape. <Dot /> Not the size.
        </h2>
        <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Engagement comparison">
          <table className={s.compare}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={s.srOnly}>Attribute</span>
                </th>
                {engagements.map((e) => (
                  <th key={e.id} scope="col">
                    {e.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {engagementCompare.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {engagements.map((e) => (
                    <td key={e.id}>{r.values[e.id]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={s.section} aria-labelledby="pricing">
        <SectionHead title="How pricing works" count={pricingNotes.length} id="pricing" />
        <ol className={s.values}>
          {pricingNotes.map((n, i) => (
            <li key={n}>
              <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <p className={s.bodyLg}>{n}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="eng-faq">
        <SectionHead title="Questions" count={engagementFaq.length} id="eng-faq" />
        <Accordion items={engagementFaq.map((f, i) => ({ id: `eng-${i}`, title: f.q, body: <p className={s.bodyLg}>{f.a}</p> }))} />
        <div className={s.ctaRow}>
          <Link href="/v11/start" className={s.btn}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v11/process" className={s.btnGhost}>
            How it goes
          </Link>
        </div>
      </section>
    </main>
  );
}
