export default function ContactCard() {
  return (
    <div className="rounded-3xl border border-slate-100 p-6 shadow-soft">
      <h3 className="text-xl font-extrabold">Contact us</h3>
      <p className="mt-2 text-sm text-white">Tell us what you’re building. We’ll reply quickly.</p>
      <form className="mt-6 grid gap-3">
        <input className="h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-brand-orange" placeholder="Name" />
        <input className="h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-brand-orange" placeholder="Email" type="email" />
        <textarea className="min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-orange" placeholder="Project details"></textarea>
        <button type="button" className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand-orange px-5 text-sm font-semibold text-white hover:opacity-95">
          Send Message
        </button>
        <p className="text-xs text-white">By sending, you agree to be contacted about your request.</p>
      </form>
    </div>
  );
}
