import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Footer, Header, SectionHead } from "@/redesign/v9/Chrome";
import { PixelReveal, Scramble } from "@/redesign/v9/Client";
import { artFor } from "@/redesign/v9/art";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v9/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Project" };
}

export default async function V9Case({ params }: PageProps<"/v9/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const meta = [
    ["Client", w.client],
    ["Year", w.year],
    ["Discipline", w.category],
    ["Role", w.role],
    ["Duration", w.duration],
    ["Team", w.team],
  ];

  return (
    <>
      <Header />
      <main>
        <section className={s.caseHero}>
          <p className={s.heroMeta}>
            <Link href="/v9#work" className={s.back}>
              <G name="arrow" className={s.flipArrow} /> Index
            </Link>
            <span>
              <Scramble text={`Case ${String(works.indexOf(w) + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`} duration={500} />
            </span>
            <span className={s.heroMetaEnd}>
              {w.category} ◇ {w.year}
            </span>
          </p>
          <h1 className={s.caseTitle}>{w.title}</h1>
          <div className={s.caseIntro}>
            <p className={s.caseSummary}>{w.summary}</p>
            <dl className={s.metaTable}>
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <PixelReveal className={s.caseCover}>
          <ProjectArt slug={w.slug} label={w.client} variant={artFor(works.indexOf(w))} ink="#f7f7f5" paper="#0b0b0b" ratio={16 / 9} title={`${w.title} — cover artwork`} />
        </PixelReveal>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.twoCol}`}>
            <div>
              <span className={s.label}>(01) Challenge</span>
              <p className={s.colText}>{w.challenge}</p>
            </div>
            <div>
              <span className={s.label}>(02) Response</span>
              <p className={s.colText}>{w.solution}</p>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead n="03" title="Approach" aside={`${w.approach.length} moves`} />
            <ol className={s.steps}>
              {w.approach.map((a, i) => (
                <li key={a.title} className={s.step}>
                  <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={s.stepTitle}>{a.title}</h3>
                  <p className={s.stepBody}>{a.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${s.section} ${s.dark}`}>
          <div className={s.wrap}>
            <SectionHead n="04" title="Outcomes" aside="Measured after launch" dark />
            <ul className={s.outcomes}>
              {w.stats.map((st) => (
                <li key={st.label}>
                  <span className={s.outNum}>{st.value}</span>
                  <span className={s.outLabel}>{st.label}</span>
                </li>
              ))}
            </ul>
            <figure className={s.caseQuote}>
              <blockquote className={s.quote}>
                <G name="flower" /> {w.quote.text}
              </blockquote>
              <figcaption className={s.quoteBy}>
                {w.quote.author} <G name="slash" /> {w.quote.role}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead n="05" title="Frames" aside="Artwork placeholders" />
            <div className={s.gallery}>
              {[1, 2, 3].map((f) => (
                <PixelReveal key={f} className={s.galleryItem}>
                  <ProjectArt
                    slug={w.slug}
                    label={w.client}
                    variant={artFor(works.indexOf(w), f)}
                    frame={f}
                    ink={f === 2 ? "#0b0b0b" : "#f7f7f5"}
                    paper={f === 2 ? "#e4e4e1" : "#0b0b0b"}
                    ratio={f === 1 ? 2.2 : 4 / 3}
                    title={`${w.title} — frame ${f}`}
                  />
                </PixelReveal>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.table}`}>
            <div className={s.tGroup}>
              <h3 className={s.tHead}>Delivered</h3>
              <ul>
                {w.deliverables.map((d, i) => (
                  <li key={d} className={`${s.tRow} ${s.tRowSimple}`}>
                    <span className={s.tKey}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.tVal}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.tGroup}>
              <h3 className={s.tHead}>Tools</h3>
              <ul>
                {w.tools.map((t) => (
                  <li key={t} className={`${s.tRow} ${s.tRowSimple}`}>
                    <span className={s.tKey}>
                      <G name="plus" />
                    </span>
                    <span className={s.tVal}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.tGroup}>
              <h3 className={s.tHead}>Where it is now</h3>
              <p className={s.tProse}>{w.outcome}</p>
            </div>
          </div>
        </section>

        <Link href={`/v9/work/${next.slug}`} className={s.next}>
          <span className={s.label}>Next case</span>
          <span className={s.nextTitle}>
            <G name="arrow" /> {next.title}
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
