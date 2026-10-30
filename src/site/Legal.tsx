import Link from "next/link";
import type { LegalPage } from "@/data/legal";
import { PageHead } from "./Bits";
import { Em } from "./Chrome";
import s from "./pages.module.css";

/** Privacy and terms share one calm, readable layout. */
export function Legal({ page }: { page: LegalPage }) {
  const [first, ...rest] = page.title.split(" ");
  return (
    <main className={s.pg}>
      <PageHead
        label={`Updated ${page.updated}`}
        head="Fine print."
        title={
          <>
            {first} <Em>{rest.join(" ")}</Em>
          </>
        }
      />
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
            Questions about this page? <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
