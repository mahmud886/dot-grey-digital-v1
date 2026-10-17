import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobs, site } from "@/redesign/content";
import { Footer, SecHead, Stop } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v8/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  return { title: j ? j.title : "Role" };
}

export default async function V8Job({ params }: PageProps<"/v8/careers/[slug]">) {
  const { slug } = await params;
  const j = getJobBySlug(slug);
  if (!j) notFound();
  const apply = `mailto:${site.email}?subject=${encodeURIComponent(`Application — ${j.title}`)}`;
  const lists = [
    { id: "do", title: "What you'll do.", items: j.responsibilities },
    { id: "bring", title: "What you bring.", items: j.requirements },
    { id: "nice", title: "Nice to have.", items: j.niceToHave },
  ];

  return (
    <>
      <main id="main">
        <section className={s.cover}>
          <nav aria-label="Breadcrumb" className={s.coverCrumbs}>
            <Link href="/v8/careers">Careers</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{j.department}</span>
          </nav>
          <h1 className={s.jobTitle}>
            <Stop>{`${j.title}.`}</Stop>
          </h1>
          <div className={s.coverFoot}>
            <p className={s.coverLead}>{j.summary}</p>
            <div className={s.coverAside}>
              <dl className={s.jobFacts}>
                {[
                  ["Team", j.department],
                  ["Where", j.location],
                  ["Type", j.type],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <a href={apply} className={s.pillAccent}>
                Apply by email →
              </a>
            </div>
          </div>
        </section>

        {lists.map((l) => (
          <section key={l.id} className={s.process} aria-labelledby={`${l.id}-title`}>
            <SecHead id={`${l.id}-title`} title={l.title} />
            <ol className={s.capRows}>
              {l.items.map((x, k) => (
                <li key={x}>
                  <span className={s.stepNum}>{String(k + 1).padStart(2, "0")}</span>
                  <span className={s.capName}>{x}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className={`${s.chapterDark} ${s.process}`} aria-labelledby="apply-title">
          <SecHead id="apply-title" title="How to apply." note="Send a CV and two or three pieces of work you are proud of, with a line on what you did. We reply to everyone within a week." />
          <a href={apply} className={s.pillLight}>
            Apply by email →
          </a>
        </section>
      </main>
      <Footer signoff="Good luck." />
    </>
  );
}
