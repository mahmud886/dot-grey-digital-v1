import Link from "next/link";
import { Em, Footer, Stop } from "@/redesign/v13/Chrome";
import s from "@/redesign/v13/v13.module.css";

export default function V13NotFound() {
  return (
    <>
      <main id="main" className={`${s.wrap} ${s.lost}`}>
        <p className={s.label}>404</p>
        <h1 className={s.lostTitle}>
          <Stop>Lost.</Stop>
        </h1>
        <p className={s.lostLead}>
          This page isn&apos;t here. It may have moved, or the link was <Em>mistyped.</Em>
        </p>
        <div className={s.ctas}>
          <Link href="/v13" className={s.pillInk}>
            Back to the start <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/v13#work" className={s.pill}>
            See the work
          </Link>
        </div>
      </main>
      <Footer signoff="Oops." />
    </>
  );
}
