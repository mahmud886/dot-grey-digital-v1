import Link from "next/link";

/** Plain on purpose: every prototype has its own look, so the 404 stays neutral. */
export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#0a0a0a] px-6 text-center text-white" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div>
        <p className="text-sm tracking-[0.3em] text-white/50">404</p>
        <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "inherit", textTransform: "none" }}>
          This page isn&apos;t one of the twelve.
        </h1>
        <Link href="/" className="mt-8 inline-block rounded-full border border-white/30 px-6 py-3 text-sm hover:bg-white hover:text-black">
          Back to all versions
        </Link>
      </div>
    </main>
  );
}
