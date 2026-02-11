import Image from 'next/image';

export default function Mission() {
  return (
    <section className='py-20 md:py-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>Our Mission</h2>
            <div className='mt-6 space-y-6 text-white leading-relaxed'>
              <p>
                We believe in the power of digital experiences to transform businesses and connect brands with their
                audiences. Our mission is to create thoughtful, effective digital solutions that solve real problems and
                drive measurable results.
              </p>
              <p>
                By combining creativity with technical expertise, we deliver solutions that not only look great but also
                perform exceptionally well. We&apos;re committed to understanding our clients&apos; goals and working
                collaboratively to exceed their expectations.
              </p>
            </div>
          </div>
          <div className='relative'>
            <div className='relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl'>
              <Image
                src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
                alt='Our Mission - Team collaboration'
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 600px'
              />
              <div className='absolute inset-0 bg-slate-900/10'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
