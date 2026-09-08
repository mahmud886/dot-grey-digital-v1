import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/ui/TeamCard";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { team } from "@/data/team";

export function TeamGrid({
  limit = team.length,
  label = "Team",
  title = "The people doing the work",
  showCta = false,
  bg = "transparent",
}: {
  limit?: number;
  label?: string;
  title?: string;
  showCta?: boolean;
  bg?: "transparent" | "elev";
}) {
  return (
    <Section spacing="lg" bg={bg}>
      <Container>
        <SectionHeading
          label={label}
          title={title}
          action={
            showCta ? (
              <Magnetic>
                <ButtonLink href="/team" variant="outline" arrow>
                  Meet the team
                </ButtonLink>
              </Magnetic>
            ) : undefined
          }
        />

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {team.slice(0, limit).map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
