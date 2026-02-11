import Link from 'next/link';

export default function WorksHero() {
  return (
    <section className='relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='max-w-xl'>
            <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
              UX Research and <br />
              <span className='text-brand-orange'>Consulting Services</span>
            </h1>
            <p className='mt-6 text-lg text-white leading-relaxed'>
              Our Global digital product design agency helps brands to make top quality SaaS, MVP, software, mobile
              apps, and websites. We focus on user-friendly designs that look great and work.
            </p>
            <div className='mt-8'>
              <Link
                href='#gallery'
                className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 hover:opacity-95 hover:shadow-xl transition-all hover:-translate-y-0.5 font-kanit uppercase'>
                Get Started
              </Link>
            </div>
          </div>
          <div className='relative flex justify-center md:justify-end'>
            <div className='relative h-64 w-64 md:h-80 md:w-80'>
              {/* Abstract 3D UI/UX Icon */}
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 opacity-90 blur-sm animate-pulse'></div>
              <div className='absolute inset-4 rounded-full bg-gradient-to-tr from-orange-500 to-brand-orange flex items-center justify-center text-white shadow-2xl -rotate-6 transform hover:rotate-0 transition duration-700'>
                <div className='text-center'>
                  <span className='block text-4xl font-black tracking-tighter'>UI/UX</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mx-auto mt-2 h-8 w-8 opacity-80'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
                    />
                  </svg>
                </div>
              </div>
              {/* Shadow/Reflection */}
              <div className='absolute -bottom-12 left-1/2 h-8 w-40 -translate-x-1/2 rounded-[100%] bg-brand-orange/20 blur-xl'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
