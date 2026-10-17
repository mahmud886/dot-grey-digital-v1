import Link from "next/link";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Footer, Nav } from "@/redesign/v6/Chrome";
import { DepthStack, OrbHero, TiltCard } from "@/redesign/v6/Client";
import s from "@/redesign/v6/v6.module.css";

export default function V6Home() {
  return (
    <>
      <Nav />
      <main>
        <OrbHero>
          <span className={`${s.eyebrow} ${s.glass}`}>● Design · Software · Automation · Data · ML</span>
          <h1 className={s.heroTitle} style={{ marginTop: "1.5rem" }}>
            Software with <span className={s.grad}>depth.</span>
          </h1>
          <p className={s.heroLead}>
            We design and engineer products in layers — interface, logic, automation, data and models — so every layer
            makes the one above it better.
          </p>
          <div className={s.heroCtas}>
            <Link href="#contact" className={s.pill}>
              Start a project →
            </Link>
            <Link href="#work" className={s.pillGlass}>
              Explore the work
            </Link>
          </div>
        </OrbHero>

        <section id="services" style={{ paddingTop: "clamp(4rem, 9vw, 7rem)" }}>
          <div className={`${s.wrap} ${s.secHead}`}>
            <span className={`${s.eyebrow} ${s.glass}`}>Services</span>
            <h2 className={s.h2}>Six layers, one product.</h2>
            <p className={s.lead}>Scroll to move through the stack — each layer is a team we staff in-house.</p>
          </div>
          <DepthStack items={disciplines} />
        </section>

        <section id="work" className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <span className={`${s.eyebrow} ${s.glass}`}>Selected work</span>
              <h2 className={s.h2}>
                Results you can <span className={s.grad}>measure.</span>
              </h2>
            </div>
            <div className={s.works}>
              {featuredWorks.slice(0, 5).map((w) => (
                <TiltCard key={w.slug} work={w} />
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} aria-label="In numbers" style={{ paddingTop: 0 }}>
          <div className={`${s.wrap} ${s.stats}`}>
            {stats.map((st) => (
              <div key={st.label} className={`${s.stat} ${s.glass}`}>
                <b className={s.grad}>
                  {st.value}
                  {st.suffix}
                </b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <span className={`${s.eyebrow} ${s.glass}`}>Process</span>
              <h2 className={s.h2}>From first call to compounding.</h2>
            </div>
            <div className={s.orbit}>
              {process.map((p, i) => (
                <div key={p.title} className={`${s.step} ${s.glass}`}>
                  <span className={s.num}>{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: "2rem" }}>
          <div className={`${s.wrap} ${s.quotes}`}>
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className={`${s.quote} ${s.glass}`}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <b style={{ color: "var(--ink)" }}>{t.author}</b> · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contact" className={s.section}>
          <div className={s.wrap}>
            <div className={`${s.cta} ${s.glass}`}>
              <span className={`${s.eyebrow} ${s.glass}`}>Contact</span>
              <h2 className={s.ctaTitle} style={{ marginTop: "1rem" }}>
                Let&apos;s build something with <span className={s.grad}>depth.</span>
              </h2>
              <div className={s.heroCtas} style={{ justifyContent: "center" }}>
                <a href={`mailto:${site.email}`} className={s.pill}>
                  {site.email}
                </a>
                <Link href="mailto:hello@dotgreydigital.com" className={s.pillGlass}>
                  Send a brief
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
