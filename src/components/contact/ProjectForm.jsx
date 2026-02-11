import Link from 'next/link';

export default function ProjectForm() {
  return (
    <section id='form' className='py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='grid gap-16 lg:grid-cols-2 lg:items-start'>
          {/* Text Side */}
          <div className='lg:pr-12'>
            <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
              Have a project idea in mind? Let&apos;s get started
            </h2>
            <p className='mt-4 text-white leading-relaxed max-w-md'>
              We turn ideas into seamless, beautiful designs. Let&apos;s build digital experiences that not only look
              stunning but also deliver real results.
            </p>
          </div>

          {/* Form Side */}
          <div className='bg-black/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-900/50 border border-white/10'>
            <form className='space-y-6'>
              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Jane Cooper'
                    className='w-full border-b border-white/20 py-3 text-white placeholder-slate-500 outline-none focus:border-brand-orange transition-colors bg-transparent'
                  />
                </div>
                {/* Empty grid cell for spacing or secondary field if needed later */}
              </div>

              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='company' className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Company name
                  </label>
                  <input
                    type='text'
                    id='company'
                    placeholder='Jane Cooper'
                    className='w-full border-b border-white/20 py-3 text-white placeholder-slate-500 outline-none focus:border-brand-orange transition-colors bg-transparent'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Email*
                  </label>
                  <input
                    type='email'
                    id='email'
                    placeholder='you@email.com'
                    required
                    className='w-full border-b border-white/20 py-3 text-white placeholder-slate-500 outline-none focus:border-brand-orange transition-colors bg-transparent'
                  />
                </div>
              </div>

              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='service' className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Service required*
                  </label>
                  <select
                    id='service'
                    className='w-full border-b border-white/20 py-3 text-white outline-none focus:border-brand-orange bg-transparent cursor-pointer [&>option]:text-black'>
                    <option value='' disabled selected>
                      Select your Service
                    </option>
                    <option value='ui-ux'>UI/UX Design</option>
                    <option value='web-dev'>Web Development</option>
                    <option value='email'>Email Template</option>
                  </select>
                </div>
                <div className='space-y-2'>
                  <label htmlFor='budget' className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Project budget*
                  </label>
                  <select
                    id='budget'
                    className='w-full border-b border-white/20 py-3 text-white outline-none focus:border-brand-orange bg-transparent cursor-pointer [&>option]:text-black'>
                    <option value='' disabled selected>
                      Select your Range
                    </option>
                    <option value='small'>&lt; $1k</option>
                    <option value='medium'>$1k - $5k</option>
                    <option value='large'>$5k+</option>
                  </select>
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='details' className='text-xs font-semibold text-white uppercase tracking-wider'>
                  Project details*
                </label>
                <textarea
                  id='details'
                  rows='4'
                  placeholder='Tell us more about your idea'
                  className='w-full border-b border-slate-200 py-3 text-slate-900 placeholder-slate-300 outline-none focus:border-brand-orange transition-colors resize-none'></textarea>
              </div>

              <div className='pt-4'>
                <button
                  type='button'
                  className='w-full rounded-full bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10'>
                  Send Inquiry
                </button>
              </div>
            </form>

            <p className='mt-6 text-center text-xs text-white'>
              Not interested to submit the form?{' '}
              <Link href='tel:+1234567890' className='text-brand-orange font-semibold hover:underline'>
                Book A Call Directly
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
