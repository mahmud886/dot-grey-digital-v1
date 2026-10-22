import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getMemberBySlug, posts, team } from "@/redesign/content";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v9/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getMemberBySlug(slug)?.name ?? "Team" };
}

export default async function V9Member({ params }: PageProps<"/v9/team/[slug]">) {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const i = team.indexOf(m);
  const next = team[(i + 1) % team.length];
  const written = posts.filter((p) => p.author === m.slug);
  const socials = m.socials.filter((x) => x.href && x.href !== "#");

  return (
    <main>
      <PageHead crumb={{ href: "/v9/about", label: "About" }} meta={`(${String(i + 1).padStart(2, "0")}) ${m.role}`} title={m.name} />

      <section className={s.sectionTight}>
        <div className={`${s.wrap} ${s.memberGrid}`}>
          <div className={s.personArt}>
            <ProjectArt slug={`person-${m.slug}`} label={m.name} variant="rings" ink="#f7f7f5" paper="#0b0b0b" ratio={4 / 5} title={`Generated artwork for ${m.name}`} />
            <span className={s.monogram} aria-hidden="true">
              {m.name
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </span>
          </div>
          <div className={s.memberText}>
            {m.bio.map((b) => (
              <p key={b} className={s.colText}>
                {b}
              </p>
            ))}
            <ul className={s.skills}>
              {m.skills.map((k) => (
                <li key={k.label}>
                  <span className={s.skillHead}>
                    <span>{k.label}</span>
                    <span>{k.value}</span>
                  </span>
                  <span className={s.skillBar} aria-hidden="true">
                    <i style={{ width: `${k.value}%` }} />
                  </span>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <p className={s.label}>
                {socials.map((x) => (
                  <a key={x.label} href={x.href}>
                    {x.label} <G name="arrow" />{" "}
                  </a>
                ))}
              </p>
            )}
            <p className={s.label}>Portrait is generated artwork.</p>
          </div>
        </div>
      </section>

      {written.length > 0 && (
        <section className={s.section}>
          <div className={s.wrap}>
            <SectionHead n="02" title="Writing" aside={`${written.length} essays`} />
            <ul className={s.table}>
              {written.map((p) => (
                <li key={p.slug}>
                  <Link href={`/v9/insights/${p.slug}`} className={s.tRow}>
                    <span className={s.tKey}>
                      <G name="arrow" />
                    </span>
                    <span className={s.tName}>{p.title}</span>
                    <span className={s.tVal}>{formatPostDate(p.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Link href={`/v9/team/${next.slug}`} className={s.next}>
        <span className={s.label}>Next person</span>
        <span className={s.nextTitle}>
          <G name="arrow" /> {next.name}
        </span>
      </Link>
    </main>
  );
}
