import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, workColor, works } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v4/Chrome";
import s from "@/redesign/v4/v4.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v4/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Work" };
}

export default async function V4Case({ params }: PageProps<"/v4/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const color = workColor(w.slug);

  return (
    <>
      <Header />
      <main>
        <section className={`${s.caseHero} ${s.pad}`} style={{ background: color, color: "#fff" }}>
          <span className={s.label}>
            {w.category} / {w.year} / {w.client}
          </span>
          <h1 className={s.caseTitle} style={{ marginTop: "1rem" }}>
            {w.title}
          </h1>
          <p className={s.heroLead} style={{ marginTop: "1.5rem" }}>
            {w.summary}
          </p>
        </section>

        <div className={s.caseCover}>
          <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority />
        </div>

        <section className={s.numbers} aria-label="Results">
          {w.stats.map((st) => (
            <div key={st.label} className={s.num}>
              <b style={st.value.length > 4 ? { fontSize: "clamp(2.6rem, 6vw, 5.5rem)", whiteSpace: "nowrap" } : undefined}>{st.value}</b>
              <span className={s.label}>{st.label}</span>
            </div>
          ))}
          <div className={s.num}>
            <b>{w.duration.split(" ")[0]}</b>
            <span className={s.label}>{w.duration.split(" ").slice(1).join(" ") || "Duration"}</span>
          </div>
        </section>

        <section className={s.boxes}>
          <div>
            <span className={s.label}>The problem</span>
            <p>{w.challenge}</p>
          </div>
          <div style={{ background: "#e4ff00" }}>
            <span className={s.label}>The fix</span>
            <p>{w.solution}</p>
          </div>
        </section>

        <section className={s.pad} style={{ paddingBlock: "clamp(3rem, 7vw, 5rem)" }}>
          <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
            How we did it
          </h2>
          {w.approach.map((a, i) => (
            <div key={a.title} className={s.listRow}>
              <span className={s.rowNum}>0{i + 1}</span>
              <h3>{a.title}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>{a.body}</p>
            </div>
          ))}
        </section>

        <div className={s.pad} style={{ background: "#0a0a0a", color: "#fff" }}>
          <div className={s.quoteSec} style={{ borderBottom: 0 }}>
            <span className={s.label} style={{ color: "#e4ff00" }}>
              Client says
            </span>
            <blockquote className={s.quote}>“{w.quote.text}”</blockquote>
            <span className={s.label}>
              {w.quote.author} — {w.quote.role}
            </span>
          </div>
        </div>

        <section className={s.boxes}>
          <div>
            <span className={s.label}>Delivered</span>
            <ul style={{ marginTop: "1rem", fontWeight: 500, fontSize: "1.15rem" }}>
              {w.deliverables.map((d) => (
                <li key={d}>■ {d}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className={s.label}>Tools</span>
            <div className={s.tags} style={{ marginTop: "1rem" }}>
              {w.tools.map((t) => (
                <span key={t} className={s.tag}>
                  {t}
                </span>
              ))}
            </div>
            <p>{w.outcome}</p>
          </div>
        </section>

        {w.gallery.map((g, i) => (
          <div key={g} className={s.caseCover}>
            <Image src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
          </div>
        ))}

        <Link href={`/v4/work/${next.slug}`} className={`${s.nextBar} ${s.pad}`}>
          <span className={s.label}>Next →</span>
          <b>{next.title}</b>
        </Link>
      </main>
      <Footer />
    </>
  );
}
