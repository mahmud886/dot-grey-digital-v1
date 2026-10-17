import Link from "next/link";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Em, Footer, Header, WorkCard } from "@/redesign/v12/Chrome";
import { LocalHello, Sculpture, ServiceList } from "@/redesign/v12/Client";
import s from "@/redesign/v12/v12.module.css";

const FAQS = [
  {
    q: "Can one team really cover design, software, data and ML?",
    a: "Yes, because most projects need two or three of them at once. A designer, an engineer and a data person sit on the same project from day one, so nothing is lost in a hand-over.",
  },
  {
    q: "How do projects usually start?",
    a: "With a short paid discovery: a few workshops and a look at your data and tools. You leave with a plan, an estimate and a first prototype — and you can stop there if you want.",
  },
  {
    q: "Do you use AI because it's fashionable?",
    a: "No. We use a model when it does a job better than a rule would, and we ship it with evaluation and a way for a person to override it.",
  },
  {
    q: "We're not in Bangladesh. Does that matter?",
    a: "Most of our clients aren't. We keep a daily overlap window with your time zone and show working software every week.",
  },
];

export default function V12Home() {
  const quote = testimonials[0];
  return (
    <>
      <Header />
      <main id="top">
        <section className={`${s.wrap} ${s.hero}`}>
          <div className={s.heroText}>
            <p className={s.kicker}>DotGrey Digital — Dhaka &amp; remote</p>
            <h1 className={s.heroTitle}>
              Software, <Em>by design.</Em>
            </h1>
            <p className={s.heroLead}>
              Design, engineering, automation, data and machine learning — from one small, senior team.
            </p>
            <div className={s.ctas}>
              <Link href="#contact" className={s.pillInk}>
                Start a project <span aria-hidden="true">↗</span>
              </Link>
              <Link href="#work" className={s.textLink}>
                See the work
              </Link>
            </div>
          </div>
          <Sculpture labels={disciplines.map((d) => d.short)} />
        </section>

        <section className={`${s.wrap} ${s.perspective}`} aria-labelledby="perspective">
          <p id="perspective" className={s.label}>
            A connected perspective
          </p>
          <p className={s.statement}>
            Most problems cross a boundary — a design problem that is really a data problem, a workflow that needs a
            model. We keep all six crafts <Em>in one room,</Em> so nothing gets thrown over the wall.
          </p>
          <dl className={s.stats}>
            {stats.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd>
                  {st.value}
                  {st.suffix && <sup>{st.suffix}</sup>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="services" className={`${s.wrap} ${s.section}`}>
          <div className={s.secHead}>
            <p className={s.label}>Services</p>
            <h2 className={s.h2}>
              Six crafts, <Em>one team.</Em>
            </h2>
          </div>
          <ServiceList items={disciplines} />
        </section>

        <section id="work" className={`${s.wrap} ${s.section}`}>
          <div className={s.secHead}>
            <p className={s.label}>Selected work</p>
            <h2 className={s.h2}>
              Ambition, <Em>in practice.</Em>
            </h2>
          </div>
          <div className={s.workGrid}>
            {featuredWorks.map((w, i) => (
              <WorkCard key={w.slug} work={w} index={i} />
            ))}
          </div>
        </section>

        <section className={`${s.wrap} ${s.quoteBlock}`} aria-label="What clients say">
          <figure>
            <blockquote className={s.quote}>“{quote.quote}”</blockquote>
            <figcaption className={s.quoteBy}>
              <b>{quote.author}</b> — {quote.role}
            </figcaption>
          </figure>
        </section>

        <section id="process" className={s.dark}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <p className={s.label}>Process</p>
              <h2 className={s.h2}>
                How it <Em>moves.</Em>
              </h2>
            </div>
            <ol className={s.steps}>
              {process.map((p, i) => (
                <li key={p.title} className={s.step}>
                  <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, k) => (
                      <circle key={k} cx="60" cy="60" r={14 + k * 11} data-on={k <= i} />
                    ))}
                  </svg>
                  <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.stepTitle}>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${s.wrap} ${s.section} ${s.faqWrap}`} aria-labelledby="faq">
          <div>
            <p className={s.label}>Questions</p>
            <h2 id="faq" className={s.h2}>
              Fair <Em>questions.</Em>
            </h2>
          </div>
          <div className={s.faq}>
            {FAQS.map((f) => (
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

        <section id="contact" className={`${s.wrap} ${s.contact}`}>
          <LocalHello />
          <h2 className={s.ctaTitle}>
            Let&apos;s make it <Em>matter.</Em>
          </h2>
          <div className={s.contactRow}>
            <a href={`mailto:${site.email}`} className={s.mail}>
              {site.email} <span aria-hidden="true">↗</span>
            </a>
            <Link href="/contact" className={s.pill}>
              Send a brief
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
