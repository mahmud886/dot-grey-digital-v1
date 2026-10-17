import Link from "next/link";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v4/Chrome";
import { QuoteCycler, Reel, ScrollBand } from "@/redesign/v4/Client";
import s from "@/redesign/v4/v4.module.css";

export default function V4Home() {
  return (
    <>
      <Header />
      <main>
        <section className={`${s.hero} ${s.pad}`}>
          <h1 className={s.mega}>
            <span>We build</span>
            <span>things that</span>
            <span>
              <span className={s.hl}>think.</span>
            </span>
          </h1>
          <div className={s.heroRow}>
            <p className={s.heroLead}>
              DotGrey Digital is a design and engineering studio. Interfaces, software, automations, data pipelines and
              machine learning — built by one loud, very small, very senior team.
            </p>
            <div className={s.tags}>
              {disciplines.map((d) => (
                <span key={d.id} className={s.tag}>
                  {d.short}
                </span>
              ))}
            </div>
            <Link href="#contact" className={s.bigBtn}>
              Start →
            </Link>
          </div>
        </section>

        <ScrollBand words={disciplines.map((d) => d.short)} />

        <section id="services" className={s.svc}>
          <div className={`${s.svcHead} ${s.pad}`}>
            <h2 className={s.h2}>What we do</h2>
            <span className={s.label}>(06)</span>
          </div>
          {disciplines.map((d) => (
            <article key={d.id} className={`${s.row} ${s.pad}`} tabIndex={0}>
              <span className={s.rowNum}>{d.number}</span>
              <h3 className={s.rowTitle}>{d.short}</h3>
              <p className={s.rowDetail}>
                {d.line}
                <small>{d.capabilities.join(" / ")}</small>
              </p>
            </article>
          ))}
        </section>

        <Reel
          items={featuredWorks}
          title={
            <>
              <h2 className={s.h2}>The work</h2>
              <span className={s.label} style={{ color: "#e4ff00" }}>
                Scroll →
              </span>
            </>
          }
        />

        <section className={s.numbers} aria-label="In numbers">
          {stats.map((st) => (
            <div key={st.label} className={s.num}>
              <b>
                {st.value}
                {st.suffix}
              </b>
              <span className={s.label}>{st.label}</span>
            </div>
          ))}
        </section>

        <section id="process">
          <div className={`${s.svcHead} ${s.pad}`} style={{ borderTop: 0 }}>
            <h2 className={s.h2}>How</h2>
            <span className={s.label}>Five steps. No theatre.</span>
          </div>
          <div className={s.steps}>
            {process.map((p, i) => (
              <div key={p.title} className={s.stepBox}>
                <b>0{i + 1}</b>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={s.pad}>
          <QuoteCycler items={testimonials} />
        </div>

        <section id="contact" className={`${s.ctaSec} ${s.pad}`}>
          <span className={s.label}>Contact</span>
          <h2 className={s.ctaTitle} style={{ marginTop: "1rem" }}>
            Got a problem? Bring it.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
            <a href={`mailto:${site.email}`} className={s.bigBtn}>
              {site.email}
            </a>
            <Link href="/contact" className={s.bigBtn} style={{ background: "transparent", color: "#0a0a0a" }}>
              Send a brief
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
