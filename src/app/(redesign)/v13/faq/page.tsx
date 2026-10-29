import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/redesign/content";
import { Em, Footer } from "@/redesign/v13/Chrome";
import { PageHead } from "@/redesign/v13/Bits";
import { FaqTabs } from "@/redesign/v13/Pages";
import s from "@/redesign/v13/pages.module.css";

export const metadata: Metadata = { title: "FAQ" };

export default function V13Faq() {
  const groups = faqCategories
    .map((c) => ({ id: c, items: faqs.filter((f) => f.category === c).map((f) => ({ q: f.question, a: f.answer })) }))
    .filter((g) => g.items.length);
  return (
    <>
    <main className={s.pg}>
      <PageHead
        head="Good questions."
        label="FAQ"
        title={
          <>
            Fair <Em>questions.</Em>
          </>
        }
        lead="The things people ask before working with us. Missing one? Ask it directly."
      />
      <section className={`${s.wrap} ${s.sectionTight}`}>
        <FaqTabs groups={groups} />
      </section>
      <section className={`${s.wrap} ${s.contact}`}>
        <h2 className={s.ctaSmall}>
          Still wondering? <Em>Ask us.</Em>
        </h2>
        <div className={s.ctas}>
          <Link href="/v13/contact" className={s.pillInk}>
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
      <Footer signoff="Ask away." />
    </>
  );
}
