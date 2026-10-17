import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberBySlug, posts, team } from "@/redesign/content";
import { Footer, Portrait, SecHead, Stop } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v8/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  return { title: m ? m.name : "Team" };
}

export default async function V8Member({ params }: PageProps<"/v8/team/[slug]">) {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const i = team.indexOf(m);
  const next = team[(i + 1) % team.length];
  const written = posts.filter((p) => p.author === m.slug);
  const socials = m.socials.filter((x) => x.href && x.href !== "#");

  return (
    <>
      <main id="main">
        <section className={s.member}>
          <div className={s.memberText}>
            <nav aria-label="Breadcrumb" className={s.coverCrumbs}>
              <Link href="/v8/about">About</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Team</span>
            </nav>
            {/* Huge's staff pages are just a first name and a full stop. */}
            <h1 className={s.coverTitle}>
              <Stop>{`${m.name.split(" ")[0]}.`}</Stop>
            </h1>
            <p className={s.memberRole}>
              {m.name} — {m.role}
            </p>
            <div className={s.memberBio}>
              {m.bio.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
            {socials.length > 0 && (
              <p className={s.memberLinks}>
                {socials.map((x) => (
                  <a key={x.label} href={x.href} className={s.pillSolidWide}>
                    {x.label} ↗
                  </a>
                ))}
              </p>
            )}
          </div>
          <div className={s.memberArt}>
            <Portrait slug={m.slug} name={m.name} label />
            <small>Generated artwork, not a photo.</small>
          </div>
        </section>

        <section className={s.process} aria-labelledby="skills-title">
          <SecHead id="skills-title" title="Good at." />
          <ul className={s.skills}>
            {m.skills.map((k) => (
              <li key={k.label}>
                <span>{k.label}</span>
                <span className={s.skillBar} style={{ ["--v" as string]: `${k.value}%` }} aria-hidden="true" />
                <span className={s.skillVal}>{k.value}</span>
              </li>
            ))}
          </ul>
        </section>

        {written.length > 0 && (
          <section className={s.process} aria-labelledby="wrote-title">
            <SecHead id="wrote-title" title="Wrote." />
            <ul className={s.postList}>
              {written.map((p) => (
                <li key={p.slug}>
                  <Link href={`/v8/insights/${p.slug}`} className={s.postRow}>
                    <span className={s.postCat}>{p.category}</span>
                    <span className={s.postTitle}>{p.title}</span>
                    <span className={s.postMeta}>{p.readingMinutes} min</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link href={`/v8/team/${next.slug}`} className={s.next}>
          <span className={s.kicker}>
            <Stop>Next.</Stop>
          </span>
          <span className={s.nextTitle}>
            {next.name} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </main>
      <Footer signoff="Cheers." />
    </>
  );
}
