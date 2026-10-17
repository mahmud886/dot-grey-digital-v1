import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextWork, getWorkBySlug, works } from "@/redesign/content";
import { Footer, StatusBar, Window } from "@/redesign/v5/Chrome";
import s from "@/redesign/v5/v5.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/v5/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return { title: w ? w.title : "Case" };
}

export default async function V5Case({ params }: PageProps<"/v5/work/[slug]">) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();
  const next = getNextWork(slug);

  return (
    <>
      <StatusBar />
      <main className={s.wrap}>
        <Window title={`cat ~/work/${w.slug}.md`}>
          <article className={s.md}>
            <div className={s.dim}>
              ---
              <br />
              client: {w.client}
              <br />
              year: {w.year}
              <br />
              category: {w.category}
              <br />
              duration: {w.duration} · team: {w.team}
              <br />
              ---
            </div>
            <h1>
              <span className={s.dim}># </span>
              {w.title}
            </h1>
            <p style={{ fontSize: "1.1rem" }}>{w.summary}</p>

            <figure className={s.frame}>
              <Image src={w.cover} alt={`${w.title} cover`} width={1600} height={1000} priority />
              <figcaption>![cover]({w.cover})</figcaption>
            </figure>

            <h2>Problem</h2>
            <p>{w.challenge}</p>
            <h2>Solution</h2>
            <p>{w.solution}</p>

            <h2>Steps</h2>
            <ol>
              {w.approach.map((a, i) => (
                <li key={a.title} style={{ marginBottom: "1rem" }}>
                  <span className={s.amber}>{i + 1}.</span> <span className={s.g}>{a.title}</span> — {a.body}
                </li>
              ))}
            </ol>

            <h2>Results</h2>
            <div style={{ overflowX: "auto" }}>
              <table className={s.mdTable}>
                <thead>
                  <tr>
                    <th>metric</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {w.stats.map((st) => (
                    <tr key={st.label}>
                      <td>{st.label}</td>
                      <td>
                        <b>{st.value}</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "1rem" }}>{w.outcome}</p>

            <h2>Quote</h2>
            <blockquote style={{ borderLeft: "2px solid var(--amber)", paddingLeft: "1rem" }}>
              &gt; {w.quote.text}
              <br />
              <span className={s.dim}>
                — {w.quote.author}, {w.quote.role}
              </span>
            </blockquote>

            <h2>Stack</h2>
            <p>
              <span className={s.dim}>tools:</span> {w.tools.join(", ")}
              <br />
              <span className={s.dim}>deliverables:</span> {w.deliverables.join("; ")}
            </p>

            {w.gallery.map((g, i) => (
              <figure key={g} className={s.frame}>
                <Image src={g} alt={`${w.title} — detail ${i + 1}`} width={1600} height={1000} />
                <figcaption>![detail-{i + 1}]({g})</figcaption>
              </figure>
            ))}
          </article>
        </Window>
        <Link href={`/v5/work/${next.slug}`} className={s.btn} style={{ marginBottom: "2rem" }}>
          $ cd ../{next.slug} ▸
        </Link>
      </main>
      <Footer />
    </>
  );
}
