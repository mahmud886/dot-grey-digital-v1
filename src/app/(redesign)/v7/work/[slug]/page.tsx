import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, workColor, works } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v7/Chrome";
import s from "@/redesign/v7/v7.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v7/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

export default async function V7Case({ params }: PageProps<"/v7/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const color = workColor(w.slug);

  return (
    <>
      <Header />
      <main>
        <section className={`${s.wrap} ${s.caseHero}`}>
          <span className={s.kicker}>
            {w.category} · {w.year} · for {w.client}
          </span>
          <h1 className={s.caseTitle}>{w.title}</h1>
          <p className={s.lead}>{w.summary}</p>
          <div className={s.team} style={{ marginTop: "1.5rem" }}>
            {[w.role, w.duration, w.team].map((m) => (
              <span key={m} className={s.opt} style={{ cursor: "default" }}>
                {m}
              </span>
            ))}
          </div>
        </section>

        <div className={s.wrap}>
          <div className={s.coverCard} style={{ background: color }}>
            <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority />
          </div>
        </div>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.notes}`}>
            <div className={s.sticky}>
              <h3>The problem</h3>
              <p>{w.challenge}</p>
            </div>
            <div className={s.sticky}>
              <h3>What we did</h3>
              <p>{w.solution}</p>
            </div>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
              How it went
            </h2>
            <div className={s.path} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              {w.approach.map((a, i) => (
                <div key={a.title} className={s.stop}>
                  <span className={s.dot}>{i + 1}</span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={`${s.wrap} ${s.stats}`} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {w.stats.map((st, i) => (
              <div key={st.label} className={s.stat} style={{ background: ["#ffc53d", "#9cc5a1", "#f4a6a0"][i % 3] }}>
                <div>
                  <b style={{ fontSize: st.value.length > 5 ? "clamp(1.8rem, 4vw, 3rem)" : undefined }}>{st.value}</b>
                  <span>{st.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={s.wrap} style={{ marginTop: "3rem", maxWidth: "52rem" }}>
            <figure>
              <blockquote className={s.bubble} style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)", fontFamily: "var(--v7-display)", fontWeight: 600, lineHeight: 1.25 }}>
                {w.quote.text}
              </blockquote>
              <figcaption className={s.who}>
                <span className={s.avatar} style={{ background: "#ffc53d" }} aria-hidden="true">
                  {w.quote.author
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <b>{w.quote.author}</b>
                  <small>{w.quote.role}</small>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={`${s.wrap} ${s.cards}`}>
            <div className={s.card} style={{ background: "#ffe3c7", minHeight: 0 }}>
              <h3>What you get</h3>
              <ul style={{ display: "block", marginTop: "0.5rem" }}>
                {w.deliverables.map((d) => (
                  <li key={d} style={{ background: "transparent", padding: "0.15rem 0" }}>
                    ✓ {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.card} style={{ background: "#dbe9f6", minHeight: 0 }}>
              <h3>Tools we used</h3>
              <ul>
                {w.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className={s.card} style={{ background: "#d9f0dc", minHeight: 0 }}>
              <h3>Where it is now</h3>
              <p>{w.outcome}</p>
            </div>
          </div>
          <div className={`${s.wrap} ${s.polaroids}`} style={{ marginTop: "3rem" }}>
            {w.gallery.map((g, i) => (
              <div key={g} className={s.polaroid} style={{ ["--r" as string]: `${[-1.5, 1.2, -0.8][i % 3]}deg` }}>
                <Image src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
              </div>
            ))}
          </div>
        </section>

        <div className={s.wrap}>
          <Link href={`/v7/work/${next.slug}`} className={s.nextCard}>
            <span style={{ fontWeight: 700 }}>Next project →</span>
            <b>{next.title}</b>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
