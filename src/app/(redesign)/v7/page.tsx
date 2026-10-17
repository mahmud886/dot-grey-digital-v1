import Image from "next/image";
import Link from "next/link";
import { BarChart3, Bot, Brain, Code2, Cpu, PenTool } from "lucide-react";
import { disciplines, featuredWorks, process, site, stats, testimonials } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v7/Chrome";
import { Greeting, ScopePlanner } from "@/redesign/v7/Client";
import s from "@/redesign/v7/v7.module.css";

const ICONS = { design: PenTool, development: Code2, software: Cpu, automation: Bot, data: BarChart3, ml: Brain } as const;
const TINTS = ["#ffe3c7", "#d9f0dc", "#fff1b8", "#ffd9d4", "#dbe9f6", "#ece0ff"];
const STICKERS = [
  { id: "design", top: "4%", left: "2%", r: "-8deg", bg: "#ffd9d4" },
  { id: "software", top: "12%", left: "58%", r: "6deg", bg: "#dbe9f6" },
  { id: "automation", top: "70%", left: "0%", r: "5deg", bg: "#d9f0dc" },
  { id: "ml", top: "78%", left: "52%", r: "-6deg", bg: "#ece0ff" },
  { id: "data", top: "42%", left: "70%", r: "9deg", bg: "#fff1b8" },
] as const;

const FAQS = [
  {
    q: "Can you take a project from idea to launch?",
    a: "Yes — design, engineering, automation, data and ML sit in one team, so we can carry a product from the first workshop to production and keep improving it after.",
  },
  {
    q: "Do we need a big budget to work with you?",
    a: "No. Many projects start small: an automation that saves a team a day a week, or a dashboard that answers one question well. We scope to what moves the needle first.",
  },
  {
    q: "How do you use AI responsibly?",
    a: "We use models where judgement is needed and humans where accountability is. Every ML feature ships with evaluation, monitoring and a way for a person to override it.",
  },
  {
    q: "Where are you, and what hours do you keep?",
    a: "Our home base is Dhaka, with people across four time zones. Most clients get a daily overlap window and a weekly demo.",
  },
];

export default function V7Home() {
  return (
    <>
      <Header />
      <main>
        <section className={`${s.wrap} ${s.hero}`}>
          <div>
            <Greeting />
            <h1 className={s.title}>
              Friendly people building{" "}
              <span className={s.scribble}>
                seriously smart
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 14 C 60 4, 120 18, 180 9 S 270 6, 297 12" />
                </svg>
              </span>{" "}
              software.
            </h1>
            <p className={s.lead}>
              We design it, build it, automate the boring parts and add the data and AI that make it clever — and we
              explain every step in plain language.
            </p>
            <div className={s.ctas}>
              <Link href="#planner" className={s.btn}>
                Plan my project
              </Link>
              <Link href="#work" className={s.btnSoft}>
                See what we&apos;ve made
              </Link>
            </div>
          </div>
          <div className={s.stickers} aria-hidden="true">
            <div className={s.blob} />
            <div className={s.bigSmile}>Hi, we&apos;re DotGrey</div>
            {STICKERS.map((st) => {
              const d = disciplines.find((x) => x.id === st.id)!;
              const Icon = ICONS[st.id];
              return (
                <span key={st.id} className={s.sticker} style={{ top: st.top, left: st.left, ["--r" as string]: st.r }}>
                  <span className={s.stickerIcon} style={{ background: st.bg }}>
                    <Icon size={20} />
                  </span>
                  {d.short}
                </span>
              );
            })}
          </div>
        </section>

        <section id="planner" className={s.section} style={{ paddingTop: "2rem" }}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <div>
                <span className={s.kicker}>Project planner</span>
                <h2 className={s.h2}>Plan your project in 30 seconds.</h2>
              </div>
              <p className={s.sub}>Three quick questions and you&apos;ll see a rough timeline and the team you&apos;d work with.</p>
            </div>
            <ScopePlanner email={site.email} />
          </div>
        </section>

        <section id="services" className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <div>
                <span className={s.kicker}>What we do</span>
                <h2 className={s.h2}>Six ways we can help.</h2>
              </div>
              <p className={s.sub}>Pick one, or let us combine a few. Everything is done by the same small, friendly team.</p>
            </div>
            <div className={s.cards}>
              {disciplines.map((d, i) => {
                const Icon = ICONS[d.id as keyof typeof ICONS];
                return (
                  <article key={d.id} className={s.card} style={{ background: TINTS[i] }}>
                    <span className={s.cardIcon}>
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3>{d.title}</h3>
                    <p>{d.line}</p>
                    <ul>
                      {d.capabilities.slice(0, 4).map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="work" className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <div>
                <span className={s.kicker}>Our work</span>
                <h2 className={s.h2}>Things we&apos;re proud of.</h2>
              </div>
              <p className={s.sub}>Every project has a number our client cared about. Here it is, next to the name.</p>
            </div>
            <div className={s.polaroids}>
              {featuredWorks.map((w, i) => (
                <Link key={w.slug} href={`/v7/work/${w.slug}`} className={s.polaroid} style={{ ["--r" as string]: `${[-2, 1.5, -1, 2, -1.5, 1][i]}deg` }}>
                  <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} />
                  <div className={s.polaroidCap}>
                    <div>
                      <small>
                        {w.category} · {w.year}
                      </small>
                      <h3>{w.title}</h3>
                    </div>
                    <span className={s.statBadge}>{w.stats[0].value}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} aria-label="In numbers" style={{ paddingTop: 0 }}>
          <div className={`${s.wrap} ${s.stats}`}>
            {stats.map((st, i) => (
              <div key={st.label} className={s.stat} style={{ background: ["#ffc53d", "#9cc5a1", "#f4a6a0", "#a7c7e7"][i] }}>
                <div>
                  <b>
                    {st.value}
                    {st.suffix}
                  </b>
                  <span>{st.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <div>
                <span className={s.kicker}>How it works</span>
                <h2 className={s.h2}>No surprises, just steps.</h2>
              </div>
            </div>
            <div className={s.path}>
              <svg className={s.pathLine} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M20 20 C 150 60, 250 -10, 400 25 S 650 55, 780 18 S 950 10, 990 24" />
              </svg>
              {process.map((p, i) => (
                <div key={p.title} className={s.stop}>
                  <span className={s.dot}>{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <div className={s.secHead}>
              <div>
                <span className={s.kicker}>Kind words</span>
                <h2 className={s.h2}>From people we&apos;ve worked with.</h2>
              </div>
            </div>
            <div className={s.bubbles}>
              {testimonials.slice(0, 3).map((t, i) => (
                <figure key={t.id}>
                  <blockquote className={s.bubble}>{t.quote}</blockquote>
                  <figcaption className={s.who}>
                    <span className={s.avatar} style={{ background: ["#ffc53d", "#9cc5a1", "#f4a6a0"][i] }} aria-hidden="true">
                      {t.author
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <span>
                      <b>{t.author}</b>
                      <small>{t.role}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className={s.section}>
          <div className={`${s.wrap} ${s.secHead}`} style={{ alignItems: "start" }}>
            <div>
              <span className={s.kicker}>Questions</span>
              <h2 className={s.h2}>Good questions, honest answers.</h2>
            </div>
            <div className={s.faq}>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="hello" className={s.section}>
          <div className={s.wrap}>
            <div className={s.cta}>
              <h2 className={s.ctaTitle}>Say hello. We reply within a day.</h2>
              <div className={s.ctas} style={{ position: "relative", zIndex: 1 }}>
                <a href={`mailto:${site.email}`} className={s.btnSoft}>
                  {site.email}
                </a>
                <Link href="mailto:hello@dotgreydigital.com" className={s.btnSoft}>
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
