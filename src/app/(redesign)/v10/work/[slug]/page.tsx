import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v10/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

const len = (word: string) => ({ "--len": Math.max(word.length, 6) }) as CSSProperties;

export default async function V10Case({ params }: PageProps<"/v10/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const n = works.findIndex((x) => x.slug === w.slug) + 1;

  return (
    <>
      <main className={s.case}>
        <section className={s.caseHero}>
          <p className={s.kicker}>
            Case file {String(n).padStart(2, "0")} — {w.category} — {w.year}
          </p>
          <h1 className={s.caseTitle} style={len(w.title)}>
            {w.title}
            <span className={s.acc}>.</span>
          </h1>
          <p className={s.caseSum}>{w.summary}</p>
          <dl className={s.meta}>
            {[
              ["Client", w.client],
              ["Role", w.role],
              ["Duration", w.duration],
              ["Team", w.team],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={s.caseCover}>
          <ProjectArt slug={w.slug} label={w.client} variant="matrix" ratio={2.4} ink="var(--fg)" paper="var(--bg)" title={`${w.title} — cover`} />
        </div>

        <section className={s.caseCols}>
          <div>
            <h2 className={s.label}>Problem</h2>
            <p>{w.challenge}</p>
          </div>
          <div>
            <h2 className={s.label}>Response</h2>
            <p>{w.solution}</p>
          </div>
        </section>

        <section className={s.caseBlock} aria-labelledby="approach-h">
          <h2 id="approach-h" className={s.label}>
            Approach
          </h2>
          <ol className={s.steps}>
            {w.approach.map((a, i) => (
              <li key={a.title}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.caseBlock} aria-labelledby="out-h">
          <h2 id="out-h" className={s.label}>
            Outcomes
          </h2>
          <dl className={s.outcomes}>
            {w.stats.map((st) => (
              <div key={st.label}>
                <dd>{st.value}</dd>
                <dt>{st.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className={s.gallery} aria-label="Gallery">
          {(["halftone", "contour", "rings"] as const).map((v, i) => (
            <div key={v} className={s.galleryItem}>
              <ProjectArt slug={w.slug} label={w.client} variant={v} frame={i + 1} ratio={i === 0 ? 2.2 : 1.3} ink="var(--fg)" paper="var(--bg)" title={`${w.title} — study ${i + 1}`} />
            </div>
          ))}
        </section>

        <section className={s.caseBlock}>
          <figure className={s.quote}>
            <blockquote>“{w.quote.text}”</blockquote>
            <figcaption>
              {w.quote.author} — {w.quote.role}
            </figcaption>
          </figure>
        </section>

        <section className={`${s.caseBlock} ${s.caseCols}`}>
          <div>
            <h2 className={s.label}>Delivered</h2>
            <ul className={s.list}>
              {w.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={s.label}>Tools</h2>
            <ul className={s.list}>
              {w.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h2 className={s.label} style={{ marginTop: "2.5rem" }}>
              Where it is now
            </h2>
            <p>{w.outcome}</p>
          </div>
        </section>

        <Link href={`/v10/work/${next.slug}`} className={s.next}>
          <span className={s.kicker}>Next case file →</span>
          <span className={s.nextTitle} style={len(next.title)}>
            {next.title}
          </span>
          <span className={s.nextArt} aria-hidden="true">
            <ProjectArt slug={next.slug} label={next.client} variant="matrix" ratio={3} ink="var(--fg)" paper="var(--bg)" />
          </span>
        </Link>
        <div className={s.caseFoot}>
          <Footer />
        </div>
      </main>
    </>
  );
}
