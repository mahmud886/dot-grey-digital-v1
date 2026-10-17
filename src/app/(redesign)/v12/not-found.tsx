import Link from "next/link";
import { Em } from "@/redesign/v12/Chrome";
import s from "@/redesign/v12/v12.module.css";

export default function V12NotFound() {
  return (
    <main className={`${s.wrap} ${s.lost}`}>
      <p className={s.kicker}>404</p>
      <h1 className={s.pageTitle}>
        This shape <Em>doesn&apos;t exist.</Em>
      </h1>
      <p className={s.pageLead}>The page may have moved, or the link was mistyped.</p>
      <div className={s.ctas}>
        <Link href="/v12" className={s.pillInk}>
          Back to the start <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/v12/work" className={s.textLink}>
          See the work
        </Link>
      </div>
    </main>
  );
}
