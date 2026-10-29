import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberBySlug, posts, team } from "@/site/content";
import { Em, Footer, Stop } from "@/site/Chrome";
import s13 from "@/site/site.module.css";
import { Portrait } from "@/site/Bits";
import s from "@/site/pages.module.css";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  return m ? pageMeta({ title: m.name, description: `${m.name}, ${m.role} at DotGrey Digital.`, path: `/team/${slug}` }) : { title: "Team" };
}

export default async function MemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const m = getMemberBySlug(slug);
  if (!m) notFound();
  const [firstName, ...last] = m.name.split(" ");
  const writing = posts.filter((p) => p.author === m.slug);
  const links = m.socials.filter((x) => x.href && x.href !== "#");
  const i = team.indexOf(m);
  const next = team[(i + 1) % team.length];

  return (
    <>
    <main className={s.pg}>
      <section className={`${s.wrap} ${s.memberHero}`}>
        <div>
          <p className={s.kicker}>
            <Link href="/about">About</Link> — People
          </p>
          <h1 className={s13.pageHeadline}>
            <Stop>{`${firstName}.`}</Stop>
          </h1>
          <p className={s13.pageSentence}>
            {firstName} <Em>{last.join(" ")}</Em>
          </p>
          <p className={s.pageLead}>{m.role}</p>
        </div>
        <Portrait slug={m.slug} name={m.name} title={`Generated artwork standing in for ${m.name}'s portrait`} />
      </section>

      <section className={`${s.wrap} ${s.section} ${s.twoUp}`}>
        <div>
          <p className={s.label}>Bio</p>
          {m.bio.map((b) => (
            <p key={b} className={s.prose}>
              {b}
            </p>
          ))}
          {links.length > 0 && (
            <p className={s.more}>
              {links.map((l) => (
                <a key={l.label} href={l.href} className={s.textLink}>
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </div>
        <div>
          <p className={s.label}>Strengths</p>
          <ul className={s.skills}>
            {m.skills.map((k) => (
              <li key={k.label}>
                <span>{k.label}</span>
                <span className={s.skillBar} aria-hidden="true">
                  <i style={{ width: `${k.value}%` }} />
                </span>
                <span className={s.skillValue}>{k.value}</span>
              </li>
            ))}
          </ul>
          {writing.length > 0 && (
            <>
              <p className={s.label} style={{ marginTop: "3rem" }}>
                Writing
              </p>
              <ul className={s.plainList}>
                {writing.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/insights/${p.slug}`} className={s.textLink}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className={`${s.wrap} ${s.nextBlock}`}>
        <p className={s.label}>Next person</p>
        <Link href={`/team/${next.slug}`} className={s.nextCraft}>
          <span className={s.serviceNum}>{String(((i + 1) % team.length) + 1).padStart(2, "0")}</span>
          <span>{next.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
      <Footer signoff="Say hi." />
    </>
  );
}
