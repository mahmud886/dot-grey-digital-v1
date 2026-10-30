import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/site/content";
import { ProjectMockup } from "@/site/shared/ProjectMockup";
import { Footer, SecHead, Stop } from "@/site/Chrome";
import { TrackView } from "@/site/analytics/Analytics";
import { TiltCard } from "@/site/Client";
import s from "@/site/site.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return w ? pageMeta({ title: w.title, description: w.summary, path: `/work/${slug}` }) : { title: "Project" };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const nextIndex = works.findIndex((x) => x.slug === next.slug);

  return (
    <>
      <TrackView name="project_view" params={{ slug }} />
      <main id="main">
        <section className={`${s.chapter} ${s.caseCover}`}>
          <div className={`${s.wrap} ${s.caseTop}`}>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <Link href="/#work">Work</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{w.client}</span>
            </nav>
            <span>
              {w.category} · {w.year}
            </span>
          </div>
          <h1 className={s.caseTitle}>{w.title}</h1>
          <ul className={s.tags} aria-label="Tags">
            {w.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className={`${s.wrap} ${s.caseIntro}`} aria-label="Overview">
          <p className={s.label}>
            <Stop>The brief.</Stop>
          </p>
          <div>
            <p className={s.caseLead}>{w.summary}</p>
            <dl className={s.caseMeta}>
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
          </div>
        </section>

        <div className={`${s.wrap} ${s.caseHeroArt}`}>
          <ProjectMockup slug={w.slug} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={2} title={`${w.title} — key visual`} />
        </div>

        <section className={`${s.wrap} ${s.caseBlocks}`} aria-label="Problem and approach">
          <div className={s.caseBlock}>
            <h2 className={s.blockTitle}>
              <Stop>The problem.</Stop>
            </h2>
            <p>{w.challenge}</p>
          </div>
          <div className={s.caseBlock}>
            <h2 className={s.blockTitle}>
              <Stop>The approach.</Stop>
            </h2>
            <p>{w.solution}</p>
          </div>
        </section>

        <div className={`${s.wrap} ${s.gallery}`}>
          <div className={s.galA}>
            <ProjectMockup slug={w.slug} frame={1} ink="var(--art-b-ink)" paper="var(--art-b-paper)" ratio={0.92} title={`${w.title} — detail 1`} />
          </div>
          <div className={s.galB}>
            <ProjectMockup slug={w.slug} frame={2} ink="var(--art-a-ink)" paper="var(--art-a-paper)" ratio={1.5} title={`${w.title} — detail 2`} />
          </div>
          <div className={s.galC}>
            <ProjectMockup slug={w.slug} frame={3} ink="var(--art-a-ink)" paper="var(--stage)" ratio={1.5} title={`${w.title} — detail 3`} />
          </div>
        </div>

        <section className={`${s.wrap} ${s.process}`} aria-labelledby="steps-title">
          <SecHead id="steps-title" title="How it went." note={`${w.duration}, with a team of ${w.team.toLowerCase()}.`} />
          <ol className={s.steps} style={{ ["--cols" as string]: w.approach.length }}>
            {w.approach.map((a, i) => (
              <li key={a.title} className={s.step}>
                <svg viewBox="0 0 120 120" className={s.rings} aria-hidden="true">
                  {w.approach.map((_, k) => (
                    <circle key={k} cx="60" cy="60" r={14 + k * 13} data-on={k <= i} />
                  ))}
                </svg>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>
                  <Stop>{`${a.title}.`}</Stop>
                </h3>
                <p className={s.stepBody}>{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapter} ${s.numbers}`} aria-labelledby="outcomes-title">
          <div className={s.wrap}>
            <SecHead id="outcomes-title" title="Outcomes." note={w.outcome} />
            <dl className={`${s.statGrid} ${s.statGrid3}`}>
              {w.stats.slice(0, 3).map((st) => (
                <div key={st.label} className={s.stat}>
                  <dt>{st.label}</dt>
                  <dd className={st.value.length > 4 ? s.statLong : undefined}>{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={`${s.wrap} ${s.voices}`} aria-label="Client quote">
          <figure className={s.quoteFig}>
            <blockquote className={s.quote}>“{w.quote.text}”</blockquote>
            <figcaption className={s.quoteFoot}>
              <span>
                <b>{w.quote.author}</b> — {w.quote.role}
              </span>
            </figcaption>
          </figure>
        </section>

        <section className={`${s.wrap} ${s.next}`} aria-labelledby="next-title">
          <div className={s.nextHead}>
            <p className={s.label}>
              <Stop>Next.</Stop>
            </p>
            <h2 id="next-title" className={s.nextTitle}>
              <Link href={`/work/${next.slug}`}>
                {next.title} <span aria-hidden="true">→</span>
              </Link>
            </h2>
            <p className={s.secNote}>{next.summary}</p>
          </div>
          <div className={s.nextCard}>
            <TiltCard work={next} index={nextIndex} href={`/work/${next.slug}`} />
          </div>
        </section>
      </main>
      <Footer signoff="Done." />
    </>
  );
}
