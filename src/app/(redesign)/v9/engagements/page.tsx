import type { Metadata } from "next";
import Link from "next/link";
import { engagementCompare, engagementFaq, engagements, pricingNotes } from "@/redesign/agency";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Work with us" };

export default function V9Engagements() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(engagements.length).padStart(2, "0")}) ways to work together`}
        title={
          <>
            Work <G name="diamond" /> with us
          </>
        }
        lede="Four shapes of engagement, from a two-week study to a team inside yours. Every one is scoped after a call; the figures below are where they usually start."
      />
      <section className={s.sectionTight}>
        <ol className={`${s.wrap} ${m.engRows}`}>
          {engagements.map((e, i) => (
            <li key={e.id} id={e.id} className={m.engRow}>
              <span className={m.engNum}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className={m.engName}>{e.name}</h2>
                <p className={m.engLine}>{e.line}</p>
                <p className={m.engBest}>Best for: {e.bestFor}</p>
              </div>
              <dl className={m.engDl}>
                <div>
                  <dt>Includes</dt>
                  <dd>
                    <ul>
                      {e.includes.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </dd>
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
              <div className={m.engFrom}>
                <span className={s.label}>From</span>
                <span className={m.engPrice}>{e.from}</span>
                <span className={m.engPriceNote}>Indicative starting point — not a quote.</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.wrap}>
          <SectionHead n="02" title="Side by side" aside="Compare" dark />
          <div className={m.compareWrap}>
            <table className={m.compare}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Aspect</span>
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
        </div>
      </section>
      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="03" title="How pricing works" aside={`${pricingNotes.length} notes`} />
          <ol className={m.notesList}>
            {pricingNotes.map((x, i) => (
              <li key={x}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className={s.sectionTight}>
        <div className={s.wrap}>
          <SectionHead n="04" title="Questions" aside={`${engagementFaq.length} answers`} />
          <div className={s.faqList}>
            {engagementFaq.map((f) => (
              <details key={f.q} className={s.faq}>
                <summary>
                  {f.q} <G name="plus" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <nav className={m.band} aria-label="Next steps">
        <Link href="/v9/process" className={m.bandLink}>
          <span className={s.label}>What happens week to week</span>
          <b>
            The process <G name="arrow" />
          </b>
          <p>Five stages, weekly demos, and what we need from you.</p>
        </Link>
        <Link href="/v9/start" className={m.bandLink}>
          <span className={s.label}>Scope it with us</span>
          <b>
            Start a project <G name="arrow" />
          </b>
          <p>Tell us what you need; we reply within a working day.</p>
        </Link>
      </nav>
    </main>
  );
}
