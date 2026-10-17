import Image from "next/image";
import Link from "next/link";
import { disciplines, featuredWorks, offices, process, site, stats, testimonials } from "@/redesign/content";
import { Colophon, Masthead } from "@/redesign/v2/Chrome";
import { InkText } from "@/redesign/v2/Client";
import s from "@/redesign/v2/v2.module.css";

const MANIFESTO =
  "Most studios hand your project from designers to developers to a data team who never met. We put the *designer,* the *engineer,* the *automation* builder and the *data* scientist at one desk, so the product you see and the system behind it are made as one thing — and keep getting better after launch.";

export default function V2Home() {
  return (
    <>
      <Masthead />
      <main>
        <div className={s.wrap}>
          <section className={s.front} aria-labelledby="lead-story">
            <div>
              <p className={`${s.caps} ${s.edition}`}>Lead story · Studio</p>
              <h1 id="lead-story" className={s.headline}>
                Where design, software and <em>machine learning</em> finally share a desk.
              </h1>
              <p className={s.deck}>
                DotGrey Digital designs interfaces, builds the software behind them, automates the busywork and trains
                the models that make it smart — one team, accountable for the whole thing.
              </p>
              <div className={s.byline}>
                <span className={s.caps}>By the studio</span>
                <span className={s.caps}>{offices.length} offices · 6 disciplines</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "2rem" }}>
                <Link href="#write" className={`${s.btnInk} ${s.caps}`}>
                  Commission a project
                </Link>
                <Link href="#features" className={`${s.btnLine} ${s.caps}`}>
                  Read the features →
                </Link>
              </div>
            </div>
            <aside className={s.inIssue} aria-label="In this issue">
              <h2>In this issue</h2>
              {disciplines.map((d, i) => (
                <a key={d.id} href="#contents" className={s.issueItem}>
                  <span>{d.title}</span>
                  <span>p. {String(4 + i * 6).padStart(2, "0")}</span>
                </a>
              ))}
              <a href="#features" className={s.issueItem}>
                <span>
                  <em>Features:</em> six case studies
                </span>
                <span>p. 40</span>
              </a>
            </aside>
          </section>

          <section className={s.manifesto} aria-label="Manifesto">
            <p className={`${s.caps} ${s.edition}`}>Editor&apos;s letter</p>
            <InkText text={MANIFESTO} />
          </section>

          <section id="contents" className={s.section}>
            <div className={s.secHead}>
              <h2 className={s.secTitle}>
                <em>Contents</em>
              </h2>
              <span className={s.caps}>Six disciplines</span>
            </div>
            <div className={s.contents}>
              {disciplines.map((d, i) => (
                <article key={d.id} className={s.entry}>
                  <span className={s.entryNum}>{d.number}</span>
                  <h3 className={s.entryTitle}>{d.title}</h3>
                  <p className={s.entryLine}>
                    {d.line}
                    <span className={s.entryCaps}>{d.capabilities.join(" · ")}</span>
                  </p>
                  <span className={`${s.entryPage} ${s.caps}`}>p. {String(4 + i * 6).padStart(2, "0")}</span>
                </article>
              ))}
            </div>
          </section>

          <section id="features" className={s.section}>
            <div className={s.secHead}>
              <h2 className={s.secTitle}>
                Features<em>.</em>
              </h2>
              <span className={s.caps}>Selected case studies</span>
            </div>
            {featuredWorks.slice(0, 4).map((w) => (
              <article key={w.slug} className={s.feature}>
                <Link href={`/v2/work/${w.slug}`} className={s.featureMedia} tabIndex={-1} aria-hidden="true">
                  <Image src={w.cover} alt="" width={1600} height={1000} />
                </Link>
                <div>
                  <p className={`${s.caps}`} style={{ color: "var(--ox)" }}>
                    {w.category} · {w.year}
                  </p>
                  <h3 className={s.featureTitle}>
                    <Link href={`/v2/work/${w.slug}`}>{w.title}</Link>
                  </h3>
                  <p className={s.standfirst}>{w.summary}</p>
                  <div className={s.figure}>
                    <b>{w.stats[0].value}</b>
                    <span className={s.caps}>{w.stats[0].label}</span>
                  </div>
                  <Link href={`/v2/work/${w.slug}`} className={`${s.btnLine} ${s.caps}`}>
                    Read the full story →
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section id="method" className={s.section}>
            <div className={s.secHead}>
              <h2 className={s.secTitle}>
                The <em>method</em>
              </h2>
              <span className={s.caps}>Five stages, weekly loops</span>
            </div>
            <div className={s.columns}>
              {process.map((p, i) => (
                <div key={p.title} className={s.col}>
                  <span className={s.caps} style={{ color: "var(--ox)" }}>
                    Stage {i + 1}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={s.section} aria-labelledby="figures">
            <div className={s.secHead}>
              <h2 id="figures" className={s.secTitle}>
                By the <em>figures</em>
              </h2>
              <span className={s.caps}>Since {site.founded}</span>
            </div>
            <div className={s.figures}>
              {stats.map((st) => (
                <div key={st.label} className={s.fig}>
                  <b>
                    {st.value}
                    {st.suffix}
                  </b>
                  <span className={s.caps}>{st.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="letters" className={s.section}>
            <div className={s.secHead}>
              <h2 className={s.secTitle}>
                Letters to the <em>studio</em>
              </h2>
              <span className={s.caps}>From our clients</span>
            </div>
            <div className={s.letters}>
              {testimonials.slice(0, 4).map((t) => (
                <figure key={t.id} className={s.letter}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption className={s.caps}>
                    <b>{t.author}</b> — {t.role}, {t.location}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="write" className={s.corr}>
            <div>
              <p className={`${s.caps} ${s.edition}`}>Correspondence</p>
              <h2 className={s.corrTitle}>
                Write to us. <em>We answer every letter.</em>
              </h2>
            </div>
            <div className={s.postcard}>
              <p className={s.caps} style={{ color: "var(--muted)", marginBottom: "0.75rem" }}>
                Address
              </p>
              <p>
                DotGrey Digital
                <br />
                {offices[0].lines.join(", ")}
              </p>
              <p style={{ marginTop: "1rem" }}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
              <p style={{ marginTop: "1.25rem" }}>
                <Link href="/contact" className={`${s.btnInk} ${s.caps}`}>
                  Send a brief
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Colophon />
    </>
  );
}
