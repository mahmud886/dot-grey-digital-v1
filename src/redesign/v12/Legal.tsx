import Link from "next/link";
import type { LegalPage } from "@/data/legal";
import { Em } from "./Chrome";
import s from "./v12.module.css";

/** Privacy and terms share one calm, readable layout. */
export function Legal({ page }: { page: LegalPage }) {
  const [first, ...rest] = page.title.split(" ");
  return (
    <main>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <p className={s.kicker}>Updated {page.updated}</p>
        <h1 className={s.pageTitle}>
          {first} <Em>{rest.join(" ")}</Em>
        </h1>
        {page.notice && (
          <p className={s.notice} role="note">
            {page.notice}
          </p>
        )}
      </section>
      <section className={`${s.wrap} ${s.legal}`}>
        <nav aria-label="On this page" className={s.toc}>
          <p className={s.label}>On this page</p>
          <ol>
            {page.blocks.map((b, i) => (
              <li key={b.heading}>
                <a href={`#s${i + 1}`}>{b.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.articleBody}>
          {page.blocks.map((b, i) => (
            <section key={b.heading} id={`s${i + 1}`}>
              <h2>{b.heading}</h2>
              {b.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {b.bullets.length > 0 && (
                <ul>
                  {b.bullets.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className={s.note}>
            Questions about this page? <Link href="/v12/contact">Contact us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
