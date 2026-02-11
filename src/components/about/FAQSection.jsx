import Image from 'next/image';

export default function FAQSection() {
  return (
    <section className='py-20 md:py-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid gap-12 lg:grid-cols-12'>
          {/* Left Side: Title + Dark Card */}
          <div className='lg:col-span-4'>
            <h2 className='text-3xl font-bold tracking-tight text-white mb-8'>Have questions?</h2>

            <div className='relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 text-white shadow-xl backdrop-blur-sm'>
              {/* Decorative gradient blob */}
              <div className='absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-orange blur-3xl opacity-20'></div>

              <div className='relative z-10'>
                <div className='flex -space-x-3 mb-6'>
                  <Image
                    src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
                    width={48}
                    height={48}
                    alt='User 1'
                    className='rounded-full border-2 border-black h-12 w-12 object-cover'
                  />
                  <Image
                    src='https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
                    width={48}
                    height={48}
                    alt='User 2'
                    className='rounded-full border-2 border-black h-12 w-12 object-cover'
                  />
                  <Image
                    src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
                    width={48}
                    height={48}
                    alt='User 3'
                    className='rounded-full border-2 border-black h-12 w-12 object-cover'
                  />
                </div>

                <h3 className='text-xl font-bold mb-2'>Find the right solution for you now</h3>
                <p className='text-white text-sm mb-6'>Let&apos;s discuss how we can help your business grow.</p>

                <a
                  href='#start'
                  className='inline-block rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition'>
                  Book a Quick Call
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: FAQ List */}
          <div className='lg:col-span-8'>
            <div className='divide-y divide-white/10'>
              {[
                'What are your focus areas as a UI/UX agency?',
                'What sets Musemind apart from other top UI/UX design agencies?',
                'What services do you offer for start-ups, and how can they add value to my business?',
                'Can you help us redesign our app, website, or enterprise/B2B software?',
                'How do you estimate the time for the UI/UX project?',
                'How much does a UI/UX design project cost?',
              ].map((question, i) => (
                <details key={i} className='group py-6'>
                  <summary className='flex w-full cursor-pointer items-center justify-between list-none text-left font-medium text-white hover:text-brand-orange transition-colors'>
                    {question}
                    <span className='ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-open:bg-brand-orange group-open:text-white transition-all group-open:rotate-180'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                      </svg>
                    </span>
                  </summary>
                  <div className='mt-4 text-white text-sm leading-relaxed'>
                    <p>
                      We specialize in creating user-centric digital products. Our focus spans from comprehensive user
                      research and strategy to high-fidelity UI design and front-end development. We tailor our approach
                      based on your specific industry needs and user goals.
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
