import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/redesign/content";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v10/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getJobBySlug(slug)?.title ?? "Role" };
}

export default async function V10Job({ params }: PageProps<"/v10/careers/[slug]">) {
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
    <Page>
      <PageHero kicker={`Process · ${j.department}`} title={j.title} long form="development" lede={j.summary}>
        <dl className={s.meta}>
          {[
            ["Team", j.department],
            ["Where", j.location],
            ["Type", j.type],
            ["Apply", "By email"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className={s.heroLinks}>
          <a href={apply} className={s.cta}>
            Apply by email <span aria-hidden="true">→</span>
          </a>
        </p>
      </PageHero>
      <section className={`${s.block} ${s.threeCol}`} aria-label="Role details">
        {lists.map(([h, items]) => (
          <div key={h}>
            <p className={s.label}>{h}</p>
            <ul className={s.list}>
              {items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className={s.block}>
        <div className={s.ctaBand}>
          <p className={s.kicker}>Send a short note, a CV or a link to work you&apos;re proud of</p>
          <a href={apply} className={s.nextLink}>
            Apply <span aria-hidden="true">↗</span>
          </a>
          <Link href="/v10/careers" className={s.ghostBtn}>
            All roles
          </Link>
        </div>
      </section>
    </Page>
  );
}
