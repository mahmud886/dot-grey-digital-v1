import Link from "next/link";
import { disciplines, featuredWorks, process, stats, testimonials } from "@/redesign/content";
import { Footer, SecHead } from "@/redesign/v8/Chrome";
import { Deck, Greeting, HalftoneField, Quotes, RotatingWord, ScrubText, Wordmark, WorkReel } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export default function V8Home() {
  return (
    <>
      <main id="main">
        <section className={s.hero}>
          <h1 className={s.wordmarkWrap}>
            <Wordmark text="DOTGREY" />
            <span className={s.srOnly}>DotGrey Digital — design, software, automation, data and machine learning studio</span>
          </h1>
          <Greeting />
        </section>

        <section className={s.fieldSec} aria-label="Disciplines">
          <HalftoneField />
        </section>

        <section className={s.statement} aria-labelledby="statement-title">
          <h2 id="statement-title" className={s.statementTitle}>
            We build software that matters to <RotatingWord />
          </h2>
          <div className={s.statementBody}>
            <ScrubText text="Design, engineering, automation, data and machine learning under one roof. One team takes a product from the first sketch to the model behind it — and keeps improving it after launch." />
            <ul className={s.arrowList}>
              <li>
                <Link href="/v8/work">See the work</Link>
              </li>
              <li>
                <Link href="/v8/services">What we do</Link>
              </li>
              <li>
                <Link href="/v8/start">Start a project</Link>
              </li>
            </ul>
          </div>
        </section>

        <div className={s.chapterDark}>
          <WorkReel items={featuredWorks} />
        </div>

        <section id="services" className={s.services} aria-labelledby="services-title">
          <SecHead id="services-title" title="What we do." note="Six disciplines. Most problems cross at least two of them, so we staff all six." />
          <Deck>
            {disciplines.map((d, i) => (
              <article
                key={d.id}
                className={s.deckCard}
                data-tone={i % 2 ? "light" : "dark"}
                style={{ ["--i" as string]: i }}
                aria-labelledby={`svc-${d.id}`}
              >
                <div className={s.deckInner}>
                  <span className={s.deckNum}>{d.number}</span>
                  <div className={s.deckMain}>
                    <h3 id={`svc-${d.id}`} className={s.deckTitle}>
                      {d.title}
                    </h3>
                    <p className={s.deckLine}>{d.line}</p>
                  </div>
                  <div className={s.deckSide}>
                    <ul className={s.deckCaps}>
                      {d.capabilities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p className={s.deckStack}>{d.stack.join(" · ")}</p>
                    <Link href={`/v8/services/${d.id}`} className={s.deckLink}>
                      More on {d.short} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </Deck>
        </section>

        <section id="process" className={s.process} aria-labelledby="process-title">
          <SecHead id="process-title" title="How it goes." note="Five stages, run in weekly loops. You see working software from week two." />
          <ol className={s.steps}>
            {process.map((p, i) => (
              <li key={p.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepTitle}>{p.title}.</span>
                <span className={s.stepBody}>{p.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" className={`${s.chapterDark} ${s.numbers}`} aria-labelledby="numbers-title">
          <SecHead id="numbers-title" title="In numbers." note="A small senior team in Dhaka, working across four time zones." />
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

        <section className={s.voices} aria-labelledby="voices-title">
          <h2 id="voices-title" className={s.kicker}>
            In their words.
          </h2>
          <Quotes items={testimonials} />
        </section>
      </main>
      <Footer />
    </>
  );
}
