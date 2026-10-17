import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, workColor, works } from "@/redesign/content";
import { Footer, Nav } from "@/redesign/v6/Chrome";
import s from "@/redesign/v6/v6.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v6/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Case study" };
}

export default async function V6Case({ params }: PageProps<"/v6/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);
  const color = workColor(w.slug);

  return (
    <>
      <Nav />
      <main>
        <section className={s.caseHero}>
          <div className={s.caseBlob} style={{ background: `radial-gradient(circle, ${color}, transparent 65%)` }} />
          <div className={s.wrap}>
            <span className={`${s.eyebrow} ${s.glass}`}>
              {w.category} · {w.year}
            </span>
            <h1 className={s.caseTitle} style={{ marginTop: "1.25rem" }}>
              {w.title}
            </h1>
            <p className={s.heroLead}>{w.summary}</p>
            <div className={s.metaRow}>
              {[w.client, w.role, w.duration, w.team].map((m) => (
                <span key={m} className={`${s.cap}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className={s.wrap}>
          <div className={`${s.tilt} ${s.glass}`} style={{ transform: "none" }}>
            <div className={s.tiltImg}>
              <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority />
            </div>
          </div>
        </div>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.stats}`} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {w.stats.map((st) => (
              <div key={st.label} className={`${s.stat} ${s.glass}`}>
                <b className={s.grad}>{st.value}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={s.wrap}>
          <div className={s.panels}>
            <div className={`${s.panel} ${s.glass}`}>
              <span className={s.eyebrow}>The challenge</span>
              <p>{w.challenge}</p>
            </div>
            <div className={`${s.panel} ${s.glass}`}>
              <span className={s.eyebrow}>What we built</span>
              <p>{w.solution}</p>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <h2 className={s.h2} style={{ marginBottom: "2rem" }}>
              How we got there
            </h2>
            <div className={s.orbit} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {w.approach.map((a, i) => (
                <div key={a.title} className={`${s.step} ${s.glass}`}>
                  <span className={s.num}>{i + 1}</span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.wrap}>
          <figure className={`${s.quote} ${s.glass}`} style={{ textAlign: "center", padding: "clamp(2rem, 5vw, 4rem)" }}>
            <blockquote style={{ fontFamily: "var(--v6-display)", fontSize: "clamp(1.6rem, 3.4vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              “{w.quote.text}”
            </blockquote>
            <figcaption>
              {w.quote.author} · {w.quote.role}
            </figcaption>
          </figure>
        </section>

        <section className={s.section}>
          <div className={`${s.wrap} ${s.panels}`}>
            <div className={`${s.panel} ${s.glass}`}>
              <span className={s.eyebrow}>Deliverables</span>
              <ul style={{ marginTop: "0.75rem" }}>
                {w.deliverables.map((d) => (
                  <li key={d}>✦ {d}</li>
                ))}
              </ul>
            </div>
            <div className={`${s.panel} ${s.glass}`}>
              <span className={s.eyebrow}>Tools</span>
              <div className={s.caps}>
                {w.tools.map((t) => (
                  <span key={t} className={s.cap}>
                    {t}
                  </span>
                ))}
              </div>
              <p>{w.outcome}</p>
            </div>
          </div>
          <div className={`${s.wrap} ${s.works}`} style={{ marginTop: "2rem" }}>
            {w.gallery.map((g, i) => (
              <div key={g} className={`${s.tilt} ${s.glass}`} style={{ transform: "none" }}>
                <div className={s.tiltImg}>
                  <Image src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={s.wrap}>
          <Link href={`/v6/work/${next.slug}`} className={`${s.next} ${s.glass}`}>
            <span className={s.eyebrow}>Next project</span>
            <b className={s.grad}>{next.title} →</b>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
