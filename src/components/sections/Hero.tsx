import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroCardStack } from "./HeroCardStack";
import { pages } from "@/data/copy";

export function Hero() {
  const { hero } = pages.home;

  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:min-h-svh">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div className="min-w-0">
            <Reveal y={20}>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </Reveal>

            <h1 className="mt-7 font-display text-display-1 text-fg">
              {hero.titleLines.map((line, i) => (
                <SplitText
                  key={line}
                  text={line}
                  by="word"
                  trigger="mount"
                  delay={0.25 + i * 0.12}
                  stagger={0.07}
                  highlight={hero.accentWord}
                  className="block"
                />
              ))}
            </h1>

            <Reveal delay={0.6} className="mt-7 max-w-xl">
              <p className="text-body-lg text-fg-muted">{hero.lead}</p>
            </Reveal>

            <Reveal delay={0.72} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <ButtonLink href={hero.primaryCta.href} size="lg">
                  {hero.primaryCta.label}
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href={hero.secondaryCta.href} variant="outline" size="lg" arrow>
                  {hero.secondaryCta.label}
                </ButtonLink>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <HeroCardStack />
          </Reveal>
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden h-14 w-px -translate-x-1/2 overflow-hidden bg-line lg:block"
      >
        <span className="block h-4 w-px animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-accent" />
      </span>
    </section>
  );
}
