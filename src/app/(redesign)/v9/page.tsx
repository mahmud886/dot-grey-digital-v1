import { disciplines, process, stats, testimonials, works, offices } from "@/redesign/content";
import { Footer, Header, SectionHead } from "@/redesign/v9/Chrome";
import { DhakaTime, Scramble, ServicesIndex, WorkIndex } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

const BADGES = ["Des", "Dev", "Sw", "Auto", "Data", "ML"];
const LINES = ["Design", "Software", "Automation", "Data", "Machine learning"];

export default function V9Home() {
  const quote = testimonials[1];
  return (
    <>
      <Header />
      <main>
        <section className={s.hero}>
          <p className={s.heroMeta}>
            <span>
              DotGrey<sup>®</sup> Digital-first studio
            </span>
            <span>Est. 2019</span>
            <span className={s.heroMetaEnd}>
              Dhaka <DhakaTime />
            </span>
          </p>
          <h1 className={s.lockup}>
            <span className={s.lockupA}>DotGrey</span>
            <span className={s.lockupB}>
              <G name="asterisk" className={s.lockupGlyph} />
              Digital
            </span>
          </h1>
          <div className={s.heroFoot}>
            <ul className={s.badges} aria-label="Disciplines">
              {BADGES.map((b, i) => (
                <li key={b}>
                  <Scramble text={b} delay={i * 60} duration={420} />
                </li>
              ))}
            </ul>
            <p className={s.heroLine}>
              We design the interface, build the software, automate the busywork and teach it to think.
            </p>
            <ol className={s.heroList}>
              {LINES.map((l, i) => (
                <li key={l}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <Scramble text={l} delay={120 + i * 90} duration={650} />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="work" className={s.section}>
          <div className={s.wrap}>
            <SectionHead n="01" title="Selected work" aside={`${works.length} projects`} />
          </div>
          <WorkIndex works={works} />
        </section>

        <section className={`${s.section} ${s.manifestoSec}`}>
          <div className={`${s.wrap} ${s.manifestoGrid}`}>
            <span className={s.label}>(02) Manifesto</span>
            <p className={s.manifesto}>
              A small studio <G name="asterisk" /> in Dhaka with one rule: the interface <G name="diamond" />, the code{" "}
              <G name="slash" /> the automations <G name="wave" /> and the models <G name="dot" /> are one product, so one
              team builds them <G name="arrow" />
            </p>
          </div>
        </section>

        <section id="services" className={`${s.section} ${s.dark}`}>
          <div className={s.wrap}>
            <SectionHead n="03" title="Services" aside="Six disciplines, one team" dark />
            <ServicesIndex items={disciplines} />
          </div>
        </section>

        <section id="index" className={s.section}>
          <div className={s.wrap}>
            <SectionHead n="04" title="Index" aside="Process, numbers, places" />
            <div className={s.table}>
              <div className={s.tGroup}>
                <h3 className={s.tHead}>Process</h3>
                <ol>
                  {process.map((p, i) => (
                    <li key={p.title} className={s.tRow}>
                      <span className={s.tKey}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={s.tName}>{p.title}</span>
                      <span className={s.tVal}>{p.body}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={s.tGroup}>
                <h3 className={s.tHead}>Numbers</h3>
                <ul>
                  {stats.map((st) => (
                    <li key={st.label} className={s.tRow}>
                      <span className={s.tKey}>
                        <G name="plus" />
                      </span>
                      <span className={s.tName}>
                        {st.value}
                        {st.suffix}
                      </span>
                      <span className={s.tVal}>{st.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={s.tGroup}>
                <h3 className={s.tHead}>Places</h3>
                <ul>
                  {offices.map((o) => (
                    <li key={o.label} className={s.tRow}>
                      <span className={s.tKey}>
                        <G name={o.label === "Dhaka" ? "diamond" : "ring"} />
                      </span>
                      <span className={s.tName}>{o.label}</span>
                      <span className={s.tVal}>
                        {o.lines.join(", ")}
                        {o.label === "Dhaka" && (
                          <>
                            {" "}
                            — <DhakaTime /> local
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.quoteSec}`}>
          <figure className={s.wrap}>
            <span className={s.label}>(05) Kind words</span>
            <blockquote className={s.quote}>
              <G name="flower" /> {quote.quote}
            </blockquote>
            <figcaption className={s.quoteBy}>
              {quote.author} <G name="slash" /> {quote.role}
            </figcaption>
          </figure>
        </section>
      </main>
      <Footer />
    </>
  );
}
