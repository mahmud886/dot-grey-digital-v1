import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { variantFor } from "@/redesign/v8/art";
import { Footer } from "@/redesign/v8/Chrome";
import { Header } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v8/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

export default async function V8Case({ params }: PageProps<"/v8/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);

  return (
    <>
      <Header />
      <main id="main">
        <section className={`${s.chapterDark} ${s.caseCover}`}>
          <div className={s.caseTop}>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <Link href="/v8#work">Work</Link>
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

        <section className={s.caseIntro} aria-label="Overview">
          <p className={s.kicker}>The brief.</p>
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

        <div className={s.caseHeroArt}>
          <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug)} ink="#ffffff" paper="#0a0a0a" ratio={2} title={`${w.title} — key visual`} />
        </div>

        <section className={s.caseBlocks} aria-label="Problem and approach">
          <div className={s.caseBlock}>
            <h2 className={s.blockTitle}>The problem.</h2>
            <p>{w.challenge}</p>
          </div>
          <div className={s.caseBlock}>
            <h2 className={s.blockTitle}>The approach.</h2>
            <p>{w.solution}</p>
          </div>
        </section>

        <div className={s.gallery}>
          <div className={s.galA}>
            <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug, 1)} frame={1} ink="#ffffff" paper="#0a0a0a" ratio={0.92} title={`${w.title} — detail 1`} />
          </div>
          <div className={s.galB}>
            <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug, 2)} frame={2} ink="#0a0a0a" paper="#e6e6e6" ratio={1.5} title={`${w.title} — detail 2`} />
          </div>
          <div className={s.galC}>
            <ProjectArt slug={w.slug} label={w.client} variant={variantFor(w.slug, 3)} frame={3} ink="#ffffff" paper="#1a1a1a" ratio={1.5} title={`${w.title} — detail 3`} />
          </div>
        </div>

        <section className={s.process} aria-labelledby="steps-title">
          <div className={s.secHead}>
            <h2 id="steps-title" className={s.chapterTitle}>
              How it went.
            </h2>
            <p className={s.secNote}>{w.duration}, with a team of {w.team.toLowerCase()}.</p>
          </div>
          <ol className={s.steps}>
            {w.approach.map((a, i) => (
              <li key={a.title} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepTitle}>{a.title}.</span>
                <span className={s.stepBody}>{a.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.chapterDark} ${s.numbers}`} aria-labelledby="outcomes-title">
          <div className={s.secHead}>
            <h2 id="outcomes-title" className={s.chapterTitle}>
              Outcomes.
            </h2>
            <p className={s.secNote}>{w.outcome}</p>
          </div>
          <dl className={`${s.statGrid} ${s.statGrid3}`}>
            {w.stats.slice(0, 3).map((st) => (
              <div key={st.label} className={s.stat}>
                <dt>{st.label}</dt>
                <dd className={st.value.length > 4 ? s.statLong : undefined}>{st.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={s.voices} aria-label="Client quote">
          <figure className={s.quoteFig}>
            <blockquote className={s.quote}>“{w.quote.text}”</blockquote>
            <figcaption className={s.quoteFoot}>
              <span>
                <b>{w.quote.author}</b> — {w.quote.role}
              </span>
            </figcaption>
          </figure>
        </section>

        <Link href={`/v8/work/${next.slug}`} className={s.next}>
          <span className={s.kicker}>Next.</span>
          <span className={s.nextTitle}>
            {next.title} <span aria-hidden="true">→</span>
          </span>
          <span className={s.nextArt} aria-hidden="true">
            <ProjectArt slug={next.slug} label={next.client} variant={variantFor(next.slug)} ink="#ffffff" paper="#0a0a0a" ratio={4} />
          </span>
        </Link>
      </main>
      <Footer signoff="Done." />
    </>
  );
}
