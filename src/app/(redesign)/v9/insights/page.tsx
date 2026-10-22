import type { Metadata } from "next";
import { formatPostDate, posts, team } from "@/redesign/content";
import { PageHead } from "@/redesign/v9/Chrome";
import { PostIndex } from "@/redesign/v9/Client";
import { G } from "@/redesign/v9/Glyphs";
import s from "@/redesign/v9/v9.module.css";

export const metadata: Metadata = { title: "Insights" };

export default function V9Insights() {
  const authors = Object.fromEntries(team.map((m) => [m.slug, m.name]));
  const dates = Object.fromEntries(posts.map((p) => [p.slug, formatPostDate(p.date)]));
  return (
    <main>
      <PageHead
        crumb={{ href: "/v9", label: "Index" }}
        meta={`(${String(posts.length).padStart(2, "0")}) essays`}
        title={
          <>
            Notes <G name="wave" /> on the work
          </>
        }
        lede="Short essays on the decisions behind the work. We publish when we have learned something, not on a schedule."
      />
      <section className={s.sectionTight}>
        <PostIndex posts={posts} authors={authors} format={dates} />
      </section>
    </main>
  );
}
