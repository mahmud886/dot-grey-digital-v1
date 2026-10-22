import Link from "next/link";
import { PageHead } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

export default function V11NotFound() {
  return (
    <main>
      <PageHead label="404" title="Wrong turn. ● Right studio." lede="This page isn't here. It may have moved, or the link was mistyped.">
        <div className={s.lostLinks}>
          <Link href="/v11" className={s.btn}>
            Back to the start <span aria-hidden="true">→</span>
          </Link>
          <Link href="/v11/work" className={s.arrowLink}>
            See the work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </PageHead>
    </main>
  );
}
