import { Code, FileText, Layout, Mail, Monitor, Video } from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  return (
    <section id='services' className='mx-auto max-w-6xl px-4 py-20 md:py-32'>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between mb-16'>
        <div className='max-w-xl'>
          <p className='text-xs font-bold tracking-widest text-brand-orange uppercase'>
            360-Award Winning Digital Services
          </p>
          <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
            We offer services that transform businesses and help them grow.
          </h2>
        </div>
        <div className='mt-6 md:mt-0'>
          <Link
            href='/services'
            className='inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-all font-kanit uppercase'>
            See All Services
          </Link>
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Card 1: UI/UX Design */}
        <div className='rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/50'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors'>
            <Layout className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold text-white'>UI/UX Design</h3>
          <p className='mt-3 text-sm text-white leading-relaxed'>
            Websites, SaaS, dashboards—designed for clarity and conversion.
          </p>
          <Link
            href='/services/ui-ux-design'
            className='mt-6 inline-flex text-sm font-bold text-white hover:text-brand-orange'>
            Learn More
          </Link>
        </div>

        {/* Card 2: Web Development (Highlighted) */}
        <div className='rounded-3xl bg-brand-orange p-8 shadow-xl shadow-brand-orange/20 text-white transform md:-translate-y-4'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-orange'>
            <Code className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold'>Web Development</h3>
          <p className='mt-3 text-sm text-white/90 leading-relaxed'>
            Clean builds, performance-minded, responsive by default.
          </p>
          <Link
            href='/services/web-development'
            className='mt-6 inline-flex text-sm font-bold text-white hover:opacity-80'>
            Learn More
          </Link>
        </div>

        {/* Card 3: Email Template */}
        <div className='rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/50'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors'>
            <Mail className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold text-white'>Email Template Development</h3>
          <p className='mt-3 text-sm text-white leading-relaxed'>
            Compatible layouts for major inboxes and platforms.
          </p>
          <Link
            href='/services/email-templates'
            className='mt-6 inline-flex text-sm font-bold text-white hover:text-brand-orange'>
            Learn More
          </Link>
        </div>

        {/* Card 4: Banner Ads */}
        <div className='rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/50'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors'>
            <Monitor className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold text-white'>Banner Ads</h3>
          <p className='mt-3 text-sm text-white leading-relaxed'>
            Display ads built for attention and message clarity.
          </p>
          <Link
            href='/services/banner-ads'
            className='mt-6 inline-flex text-sm font-bold text-white hover:text-brand-orange'>
            Learn More
          </Link>
        </div>

        {/* Card 5: Video */}
        <div className='rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/50'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors'>
            <Video className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold text-white'>Video</h3>
          <p className='mt-3 text-sm text-white leading-relaxed'>
            Short promos, UI demos, reels—simple and clean edits.
          </p>
          <Link href='/services' className='mt-6 inline-flex text-sm font-bold text-white hover:text-brand-orange'>
            Learn More
          </Link>
        </div>

        {/* Card 6: Desktop Publishing */}
        <div className='rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/50'>
          <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors'>
            <FileText className='h-7 w-7' strokeWidth={1.5} />
          </div>
          <h3 className='text-xl font-bold text-white'>Desktop Publishing</h3>
          <p className='mt-3 text-sm text-white leading-relaxed'>
            Presentations, PDFs, reports—aligned to your brand system.
          </p>
          <Link href='/services' className='mt-6 inline-flex text-sm font-bold text-white hover:text-brand-orange'>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
