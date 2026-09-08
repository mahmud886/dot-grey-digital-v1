import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { comparison, plans } from "@/data/pricing";
import { cn } from "@/lib/cn";

export function ComparisonTable({ label, title }: { label: string; title: string }) {
  return (
    <Section spacing="lg" bg="elev" bordered>
      <Container>
        <SectionHeading label={label} title={title} />

        <Reveal className="mt-14 md:mt-20">
          {/* Wide content scrolls inside its own container, never the page. */}
          <div className="overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Feature comparison across DotGrey plans</caption>
              <thead>
                <tr className="border-b border-line bg-bg-card">
                  <th
                    scope="col"
                    className="p-5 font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted"
                  >
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={cn("p-5 font-display text-h3", plan.featured ? "text-accent" : "text-fg")}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 font-body font-normal text-fg-muted">
                      {row.label}
                    </th>
                    {plans.map((plan) => (
                      <td key={plan.id} className="p-5 text-fg">
                        {row.values[plan.id] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
