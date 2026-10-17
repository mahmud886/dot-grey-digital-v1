import type { CSSProperties } from "react";
import { disciplines, featuredWorks, site, stats, testimonials } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v10/Chrome";
import { Ask, Loader, WorkIndex, World } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

const len = (word: string) => ({ "--len": word.length }) as CSSProperties;

export default function V10Home() {
  const quote = testimonials[0];
  return (
    <>
      <Loader />
      <Header home />
      <World chapters={disciplines.map((d) => ({ id: d.id, label: d.short }))}>
        <main className={s.layer}>
          <section id="top" data-ch="0" className={s.hero}>
            <p className={s.kicker}>DotGrey Digital — Dhaka / remote</p>
            <h1 className={s.heroTitle}>
              <span>We build</span> <span>thinking</span> <span>software.</span>
            </h1>
            <p className={s.heroSub}>Design, engineering, automation, data and machine learning. One team, one system.</p>
            <a href="#design" className={s.scrollCue}>
              Scroll to enter <span aria-hidden="true">↓</span>
            </a>
          </section>

          {disciplines.map((d, i) => {
            const word = d.short.toUpperCase();
            return (
              <section key={d.id} id={d.id} data-ch={i + 1} className={s.chapter} aria-labelledby={`${d.id}-h`}>
                <div className={s.chInner}>
                  <p className={s.chNum}>
                    {d.number} / 06 <span>{d.title}</span>
                  </p>
                  <h2 id={`${d.id}-h`} className={s.chTitle} style={len(word)}>
                    {word}
                  </h2>
                  <p className={s.chLine}>{d.line}</p>
                  <ul className={s.caps}>
                    {d.capabilities.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className={s.stack}>
                    <span>Stack</span> {d.stack.join(" · ")}
                  </p>
                </div>
              </section>
            );
          })}

          <section className={s.askDock} aria-label="Ask DotGrey">
            <Ask disciplines={disciplines} email={site.email} />
          </section>

          <section id="work" data-ch="7" className={s.section} aria-labelledby="work-h">
            <div className={s.secHead}>
              <h2 id="work-h" className={s.secTitle}>
                Work
              </h2>
              <p className={s.secNote}>Six projects. Each with the one number the client cared about.</p>
            </div>
            <WorkIndex works={featuredWorks} />
          </section>

          <section className={s.section} aria-label="In numbers">
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
            <figure className={s.quote}>
              <blockquote>“{quote.quote}”</blockquote>
              <figcaption>
                {quote.author} — {quote.role}
              </figcaption>
            </figure>
          </section>

          <section id="contact" className={s.contact} aria-labelledby="contact-h">
            <h2 id="contact-h" className={s.contactTitle}>
              <span>Let&apos;s</span> <span>build.</span>
            </h2>
            <a href={`mailto:${site.email}`} className={s.mail}>
              {site.email} <span aria-hidden="true">↗</span>
            </a>
            <Footer />
          </section>
        </main>
      </World>
    </>
  );
}
