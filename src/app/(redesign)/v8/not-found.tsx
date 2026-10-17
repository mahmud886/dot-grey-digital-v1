import Link from "next/link";
import { Footer, PageCover } from "@/redesign/v8/Chrome";
import s from "@/redesign/v8/v8.module.css";

export default function V8NotFound() {
  return (
    <>
      <main id="main">
        <PageCover kicker="404" title="Lost." lead="This page isn't here. It may have moved, or the link was mistyped." />
        <div className={s.lostLinks}>
          <Link href="/v8" className={s.pillSolidWide}>
            Back to the start →
          </Link>
          <Link href="/v8/work" className={s.pillSolidWide}>
            See the work
          </Link>
        </div>
      </main>
      <Footer signoff="Oops." />
    </>
  );
}
