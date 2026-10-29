import { disciplines, featuredWorks, formatPostDate, posts, process, stats, testimonials } from "@/redesign/content";
import { Em, Footer, SecHead, Stop } from "@/redesign/v13/Chrome";
import { Deck, Form, Greeting, Quotes, RotatingWord, ScrubText, Sculpture, Wordmark, WorkReel } from "@/redesign/v13/Client";
import s from "@/redesign/v13/v13.module.css";

export default function V13Home() {
  return (
    <>
      <main id="main">
        <section className={`${s.wrap} ${s.hero}`}>
          <h1 className={s.wordmarkWrap}>
            <Wordmark text="DOTGREY" />
            <span className={s.srOnly}>DotGrey Digital — design, software, automation, data and machine learning studio</span>
          </h1>
          <div className={s.heroRow}>
            <Greeting />
            <Sculpture labels={disciplines.map((d) => d.short)} />
          </div>
        </section>

        <section className={`${s.wrap} ${s.statement}`} aria-labelledby="statement-title">
          <h2 id="statement-title" className={s.statementTitle}>
            We build software that matters to <RotatingWord />
          </h2>
          <div className={s.statementBody}>
            <ScrubText text="Design, engineering, automation, data and machine learning under one roof. One team takes a product from the first sketch to the model behind it — and keeps improving it after launch." />
            <ul className={s.arrowList}>
              <li>
                <a href="#work">See the work</a>
              </li>
              <li>
                <a href="#services">What we do</a>
              </li>
              <li>
                <a href="#start">Start a project</a>
              </li>
            </ul>
          </div>
        </section>

        <div className={s.chapter}>
          <WorkReel
            items={featuredWorks}
            title={<Stop>Our work.</Stop>}
            note={
              <>
                {featuredWorks.length} recent projects. Every one has <Em>a number</Em> the client cared about.
              </>
            }
          />
        </div>

        <section id="services" className={`${s.wrap} ${s.services}`} aria-labelledby="services-title">
          <SecHead
            id="services-title"
            title="What we do."
            note={
              <>
                Six crafts, <Em>one team.</Em> Most problems cross at least two of them, so we staff all six.
              </>
            }
          />
          <Deck>
            {disciplines.map((d, i) => (
              <article key={d.id} className={s.deckCard} data-tone={i % 2 ? "light" : "dark"} style={{ ["--i" as string]: i }} aria-labelledby={`svc-${d.id}`}>
                <div className={s.deckInner}>
                  <span className={s.deckNum}>{d.number}</span>
                  <div className={s.deckArt}>
                    <Form index={i} />
                  </div>
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
                  </div>
                </div>
              </article>
            ))}
          </Deck>
        </section>

        <section id="process" className={`${s.wrap} ${s.process}`} aria-labelledby="process-title">
          <SecHead
            id="process-title"
            title="How it goes."
            note={
              <>
                Five stages, run in weekly loops. You see <Em>working software</Em> from week two.
              </>
            }
          />
          <ol className={s.steps}>
            {process.map((p, i) => (
              <li key={p.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepTitle}>
                  <Stop>{`${p.title}.`}</Stop>
                </span>
                <span className={s.stepBody}>{p.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" className={`${s.chapter} ${s.numbers}`} aria-labelledby="about-title">
          <div className={s.wrap}>
            <SecHead
              id="about-title"
              title="Small on purpose."
              note={
                <>
                  A senior team in Dhaka, working across four time zones. The people in the first workshop are <Em>the people who build it.</Em>
                </>
              }
            />
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
          </div>
        </section>

        <section className={`${s.wrap} ${s.voices}`} aria-labelledby="voices-title">
          <h2 id="voices-title" className={s.label}>
            In their words
          </h2>
          <Quotes items={testimonials} />
        </section>

        <section id="insights" className={`${s.wrap} ${s.notes}`} aria-labelledby="insights-title">
          <SecHead
            id="insights-title"
            title="Notes."
            note={
              <>
                Short essays on the decisions behind the work. We publish when we have <Em>learned something</Em>, not on a schedule.
              </>
            }
          />
          <ul className={s.noteList}>
            {posts.slice(0, 4).map((p) => (
              <li key={p.slug} className={s.note}>
                <span className={s.noteMeta}>
                  {p.category} · {formatPostDate(p.date)}
                </span>
                <span className={s.noteTitle}>{p.title}</span>
                <span className={s.noteExcerpt}>{p.excerpt}</span>
                <span className={s.noteRead}>{p.readingMinutes} min read</span>
              </li>
            ))}
          </ul>
          <p className={s.noteMore}>
            The full journal arrives with the next phase of this site. Want an essay now? <a href="#start">Ask us</a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
