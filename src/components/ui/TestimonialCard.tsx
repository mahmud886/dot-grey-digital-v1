import type { Testimonial } from "@/data/testimonials";

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="card-glass flex h-full flex-col rounded-3xl p-8 md:p-10">
      <div className="flex gap-1" aria-label={`${item.rating} out of 5`}>
        {Array.from({ length: item.rating }, (_, i) => (
          <svg key={i} aria-hidden viewBox="0 0 20 20" className="size-4 text-accent" fill="currentColor">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
          </svg>
        ))}
      </div>

      <blockquote className="mt-7 flex-1 text-body-lg text-fg">
        <p>&ldquo;{item.quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-dim font-display text-sm font-bold text-accent"
        >
          {item.author
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-h3 text-fg">{item.author}</span>
          <span className="mt-0.5 block text-sm text-fg-muted">{item.role}</span>
          <span className="block text-sm text-fg-subtle">{item.location}</span>
        </span>
      </figcaption>
    </figure>
  );
}
