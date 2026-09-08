import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { PostCard } from "@/components/ui/PostCard";
import { posts } from "@/data/insights";

export function LatestInsights({ limit = 3 }: { limit?: number }) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          label="Insights"
          title="What we are thinking about"
          action={
            <Magnetic>
              <ButtonLink href="/insights" variant="outline" arrow>
                Read everything
              </ButtonLink>
            </Magnetic>
          }
        />

        <RevealGroup stagger={0.09} className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, limit).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
