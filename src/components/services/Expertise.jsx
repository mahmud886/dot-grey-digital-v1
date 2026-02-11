import Image from 'next/image';

export default function Expertise() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white">Our Expertise</h2>
          </div>
          <div>
            <p className="text-white">
              We&apos;ve worked with dozens of app businesses across industries to design digital products. Here are some industries where we excel, but our expertise extends far beyond!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 overflow-hidden rounded-3xl shadow-xl border border-white/10">
           <div className="h-64 relative group">
              <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80" alt="Business Expertise" fill className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                 <p className="text-white font-bold text-lg">Business</p>
              </div>
           </div>
           <div className="h-64 relative group bg-brand-orange">
              <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Marketing Expertise" fill className="object-cover opacity-20 mix-blend-overlay transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
              </div>
              <div className="absolute inset-0 flex items-end p-6">
                 <p className="text-white font-bold text-lg">Marketing</p>
              </div>
           </div>
           <div className="h-64 relative group">
              <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="Strategy Expertise" fill className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                 <p className="text-white font-bold text-lg">Strategy</p>
              </div>
           </div>
           <div className="h-64 relative group bg-white/10 flex items-center justify-center border-l border-white/10">
              <p className="text-5xl font-black text-white tracking-tighter">SEO</p>
           </div>
        </div>
      </div>
    </section>
  );
}
