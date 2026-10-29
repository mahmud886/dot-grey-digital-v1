import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import Link from "next/link";
import { faqCategories, faqs } from "@/site/content";
import { Em, Footer } from "@/site/Chrome";
import { PageHead } from "@/site/Bits";
import { FaqTabs } from "@/site/Pages";
import s from "@/site/pages.module.css";

export const metadata: Metadata = pageMeta({ title: "FAQ", description: "Answers about how DotGrey works, pricing, AI and data, and support after launch.", path: "/faq" });

export default function FaqPage() {
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
          <Link href="/contact" className={s.pillInk}>
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
      <Footer signoff="Ask away." />
    </>
  );
}
