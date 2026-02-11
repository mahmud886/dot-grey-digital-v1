'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

const testimonials = [
  {
    id: 1,
    logo: 'SiteLogo', // Placeholder text for logo
    quote:
      '“As a founder, finding the right team for Trainmate was a challenge until we discovered Musemind. They quickly onboarded, worked within our budget, and delivered high-quality designs at an impressive pace.”',
    author: 'George El Nachar',
    title: 'Founder, Trainmate',
    location: 'Dubai, United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    logo: 'SiteLogo',
    quote:
      '“As a founder, finding the right team for Trainmate was a challenge until we discovered Musemind. They quickly onboarded, worked within our budget, and delivered high-quality designs at an impressive pace.”',
    author: 'Val Kobal',
    title: 'Founder, Trainmate',
    location: 'Dubai, United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    logo: 'SiteLogo',
    quote:
      '“The team exceeded our expectations with their attention to detail and creative solutions. A truly collaborative partner.”',
    author: 'Sarah Jenkins',
    title: 'CEO, TechStart',
    location: 'San Francisco, USA',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id='testimonials' className='mx-auto max-w-7xl px-4 py-14 md:py-24 bg-[#f8f9fa] text-black rounded-3xl my-10'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-12 px-4'>
        <h2 className='text-3xl font-bold tracking-tight text-black sm:text-4xl max-w-md uppercase font-roboto'>
          Words that define our UI/UX design capabilities
        </h2>
        
        {/* Navigation Buttons */}
        <div className='flex gap-3 mt-6 md:mt-0'>
          <button
            onClick={scrollPrev}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors'
            aria-label='Previous slide'>
            <ArrowLeft className='h-5 w-5 text-gray-600' />
          </button>
          <button
            onClick={scrollNext}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors'
            aria-label='Next slide'>
            <ArrowRight className='h-5 w-5 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Embla Carousel */}
      <div className='overflow-hidden px-4' ref={emblaRef}>
        <div className='flex gap-6'>
          {testimonials.map((testimonial) => (
            <div className='flex-[0_0_100%] min-w-0 md:flex-[0_0_85%] lg:flex-[0_0_60%]' key={testimonial.id}>
              <article className='flex flex-col md:flex-row h-full overflow-hidden rounded-3xl bg-white shadow-sm'>
                {/* Content Side */}
                <div className='flex-1 p-8 md:p-10 flex flex-col justify-between'>
                  <div>
                    {/* Logo Placeholder */}
                    <div className='flex items-center gap-2 mb-8'>
                      <div className='flex gap-1'>
                        <div className='w-1 h-4 bg-blue-500 rounded-full'></div>
                        <div className='w-1 h-4 bg-red-500 rounded-full'></div>
                        <div className='w-1 h-4 bg-yellow-500 rounded-full'></div>
                      </div>
                      <span className='font-bold text-lg text-slate-900 font-kanit'>{testimonial.logo}</span>
                    </div>

                    <blockquote className='text-lg text-slate-700 leading-relaxed mb-8'>
                      {testimonial.quote}
                    </blockquote>
                  </div>

                  <div>
                    <p className='font-bold text-slate-900 font-roboto'>{testimonial.author}</p>
                    <p className='text-sm text-slate-500 mt-1 capitalize'>{testimonial.title}</p>
                    <p className='text-xs text-slate-400 mt-0.5 capitalize'>{testimonial.location}</p>
                  </div>
                </div>

                {/* Image Side */}
                <div className='relative w-full md:w-[40%] h-64 md:h-auto'>
                  <Image
                    className='object-cover'
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    sizes='(max-width: 768px) 100vw, 400px'
                  />
                  {/* Play Button Overlay */}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/0 transition-all'>
                    <button className='flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg transition-transform hover:scale-105'>
                      <Play className='h-6 w-6 ml-1' fill='currentColor' />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
