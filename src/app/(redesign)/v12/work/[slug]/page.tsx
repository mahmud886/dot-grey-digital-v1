import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { Em, WorkCard } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

/** The italic word after each title, by kind of project. */
const VERB: Record<string, string> = { "UI/UX": "simplified.", Web: "shipped.", Email: "opened.", Branding: "defined." };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v12/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

export default async function V12Case({ params }: PageProps<"/v12/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const nextIndex = works.findIndex((x) => x.slug === next.slug);

  return (
    <>
      <main>
        <section className={`${s.wrap} ${s.caseHero}`}>
          <p className={s.kicker}>
            <Link href="/v12/work">Work</Link> — {w.category} — {w.year}
          </p>
          <h1 className={s.caseTitle}>
            {w.title}, <Em>{VERB[w.category] ?? "made."}</Em>
          </h1>
          <p className={s.caseLead}>{w.summary}</p>
          <dl className={s.meta}>
            {[
              ["Client", w.client],
              ["Our role", w.role],
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

        <div className={`${s.wrap} ${s.cover}`}>
          <ProjectArt slug={w.slug} label={w.client} variant="contour" ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={2.2} title={`${w.title} — cover artwork`} />
        </div>

        <section className={`${s.wrap} ${s.section} ${s.twoUp}`}>
          <div>
            <p className={s.label}>The problem</p>
            <p className={s.prose}>{w.challenge}</p>
          </div>
          <div>
            <p className={s.label}>What we did</p>
            <p className={s.prose}>{w.solution}</p>
          </div>
        </section>

        <section className={`${s.wrap} ${s.section}`} aria-labelledby="approach">
          <div className={s.secHead}>
            <p className={s.label}>Approach</p>
            <h2 id="approach" className={s.h2}>
              How it <Em>went.</Em>
            </h2>
          </div>
          <ol className={s.approach}>
            {w.approach.map((a, i) => (
              <li key={a.title}>
                <span className={s.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.dark} aria-labelledby="outcomes">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <p className={s.label}>Outcomes</p>
              <h2 id="outcomes" className={s.h2}>
                What <Em>changed.</Em>
              </h2>
            </div>
            <dl className={s.outcomes}>
              {w.stats.map((st) => (
                <div key={st.label}>
                  <dd>{st.value}</dd>
                  <dt>{st.label}</dt>
                </div>
              ))}
            </dl>
            <p className={s.outcomeNote}>{w.outcome}</p>
          </div>
        </section>

        <section className={`${s.wrap} ${s.quoteBlock}`} aria-label="Client quote">
          <figure>
            <blockquote className={s.quote}>“{w.quote.text}”</blockquote>
            <figcaption className={s.quoteBy}>
              <b>{w.quote.author}</b> — {w.quote.role}
            </figcaption>
          </figure>
        </section>

        <section className={`${s.wrap} ${s.gallery}`} aria-label="Gallery">
          {(["rings", "halftone", "contour"] as const).map((v, i) => (
            <div key={v} className={s.galleryItem} style={{ ["--r" as string]: `${[-2.5, 1.8, -1.2][i]}deg` }}>
              <ProjectArt slug={w.slug} label={w.client} variant={v} frame={i + 2} ink={i === 1 ? "var(--art-b-ink)" : "var(--art-a-ink)"} paper={i === 1 ? "var(--art-b-paper)" : "var(--art-a-paper)"} ratio={i === 0 ? 1.6 : 1.1} />
            </div>
          ))}
        </section>

        <section className={`${s.wrap} ${s.section} ${s.twoUp}`}>
          <div>
            <p className={s.label}>Delivered</p>
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
          </div>
        </section>

        <section className={`${s.wrap} ${s.nextBlock}`} aria-label="Next project">
          <p className={s.label}>Next project</p>
          <WorkCard work={next} index={nextIndex} size="lg" />
        </section>
      </main>
    </>
  );
}
