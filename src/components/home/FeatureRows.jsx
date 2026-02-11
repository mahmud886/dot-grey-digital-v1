import Link from 'next/link';

export default function FeatureRows() {
  return (
    <section className='mx-auto max-w-6xl px-4 pb-14 md:pb-20'>
      <div className='grid gap-20'>
        {/* Row 1: Email Template */}
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <p className='text-xs font-bold tracking-widest text-brand-orange uppercase'>New</p>
            <h2 className='mt-2 text-3xl font-extrabold tracking-tight text-white'>
              YOUR FIRST CUSTOM EMAIL <br />
              TEMPLATE ORDER IS <span className='text-brand-orange'>ON US!</span>
            </h2>
            <p className='mt-4 text-lg text-white leading-relaxed'>
              Get a high-converting, responsive email template designed to match your brand. Perfect for welcome flows
              and promotions.
            </p>

            <div className='mt-6 space-y-3'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Mobile-first & inbox-friendly</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Clean, modular layout</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Fast turnaround</p>
              </div>
            </div>

            <div className='mt-8'>
              <Link
                href='#start'
                className='inline-flex items-center rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-soft hover:opacity-95 transition-all font-kanit uppercase'>
                Get a Free Template
              </Link>
            </div>
          </div>

          <div className='relative flex justify-center'>
            <div className='relative h-72 w-72 md:h-96 md:w-96'>
              {/* Orange Blob Background */}
              <div className='absolute inset-0 rounded-[40%] bg-gradient-to-br from-brand-orange to-orange-400 blur-2xl opacity-20 animate-pulse'></div>

              {/* Icon Container */}
              <div className='absolute inset-4 flex items-center justify-center'>
                <div className='h-40 w-40 rounded-[30%] bg-gradient-to-tr from-brand-orange to-orange-500 shadow-2xl flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition duration-700'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-20 w-20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                {/* Decorative curved arrow */}
                <svg
                  className='absolute -bottom-4 -left-10 h-16 w-16 text-brand-orange transform rotate-12'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: UI/UX (Reversed) */}
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='order-2 md:order-1 relative flex justify-center'>
            <div className='relative h-72 w-72 md:h-96 md:w-96'>
              <div className='absolute inset-0 rounded-[40%] bg-gradient-to-br from-brand-orange to-orange-400 blur-2xl opacity-20 animate-pulse'></div>
              <div className='absolute inset-4 flex items-center justify-center'>
                <div className='h-40 w-40 rounded-full bg-gradient-to-bl from-orange-500 to-brand-orange shadow-2xl flex items-center justify-center text-white transform -rotate-3 hover:rotate-0 transition duration-700'>
                  <span className='text-3xl font-black tracking-tighter'>UI/UX</span>
                </div>
                <svg
                  className='absolute -top-4 -right-8 h-12 w-12 text-brand-orange'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                </svg>
              </div>
            </div>
          </div>

          <div className='order-1 md:order-2'>
            <p className='text-xs font-bold tracking-widest text-brand-orange uppercase'>Free</p>
            <h2 className='mt-2 text-3xl font-extrabold tracking-tight text-white'>
              Your first UI/UX design <br />
              screen is <span className='text-brand-orange'>free!</span>
            </h2>
            <p className='mt-4 text-lg text-white leading-relaxed'>
              Get a modern, conversion-focused screen design to kickstart your product, landing page, or web app.
            </p>

            <div className='mt-6 space-y-3'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Modern layout & typography</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Reusable components</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Mobile + desktop versions</p>
              </div>
            </div>

            <div className='mt-8'>
              <Link
                href='#start'
                className='inline-flex items-center rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-soft hover:opacity-95 transition-all'>
                Claim Free Screen
              </Link>
            </div>
          </div>
        </div>

        {/* Row 3: Web Dev */}
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <p className='text-xs font-bold tracking-widest text-brand-orange uppercase'>Dev</p>
            <h2 className='mt-2 text-3xl font-extrabold tracking-tight text-white'>
              Your first web <br />
              development task is <span className='text-brand-orange'>on us!</span>
            </h2>
            <p className='mt-4 text-lg text-white leading-relaxed'>
              Need a landing page section, bug fix, performance improvement, or responsive cleanup? Send it over.
            </p>

            <div className='mt-6 space-y-3'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Clean Tailwind/HTML/CSS</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Responsive across devices</p>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange'>
                  ✓
                </div>
                <p className='text-sm text-white'>Performance-minded</p>
              </div>
            </div>

            <div className='mt-8'>
              <Link
                href='#start'
                className='inline-flex items-center rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-soft hover:opacity-95 transition-all'>
                Submit a Task
              </Link>
            </div>
          </div>

          <div className='relative flex justify-center'>
            <div className='relative h-72 w-72 md:h-96 md:w-96'>
              <div className='absolute inset-0 rounded-[40%] bg-gradient-to-br from-brand-orange to-orange-400 blur-2xl opacity-20 animate-pulse'></div>
              <div className='absolute inset-4 flex items-center justify-center'>
                <div className='h-40 w-40 rounded-2xl bg-gradient-to-tl from-orange-500 to-brand-orange shadow-2xl flex items-center justify-center text-white transform rotate-6 hover:rotate-0 transition duration-700'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-20 w-20'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                  </svg>
                </div>
                <svg
                  className='absolute -bottom-8 -left-8 h-12 w-12 text-brand-orange'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
