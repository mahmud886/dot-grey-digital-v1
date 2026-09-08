import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/data/team";

export function TeamCard({ member }: { member: Member }) {
  return (
    <article className="group">
      <Link href={`/team/${member.slug}`} data-cursor="VIEW" className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-bg-card">
          <Image
            src={member.portrait}
            alt={member.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover grayscale transition-[transform,filter] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-4 bg-accent px-5 py-3.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
            {member.socials.map((social) => (
              <span
                key={social.label}
                className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-accent-fg"
              >
                {social.label}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mt-5 font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
          {member.name}
        </h3>
        <p className="mt-1 text-sm text-fg-muted">{member.role}</p>
      </Link>
    </article>
  );
}
