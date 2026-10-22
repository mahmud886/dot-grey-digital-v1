import Link from "next/link";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

export default function V10NotFound() {
  return (
    <Page>
      <PageHero kicker="Error 404 · no route" title="Signal lost" form="dust" side="center" lede="This page isn't in the engine. It may have moved, or the link was mistyped.">
        <p className={s.heroLinks}>
          <Link href="/v10" className={s.cta}>
            Back to the world <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v10/work" className={s.ghostBtn}>
            See the work
          </Link>
        </p>
      </PageHero>
    </Page>
  );
}
