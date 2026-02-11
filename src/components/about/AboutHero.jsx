export default function AboutHero() {
  return (
    <section className='relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='max-w-xl'>
            <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-6xl'>
              We&apos;re a team of <span className='text-brand-orange'>digital</span>
              <br />
              <span className='text-brand-orange'>problem solvers</span>
            </h1>
            <p className='mt-6 text-lg text-white leading-relaxed'>
              First Impression Agency has grown into a team of dedicated specialists who are passionate about creating
              digital experiences that make an impact.
            </p>
            <div className='mt-8'>
              <a
                href='#start'
                className='inline-flex items-center rounded-full bg-brand-orange px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-orange/20 hover:opacity-95 hover:shadow-xl transition-all hover:-translate-y-0.5 font-kanit uppercase'>
                Get Started
              </a>
            </div>
          </div>
          <div className='relative flex justify-center md:justify-end'>
            <div className='relative h-64 w-64 md:h-80 md:w-80'>
              {/* Abstract 3D shape placeholder - using a gradient blob for now */}
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 opacity-90 blur-sm animate-pulse'></div>
              <div className='absolute inset-4 rounded-full bg-gradient-to-tr from-orange-500 to-brand-orange flex items-center justify-center text-white shadow-2xl rotate-12 transform hover:rotate-0 transition duration-700'>
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
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
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
