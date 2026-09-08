import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { BriefForm } from "./BriefForm";
import { offices, site, socials } from "@/data/site";
import { sections } from "@/data/copy";

export function ProjectForm({ id = "start" }: { id?: string }) {
  const copy = sections.projectForm;

  return (
    <Section id={id} spacing="lg" bg="elev" bordered>
      <Container>
        <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div>
            <Reveal y={20}>
              <Eyebrow>{copy.eyebrow}</Eyebrow>
            </Reveal>

            <SplitText
              as="h2"
              text={copy.titleLines}
              by="line"
              className="mt-5 block font-display text-display-2 text-fg"
            />

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-fg-muted">{copy.lead}</p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 flex flex-col gap-2">
              <a
                href={`mailto:${site.email}`}
                className="font-display text-h3 uppercase text-fg transition-colors duration-300 hover:text-accent"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="text-fg-muted transition-colors duration-300 hover:text-accent"
              >
                {site.phone}
              </a>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 grid gap-8 sm:grid-cols-2">
              {offices.map((office) => (
                <div key={office.label}>
                  <h3 className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-accent">
                    {office.label}
                  </h3>
                  <address className="mt-3 text-fg-muted not-italic">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.25}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      className="font-display text-eyebrow font-semibold tracking-[0.18em] uppercase text-fg-muted transition-colors duration-300 hover:text-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <BriefForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
