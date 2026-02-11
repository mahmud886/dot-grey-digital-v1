'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className='sticky top-0 z-50 backdrop-blur-md border-b border-white/10'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/logo.png'
              alt='DotGrey Digital'
              width={150}
              height={40}
              className='h-10 w-auto object-contain'
              priority
            />
          </Link>
          <nav className='hidden md:flex items-center gap-8 text-sm text-white/90 font-kanit uppercase'>
            <Link className='hover:text-brand-orange transition-colors' href='/about'>
              About
            </Link>
            <Link className='hover:text-brand-orange transition-colors' href='/works'>
              Works
            </Link>
            <div className='relative group'>
              <Link className='hover:text-brand-orange transition-colors py-4' href='/services'>
                Services
              </Link>
              <div className='absolute top-full left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-xl shadow-2xl rounded-2xl p-2 hidden group-hover:block border border-white/10'>
                <Link
                  href='/services/email-templates'
                  className='block px-4 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90'>
                  Email Templates
                </Link>
                <Link
                  href='/services/ui-ux-design'
                  className='block px-4 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90'>
                  UI/UX Design
                </Link>
                <Link
                  href='/services/web-development'
                  className='block px-4 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90'>
                  Web Development
                </Link>
                <Link
                  href='/services/veeva-services'
                  className='block px-4 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90'>
                  Veeva Services
                </Link>
                <Link
                  href='/services/banner-ads'
                  className='block px-4 py-2 rounded-xl hover:bg-white/10 text-sm text-white/90'>
                  Banner Ads
                </Link>
              </div>
            </div>
            <Link className='hover:text-brand-orange transition-colors' href='/contact'>
              Contact
            </Link>
            <Link className='hover:text-brand-orange transition-colors' href='/#faq'>
              FAQ
            </Link>
          </nav>
          <div className='flex items-center gap-3'>
            <a
              href='#start'
              className='hidden sm:inline-flex items-center rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-95 font-kanit uppercase'>
              Get a Quote
            </a>
            <button
              onClick={() => setOpen(!open)}
              className='md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10'
              aria-label='Open menu'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className='md:hidden pb-4'>
            <div className='grid gap-2 text-sm text-white font-kanit uppercase'>
              <Link className='rounded-xl px-3 py-2 hover:bg-white/10' href='/about'>
                About
              </Link>
              <Link className='rounded-xl px-3 py-2 hover:bg-white/10' href='/works'>
                Works
              </Link>

              {/* Mobile Services Accordion/List */}
              <div className='rounded-xl bg-white/5 px-3 py-2'>
                <Link href='/services' className='block font-semibold mb-2 text-white'>
                  Services
                </Link>
                <div className='grid gap-2 pl-2 border-l-2 border-white/20'>
                  <Link href='/services/email-templates' className='block text-white/70 hover:text-brand-orange'>
                    Email Templates
                  </Link>
                  <Link href='/services/ui-ux-design' className='block text-white/70 hover:text-brand-orange'>
                    UI/UX Design
                  </Link>
                  <Link href='/services/web-development' className='block text-white/70 hover:text-brand-orange'>
                    Web Development
                  </Link>
                  <Link href='/services/veeva-services' className='block text-white/70 hover:text-brand-orange'>
                    Veeva Services
                  </Link>
                  <Link href='/services/banner-ads' className='block text-white/70 hover:text-brand-orange'>
                    Banner Ads
                  </Link>
                </div>
              </div>

              <Link className='rounded-xl px-3 py-2 hover:bg-white/10' href='/contact'>
                Contact
              </Link>
              <Link className='rounded-xl px-3 py-2 hover:bg-white/10' href='/#faq'>
                FAQ
              </Link>
              <a
                className='mt-2 inline-flex items-center justify-center rounded-full bg-brand-orange px-4 py-2 font-semibold text-white'
                href='#start'>
                Get a Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
