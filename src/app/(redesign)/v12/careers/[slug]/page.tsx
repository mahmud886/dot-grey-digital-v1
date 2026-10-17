import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/redesign/content";
import { Em } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v12/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  return { title: j ? j.title : "Role" };
}

export default async function V12Job({ params }: PageProps<"/v12/careers/[slug]">) {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  if (!j) notFound();
  const words = j.title.split(" ");
  const tail = words.pop();
  const apply = `mailto:${site.email}?subject=${encodeURIComponent(`Application — ${j.title}`)}`;

  return (
    <main>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <p className={s.kicker}>
          <Link href="/v12/careers">Careers</Link> — {j.department}
        </p>
        <h1 className={s.pageTitle}>
          {words.join(" ")} <Em>{tail}</Em>
        </h1>
        <p className={s.pageLead}>{j.summary}</p>
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
      </section>
      <section className={`${s.wrap} ${s.section} ${s.jobBody}`}>
        {[
          ["What you'll do", j.responsibilities],
          ["What you'll bring", j.requirements],
          ["Nice to have", j.niceToHave],
        ].map(([title, items]) => (
          <div key={title as string}>
            <h2 className={s.label}>{title as string}</h2>
            <ul className={s.bigList}>
              {(items as string[]).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className={`${s.wrap} ${s.contact}`}>
        <h2 className={s.ctaSmall}>
          Sound like you? <Em>Say hello.</Em>
        </h2>
        <div className={s.ctas}>
          <a href={apply} className={s.pillInk}>
            Apply by email <span aria-hidden="true">↗</span>
          </a>
          <span className={s.note}>A few lines about you and a link to work you are proud of is plenty.</span>
        </div>
      </section>
    </main>
  );
}
