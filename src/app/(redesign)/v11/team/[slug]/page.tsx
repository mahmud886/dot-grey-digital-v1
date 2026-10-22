import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, posts, team } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Crumb, SectionHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v11/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getMemberBySlug(slug)?.name ?? "Team" };
}

export default async function V11Member({ params }: PageProps<"/v11/team/[slug]">) {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const i = team.findIndex((x) => x.slug === slug);
  const next = team[(i + 1) % team.length];
  const written = posts.filter((p) => p.author === m.slug);

  return (
    <main>
      <section className={s.member}>
        <div className={s.memberText}>
          <Crumb href="/v11/about">The team</Crumb>
          <p className={s.label}>{m.role}</p>
          <h1 className={s.pageTitle}>{m.name}</h1>
          {m.bio.map((b) => (
            <p key={b} className={s.bodyLg}>
              {b}
            </p>
          ))}
        </div>
        <div className={s.memberArt}>
          <ProjectArt slug={`person-${m.slug}`} variant="rings" ink="var(--art-d-ink)" paper="var(--art-d-paper)" ratio={0.8} />
          <span className={s.artNote}>Generated portrait</span>
        </div>
      </section>

      <section className={s.section} aria-labelledby="skills">
        <SectionHead title="Strengths" count={m.skills.length} id="skills" />
        <ul className={s.skills}>
          {m.skills.map((k) => (
            <li key={k.label}>
              <span>{k.label}</span>
              <span className={s.skillBar} aria-hidden="true">
                <span style={{ transform: `scaleX(${k.value / 100})` }} />
              </span>
              <span className={s.skillVal}>{k.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {written.length > 0 && (
        <section className={s.section} aria-labelledby="written">
          <SectionHead title="Writing" count={written.length} id="written" />
          <ol className={s.news}>
            {written.map((p) => (
              <li key={p.slug}>
                <Link href={`/v11/insights/${p.slug}`} className={s.newsRow}>
                  <span className={s.newsTitle}>{p.title}</span>
                  <span className={s.newsMeta}>
                    {p.category} ● {formatPostDate(p.date)}
                  </span>
                  <span className={s.rowArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className={s.section}>
        <Link href={`/v11/team/${next.slug}`} className={s.nextRow}>
          <span className={s.label}>Next person</span>
          <span className={s.nextName}>
            {next.name} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>
    </main>
  );
}
