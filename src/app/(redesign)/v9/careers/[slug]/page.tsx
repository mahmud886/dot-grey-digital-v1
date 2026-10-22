import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/redesign/content";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v9/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getJobBySlug(slug)?.title ?? "Role" };
}

export default async function V9Job({ params }: PageProps<"/v9/careers/[slug]">) {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  if (!j) notFound();
  const apply = `mailto:${site.email}?subject=${encodeURIComponent(`Application — ${j.title}`)}`;
  const lists = [
    ["What you'll do", j.responsibilities],
    ["What you'll bring", j.requirements],
    ["Nice to have", j.niceToHave],
  ] as const;

  return (
    <main>
      <PageHead crumb={{ href: "/v9/careers", label: "Careers" }} meta={`${j.department} ◇ ${j.location} ◇ ${j.type}`} title={j.title} lede={j.summary}>
        <a href={apply} className={s.cta}>
          Apply by email <G name="arrow" />
        </a>
      </PageHead>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.table}`}>
          {lists.map(([h, items]) => (
            <div key={h} className={s.tGroup}>
              <h2 className={s.tHead}>{h}</h2>
              <ul>
                {items.map((x, i) => (
                  <li key={x} className={`${s.tRow} ${s.tRowSimple}`}>
                    <span className={s.tKey}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.tVal}>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.applyBlock}`}>
          <p className={s.manifesto}>
            Send a short note <G name="slash" /> and the work you are proudest of <G name="arrow" />
          </p>
          <a href={apply} className={s.cta}>
            {site.email} <G name="arrow" />
          </a>
          <Link href="/v9/careers" className={s.asideLink}>
            All roles
          </Link>
        </div>
      </section>
    </main>
  );
}
