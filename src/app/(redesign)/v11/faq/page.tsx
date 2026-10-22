import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/redesign/content";
import { PageHead, SectionHead } from "@/redesign/v11/Chrome";
import { Filtered } from "@/redesign/v11/Client";
import s from "@/redesign/v11/v11.module.css";

export const metadata: Metadata = { title: "FAQ" };

export default function V11Faq() {
  return (
    <main>
      <PageHead label="FAQ" title="Questions. ● Answered." count={faqs.length} lede="The things people ask before working with us." />
      <section className={s.sectionTight}>
        <Filtered
          label="Filter questions by topic"
          categories={faqCategories}
          className={s.faq}
          items={faqs.map((f) => ({
            key: f.id,
            category: f.category,
            node: (
              <details className={s.faqItem}>
                <summary>
                  <span>{f.question}</span>
                  <span className={s.accSign} aria-hidden="true" />
                </summary>
                <p className={s.bodyLg}>{f.answer}</p>
              </details>
            ),
          }))}
        />
      </section>
      <section className={s.section}>
        <SectionHead title="Still curious?">
          <Link href="/v11/contact" className={s.arrowLink}>
            Ask us directly <span aria-hidden="true">→</span>
          </Link>
        </SectionHead>
      </section>
    </main>
  );
}
