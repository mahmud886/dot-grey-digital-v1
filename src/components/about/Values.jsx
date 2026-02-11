const values = [
  {
    title: 'Innovation',
    description: 'We embrace new technologies and approaches to solve complex problems in creative ways.',
  },
  {
    title: 'Quality',
    description: "We're committed to excellence in everything we do, from design to development to client service.",
  },
  {
    title: 'Collaboration',
    description: 'We believe the best results come from working closely with our clients and with each other.',
  },
  {
    title: 'Integrity',
    description: "We conduct business with honesty, transparency, and a commitment to doing what's right.",
  },
  {
    title: 'Adaptability',
    description: "We're flexible and responsive, ready to pivot and evolve in a rapidly changing digital landscape.",
  },
  {
    title: 'Results-Driven',
    description: 'We focus on delivering measurable outcomes that help our clients achieve their business goals.',
  },
];

export default function Values() {
  return (
    <section className='py-20 md:py-32'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>Our Values</h2>
          <p className='mt-4 text-white'>These core principles guide our work and define our culture.</p>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {values.map((value, index) => (
            <div
              key={index}
              className='rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-brand-orange hover:bg-white/10 transition-all duration-300'>
              <h3 className='font-bold text-lg text-white'>{value.title}</h3>
              <p className='mt-3 text-sm text-white leading-relaxed'>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
