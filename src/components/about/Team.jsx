import Image from 'next/image';

const teamMembers = [
  {
    name: "Alex Morgan",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sarah Chen",
    role: "Lead Product Designer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "James Wilson",
    role: "Senior Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Emily Davis",
    role: "Marketing Strategist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
  }
];

export default function Team() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-bold tracking-widest text-brand-orange">OUR TEAM</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Meet the creators</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white">
          A distributed team of designers, developers, and strategists working together to build better products.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1">
            <div className="h-64 w-full relative">
              <Image 
                src={member.image} 
                alt={member.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-brand-orange font-medium">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
