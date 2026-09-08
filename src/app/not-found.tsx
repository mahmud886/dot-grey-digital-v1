import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/SplitText";
import { Magnetic } from "@/components/ui/Magnetic";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { pages } from "@/data/copy";

export default function NotFound() {
  const copy = pages.notFound;

  // Unmatched URLs render outside the (site) group, so this page brings its own chrome.
  return (
    <SiteChrome>
      <section className="relative grid min-h-[80svh] place-items-center overflow-hidden py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,var(--accent-dim),transparent_70%)]"
        />

        <Container className="relative text-center">
          <p className="font-display text-display-1 leading-none text-fg">
            <SplitText text={copy.code} trigger="mount" />
          </p>
          <h1 className="mt-6 font-display text-h1 text-fg">{copy.title}</h1>
          <p className="mx-auto mt-5 max-w-md text-body-lg text-fg-muted">{copy.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <ButtonLink href="/">{copy.primaryCtaLabel}</ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/works" variant="outline" arrow>
                {copy.secondaryCtaLabel}
              </ButtonLink>
            </Magnetic>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
