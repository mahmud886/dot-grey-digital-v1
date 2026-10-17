import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { Colophon, Masthead } from "@/redesign/v2/Chrome";
import s from "@/redesign/v2/v2.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v2/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Feature" };
}

export default async function V2Case({ params }: PageProps<"/v2/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);

  return (
    <>
      <Masthead compact />
      <main className={s.wrap}>
        <article className={s.article}>
          <header className={s.articleHead}>
            <p className={s.caps} style={{ color: "var(--ox)" }}>
              Feature · {w.category}
            </p>
            <h1 className={s.articleTitle}>{w.title}</h1>
            <p className={s.deck} style={{ marginInline: "auto" }}>
              {w.summary}
            </p>
            <div className={`${s.articleMeta} ${s.caps}`}>
              <span>Client: {w.client}</span>
              <span>Year: {w.year}</span>
              <span>Duration: {w.duration}</span>
              <span>Team: {w.team}</span>
            </div>
          </header>

          <figure className={s.articleCover}>
            <Image src={w.cover} alt={`${w.title} — cover`} width={1600} height={1000} priority />
            <figcaption className={s.caption}>{w.services.join(", ")} for {w.client}.</figcaption>
          </figure>

          <div className={s.body}>
            <div>
              <p className={s.caps} style={{ marginBottom: "0.75rem" }}>
                The problem
              </p>
              <p>{w.challenge}</p>
            </div>
            <div>
              <p className={s.caps} style={{ marginBottom: "0.75rem" }}>
                What we did
              </p>
              <p>{w.solution}</p>
            </div>
          </div>

          <aside className={s.pull}>
            <blockquote>“{w.quote.text}”</blockquote>
            <p className={s.caps} style={{ marginTop: "1rem", color: "var(--muted)" }}>
              {w.quote.author}, {w.quote.role}
            </p>
          </aside>

          <section className={s.section} style={{ borderBottom: 0 }}>
            <div className={s.secHead}>
              <h2 className={s.secTitle}>
                How it <em>unfolded</em>
              </h2>
            </div>
            <div className={s.columns} style={{ gridTemplateColumns: undefined }}>
              {w.approach.map((a, i) => (
                <div key={a.title} className={s.col}>
                  <span className={s.caps} style={{ color: "var(--ox)" }}>
                    Part {i + 1}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="fig">
            <div className={s.secHead}>
              <h2 id="fig" className={s.secTitle}>
                The <em>figures</em>
              </h2>
            </div>
            <div className={s.figures}>
              {w.stats.map((st) => (
                <div key={st.label} className={s.fig}>
                  <b style={{ color: "var(--ox)" }}>{st.value}</b>
                  <span className={s.caps}>{st.label}</span>
                </div>
              ))}
            </div>
            <p className={s.deck}>{w.outcome}</p>
          </section>

          <div style={{ margin: "4rem 0" }}>
            {w.gallery.map((g, i) => (
              <figure key={g} style={{ marginBottom: "2rem" }}>
                <Image src={g} alt={`${w.title} — plate ${i + 1}`} width={1600} height={1000} style={{ width: "100%", height: "auto" }} />
                <figcaption className={s.caption}>Plate {i + 1}.</figcaption>
              </figure>
            ))}
          </div>

          <div className={s.credits}>
            <div>
              <p className={s.caps}>Role</p>
              <p className={s.serif} style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
                {w.role}
              </p>
            </div>
            <div>
              <p className={s.caps}>Deliverables</p>
              <ul style={{ marginTop: "0.5rem" }}>
                {w.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={s.caps}>Tools</p>
              <ul style={{ marginTop: "0.5rem" }}>
                {w.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <Link href={`/v2/work/${next.slug}`} className={s.nextStory}>
          <span className={s.caps}>Next feature</span>
          <b>{next.title} →</b>
        </Link>
      </main>
      <Colophon />
    </>
  );
}
