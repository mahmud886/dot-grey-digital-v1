import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { Marquee } from "@/components/ui/Marquee";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { TiltCard } from "@/components/ui/TiltCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { site } from "@/data/site";

/**
 * PHASE 1 SCAFFOLD — a harness for the design system and motion primitives, not the real
 * homepage. Replaced in Phase 3 by the section composition in docs/02-sections.md.
 */
export default function FoundationPage() {
  return (
    <>
      <Section spacing="lg" className="pt-32 md:pt-44">
        <Container>
          <div className="flex items-start justify-between gap-6">
            <Eyebrow>Phase 1 — foundation</Eyebrow>
            <ThemeToggle />
          </div>

          <h1 className="mt-8 font-display text-display-1 text-fg">
            <SplitText text={["We create stunning", "digital experiences"]} by="line" trigger="mount" stagger={0.1} />
          </h1>

          <Reveal delay={0.4} className="mt-8 max-w-xl">
            <p className="text-body-lg text-fg-muted">{site.description}</p>
          </Reveal>

          <Reveal delay={0.55} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <ButtonLink href="/" size="lg">
                Get started
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/" variant="outline" size="lg" arrow>
                Our services
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="sm" bordered>
        <Marquee
          items={["UI/UX Design", "Web Development", "Email Templates", "Banner Ads", "Veeva", "Motion"]}
          className="font-display text-display-2 leading-none font-bold"
          outlined
        />
      </Section>

      <Section spacing="lg">
        <Container>
          <ScrollHighlightText
            text="Innovative design is our tool to reshape business. We turn ideas into seamless, beautiful products that look stunning and deliver real results."
            className="max-w-4xl font-display text-display-2 uppercase"
          />
        </Container>
      </Section>

      <Section spacing="lg" bg="elev" bordered>
        <Container>
          <Eyebrow>Primitives</Eyebrow>
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: 7, suffix: "", label: "Years" },
              { value: 320, suffix: "+", label: "Projects delivered" },
              { value: 18, suffix: "", label: "People" },
              { value: 40, suffix: "+", label: "Clients worldwide" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-display-2 leading-none text-accent tabular-nums">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-fg-muted">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3">
            {["Tilt card one", "Tilt card two", "Tilt card three"].map((title) => (
              <TiltCard key={title} className="rounded-3xl">
                <div
                  data-cursor="VIEW"
                  className="card-glass rounded-3xl p-8 transition-colors duration-300 hover:border-accent"
                >
                  <h2 className="text-h3 text-fg">{title}</h2>
                  <p className="mt-3 text-fg-muted">
                    Hover to check the tilt, the glare and the cursor label.
                  </p>
                </div>
              </TiltCard>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
