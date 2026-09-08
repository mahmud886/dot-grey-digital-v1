import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/ui/TeamCard";
import { SkillBars } from "@/components/sections/SkillBars";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { getMemberBySlug, team } from "@/data/team";

export function generateStaticParams() {
  return team.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) return {};
  return { title: member.name, description: `${member.name} — ${member.role} at DotGrey Digital.` };
}

export default async function MemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);
  if (!member) notFound();

  const others = team.filter((m) => m.slug !== member.slug).slice(0, 3);

  return (
    <>
      <PageHero
        title={member.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Team", href: "/team" },
          { label: member.name },
        ]}
        lead={member.role}
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-bg-card">
              <Image
                src={member.portrait}
                alt={member.name}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="object-cover"
              />
            </Reveal>

            <div className="flex flex-col gap-10">
              <Reveal delay={0.1} className="flex flex-col gap-5">
                {member.bio.map((paragraph) => (
                  <p key={paragraph} className="text-body-lg text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              <Reveal delay={0.15}>
                <h2 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                  Skills
                </h2>
                <div className="mt-6">
                  <SkillBars skills={member.skills} />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <h2 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted">
                  Elsewhere
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {member.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-fg"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <SectionHeading label="Team" title="Others on the team" />
          <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
            {others.map((other) => (
              <TeamCard key={other.slug} member={other} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <ProjectForm />
    </>
  );
}
