import Image from 'next/image';

const projects = [
  {
    title: 'Workday',
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['Agency', 'Agency', 'Agency'], // Placeholder tags as per image
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: "Hakka's Dine",
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['User Research', 'Product Development', 'Consumer'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Medicove Intl',
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['Agency', 'Agency', 'Agency'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Workday',
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['Agency', 'Agency', 'Agency'],
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: "Hakka's Dine",
    description: 'Create intuitive and visually stunning user experiences that engage and convert.',
    tags: ['Case Studies', 'Mobile Development', 'Consumer'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function ProjectGallery() {
  return (
    <section id='gallery' className='py-20 md:py-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='mb-16'>
          <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-white'>Our Works</h2>
          <p className='mt-4 max-w-2xl text-white/70'>
            We deliver transformative digital journeys for renowned global brands by combining creativity, AI
            innovation, and modern technology.
          </p>
        </div>

        <div className='grid gap-x-8 gap-y-16 md:grid-cols-2'>
          {projects.map((project, index) => (
            <article key={index} className={`group ${index === 2 ? 'md:col-span-2' : ''}`}>
              <div className='relative overflow-hidden rounded-3xl bg-white/5'>
                <div className={`relative w-full ${index === 2 ? 'aspect-[2.35/1]' : 'aspect-[4/3]'}`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes={index === 2 ? '(max-width: 1024px) 100vw, 1200px' : '(max-width: 768px) 100vw, 600px'}
                  />
                </div>
              </div>
              <div className='mt-6'>
                <h3 className='text-xl font-bold'>{project.title}</h3>
                <p className='mt-2 text-sm text-white/60 max-w-md'>{project.description}</p>
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
            href='#'
            className='inline-flex items-center rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all font-kanit uppercase'>
            See All Works
          </a>
        </div>
      </div>
    </section>
  );
}
