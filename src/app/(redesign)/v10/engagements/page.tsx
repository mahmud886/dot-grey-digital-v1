import type { Metadata } from "next";
import Link from "next/link";
import { engagementCompare, engagementFaq, engagements, pricingNotes } from "@/redesign/agency";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Work with us" };

export default function V10Engagements() {
  return (
    <Page>
      <PageHero
        kicker={`Modes · ${engagements.length} ways to work together`}
        title="Work with us"
        long
        form="development"
        lede="Four engagement modes, from a two-week study to a team inside yours. Every one is scoped after a call — the numbers below are where they usually start."
      />

      <section className={s.block} aria-label="Engagement models">
        <ol className={s.xEngGrid}>
          {engagements.map((e, i) => (
            <li key={e.id} className={s.xEng}>
              <p className={s.kicker}>
                mode {String(i + 1).padStart(2, "0")} · {e.length}
              </p>
              <h2 className={s.xEngTitle}>
                {e.name}
                <span className={s.acc}>.</span>
              </h2>
              <p className={s.xEngLine}>{e.line}</p>
              <p className={s.xFrom}>
                <span className={s.label}>Indicative starting point — not a quote</span>
                <b>from {e.from}</b>
              </p>
              <dl className={s.xSpec}>
                <div>
                  <dt>Best for</dt>
                  <dd>{e.bestFor}</dd>
                </div>
                <div>
                  <dt>Team</dt>
                  <dd>{e.team}</dd>
                </div>
                <div>
                  <dt>Pricing</dt>
                  <dd>{e.pricing}</dd>
                </div>
              </dl>
              <ul className={s.xDash}>
                {e.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.block} aria-labelledby="cmp-h">
        <SecHead id="cmp-h" title="Compare" note="Side by side." />
        <div className={s.xTableWrap}>
          <table className={s.xTable}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Attribute</span>
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
              <tr>
                <th scope="row">From</th>
                {engagements.map((e) => (
                  <td key={e.id}>{e.from}*</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className={s.formNote}>* Indicative starting points, not quotes.</p>
      </section>

      <section className={`${s.block} ${s.twoCol}`} aria-labelledby="price-h">
        <div>
          <SecHead id="price-h" title="Pricing" />
          <ol className={s.list}>
            {pricingNotes.map((n, i) => (
              <li key={n}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                {n}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SecHead id="efaq-h" title="Asked" />
          <div className={s.faq}>
            {engagementFaq.map((f, i) => (
              <details key={f.q} className={s.qa}>
                <summary>
                  <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                  <span className={s.qaMark} aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={s.block} aria-label="Start">
        <div className={s.ctaBand}>
          <p className={s.kicker}>Not sure which fits? Tell us the problem.</p>
          <Link href="/v10/process" className={s.nextLink}>
            How it runs <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/start" className={s.cta}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Page>
  );
}
