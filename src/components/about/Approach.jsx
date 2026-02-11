import Image from 'next/image';

export default function Approach() {
  return (
    <section className='bg-transparent text-white py-20 md:py-32 overflow-hidden'>
      <div className='mx-auto max-w-6xl px-4 text-center'>
        <div className='max-w-3xl mx-auto mb-16'>
          <p className='text-xs font-bold tracking-widest text-brand-orange uppercase mb-4'>Approach</p>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-5xl uppercase leading-tight text-white'>
            Human-first design is our tool to reshape business
          </h2>
          <p className='mt-6 text-lg text-white max-w-2xl mx-auto'>
            We simplify experiences so your users move faster, trust more, and convert with confidence.
          </p>
          <div className='mt-8'>
            <a
              href='#contact'
              className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-soft hover:opacity-95 transition-all font-kanit uppercase'>
              Book a Call
            </a>
          </div>
        </div>

        {/* Rotated Polaroid Collage */}
        <div className='relative mt-12 h-64 md:h-80 w-full max-w-5xl mx-auto'>
          <div className='absolute left-1/2 top-0 -translate-x-1/2 w-full h-full flex justify-center items-center'>
            {/* Image 1 (Left, tilted left) */}
            <div className='absolute left-4 md:left-20 top-4 w-48 h-60 md:w-64 md:h-80 bg-white p-3 shadow-2xl transform -rotate-12 z-10 hover:rotate-0 transition duration-500 hover:z-20 hover:scale-105'>
              <div className='relative w-full h-4/5 overflow-hidden bg-gray-200'>
                <Image
                  src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
                  alt='Team collaboration'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='h-1/5 flex items-center justify-center'>
                <p className='text-slate-900 font-handwriting text-sm'>Teamwork</p>
              </div>
            </div>

            {/* Image 2 (Center, slight tilt right) */}
            <div className='absolute top-0 w-56 h-72 md:w-72 md:h-96 bg-white p-3 shadow-2xl transform rotate-3 z-20 hover:rotate-0 transition duration-500 hover:scale-105'>
              <div className='relative w-full h-4/5 overflow-hidden bg-gray-200'>
                <Image
                  src='https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
                  alt='Strategy meeting'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='h-1/5 flex items-center justify-center'>
                <p className='text-slate-900 font-handwriting text-sm'>Strategy</p>
              </div>
            </div>

            {/* Image 3 (Right, tilted right) */}
            <div className='absolute right-4 md:right-20 top-8 w-48 h-60 md:w-64 md:h-80 bg-white p-3 shadow-2xl transform rotate-12 z-10 hover:rotate-0 transition duration-500 hover:z-20 hover:scale-105'>
              <div className='relative w-full h-4/5 overflow-hidden bg-gray-200'>
                <Image
                  src='https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80'
                  alt='Design process'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='h-1/5 flex items-center justify-center'>
                <p className='text-slate-900 font-handwriting text-sm'>Design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
