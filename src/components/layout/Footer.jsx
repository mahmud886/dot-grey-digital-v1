import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className='pt-20 pb-10 border-t border-white/10'>
      <div className='mx-auto max-w-6xl px-4'>
        {/* Bordered Block Container */}
        <div className='border border-white/10 mb-20'>
          {/* Top Row: Social Links */}
          <div className='grid grid-cols-4 border-b border-white/10 divide-x divide-white/10'>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className='group flex h-24 items-center justify-center bg-transparent transition-all hover:bg-white/5'
                aria-label={social.name}>
                <div className='text-white group-hover:text-brand-orange transition-colors'>
                  <social.icon className='h-6 w-6' />
                </div>
              </a>
            ))}
          </div>

          {/* Bottom Row: CTA Section */}
          <div className='flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-6'>
            <div className='w-full md:w-auto'>
              <h3 className='text-2xl font-bold text-white'>Get Started With Your Project</h3>
            </div>
            
            {/* Input placeholder similar to screenshot (optional but adds structure) */}
            <div className='hidden md:block flex-1 mx-8'>
               <div className='h-12 w-full border border-white/10 rounded-lg'></div>
            </div>

            <div className='w-full md:w-auto flex justify-end'>
              <a
                href='#contact'
                className='inline-flex items-center justify-center bg-brand-orange px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 font-kanit uppercase rounded-full'>
                <span>Get Your Quote</span>
                <svg className='ml-2 h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className='grid gap-12 md:grid-cols-4 border-t border-white/10 pt-16 mb-16'>
          <div className='md:col-span-1'>
            <Link href='/' className='flex items-center gap-2 mb-6'>
              <Image
                src='/logo.png'
                alt='DotGrey Digital'
                width={150}
                height={40}
                className='h-10 w-auto object-contain'
              />
            </Link>
          </div>

          <div>
            <h4 className='font-bold text-sm mb-6 text-white'>Quick Links</h4>
            <ul className='space-y-4 text-xs font-medium text-white'>
              <li>
                <Link href='/' className='hover:text-brand-orange transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-brand-orange transition-colors'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/services' className='hover:text-brand-orange transition-colors'>
                  Services
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-brand-orange transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-sm mb-6 text-white'>Our Services</h4>
            <ul className='space-y-4 text-xs font-medium text-white'>
              <li>
                <Link href='/services/email-templates' className='hover:text-brand-orange transition-colors'>
                  Email Templates
                </Link>
              </li>
              <li>
                <Link href='/services/banner-ads' className='hover:text-brand-orange transition-colors'>
                  Banner Ads
                </Link>
              </li>
              <li>
                <Link href='/services/web-development' className='hover:text-brand-orange transition-colors'>
                  Website Design
                </Link>
              </li>
              <li>
                <Link href='/services/ui-ux-design' className='hover:text-brand-orange transition-colors'>
                  UI/UX Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-sm mb-6 text-white'>Connect With Us</h4>
            <ul className='space-y-4 text-xs font-medium text-white'>
              <li>
                <a href='#' className='hover:text-brand-orange transition-colors'>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-brand-orange transition-colors'>
                  Instagram
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-brand-orange transition-colors'>
                  Twitter
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-brand-orange transition-colors'>
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-white text-sm'>&copy; 2024 Dot Grey Digital. All rights reserved.</p>
          <div className='flex gap-6'>
            <a href='#' className='text-sm text-white hover:text-white transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='text-sm text-white hover:text-white transition-colors'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
