import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, workColor, works } from "@/redesign/content";
import { Footer, Header } from "@/redesign/v1/Chrome";
import s from "@/redesign/v1/v1.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v1/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Case study" };
}

export default async function V1Case({ params }: PageProps<"/v1/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);

  return (
    <>
      <Header />
      <main>
        <section className={s.caseHero}>
          <div className={s.wrap}>
            <p className={`${s.mono} ${s.label}`}>
              / case — {w.category} — {w.year}
            </p>
            <h1 className={s.caseTitle} style={{ marginTop: "1rem" }}>
              {w.title}
            </h1>
            <p className={s.heroLead} style={{ marginTop: "1.5rem", fontSize: "1.3rem" }}>
              {w.summary}
            </p>
            <dl className={`${s.metaGrid}`}>
              {[
                ["Client", w.client],
                ["Role", w.role],
                ["Duration", w.duration],
                ["Team", w.team],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className={s.mono}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={s.wrap}>
          <div className={s.cover} style={{ boxShadow: `0 40px 120px -40px ${workColor(w.slug)}` }}>
            <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority />
            <span className={`${s.coverTag} ${s.mono}`}>
              <span className={s.dot} /> {w.services.join(" · ")}
            </span>
          </div>
        </section>

        <section className={s.section} style={{ borderTop: 0 }}>
          <div className={`${s.wrap} ${s.twoCol}`}>
            <div>
              <p className={`${s.mono} ${s.label}`}>/ input — the problem</p>
              <p className={s.bodyText}>{w.challenge}</p>
            </div>
            <div>
              <p className={`${s.mono} ${s.label}`}>/ output — what we shipped</p>
              <p className={s.bodyText}>{w.solution}</p>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <p className={`${s.mono} ${s.label}`} style={{ marginBottom: "2rem" }}>
              / approach
            </p>
            <div className={s.pipeline}>
              <div className={s.pipeLine} aria-hidden="true" />
              {w.approach.map((a, i) => (
                <div key={a.title} className={s.stage}>
                  <div className={s.node}>0{i + 1}</div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <p className={`${s.mono} ${s.label}`} style={{ marginBottom: "2rem" }}>
              / outcomes
            </p>
            <div className={s.stats} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {w.stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <span className={s.statValue} style={{ color: "var(--lime)" }}>
                    {st.value}
                  </span>
                  <span className={`${s.mono} ${s.statLabel}`}>{st.label}</span>
                </div>
              ))}
            </div>
            <figure style={{ marginTop: "4rem", maxWidth: "52rem" }}>
              <blockquote className={s.quote}>{w.quote.text}</blockquote>
              <figcaption className={s.mono} style={{ marginTop: "1.25rem", color: "var(--muted)" }}>
                {w.quote.author} — {w.quote.role}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.twoCol}`}>
            <div>
              <p className={`${s.mono} ${s.label}`}>/ deliverables</p>
              <ul className={s.bodyText}>
                {w.deliverables.map((d) => (
                  <li key={d}>→ {d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`${s.mono} ${s.label}`}>/ tools</p>
              <div className={s.chips} style={{ marginTop: "1rem" }}>
                {w.tools.map((t) => (
                  <span key={t} className={s.cap}>
                    {t}
                  </span>
                ))}
              </div>
              <p className={s.bodyText}>{w.outcome}</p>
            </div>
          </div>
        </section>

        <section className={s.wrap}>
          <div className={s.gallery}>
            {w.gallery.map((g, i) => (
              <Image key={g} src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
            ))}
          </div>
        </section>

        <div className={s.wrap}>
          <Link href={`/v1/work/${next.slug}`} className={s.next} style={{ marginTop: "6rem" }}>
            <span className={`${s.mono} ${s.label}`}>/ next case</span>
            <span className={s.nextTitle}>{next.title} →</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
