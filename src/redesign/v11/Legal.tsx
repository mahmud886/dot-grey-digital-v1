import type { legalPages } from "@/redesign/content";
import { PageHead } from "./Chrome";
import s from "./v11.module.css";

/** Privacy and Terms share one layout: a contents list beside numbered sections. */
export function Legal({ page, label }: { page: (typeof legalPages)["privacy"]; label: string }) {
  const id = (h: string) => h.toLowerCase().replace(/\W+/g, "-");
  return (
    <main>
      <PageHead label={label} title={page.title} lede={`Updated ${page.updated}`}>
        <p className={s.notice}>{page.notice}</p>
      </PageHead>
      <section className={`${s.sectionTight} ${s.legal}`}>
        <nav aria-label="On this page" className={s.legalNav}>
          <p className={s.label}>On this page</p>
          <ol>
            {page.blocks.map((b, i) => (
              <li key={b.heading}>
                <a href={`#${id(b.heading)}`}>
                  {String(i + 1).padStart(2, "0")} {b.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.prose}>
          {page.blocks.map((b, i) => (
            <section key={b.heading} id={id(b.heading)}>
              <h2>
                <span className={s.muted}>{String(i + 1).padStart(2, "0")}</span> {b.heading}
              </h2>
              {b.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {b.bullets.length > 0 && (
                <ul>
                  {b.bullets.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
