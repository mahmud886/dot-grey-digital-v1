import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/redesign/content";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import { FaqTabs } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

export const metadata: Metadata = { title: "FAQ" };

export default function V8Faq() {
  const groups = faqCategories.map((c) => ({ id: c, items: faqs.filter((f) => f.category === c).map((f) => ({ q: f.question, a: f.answer })) })).filter((g) => g.items.length);
  return (
    <>
      <main id="main">
        <PageCover
          kicker={`FAQ · ${faqs.length} answers`}
          title="Good questions."
          lead="The things people ask before working with us."
          aside={
            <p className={s.pageAside}>
              Missing one? <Link href="/v8/contact">Ask it directly →</Link>
            </p>
          }
        />
        <section className={s.indexSec} aria-label="Questions">
          <FaqTabs groups={groups} />
        </section>
      </main>
      <Footer signoff="Ask away." />
    </>
  );
}
