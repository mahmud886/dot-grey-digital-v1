import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, posts, team } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v10/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getMemberBySlug(slug)?.name ?? "Team" };
}

export default async function V10Member({ params }: PageProps<"/v10/team/[slug]">) {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const i = team.findIndex((x) => x.slug === m.slug);
  const next = team[(i + 1) % team.length];
  const written = posts.filter((p) => p.author === m.slug);
  const initials = m.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

  return (
    <Page>
      <PageHero kicker={`Crew ${String(i + 1).padStart(2, "0")} / ${String(team.length).padStart(2, "0")} · ${m.role}`} title={m.name.split(" ")[0]} form="hero" lede={m.name} />

      <section className={`${s.block} ${s.twoCol}`} aria-label="Profile">
        <figure className={s.portrait}>
          <ProjectArt slug={m.slug} label={initials} variant="matrix" ratio={1} ink="var(--fg)" paper="var(--bg)" title={`${m.name} — generated monogram`} />
          <figcaption className={s.cardMeta}>Generated monogram · not a photograph</figcaption>
        </figure>
        <div>
          <div className={s.readSm}>
            {m.bio.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
          <p className={s.label} style={{ marginTop: "2.4rem" }}>
            Levels
          </p>
          <ul className={s.meters}>
            {m.skills.map((sk) => (
              <li key={sk.label}>
                <span>{sk.label}</span>
                <span className={s.meter} style={{ "--v": sk.value / 100 } as CSSProperties} aria-hidden="true" />
                <span className={s.meterVal}>{sk.value}</span>
              </li>
            ))}
          </ul>
          {written.length > 0 && (
            <>
              <p className={s.label} style={{ marginTop: "2.4rem" }}>
                Writing
              </p>
              <ul className={s.list}>
                {written.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/v10/insights/${p.slug}`} className={s.inlineLink}>
                      {p.title}
                    </Link>{" "}
                    <span className={s.cardMeta}>· {formatPostDate(p.date)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className={s.block}>
        <div className={s.ctaBand}>
          <p className={s.kicker}>Next crew member</p>
          <Link href={`/v10/team/${next.slug}`} className={s.nextLink}>
            {next.name} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/about" className={s.ghostBtn}>
            Back to about
          </Link>
        </div>
      </section>
    </Page>
  );
}
