import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className='relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='max-w-xl'>
            <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
              Digital Product Design <br />
              <span className='text-brand-orange'>& Consulting Services</span>
            </h1>
            <p className='mt-6 text-lg text-white leading-relaxed'>
              Our Global digital product design agency helps brands to make top quality SaaS, MVP, software, mobile
              apps, and websites. We focus on user-friendly designs that look great and work.
            </p>
            <div className='mt-8'>
              <Link
                href='#list'
                className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 hover:opacity-95 hover:shadow-xl transition-all hover:-translate-y-0.5'>
                Get Started
              </Link>
            </div>
          </div>
          <div className='relative flex justify-center md:justify-end'>
            <div className='relative h-64 w-64 md:h-80 md:w-80'>
              {/* Abstract 3D UI/UX Icon */}
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 opacity-90 blur-sm animate-pulse'></div>
              <div className='absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-500 to-brand-orange flex items-center justify-center text-white shadow-xl animate-bounce'>
                <span className='font-bold text-xs'>UI/UX</span>
              </div>
              <div className='absolute bottom-10 left-10 h-16 w-16 rounded-full bg-gradient-to-tr from-orange-400 to-orange-300 flex items-center justify-center text-white shadow-lg'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-4 border-orange-200 bg-white'></div>
              {/* Shadow/Reflection */}
              <div className='absolute -bottom-12 left-1/2 h-8 w-40 -translate-x-1/2 rounded-[100%] bg-brand-orange/20 blur-xl'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
