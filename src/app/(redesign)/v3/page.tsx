import Image from "next/image";
import Link from "next/link";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Footer, Header, Schematic } from "@/redesign/v3/Chrome";
import { Gantt, SystemDiagram } from "@/redesign/v3/Client";
import s from "@/redesign/v3/v3.module.css";

function SecHead({ no, title, note }: { no: string; title: string; note: string }) {
  return (
    <div className={s.secHead}>
      <span className={s.secNo}>{no}</span>
      <h2 className={s.h2}>{title}</h2>
      <span className={`${s.mono}`} style={{ color: "var(--muted)", maxWidth: "36ch" }}>
        {note}
      </span>
    </div>
  );
}

export default function V3Home() {
  return (
    <>
      <Header dwg="DG-0001" />
      <main className={s.wrap}>
        <section id="system" className={s.hero}>
          <div>
            <p className={`${s.mono} ${s.y}`}>Sheet 01 / General arrangement</p>
            <h1 className={s.heroTitle} style={{ marginTop: "1rem" }}>
              We engineer products from <mark>interface</mark> to inference.
            </h1>
            <dl className={`${s.spec} ${s.mono}`}>
              <div>
                <dt>Scope</dt>
                <dd>Design · Software · Automation · Data · ML</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>{stats[2]?.value ?? 18} specialists, one desk</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Weekly releases · documented</dd>
              </div>
            </dl>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
              <Link href="#brief" className={s.cta}>
                Request a spec →
              </Link>
              <Link href="#drawings" className={s.ctaGhost}>
                View drawings
              </Link>
            </div>
          </div>
          <SystemDiagram items={disciplines} />
        </section>

        <section id="specs" className={s.section}>
          <SecHead no="02" title="Specification sheets" note="Six disciplines, each staffed in-house. Hover a sheet to mark it up." />
          <div className={s.sheets}>
            {disciplines.map((d) => (
              <article key={d.id} className={s.sheet}>
                <div className={`${s.sheetTop} ${s.mono}`}>
                  <span>Spec {d.number}</span>
                  <span>{d.short}</span>
                </div>
                <div className={s.sheetBody}>
                  <Schematic id={d.id} />
                  <h3>{d.title}</h3>
                  <p>{d.line}</p>
                </div>
                <ul className={`${s.checklist} ${s.mono}`}>
                  {d.capabilities.slice(0, 4).map((c) => (
                    <li key={c}>
                      <span>{c}</span>
                      <span>✓</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="drawings" className={s.section}>
          <SecHead no="03" title="Project drawings" note="Selected work. Each title block carries the result the client measured." />
          <div className={s.drawings}>
            {featuredWorks.map((w, i) => (
              <Link key={w.slug} href={`/v3/work/${w.slug}`} className={s.drawing}>
                <div className={`${s.dimLine} ${s.mono}`}>
                  <span>
                    {w.year} · {w.duration}
                  </span>
                </div>
                <div className={s.frame}>
                  <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} />
                </div>
                <div className={s.tb}>
                  <div>
                    <small className={s.mono}>Dwg DG-{String(101 + i)}</small>
                    <b>{w.title}</b>
                  </div>
                  <div>
                    <small className={s.mono}>Type</small>
                    {w.category}
                  </div>
                  <div>
                    <small className={s.mono}>{w.stats[0].label}</small>
                    <span className={s.y} style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                      {w.stats[0].value}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="schedule" className={s.section}>
          <SecHead no="04" title="Construction schedule" note="A typical twelve-week build. Stages overlap on purpose — you see software by week three." />
          <Gantt steps={process} />
        </section>

        <section className={s.section}>
          <SecHead no="05" title="Tolerances" note="The numbers we hold ourselves to." />
          <div style={{ overflowX: "auto" }}>
            <table className={`${s.tol}`}>
              <thead>
                <tr className={s.mono}>
                  {stats.map((st) => (
                    <th key={st.label}>{st.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {stats.map((st) => (
                    <td key={st.label}>
                      <b>
                        {st.value}
                        {st.suffix}
                      </b>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.section}>
          <SecHead no="06" title="Field notes" note="What clients wrote after handover." />
          <div className={s.notes}>
            {testimonials.slice(0, 3).map((t, i) => (
              <figure key={t.id} className={s.note}>
                <span className={`${s.mono} ${s.y}`}>Note {String(i + 1).padStart(2, "0")}</span>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption className={s.mono}>
                  {t.author} — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="brief" className={s.section}>
          <div className={s.ctaBlock}>
            <div>
              <p className={`${s.mono} ${s.y}`}>Sheet 07 / Issue for construction</p>
              <h2 className={s.ctaTitle} style={{ marginTop: "0.75rem" }}>
                Send us the brief. We&apos;ll draw the plan.
              </h2>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <p style={{ color: "var(--muted)" }}>
                A scoped plan, an architecture sketch and a schedule within five working days — free.
              </p>
              <a href={`mailto:${site.email}`} className={s.cta}>
                {site.email} →
              </a>
              <Link href="mailto:hello@dotgreydigital.com" className={s.ctaGhost}>
                Fill in the brief form
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
