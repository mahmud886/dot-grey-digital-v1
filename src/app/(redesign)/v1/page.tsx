import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v1/Chrome";
import { Counter, NeuralHero, QuoteTabs, Spotlight, WorkList } from "@/redesign/v1/Client";
import s from "@/redesign/v1/v1.module.css";

export default function V1Home() {
  return (
    <>
      <Header />
      <main>
        <NeuralHero
          lead={
            <>
              <p className={s.heroLead}>
                We design the interface, build the software, wire up the automations and train the models behind
                it — one team, from first sketch to production.
              </p>
              <div className={s.ctaRow}>
                <Link href="#contact" className={s.btn}>
                  Start a project <ArrowUpRight size={16} />
                </Link>
                <Link href="#work" className={s.btnGhost}>
                  See the work <ArrowRight size={16} />
                </Link>
              </div>
            </>
          }
        >
          <p className={`${s.mono} ${s.kicker}`}>DotGrey Digital — Design · Software · Automation · Data · ML</p>
          <h1 className={s.heroTitle}>
            Intelligence, <em>engineered</em> into every product.
          </h1>
        </NeuralHero>

        <section id="capabilities" className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div>
                <p className={`${s.mono} ${s.label}`}>/ capabilities</p>
                <h2 className={s.h2}>Six disciplines. One running system.</h2>
              </div>
              <p className={s.sub}>
                Most problems cross a boundary — a design problem that is really a data problem, a workflow that needs
                a model. We staff all six so nothing gets handed over the wall.
              </p>
            </div>
            <div className={s.models}>
              {disciplines.map((d) => (
                <Spotlight key={d.id} className={s.model}>
                  <div className={`${s.modelTop} ${s.mono}`}>
                    <span>model_{d.number}</span>
                    <span>{d.short.toLowerCase()}</span>
                  </div>
                  <h3>{d.title}</h3>
                  <p>{d.line}</p>
                  <div className={s.caps}>
                    {d.capabilities.map((c) => (
                      <span key={c} className={s.cap}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className={`${s.mono} ${s.stack}`}>stack → {d.stack.join(" · ")}</p>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div>
                <p className={`${s.mono} ${s.label}`}>/ selected work</p>
                <h2 className={s.h2}>Results, not renders.</h2>
              </div>
              <p className={s.sub}>Every project is measured. The number on the right is the one the client cared about most.</p>
            </div>
            <WorkList items={featuredWorks} />
          </div>
        </section>

        <section id="process" className={s.section}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <div>
                <p className={`${s.mono} ${s.label}`}>/ pipeline</p>
                <h2 className={s.h2}>How a project moves.</h2>
              </div>
              <p className={s.sub}>Five stages, run in weekly loops. You see working software from the second week.</p>
            </div>
            <div className={s.pipeline}>
              <div className={s.pipeLine} aria-hidden="true" />
              {process.map((p, i) => (
                <div key={p.title} className={s.stage}>
                  <div className={s.node}>0{i + 1}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} aria-label="In numbers">
          <div className={s.wrap}>
            <div className={s.stats}>
              {stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <Counter value={st.value} suffix={st.suffix} />
                  <span className={`${s.mono} ${s.statLabel}`}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} aria-labelledby="voices">
          <div className={s.wrap}>
            <p id="voices" className={`${s.mono} ${s.label}`} style={{ marginBottom: "2rem" }}>
              / client voices
            </p>
            <QuoteTabs items={testimonials.slice(0, 4)} />
          </div>
        </section>

        <section id="contact" className={s.section}>
          <div className={s.wrap}>
            <div className={s.cta}>
              <p className={`${s.mono} ${s.label}`}>/ next input</p>
              <h2 className={s.ctaTitle} style={{ marginTop: "1rem" }}>
                Got a dataset, a workflow or a wild idea?
              </h2>
              <div className={s.ctaRow} style={{ marginTop: "2.5rem" }}>
                <a href={`mailto:${site.email}`} className={s.btn}>
                  {site.email} <ArrowUpRight size={16} />
                </a>
                <Link href="mailto:hello@dotgreydigital.com" className={s.btnGhost}>
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
