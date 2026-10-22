import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { disciplines, process, works } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { ProjectMockup } from "@/redesign/shared/ProjectMockup";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { PixelReveal } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import { CRAFT_ART, CRAFT_FAQ, RELATED } from "@/redesign/v9/related";
import m from "@/redesign/v9/more.module.css";
import s from "@/redesign/v9/v9.module.css";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/v9/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: disciplines.find((d) => d.id === id)?.title ?? "Service" };
}

export default async function V9Service({ params }: PageProps<"/v9/services/[id]">) {
  const { id } = await params;
  const i = disciplines.findIndex((d) => d.id === id);
  if (i < 0) notFound();
  const d = disciplines[i];
  const next = disciplines[(i + 1) % disciplines.length];
  const related = (RELATED[d.id] ?? []).map((slug) => works.find((w) => w.slug === slug)).filter((w) => w !== undefined);

  return (
    <main>
      <PageHead crumb={{ href: "/v9/services", label: "Services" }} meta={`${d.number} / 06`} title={d.title} lede={d.line} />

      <PixelReveal className={s.caseCover}>
        <ProjectArt slug={`craft-${d.id}`} label={d.short} variant={CRAFT_ART[d.id]} ink="#f7f7f5" paper="#0b0b0b" ratio={21 / 9} title={`${d.short} — artwork`} />
      </PixelReveal>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.table}`}>
          <div className={s.tGroup}>
            <h2 className={s.tHead}>Capabilities</h2>
            <ul>
              {d.capabilities.map((c, k) => (
                <li key={c} className={`${s.tRow} ${s.tRowSimple}`}>
                  <span className={s.tKey}>{String(k + 1).padStart(2, "0")}</span>
                  <span className={s.tVal}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.tGroup}>
            <h2 className={s.tHead}>Stack</h2>
            <ul>
              {d.stack.map((c) => (
                <li key={c} className={`${s.tRow} ${s.tRowSimple}`}>
                  <span className={s.tKey}>
                    <G name="plus" />
                  </span>
                  <span className={s.tVal}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.tGroup}>
            <h2 className={s.tHead}>How it runs</h2>
            <ul>
              {process.map((p, k) => (
                <li key={p.title} className={`${s.tRow} ${s.tRowSimple}`}>
                  <span className={s.tKey}>{String(k + 1).padStart(2, "0")}</span>
                  <span className={s.tVal}>
                    <b>{p.title}.</b> {p.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="02" title="Related work" aside={related.length ? `${related.length} projects` : "None published yet"} />
          {related.length ? (
            <ol className={s.miniRows}>
              {related.map((w) => (
                <li key={w.slug}>
                  <Link href={`/v9/work/${w.slug}`} className={s.miniRow}>
                    <span className={s.miniThumb}>
                      <ProjectMockup slug={w.slug} ink="#f7f7f5" paper="#0b0b0b" ratio={4 / 3} />
                    </span>
                    <span className={s.miniTitle}>{w.title}</span>
                    <span className={s.miniMeta}>
                      {w.stats[0].value} <G name="slash" /> {w.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className={s.emptyNote}>
              No {d.short.toLowerCase()} case study is published yet. Ask us for a walkthrough of recent work <G name="arrow" />{" "}
              <Link href="/v9/contact">Contact</Link>
            </p>
          )}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <SectionHead n="03" title="Questions" aside={`${(CRAFT_FAQ[d.id] ?? []).length} answers`} />
          <div className={s.faqList}>
            {(CRAFT_FAQ[d.id] ?? []).map((f) => (
              <details key={f.q} className={s.faq}>
                <summary>
                  {f.q} <G name="plus" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <nav className={m.band} aria-label="Work with us">
        <Link href="/v9/engagements" className={m.bandLink}>
          <span className={s.label}>How we would work together</span>
          <b>
            Engagements <G name="arrow" />
          </b>
          <p>Discovery, Sprint, Product team or Embedded squad — and how each is priced.</p>
        </Link>
        <Link href="/v9/start" className={m.bandLink}>
          <span className={s.label}>{d.short}, scoped for you</span>
          <b>
            Start a project <G name="arrow" />
          </b>
          <p>Six short questions; your answers open as an email to us.</p>
        </Link>
      </nav>

      <Link href={`/v9/services/${next.id}`} className={s.next}>
        <span className={s.label}>Next discipline</span>
        <span className={s.nextTitle}>
          <G name="arrow" /> {next.short}
        </span>
      </Link>
    </main>
  );
}
