import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/redesign/content";
import { Crumb, Dot } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v11/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getJobBySlug(slug)?.title ?? "Role" };
}

export default async function V11Job({ params }: PageProps<"/v11/careers/[slug]">) {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  if (!j) notFound();
  const apply = `mailto:${site.email}?subject=${encodeURIComponent(`Application — ${j.title}`)}`;
  const lists: [string, string[]][] = [
    ["What you'll do", j.responsibilities],
    ["What you'll bring", j.requirements],
    ["Nice to have", j.niceToHave],
  ];
  return (
    <main>
      <section className={s.pageHead}>
        <Crumb href="/v11/careers">All roles</Crumb>
        <p className={s.label}>
          {j.department} ● {j.location} ● {j.type}
        </p>
        <h1 className={s.pageTitle}>
          {j.title} <Dot />
        </h1>
        <div className={s.pageHeadFoot}>
          <p className={s.lede}>{j.summary}</p>
          <a href={apply} className={s.btn}>
            Apply by email <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className={`${s.sectionTight} ${s.jobLists}`}>
        {lists.map(([title, items], i) => (
          <div key={title}>
            <p className={s.label}>
              ({String(i + 1).padStart(2, "0")}) {title}
            </p>
            <ul className={s.plainList}>
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={s.dark}>
        <p className={s.label}>(04) How to apply</p>
        <h2 className={s.darkTitle}>
          Send work, <Dot /> not a cover letter.
        </h2>
        <p className={s.bodyLg}>A link to things you shipped and two lines on what you did. We reply to every application within a week.</p>
        <p style={{ marginTop: "2rem" }}>
          <a href={apply} className={s.btnOnChapter}>
            Apply by email <span aria-hidden="true">→</span>
          </a>
        </p>
      </section>
    </main>
  );
}
