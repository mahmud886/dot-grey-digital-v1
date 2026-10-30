import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/site/content";
import { Em, Footer, Stop } from "@/site/Chrome";
import { ApplyForm } from "@/site/More";
import s13 from "@/site/site.module.css";
import s from "@/site/pages.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  return j ? pageMeta({ title: j.title, description: j.summary, path: `/careers/${slug}` }) : { title: "Role" };
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  if (!j) notFound();

  return (
    <>
    <main className={s.pg}>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <p className={s.kicker}>
          <Link href="/careers">Careers</Link> — {j.department}
        </p>
        <h1 className={s13.pageHeadline} data-size="m">
          <Stop>{`${j.title}.`}</Stop>
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
        <p className={s.note}>A few lines about you and a link to work you are proud of is plenty.</p>
        <ApplyForm email={site.email} role={j.title} />
      </section>
    </main>
      <Footer signoff="Good luck." />
    </>
  );
}
