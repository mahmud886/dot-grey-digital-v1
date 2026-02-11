import Link from 'next/link';

export default function ContactHero() {
  return (
    <section className='relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='max-w-xl'>
            <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
              Let&apos;s <span className='text-brand-orange'>work together</span>
            </h1>
            <p className='mt-6 text-lg text-white leading-relaxed'>
              Ready to start your next project? Contact us today and let&apos;s create something amazing.
            </p>
            <div className='mt-8'>
              <Link
                href='#form'
                className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 hover:opacity-95 hover:shadow-xl transition-all hover:-translate-y-0.5 font-kanit uppercase'>
                Get Started
              </Link>
            </div>
          </div>
          <div className='relative flex justify-center md:justify-end'>
            <div className='relative h-64 w-64 md:h-80 md:w-80'>
              {/* Abstract 3D Mail Icon */}
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 opacity-90 blur-sm animate-pulse'></div>
              <div className='absolute inset-4 rounded-full bg-gradient-to-tr from-orange-500 to-brand-orange flex items-center justify-center text-white shadow-2xl rotate-6 transform hover:rotate-0 transition duration-700'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-32 w-32 opacity-90'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
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
