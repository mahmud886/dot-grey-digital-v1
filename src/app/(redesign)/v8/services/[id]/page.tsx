import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, process, works } from "@/redesign/content";
import { Footer, SecHead, Stop, WorkGridItem } from "@/redesign/v8/Chrome";
import { HalftoneField } from "@/redesign/v8/Client";
import { CRAFT_FAQ, RELATED } from "@/redesign/v8/related";
import s from "@/redesign/v8/v8.module.css";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/v8/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const d = disciplines.find((x) => x.id === id);
  return { title: d ? d.title : "Service" };
}

/** Words the dot field spells for each discipline: the name, then what it produces. */
const FIELD: Record<string, string[]> = {
  design: ["Design", "Research", "Systems"],
  development: ["Web", "Apps", "Speed"],
  software: ["SaaS", "APIs", "Tools"],
  automation: ["Flows", "Agents", "Hours"],
  data: ["Data", "Charts", "Truth"],
  ml: ["ML", "Models", "Evals"],
};

export default async function V8Service({ params }: PageProps<"/v8/services/[id]">) {
  const { id } = await params;
  const i = disciplines.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const d = disciplines[i];
  const next = disciplines[(i + 1) % disciplines.length];
  const related = (RELATED[d.id] ?? []).map((slug) => works.find((w) => w.slug === slug)).filter((w) => w !== undefined);
  const faq = CRAFT_FAQ[d.id] ?? [];

  return (
    <>
      <main id="main">
        <section className={s.svcCover}>
          <nav aria-label="Breadcrumb" className={s.coverCrumbs}>
            <Link href="/v8/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{d.number}</span>
          </nav>
          <div className={s.svcCoverGrid}>
            <span className={s.svcBigNum} aria-hidden="true">
              {d.number}
            </span>
            <div>
              <h1 className={s.svcTitle}>
                <Stop>{`${d.title}.`}</Stop>
              </h1>
              <p className={s.coverLead}>{d.line}</p>
            </div>
          </div>
        </section>

        <section className={s.fieldSec} aria-label={`${d.short} in dots`}>
          <HalftoneField words={FIELD[d.id] ?? [d.short]} caption={`${d.number} · ${d.short}`} compact />
        </section>

        <section className={s.process} aria-labelledby="caps-title">
          <SecHead id="caps-title" title="What's in it." note={`The parts of ${d.short.toLowerCase()} we do most often. Mix and match.`} />
          <ol className={s.capRows}>
            {d.capabilities.map((c, k) => (
              <li key={c}>
                <span className={s.stepNum}>{String(k + 1).padStart(2, "0")}</span>
                <span className={s.capName}>{c}</span>
              </li>
            ))}
          </ol>
          <p className={s.capStack}>
            <span>Usually with</span> {d.stack.join(" · ")}
          </p>
        </section>

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="how-title">
          <SecHead id="how-title" title="How it goes." note="Weekly loops. Working software from week two." />
          <ol className={s.loop}>
            {process.map((p, k) => (
              <li key={p.title}>
                <span className={s.loopNum}>{String(k + 1).padStart(2, "0")}</span>
                <span className={s.loopTitle}>
                  <Stop>{`${p.title}.`}</Stop>
                </span>
                <span className={s.loopBody}>{p.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.process} aria-labelledby="proof-title">
          <SecHead id="proof-title" title="Proof." note={related.length ? "Published projects where this craft did the heavy lifting." : undefined} />
          {related.length ? (
            <ul className={s.relatedGrid}>
              {related.map((w) => (
                <li key={w.slug}>
                  <WorkGridItem work={w} index={works.indexOf(w)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.emptyNote}>
              No published case study for {d.short.toLowerCase()} yet — the work so far is under NDA. Ask us, and we will walk you
              through it on a call.
            </p>
          )}
        </section>

        {faq.length > 0 && (
          <section className={s.process} aria-labelledby="qs-title">
            <SecHead id="qs-title" title="Asked." />
            <div className={s.faqList}>
              {faq.map((f) => (
                <details key={f.q} className={s.faqItem}>
                  <summary>
                    <span>{f.q}</span>
                    <span aria-hidden="true" className={s.faqMark} />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className={s.ctaBand}>
          <p>Need this? Pick how to start.</p>
          <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/v8/engagements" className={s.pillGhost}>
              Engagements
            </Link>
            <Link href="/v8/start" className={s.pillAccent}>
              Start a project →
            </Link>
          </span>
        </div>

        <Link href={`/v8/services/${next.id}`} className={s.next}>
          <span className={s.kicker}>
            <Stop>Next.</Stop>
          </span>
          <span className={s.nextTitle}>
            {next.title} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </main>
      <Footer signoff="Your move." />
    </>
  );
}
