import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/redesign/content";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import { FaqBrowser } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "FAQ" };

export default function V10Faq() {
  return (
    <Page>
      <PageHero kicker={`Help · ${faqs.length} answers`} title="FAQ" form="data" lede="The things people ask before working with us.">
        <p className={s.heroLinks}>
          <Link href="/v10/contact" className={s.ghostBtn}>
            Missing one? Ask directly
          </Link>
        </p>
      </PageHero>
      <section className={s.block} aria-label="Questions">
        <FaqBrowser items={faqs} categories={faqCategories} />
      </section>
    </Page>
  );
}
