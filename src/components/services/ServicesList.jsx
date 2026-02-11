import Image from 'next/image';

const services = [
  {
    title: 'UX UI Design',
    description:
      'We design digital products that are easy to use and look beautiful. We focus on user-friendly designs that look great and work.',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Discovery',
      'Brand Identity',
      'Corporate Identity',
      'Brand Strategy',
      'Sprint Sprints',
      'Graphic Design',
      'Logo Design',
    ],
  },
  {
    title: 'Web Design',
    description:
      'We build websites that are fast, secure, and easy to manage. We focus on user-friendly designs that look great and work.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    features: [
      'Discovery',
      'Brand Identity',
      'Corporate Identity',
      'Brand Strategy',
      'Sprint Sprints',
      'Graphic Design',
      'Logo Design',
    ],
  },
  {
    title: 'Email Template',
    description:
      'We create custom email templates that are responsive and look great on any device. We focus on user-friendly designs that look great and work.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Discovery',
      'Brand Identity',
      'Corporate Identity',
      'Brand Strategy',
      'Sprint Sprints',
      'Graphic Design',
      'Logo Design',
    ],
  },
  {
    title: 'Banner Ads',
    description:
      'We design banner ads that are engaging and drive clicks. We focus on user-friendly designs that look great and work.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    features: [
      'Discovery',
      'Brand Identity',
      'Corporate Identity',
      'Brand Strategy',
      'Sprint Sprints',
      'Graphic Design',
      'Logo Design',
    ],
  },
  {
    title: 'Veeva',
    description:
      'Compliant and engaging CLM presentations and approved emails for the life sciences industry. We ensure your content is technically perfect and visually compelling within the Veeva ecosystem.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    features: [
      'CLM Presentations',
      'Approved Email',
      'Engage Meeting',
      'Brand Strategy',
      'Visual Graphics',
      'Graphic Design',
      'Logo Design',
    ],
  },
];

export default function ServicesList() {
  return (
    <section id='list' className='py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='space-y-32'>
          {services.map((service, index) => (
            <div
              key={index}
              className={`grid gap-12 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                {/* Collage Style Images */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='relative h-48 w-full overflow-hidden rounded-2xl bg-white/5 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1'>
                    <Image src={service.image} alt={service.title} fill className='object-cover' />
                  </div>
                  <div className='relative h-48 w-full overflow-hidden rounded-2xl bg-white/5 mt-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1'>
                    <Image src={service.image} alt={service.title} fill className='object-cover' />
                  </div>
                  <div className='relative h-48 w-full overflow-hidden rounded-2xl bg-white/5 -mt-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1'>
                    <Image src={service.image} alt={service.title} fill className='object-cover' />
                  </div>
                  <div className='relative h-48 w-full overflow-hidden rounded-2xl bg-white/5 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1'>
                    <Image src={service.image} alt={service.title} fill className='object-cover' />
                  </div>
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <h2 className='text-3xl font-bold text-white mb-4'>{service.title}</h2>
                <p className='text-white mb-8 leading-relaxed'>{service.description}</p>

                <ul className='space-y-3'>
                  {service.features.map((feature, i) => (
                    <li key={i} className='flex items-center gap-3 text-sm font-medium text-white'>
                      <span className='flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange/20 text-xs text-brand-orange'>
                        ✓
                      </span>
                      {feature}
                      <span className='ml-auto text-white'>›</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
