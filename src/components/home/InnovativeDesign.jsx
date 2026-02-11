'use client';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

const images = [
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
];

export default function InnovativeDesign() {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false }),
  ]);

  return (
    <section className='bg-black py-20 md:py-32 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 mb-20'>
        <div className='grid md:grid-cols-2 gap-16 items-start'>
          {/* Left Content */}
          <div>
            <h2 className='text-4xl md:text-5xl font-bold text-white uppercase leading-tight font-roboto'>
              Innovative design is our tool to reshape business
            </h2>
          </div>

          {/* Right Content */}
          <div className='space-y-8'>
            <p className='text-white text-lg leading-relaxed'>
              We&apos;re a passionate team of UI/UX designers dedicated to creating intuitive digital experiences. With
              years of experience, we blend creativity and strategy to design solutions that engage users and drive
              business success.
            </p>
            <p className='text-white text-lg leading-relaxed'>
              We turn ideas into seamless, beautiful designs. Let&apos;s build digital experiences that not only look
              stunning but also deliver real results.
            </p>
            <a
              href='#about'
              className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all font-kanit uppercase'>
              More About Us
            </a>
          </div>
        </div>
      </div>

      {/* Scrolling Gallery */}
      <div className='w-full' ref={emblaRef}>
        <div className='flex gap-8'>
          {images.map((src, index) => (
            <div
              key={index}
              className={`flex-[0_0_300px] md:flex-[0_0_400px] aspect-[3/4] relative overflow-hidden rounded-lg transform ${
                index % 2 === 0 ? 'rotate-2' : '-rotate-2'
              }`}>
              <Image
                src={src}
                alt={`Office Image ${index + 1}`}
                fill
                className='object-cover hover:scale-110 transition-transform duration-700'
                sizes='(max-width: 768px) 300px, 400px'
              />
            </div>
          ))}
          {/* Duplicate for seamless loop effect if needed by Embla (AutoScroll handles infinite internally, but extra items help smooth start) */}
          {images.map((src, index) => (
            <div
              key={`dup-${index}`}
              className={`flex-[0_0_300px] md:flex-[0_0_400px] aspect-[3/4] relative overflow-hidden rounded-lg transform ${
                index % 2 === 0 ? 'rotate-2' : '-rotate-2'
              }`}>
              <Image
                src={src}
                alt={`Office Image ${index + 1}`}
                fill
                className='object-cover hover:scale-110 transition-transform duration-700'
                sizes='(max-width: 768px) 300px, 400px'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
