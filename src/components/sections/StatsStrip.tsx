import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RevealGroup } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { stats } from "@/data/stats";

export function StatsStrip({ bg = "transparent" }: { bg?: "transparent" | "elev" }) {
  return (
    <Section spacing="md" bg={bg} bordered>
      <Container>
        <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-display-2 leading-none text-accent tabular-nums">
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-fg-muted">{stat.label}</p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
