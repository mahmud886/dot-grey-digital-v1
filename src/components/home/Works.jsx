import Image from 'next/image';

const projects = [
  {
    title: 'Workday',
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['Agency', 'Mobile', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: "Hakka's Dine",
    description: 'Modern restaurant booking and food delivery platform design.',
    tags: ['User Research', 'Web Design', 'Consumer'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Medicove Intl',
    description: 'Healthcare platform streamlining patient-doctor interactions.',
    tags: ['Healthcare', 'App', 'UX/UI'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Fintech Pro',
    description: 'Secure and intuitive financial management dashboard.',
    tags: ['Fintech', 'Dashboard', 'Web'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Works() {
  return (
    <section id='works' className='py-20 md:py-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='mb-16'>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>Our Works</h2>
          <p className='mt-4 max-w-2xl text-white/70'>
            We deliver transformative digital journeys for renowned global brands by combining creativity, AI
            innovation, and modern technology.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          {projects.map((project, index) => (
            <article key={index} className='group'>
              <div className='relative overflow-hidden rounded-3xl bg-white/5 aspect-[4/3]'>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, 600px'
                />
                {/* Overlay on hover */}
                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>
              <div className='mt-6'>
                <h3 className='text-xl font-bold'>{project.title}</h3>
                <p className='mt-2 text-sm text-white/60 max-w-md line-clamp-2'>{project.description}</p>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className='mt-20 text-center'>
          <a
            href='/works'
            className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all font-kanit uppercase'>
            See All Works
          </a>
        </div>
      </div>
    </section>
  );
}
