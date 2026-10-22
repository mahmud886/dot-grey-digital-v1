import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, getWorkBySlug, process } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Crumb, Dot, SectionHead } from "@/redesign/v11/Chrome";
import { Accordion } from "@/redesign/v11/Client";
import { CRAFT_ART, CRAFT_FAQ, RELATED } from "@/redesign/v11/related";
import s from "@/redesign/v11/v11.module.css";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/v11/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: disciplines.find((d) => d.id === id)?.title ?? "Service" };
}

export default async function V11Service({ params }: PageProps<"/v11/services/[id]">) {
  const { id } = await params;
  const i = disciplines.findIndex((d) => d.id === id);
  if (i < 0) notFound();
  const d = disciplines[i];
  const next = disciplines[(i + 1) % disciplines.length];
  const related = (RELATED[d.id] ?? []).map((slug) => getWorkBySlug(slug)).filter((w) => !!w);

  return (
    <main>
      <section className={s.cover} aria-labelledby="svc-title">
        <ProjectArt slug={`v11-${d.id}`} label={d.short} variant={CRAFT_ART[d.id]} ink="var(--art-d-ink)" paper="var(--black)" ratio={1.6} className={s.coverArt} />
        <div className={s.coverText}>
          <Crumb href="/v11/services">All services</Crumb>
          <p className={s.label}>
            Service {d.number} <span aria-hidden="true">●</span> {d.short}
          </p>
          <h1 id="svc-title" className={s.coverTitle}>
            {d.title}
          </h1>
        </div>
      </section>

      <section className={s.caseIntro}>
        <p className={s.mission}>
          {d.line} <Dot />
        </p>
        <ul className={s.tags}>
          {d.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className={s.section} aria-labelledby="caps">
        <SectionHead title="What's included" count={d.capabilities.length} id="caps" />
        <ol className={s.capList}>
          {d.capabilities.map((c, k) => (
            <li key={c}>
              <span className={s.rowNum}>{String(k + 1).padStart(2, "0")}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.dark} aria-labelledby="svc-how">
        <p className={s.label}>(02) How it runs</p>
        <h2 id="svc-how" className={s.darkTitle}>
          Five steps. <Dot /> Every week.
        </h2>
        <ol className={s.steps}>
          {process.map((p, k) => (
            <li key={p.title}>
              <span className={s.stepNum}>{String(k + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section} aria-labelledby="svc-work">
        <SectionHead title="Related work" count={related.length} id="svc-work" />
        {related.length ? (
          <ol className={s.workGrid}>
            {related.map((w, k) => (
              <li key={w.slug}>
                <Link href={`/v11/work/${w.slug}`} className={s.workCard}>
                  <span className={s.workArt}>
                    <ProjectArt
                      slug={w.slug}
                      label={w.client}
                      variant={k % 2 ? "halftone" : "poster"}
                      ink={k % 2 ? "var(--art-l-ink)" : "var(--art-d-ink)"}
                      paper={k % 2 ? "var(--art-l-paper)" : "var(--art-d-paper)"}
                      ratio={0.78}
                    />
                  </span>
                  <span className={s.fourMeta}>
                    <span className={s.fourNum}>{String(k + 1).padStart(2, "0")}</span>
                    <span className={s.fourTitle}>{w.title}</span>
                    <span className={s.fourCat}>
                      {w.category} ● {w.year}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className={s.lede}>
            No published case study for {d.short.toLowerCase()} yet — that work is under NDA. Ask us and we will walk you through it on a call.
          </p>
        )}
      </section>

      <section className={s.section} aria-labelledby="svc-faq">
        <SectionHead title="Questions" count={CRAFT_FAQ[d.id]?.length ?? 0} id="svc-faq" />
        <Accordion items={(CRAFT_FAQ[d.id] ?? []).map((f, k) => ({ id: `${d.id}-${k}`, title: f.q, body: <p className={s.bodyLg}>{f.a}</p> }))} />
      </section>

      <Link href={`/v11/services/${next.id}`} className={`${s.cover} ${s.nextCover}`} aria-label={`Next service: ${next.title}`}>
        <ProjectArt slug={`v11-${next.id}`} label={next.short} variant={CRAFT_ART[next.id]} ink="var(--art-d-ink)" paper="var(--black)" ratio={1.6} className={s.coverArt} />
        <span className={s.coverText}>
          <span className={s.label}>
            Next service <span aria-hidden="true">●</span> {next.number}
          </span>
          <span className={s.coverTitle}>{next.title}</span>
          <span className={s.nextCta}>
            View service <span aria-hidden="true">→</span>
          </span>
        </span>
      </Link>
    </main>
  );
}
