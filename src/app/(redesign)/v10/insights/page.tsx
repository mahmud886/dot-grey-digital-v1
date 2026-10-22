import type { Metadata } from "next";
import { formatPostDate, posts, team } from "@/redesign/content";
import { Page, PageHero } from "@/redesign/v10/Chrome";
import { PostIndex } from "@/redesign/v10/Client";
import s from "@/redesign/v10/v10.module.css";

export const metadata: Metadata = { title: "Insights" };

export default function V10Insights() {
  const authors = Object.fromEntries(team.map((m) => [m.slug, m.name]));
  const dates = Object.fromEntries(posts.map((p) => [p.slug, formatPostDate(p.date)]));
  return (
    <Page>
      <PageHero kicker={`Log · ${String(posts.length).padStart(2, "0")} entries`} title="Insights" form="automation" lede="Short essays on the decisions behind the work. Published when we've learned something, not on a schedule." />
      <section className={s.block} aria-label="Essays">
        <PostIndex posts={posts} authors={authors} dates={dates} />
      </section>
    </Page>
  );
}
