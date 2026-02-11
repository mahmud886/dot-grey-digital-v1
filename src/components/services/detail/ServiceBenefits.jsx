import Image from 'next/image';

export default function ServiceBenefits() {
  return (
    <section className='py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
          <div>
            <div className='relative h-96 w-full rounded-3xl overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
                alt='Benefits'
                fill
                className='object-cover'
              />
            </div>
          </div>

          <div>
            <h2 className='text-3xl font-bold text-white mb-8'>Benefits of Our Services</h2>
            <div className='space-y-4'>
              <details className='group rounded-xl bg-white/5 border border-white/10 p-4 shadow-sm' open>
                <summary className='flex cursor-pointer items-center justify-between font-bold text-white list-none'>
                  <span className='flex items-center gap-3'>
                    <span className='h-2 w-2 rounded-full bg-brand-orange'></span>
                    Understanding User needs
                  </span>
                  <span className='text-white group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='mt-3 text-sm text-white leading-relaxed pl-5'>
                  We dive deep into user research to ensure every design decision is backed by data and empathy.
                </p>
              </details>

              <details className='group rounded-xl bg-white/5 border border-white/10 p-4 shadow-sm'>
                <summary className='flex cursor-pointer items-center justify-between font-bold text-white list-none'>
                  <span className='flex items-center gap-3'>
                    <span className='h-2 w-2 rounded-full bg-brand-orange'></span>
                    Data-driven Decisions
                  </span>
                  <span className='text-white group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='mt-3 text-sm text-white leading-relaxed pl-5'>
                  We analyze market trends and user behavior to make informed decisions that drive growth.
                </p>
              </details>

              <details className='group rounded-xl bg-white/5 border border-white/10 p-4 shadow-sm'>
                <summary className='flex cursor-pointer items-center justify-between font-bold text-white list-none'>
                  <span className='flex items-center gap-3'>
                    <span className='h-2 w-2 rounded-full bg-brand-orange'></span>
                    Reduce Impact margin
                  </span>
                  <span className='text-white group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='mt-3 text-sm text-white leading-relaxed pl-5'>
                  Minimizing risks and maximizing efficiency through strategic planning and execution.
                </p>
              </details>

              <details className='group rounded-xl bg-white/5 border border-white/10 p-4 shadow-sm'>
                <summary className='flex cursor-pointer items-center justify-between font-bold text-white list-none'>
                  <span className='flex items-center gap-3'>
                    <span className='h-2 w-2 rounded-full bg-brand-orange'></span>
                    Validation of Ideas
                  </span>
                  <span className='text-white group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='mt-3 text-sm text-white leading-relaxed pl-5'>
                  Prototyping and testing to validate concepts before full-scale development.
                </p>
              </details>

              <details className='group rounded-xl bg-white/5 border border-white/10 p-4 shadow-sm'>
                <summary className='flex cursor-pointer items-center justify-between font-bold text-white list-none'>
                  <span className='flex items-center gap-3'>
                    <span className='h-2 w-2 rounded-full bg-brand-orange'></span>
                    Cost Efficiency
                  </span>
                  <span className='text-white group-open:rotate-180 transition-transform'>▼</span>
                </summary>
                <p className='mt-3 text-sm text-white leading-relaxed pl-5'>
                  Optimized processes and smart technology choices to deliver high value within budget.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
