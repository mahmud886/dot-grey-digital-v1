import Link from "next/link";
import { PageHead } from "@/redesign/v9/Chrome";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export default function V9NotFound() {
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta="Error 404"
        title={
          <>
            Not in <G name="asterisk" /> the index
          </>
        }
        lede="This page isn't here. It may have moved, or the link was mistyped."
      >
        <p className={s.lostLinks}>
          <Link href="/v9" className={s.cta}>
            Back to the start <G name="arrow" />
          </Link>
          <Link href="/v9/work" className={s.asideLink}>
            See the work <G name="arrow" />
          </Link>
        </p>
      </PageHead>
    </main>
  );
}
