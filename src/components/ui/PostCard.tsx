import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "./TiltCard";
import { formatPostDate, type Post } from "@/data/insights";
import { cn } from "@/lib/cn";

export function PostCard({
  post,
  priority = false,
  className,
}: {
  post: Post;
  priority?: boolean;
  className?: string;
}) {
  return (
    <TiltCard className={cn("rounded-3xl", className)} max={5}>
      <Link href={`/insights/${post.slug}`} data-cursor="VIEW" className="group block rounded-3xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-bg-card">
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-full bg-bg/80 px-3.5 py-1.5 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg backdrop-blur-md">
            {post.category}
          </span>
        </div>

        <p className="mt-5 flex items-center gap-3 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-subtle">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </p>

        <h3 className="mt-3 font-display text-h3 text-fg transition-colors duration-300 group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-3 text-fg-muted">{post.excerpt}</p>
      </Link>
    </TiltCard>
  );
}
