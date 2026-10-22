import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "FAQ" };

export default function V9Faq() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(faqs.length).padStart(2, "0")}) answers`}
        title={
          <>
            Fair <G name="ring" /> questions
          </>
        }
        lede={
          <>
            The things people ask before working with us. Missing one? <Link href="/v9/contact">Ask it directly</Link>.
          </>
        }
      />
      {faqCategories.map((c, i) => (
        <section key={c} className={s.sectionTight}>
          <div className={s.wrap}>
            <SectionHead n={String(i + 1).padStart(2, "0")} title={c} aside={`${faqs.filter((f) => f.category === c).length} answers`} />
            <div className={s.faqList}>
              {faqs
                .filter((f) => f.category === c)
                .map((f) => (
                  <details key={f.id} className={s.faq}>
                    <summary>
                      {f.question} <G name="plus" />
                    </summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
