import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, process, site, works } from "@/redesign/content";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { Page, PageHero, SecHead } from "@/redesign/v10/Chrome";
import { Ask } from "@/redesign/v10/Client";
import type { FormationId } from "@/redesign/v10/formations";
import { CRAFT_FAQ, RELATED } from "@/redesign/v10/related";
import s from "@/redesign/v10/v10.module.css";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/v10/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: disciplines.find((d) => d.id === id)?.title ?? "Service" };
}

export default async function V10Service({ params }: PageProps<"/v10/services/[id]">) {
  const { id } = await params;
  const i = disciplines.findIndex((d) => d.id === id);
  if (i < 0) notFound();
  const d = disciplines[i];
  const next = disciplines[(i + 1) % disciplines.length];
  const related = (RELATED[d.id] ?? []).map((slug) => works.find((w) => w.slug === slug)).filter((w) => !!w);

  return (
    <Page>
      <PageHero kicker={`Module ${d.number} / 06 · ${d.title}`} title={d.short} form={d.id as FormationId} lede={d.line}>
        <ul className={s.caps}>
          {d.capabilities.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </PageHero>

      <section className={`${s.block} ${s.twoCol}`} aria-label="Capabilities and stack">
        <div>
          <p className={s.label}>Capabilities</p>
          <ol className={s.list}>
            {d.capabilities.map((c, n) => (
              <li key={c}>
                <span className={s.rowNum}>{String(n + 1).padStart(2, "0")}</span> {c}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className={s.label}>Stack</p>
          <ul className={s.list}>
            {d.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className={s.label} style={{ marginTop: "2.4rem" }}>
            Not sure it&apos;s this one?
          </p>
          <Ask disciplines={disciplines} email={site.email} jump={false} />
        </div>
      </section>

      <section className={s.block} aria-labelledby="how-h">
        <SecHead id="how-h" title="Runtime" note={`How a ${d.short.toLowerCase()} engagement runs, week by week.`} />
        <ol className={s.pipeline}>
          {process.map((p, n) => (
            <li key={p.title}>
              <span className={s.rowNum}>{String(n + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.block} aria-labelledby="rel-h">
        <SecHead id="rel-h" title="Proof" note="Published projects where this craft did the heavy lifting." />
        {related.length ? (
          <ul className={s.cards}>
            {related.map((w) => (
              <li key={w.slug}>
                <Link href={`/v10/work/${w.slug}`} className={s.card}>
                  <ProjectMockup slug={w.slug} ratio={1.6} ink="var(--fg)" paper="var(--bg)" />
                  <span className={s.cardMeta}>
                    {w.category} · {w.year}
                  </span>
                  <span className={s.cardTitle}>{w.title}</span>
                  <span className={s.cardStat}>
                    <b>{w.stats[0].value}</b> {w.stats[0].label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.empty}>
            No {d.short.toLowerCase()} case study is published yet — the work exists, the write-ups don&apos;t. Ask us for a walkthrough.
          </p>
        )}
      </section>

      <section className={s.block} aria-labelledby="q-h">
        <SecHead id="q-h" title="Queries" />
        <div className={s.faq}>
          {(CRAFT_FAQ[d.id] ?? []).map((f, n) => (
            <details key={f.q} className={s.qa}>
              <summary>
                <span className={s.rowNum}>{String(n + 1).padStart(2, "0")}</span>
                <span>{f.q}</span>
                <span className={s.qaMark} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={s.block}>
        <div className={s.ctaBand}>
          <p className={s.kicker}>Next module · {next.number}</p>
          <Link href={`/v10/services/${next.id}`} className={s.nextLink}>
            {next.short} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/start" className={s.cta}>
            Start a {d.short.toLowerCase()} project <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className={s.xCross}>
          Not sure how to start? See the <Link href="/v10/engagements">engagement modes</Link> or <Link href="/v10/process">how a project runs</Link>.
        </p>
      </section>
    </Page>
  );
}
