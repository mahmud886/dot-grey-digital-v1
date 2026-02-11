import Image from 'next/image';

export default function IndustryExpertise() {
  const industries = [
    {
      name: 'SaaS',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dental',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ecommerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hospital',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b9a5000?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className='py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        <h2 className='text-3xl font-bold text-white mb-12'>Industry Expertise</h2>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {industries.map((industry, index) => (
            <div key={index} className='group relative h-64 overflow-hidden rounded-2xl bg-white/5'>
              <Image
                src={industry.image}
                alt={industry.name}
                fill
                className='object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-100 opacity-0'
              />
              {/* Default State: Solid color background with text */}
              <div className='absolute inset-0 bg-brand-orange/10 flex items-center justify-center group-hover:hidden transition-all'>
                <div className='absolute top-0 left-0 w-full h-1/2 bg-brand-orange/20'></div>
              </div>

              <div className='absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none'>
                <h3 className='font-bold text-white group-hover:text-white transition-colors'>{industry.name}</h3>
              </div>

              {/* Hover Overlay */}
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
