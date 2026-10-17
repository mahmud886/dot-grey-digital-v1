import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v3/Chrome";
import s from "@/redesign/v3/v3.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v3/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Drawing" };
}

export default async function V3Case({ params }: PageProps<"/v3/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const n = works.findIndex((x) => x.slug === slug) + 101;

  return (
    <>
      <Header dwg={`DG-${n}`} />
      <main className={s.wrap}>
        <section className={s.caseHead}>
          <p className={`${s.mono} ${s.y}`}>
            Drawing DG-{n} / {w.category} / {w.year}
          </p>
          <h1 className={s.caseTitle} style={{ marginTop: "0.75rem" }}>
            {w.title}
          </h1>
          <p style={{ fontSize: "1.35rem", maxWidth: "48ch", marginTop: "1rem" }}>{w.summary}</p>
        </section>

        <div className={`${s.dimLine} ${s.mono}`}>
          <span>
            {w.duration} · {w.team} · {w.role}
          </span>
        </div>
        <div className={s.frame}>
          <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority style={{ filter: "none", mixBlendMode: "normal" }} />
        </div>
        <div className={s.tb}>
          <div>
            <small className={s.mono}>Client</small>
            <b>{w.client}</b>
          </div>
          <div>
            <small className={s.mono}>Services</small>
            {w.services.join(", ")}
          </div>
          <div>
            <small className={s.mono}>Year</small>
            {w.year}
          </div>
        </div>

        <section className={s.section} style={{ borderTop: 0 }}>
          <div className={s.reqs}>
            <div className={s.req}>
              <span className={`${s.mono} ${s.y}`}>A — Requirement</span>
              <p>{w.challenge}</p>
            </div>
            <div className={s.req}>
              <span className={`${s.mono} ${s.y}`}>B — Solution</span>
              <p>{w.solution}</p>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
            Method
          </h2>
          <div className={s.steps}>
            {w.approach.map((a, i) => (
              <div key={a.title} className={s.step}>
                <span className={`${s.mono} ${s.y}`}>Step {i + 1}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
            Measured results
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table className={s.tol}>
              <thead>
                <tr className={s.mono}>
                  {w.stats.map((st) => (
                    <th key={st.label}>{st.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {w.stats.map((st) => (
                    <td key={st.label}>
                      <b>{st.value}</b>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <figure className={s.note} style={{ marginTop: "2rem" }}>
            <blockquote style={{ fontSize: "1.6rem" }}>“{w.quote.text}”</blockquote>
            <figcaption className={s.mono}>
              {w.quote.author} — {w.quote.role}
            </figcaption>
          </figure>
        </section>

        <section className={s.section}>
          <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
            Bill of materials
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table className={s.bom}>
              <thead className={s.mono}>
                <tr>
                  <th>Item</th>
                  <th>Deliverable</th>
                  <th>Tooling</th>
                </tr>
              </thead>
              <tbody>
                {w.deliverables.map((d, i) => (
                  <tr key={d}>
                    <td className={s.mono}>{String(i + 1).padStart(2, "0")}</td>
                    <td>{d}</td>
                    <td className={s.mono}>{w.tools[i] ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: "1.5rem", fontSize: "1.15rem", maxWidth: "60ch" }}>{w.outcome}</p>
        </section>

        <section className={s.drawings} style={{ paddingBottom: "4rem" }}>
          {w.gallery.map((g, i) => (
            <div key={g} className={s.frame}>
              <Image src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
            </div>
          ))}
        </section>

        <Link href={`/v3/work/${next.slug}`} className={s.nextDwg}>
          <span className={`${s.mono} ${s.y}`}>Next drawing →</span>
          <b>{next.title}</b>
        </Link>
      </main>
      <Footer />
    </>
  );
}
