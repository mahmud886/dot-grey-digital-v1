import Link from "next/link";
import { disciplines, featuredWorks, site, stats, testimonials, works } from "@/redesign/content";
import { Footer, StatusBar, Window } from "@/redesign/v5/Chrome";
import { Pipeline, Terminal } from "@/redesign/v5/Client";
import s from "@/redesign/v5/v5.module.css";

function Meter({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const filled = Math.max(1, Math.round((value / max) * 24));
  return (
    <div className={s.meter}>
      <span>{label}</span>
      <span className={s.bars} aria-hidden="true">
        [{"|".repeat(filled)}
        <span>{"·".repeat(24 - filled)}</span>]
      </span>
      <span className={s.amber} style={{ textAlign: "right" }}>
        {value}
        {suffix}
      </span>
    </div>
  );
}

export default function V5Home() {
  const max = Math.max(...stats.map((x) => x.value));
  return (
    <>
      <StatusBar />
      <main className={s.wrap}>
        <section id="shell">
          <Window title="guest@dotgrey: ~ — zsh — 120×40">
            <h1 className={s.ascii}>
              We automate the boring.
              <br />
              <span>We build the rest.</span>
            </h1>
            <p style={{ maxWidth: "70ch", marginBottom: "1.25rem" }}>
              DotGrey Digital is a studio for design, software, automation, data and machine learning. This page is a
              working shell — type a command, or tap one below.
            </p>
            <Terminal disciplines={disciplines} works={works} email={site.email} />
          </Window>
        </section>

        <section id="pipeline" className={s.section}>
          <span className={s.cmd}>./pipeline.run --demo</span>
          <h2 className={s.h2}>Watch an automation work.</h2>
          <p style={{ maxWidth: "70ch", marginBottom: "1.5rem" }}>
            This is the kind of workflow we build: a trigger, a few systems, a model where judgement is needed, and a
            human only where a human adds something. Pick a scenario and run it.
          </p>
          <Pipeline />
        </section>

        <section id="services" className={s.section}>
          <span className={s.cmd}>ls -la ~/services</span>
          <h2 className={s.h2}>Six services, one team.</h2>
          <div className={s.dim} style={{ marginBottom: "0.5rem" }}>
            total 6 — click a row to <span className={s.g}>cat</span> it
          </div>
          {disciplines.map((d) => (
            <details key={d.id} className={s.lsRow}>
              <summary>
                <span className={s.dim}>drwxr-xr-x</span>
                <span className={s.dim}>{d.number}</span>
                <span className={`${s.dim} ${s.hideSm}`}>dotgrey</span>
                <span className={s.lsName}>{d.short.toLowerCase().replace(/[^a-z]+/g, "-")}/</span>
                <span className={`${s.amber} ${s.hideSm}`}>{d.title}</span>
              </summary>
              <div className={s.lsBody}>
                <div className={s.amber}># {d.title}</div>
                <p>{d.line}</p>
                <div style={{ marginTop: "0.5rem" }}>
                  <span className={s.dim}>capabilities:</span> {d.capabilities.join(", ")}
                </div>
                <div>
                  <span className={s.dim}>stack:</span> {d.stack.join(", ")}
                </div>
              </div>
            </details>
          ))}
        </section>

        <section id="work" className={s.section}>
          <span className={s.cmd}>git log --oneline --graph projects</span>
          <h2 className={s.h2}>Shipped.</h2>
          {featuredWorks.map((w, i) => (
            <Link key={w.slug} href={`/v5/work/${w.slug}`} className={s.gitRow}>
              <span className={s.amber}>* {(0x3fa2c + i * 0x1b7).toString(16)}</span>
              <span className={`${s.dim} ${s.hideSm}`}>{w.year}</span>
              <span>
                <span className={s.gitTitle}>{w.title}</span> <span className={s.dim}>— {w.summary}</span>
              </span>
              <span className={`${s.g} ${s.hideSm}`}>
                {w.stats[0].value} {w.stats[0].label.toLowerCase()}
              </span>
            </Link>
          ))}
        </section>

        <section className={s.section}>
          <span className={s.cmd}>htop --studio</span>
          <h2 className={s.h2}>Uptime.</h2>
          <div className={s.htop}>
            {stats.map((st) => (
              <Meter key={st.label} label={st.label} value={st.value} max={max} suffix={st.suffix} />
            ))}
          </div>
        </section>

        <section className={s.section}>
          <span className={s.cmd}>cat reviews.txt</span>
          <h2 className={s.h2}>From the logs.</h2>
          {testimonials.slice(0, 4).map((t) => (
            <figure key={t.id} className={s.review}>
              <blockquote>&gt; {t.quote}</blockquote>
              <figcaption className={s.dim} style={{ marginTop: "0.5rem" }}>
                — {t.author}, {t.role} · {t.location}
              </figcaption>
            </figure>
          ))}
        </section>

        <section id="contact" className={s.section}>
          <Window title="contact.sh">
            <div className={s.dim}>$ ./contact.sh</div>
            <h2 className={s.h2}>Send us a problem worth automating.</h2>
            <div className={s.dim}>echo &quot;$PROJECT&quot; | mail {site.email}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
              <a href={`mailto:${site.email}`} className={s.btn}>
                ▶ {site.email}
              </a>
              <Link href="mailto:hello@dotgreydigital.com" className={s.chip}>
                open brief form
              </Link>
            </div>
          </Window>
        </section>
      </main>
      <Footer />
    </>
  );
}
