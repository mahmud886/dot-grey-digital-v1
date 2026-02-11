export default function FAQ() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Have questions?</h2>
      <p className="mt-2 text-white">Answers to the most common questions.</p>
      <div className="mt-6 space-y-3">
        <details className="group rounded-2xl border border-slate-100 p-5">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            What’s your typical turnaround time?
            <span className="ml-4 text-brand-orange group-open:rotate-180 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 text-sm text-white">
            Most first deliveries land within 48–72 hours depending on scope. Larger projects are planned in milestones.
          </p>
        </details>
        <details className="group rounded-2xl border border-slate-100 p-5">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            Do you provide source files and handoff?
            <span className="ml-4 text-brand-orange group-open:rotate-180 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 text-sm text-white">
            Yes—Figma files, component notes, and developer-ready specs. For email templates, we provide the coded files.
          </p>
        </details>
        <details className="group rounded-2xl border border-slate-100 p-5">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            Can you work with our existing design system?
            <span className="ml-4 text-brand-orange group-open:rotate-180 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 text-sm text-white">
            Absolutely. We can extend your system, improve consistency, and ship production-friendly components.
          </p>
        </details>
      </div>
    </div>
  );
}
