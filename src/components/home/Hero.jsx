'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { Code, Layout, Mail, Monitor, Palette, Smartphone, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const slides = [
  {
    title: 'Email Template development',
    icon: Mail,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'UI UX Design',
    icon: Layout,
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'HTML 5 Banner Ads',
    icon: Monitor,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Web Development',
    icon: Code,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Mobile App Development',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'SEO & Marketing',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Brand Identity',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', containScroll: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <section className='relative overflow-visible pt-12 md:pt-20'>
      <div className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
        <div className='grid items-center gap-10 md:grid-cols-2'>
          {/* Text */}
          <div>
            <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl text-white'>
              We create <span className='text-brand-orange'>stunning</span>
              <br />
              digital experiences
            </h1>

            <p className='mt-4 max-w-xl text-white leading-relaxed'>
              Specializing in UX/UI design, web development, banner ads, and email templates to help your business stand
              out in the digital landscape.
            </p>

            <div className='mt-7 flex flex-wrap items-center gap-3'>
              <a
                href='#start'
                className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95 transition-all font-kanit uppercase'>
                Get Started
              </a>
              <a
                href='#services'
                className='inline-flex items-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all font-kanit uppercase'>
                Our Services
              </a>
            </div>
          </div>

          {/* Visual Slider */}
          <div className='relative w-full max-w-lg mx-auto md:ml-auto md:mr-0 perspective-[1000px]'>
            <div className='overflow-visible' ref={emblaRef}>
              <div className='flex items-center touch-pan-y'>
                {slides.map((slide, index) => {
                  let rotateClass = '';
                  let scaleClass = 'scale-75';
                  let zIndexClass = 'z-10';
                  let opacityClass = 'opacity-100'; // Keep side cards visible
                  let blurClass = 'blur-[1px]'; // Slight blur for depth

                  if (index === selectedIndex) {
                    rotateClass = 'rotate-0';
                    scaleClass = 'scale-150';
                    zIndexClass = 'z-50';
                    blurClass = 'blur-0';
                  } else if (index === (selectedIndex - 1 + slides.length) % slides.length) {
                    // Previous slide
                    rotateClass = '-rotate-12 origin-right';
                    zIndexClass = 'z-20';
                  } else if (index === (selectedIndex + 1) % slides.length) {
                    // Next slide
                    rotateClass = 'rotate-12 origin-left';
                    zIndexClass = 'z-20';
                  } else {
                    // Others
                    opacityClass = 'opacity-0';
                  }

                  return (
                    <div
                      key={index}
                      className={`flex-[0_0_50%] min-w-0 px-4 ${zIndexClass}`}
                      style={{ transformStyle: 'preserve-3d' }}>
                      <div
                        className={`relative aspect-square rounded-3xl bg-white p-8 shadow-2xl flex flex-col items-center justify-between text-center overflow-hidden border border-white/50 transition-all duration-500 ease-out transform ${rotateClass} ${scaleClass} ${opacityClass} ${blurClass}`}>
                        <div className='mb-2 mt-4'>
                          <slide.icon className='h-12 w-12 text-brand-orange mx-auto' strokeWidth={1.5} />
                        </div>
                        <h3 className='text-xl font-bold text-brand-orange mb-6 font-kanit leading-tight px-4'>
                          {slide.title}
                        </h3>
                        <div className='relative w-full h-40 rounded-xl overflow-hidden shadow-inner'>
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 200px, 300px'
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots */}
            <div className='flex justify-center gap-3 mt-16'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-3 w-3 rounded-full border border-brand-orange transition-all duration-300 ${
                    index === selectedIndex ? 'bg-brand-orange scale-125' : 'bg-transparent hover:bg-brand-orange/20'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
