import { disciplines, faqs, featuredWorks, formatPostDate, posts, process, stats, testimonials, works } from "@/redesign/content";
import { BASE, Em, Footer, SecHead, Stop } from "@/redesign/v13/Chrome";
import { Deck, Form, Greeting, HalftoneField, Quotes, RotatingWord, ScrubText, Sculpture, TiltCard, Wordmark, WorkReel } from "@/redesign/v13/Client";
import s from "@/redesign/v13/v13.module.css";

// The reel carries the six featured projects; the grid below shows the rest, so nothing repeats.
const MORE_WORK = works.filter((w) => !featuredWorks.some((f) => f.slug === w.slug));
const FAQ_IDS = ["what-we-do", "start", "pricing", "ai-fit", "ai-data", "support"];
const FAQS = FAQ_IDS.map((id) => faqs.find((f) => f.id === id)).filter((f) => f !== undefined);

export default function V13Home() {
  return (
    <>
      <main id="main">
        {/* Hello — V8's opening, set on V12's paper. */}
        <section className={`${s.wrap} ${s.hero}`}>
          <h1 className={s.wordmarkWrap}>
            <Wordmark text="DOTGREY" />
            <span className={s.srOnly}>DotGrey Digital — design, software, automation, data and machine learning studio</span>
          </h1>
          <Greeting />
        </section>

        <section className={`${s.wrap} ${s.fieldSec}`} aria-label="Six disciplines, one team">
          <HalftoneField />
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

        {/* V12's centrepiece: the sculpture, given a chapter of its own. */}
        <section className={`${s.wrap} ${s.shape}`} aria-labelledby="shape-title">
          <div className={s.shapeText}>
            <p className={s.label}>The shape of it</p>
            <h2 id="shape-title" className={s.shapeTitle}>
              Software, <Em>by design.</Em>
            </h2>
            <p className={s.shapeLead}>
              Six crafts, six forms. Tap the sculpture to shift between them — each one is a discipline we staff on day one.
            </p>
            <a href="#services" className={s.textLink}>
              Meet the six crafts
            </a>
          </div>
          <Sculpture labels={disciplines.map((d) => d.short)} />
        </section>

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

        {/* V12's "connected perspective", carrying V8's numbers. */}
        <section id="about" className={`${s.wrap} ${s.perspective}`} aria-labelledby="about-title">
          <div className={s.perspHead}>
            <p className={s.label}>A connected perspective</p>
            <h2 id="about-title" className={s.perspTitle}>
              <Stop>Small on purpose.</Stop>
            </h2>
          </div>
          <p className={s.perspStatement}>
            Most problems cross a boundary — a design problem that is really a data problem, a workflow that needs a model. We keep all six crafts{" "}
            <Em>in one room,</Em> and the people in the first workshop are <Em>the people who build it.</Em>
          </p>
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

        <section className={`${s.wrap} ${s.more}`} aria-labelledby="more-title">
          <div className={s.secHead}>
            <h2 id="more-title" className={s.moreTitle}>
              Ambition, <Em>in practice.</Em>
            </h2>
            <p className={s.secNote}>Three more from the archive. Hover a card — the frames straighten up.</p>
          </div>
          <div className={s.moreGrid}>
            {MORE_WORK.map((w, i) => (
              <TiltCard key={w.slug} work={w} index={featuredWorks.length + i} href={`${BASE}/work/${w.slug}`} />
            ))}
          </div>
        </section>

        {/* Process on V12's deep chapter: each step gains a ring. */}
        <section id="process" className={`${s.chapter} ${s.process}`} aria-labelledby="process-title">
          <div className={s.wrap}>
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
                <li key={p.title} className={s.step} style={{ ["--i" as string]: i }}>
                  <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                    {Array.from({ length: process.length }, (_, k) => (
                      <circle key={k} cx="60" cy="60" r={12 + k * 11} data-on={k <= i} />
                    ))}
                  </svg>
                  <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.stepTitle}>
                    <Stop>{`${p.title}.`}</Stop>
                  </h3>
                  <p className={s.stepBody}>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${s.wrap} ${s.voices}`} aria-labelledby="voices-title">
          <h2 id="voices-title" className={s.label}>
            In their words
          </h2>
          <Quotes items={testimonials} />
        </section>

        <section className={`${s.wrap} ${s.faqWrap}`} aria-labelledby="faq-title">
          <div className={s.faqHead}>
            <p className={s.label}>Questions</p>
            <h2 id="faq-title" className={s.moreTitle}>
              Fair <Em>questions.</Em>
            </h2>
          </div>
          <div className={s.faq}>
            {FAQS.map((f) => (
              <details key={f.id}>
                <summary>
                  {f.question}
                  <i aria-hidden="true" />
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
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
