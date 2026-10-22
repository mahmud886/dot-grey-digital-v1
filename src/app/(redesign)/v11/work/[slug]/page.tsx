import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import s from "@/redesign/v11/v11.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v11/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

export default async function V11Case({ params }: PageProps<"/v11/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);

  return (
    <>
      <main>
        <section className={s.cover} aria-labelledby="case-title">
          <ProjectMockup slug={w.slug} ink="var(--art-d-ink)" paper="var(--art-d-paper)" ratio={1.6} className={s.coverArt} />
          <div className={s.coverText}>
            <p className={s.label}>
              Case ● {w.category} ● {w.year}
            </p>
            <h1 id="case-title" className={s.coverTitle}>
              {w.title}
            </h1>
          </div>
        </section>

        <dl className={s.meta}>
          {[
            ["Client", w.client],
            ["Role", w.role],
            ["Year", w.year],
            ["Duration", w.duration],
            ["Team", w.team],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <section className={s.caseIntro}>
          <p className={s.mission}>
            {w.summary} <span className={s.dot} aria-hidden="true">●</span>
          </p>
          <ul className={s.tags}>
            {w.services.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className={s.gallery} aria-label="Project frames">
          <div className={s.gWide}>
            <ProjectMockup slug={w.slug} ink="var(--art-l-ink)" paper="var(--art-l-paper)" ratio={2.2} frame={1} />
          </div>
          <div className={s.gTall}>
            <ProjectMockup slug={w.slug} ink="var(--art-d-ink)" paper="var(--art-d-paper)" ratio={0.75} frame={2} />
          </div>
          <div className={s.gTall}>
            <ProjectMockup slug={w.slug} ink="var(--art-l-ink)" paper="var(--art-l-paper)" ratio={0.75} frame={3} />
          </div>
        </section>

        <section className={s.twoCol}>
          <div>
            <p className={s.label}>(01) Challenge</p>
            <p className={s.bodyLg}>{w.challenge}</p>
          </div>
          <div>
            <p className={s.label}>(02) Solution</p>
            <p className={s.bodyLg}>{w.solution}</p>
          </div>
        </section>

        <section className={s.section} aria-labelledby="approach">
          <div className={s.sectionHead}>
            <h2 id="approach" className={s.h2}>
              Approach<span className={s.count}>({String(w.approach.length).padStart(2, "0")})</span>
            </h2>
          </div>
          <ol className={s.rows}>
            {w.approach.map((a, i) => (
              <li key={a.title} className={`${s.row} ${s.rowNoThumb}`}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.rowTitle}>{a.title}</h3>
                <p className={s.rowBody}>{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.dark} aria-labelledby="results">
          <p className={s.label} id="results">
            (03) Results
          </p>
          <dl className={s.bigStats}>
            {w.stats.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd>{st.value}</dd>
              </div>
            ))}
          </dl>
          <figure className={s.caseQuote}>
            <blockquote className={s.quote}>{w.quote.text}</blockquote>
            <figcaption className={s.quoteBy}>
              <b>{w.quote.author}</b> <span className={s.muted}>— {w.quote.role}</span>
            </figcaption>
          </figure>
        </section>

        <section className={s.twoCol}>
          <div>
            <p className={s.label}>Deliverables</p>
            <ul className={s.plainList}>
              {w.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className={s.label}>Tools</p>
            <ul className={s.plainList}>
              {w.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className={s.label} style={{ marginTop: "2.5rem" }}>
              Outcome
            </p>
            <p className={s.bodyLg}>{w.outcome}</p>
          </div>
        </section>

        {/* Basic-style chaining: the page runs straight into the next case's cover. */}
        <Link href={`/v11/work/${next.slug}`} className={`${s.cover} ${s.nextCover}`} aria-label={`Next case: ${next.title}`}>
          <ProjectMockup slug={next.slug} ink="var(--art-d-ink)" paper="var(--art-d-paper)" ratio={1.6} className={s.coverArt} />
          <span className={s.coverText}>
            <span className={s.label}>
              Next case <span aria-hidden="true">●</span> {next.category}
            </span>
            <span className={s.coverTitle}>{next.title}</span>
            <span className={s.nextCta}>
              View case <span aria-hidden="true">→</span>
            </span>
          </span>
        </Link>
      </main>
    </>
  );
}
