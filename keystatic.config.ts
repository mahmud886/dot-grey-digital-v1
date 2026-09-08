import { config, fields, singleton } from "@keystatic/core";
import { ICON_NAMES } from "./src/components/ui/Icon";

/**
 * DotGrey Digital content model.
 *
 * Every entry is a singleton holding one JSON file under src/content, which keeps the
 * site's data synchronously importable (`import data from "@/content/works.json"`) and
 * the whole site statically built. Collections would put each entry in its own file and
 * force an async reader, so singletons-with-arrays are the deliberate choice here.
 *
 * A singleton `path` without a trailing slash writes `<path>.json` — that is why these
 * point at "src/content/works" and not a directory.
 *
 * Storage: local (edits the working tree) unless a GitHub repo is configured, in which
 * case saving opens a commit against that repo. See docs/07-cms-setup.md.
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

const text = (label: string, description?: string) =>
  fields.text({ label, description, validation: { isRequired: true } });

const multiline = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true, validation: { isRequired: true } });

const stringList = (label: string, itemLabel = "Item") =>
  fields.array(fields.text({ label: itemLabel, validation: { isRequired: true } }), {
    label,
    itemLabel: (item) => item.value || itemLabel,
  });

const paragraphs = (label: string) =>
  fields.array(
    fields.text({ label: "Paragraph", multiline: true, validation: { isRequired: true } }),
    { label, itemLabel: (item) => item.value.slice(0, 60) || "Paragraph" },
  );

const iconField = (label = "Icon") =>
  fields.select({
    label,
    description: "Lucide icon name",
    options: ICON_NAMES.map((name) => ({ label: name, value: name })),
    defaultValue: "Layout",
  });

const linkGroup = (label: string) =>
  fields.object({ label: text("Label"), href: text("Path") }, { label });

const ctaGroup = fields.object({ label: text("Button label"), href: text("Link") }, { label: "Button" });

const proseBlocks = fields.array(
  fields.object({
    heading: text("Section heading"),
    paragraphs: paragraphs("Paragraphs"),
    bullets: stringList("Bullet points", "Bullet"),
  }),
  { label: "Sections", itemLabel: (item) => item.fields.heading.value || "Section" },
);

const legalGroup = (label: string) =>
  fields.object(
    {
      title: text("Page title"),
      updated: text("Last updated"),
      notice: fields.text({ label: "Notice banner", description: "Leave empty to hide" }),
      blocks: proseBlocks,
    },
    { label },
  );

export default config({
  storage: githubRepo
    ? { kind: "github", repo: githubRepo as `${string}/${string}` }
    : { kind: "local" },

  ui: {
    brand: { name: "DotGrey Digital" },
    navigation: {
      Site: ["site"],
      "Home page": ["home", "sections"],
      Content: ["services", "works", "team", "testimonials", "values", "stats"],
      Commercial: ["pricing", "faq", "jobs"],
      "Page copy": ["innerPages", "legalPages"],
    },
  },

  singletons: {
    site: singleton({
      label: "Site settings",
      path: "src/content/site",
      format: { data: "json" },
      schema: {
        name: text("Agency name"),
        shortName: text("Short name"),
        tagline: text("Tagline"),
        description: multiline("Description", "Used for search results and link previews"),
        url: text("Site URL", "Feeds metadata, sitemap and link previews"),
        email: text("Contact email"),
        phone: text("Phone number"),
        founded: fields.integer({ label: "Year founded", validation: { isRequired: true } }),
        offices: fields.array(
          fields.object({ label: text("City"), lines: stringList("Address lines", "Line") }),
          { label: "Offices", itemLabel: (item) => item.fields.label.value || "Office" },
        ),
        socials: fields.array(
          fields.object({ label: text("Network"), href: text("Link") }),
          { label: "Social links", itemLabel: (item) => item.fields.label.value || "Link" },
        ),
        mainNav: fields.array(
          fields.object({
            label: text("Label"),
            href: text("Path"),
            children: fields.array(linkGroup("Item"), {
              label: "Dropdown items",
              itemLabel: (item) => item.fields.label.value || "Item",
            }),
          }),
          { label: "Header navigation", itemLabel: (item) => item.fields.label.value || "Item" },
        ),
        footerCompanyNav: fields.array(linkGroup("Item"), {
          label: "Footer — company column",
          itemLabel: (item) => item.fields.label.value || "Item",
        }),
        legalNav: fields.array(linkGroup("Item"), {
          label: "Legal links",
          itemLabel: (item) => item.fields.label.value || "Item",
        }),
        serviceOptions: stringList("Form — service options", "Option"),
        budgetOptions: stringList("Form — budget options", "Option"),
        timelineOptions: stringList("Form — timeline options", "Option"),
      },
    }),

    home: singleton({
      label: "Home — hero",
      path: "src/content/pages/home",
      format: { data: "json" },
      schema: {
        hero: fields.object({
          eyebrow: text("Eyebrow"),
          titleLines: stringList("Headline lines", "Line"),
          accentWord: text("Accent word", "This word is picked out in orange"),
          lead: multiline("Lead paragraph"),
          primaryCta: ctaGroup,
          secondaryCta: ctaGroup,
        }),
      },
    }),

    sections: singleton({
      label: "Section copy",
      path: "src/content/sections",
      format: { data: "json" },
      schema: {
        featureRows: fields.object({
          rows: fields.array(
            fields.object({
              eyebrow: text("Eyebrow"),
              title: text("Headline"),
              accent: text("Accent line", "Shown in orange under the headline"),
              lead: multiline("Lead paragraph"),
              bullets: stringList("Bullets", "Bullet"),
              cta: ctaGroup,
              icon: iconField(),
            }),
            { label: "Feature rows", itemLabel: (item) => item.fields.title.value || "Row" },
          ),
        }),
        works: fields.object({
          eyebrow: text("Eyebrow"),
          title: text("Heading"),
          lead: multiline("Lead"),
          ctaLabel: text("Button label"),
        }),
        services: fields.object({
          eyebrow: text("Eyebrow"),
          title: text("Heading"),
          ctaLabel: text("Button label"),
        }),
        innovative: fields.object({
          eyebrow: text("Eyebrow"),
          statement: multiline("Large statement"),
          body: paragraphs("Supporting paragraphs"),
          ctaLabel: text("Button label"),
        }),
        testimonials: fields.object({ eyebrow: text("Eyebrow"), title: text("Heading") }),
        faq: fields.object({
          eyebrow: text("Eyebrow"),
          title: text("Heading"),
          cardTitle: text("Call card title"),
          cardBody: multiline("Call card text"),
          ctaLabel: text("Call card button"),
        }),
        projectForm: fields.object({
          eyebrow: text("Eyebrow"),
          titleLines: stringList("Heading lines", "Line"),
          lead: multiline("Lead"),
          submitLabel: text("Submit button label"),
        }),
        marquee: fields.object({ items: stringList("Scrolling items", "Item") }),
      },
    }),

    services: singleton({
      label: "Services",
      path: "src/content/services",
      format: { data: "json" },
      schema: {
        services: fields.array(
          fields.object({
            slug: text("URL slug", "Changing this changes the page URL"),
            number: text("Number", "Shown on the card, e.g. 01"),
            title: text("Title"),
            icon: iconField(),
            blurb: multiline("Short description"),
            lead: multiline("Page lead"),
            tags: stringList("Tags", "Tag"),
            overview: paragraphs("Overview paragraphs"),
            included: stringList("What's included", "Item"),
            features: fields.array(
              fields.object({
                title: text("Title"),
                description: multiline("Description"),
                icon: iconField(),
              }),
              { label: "Features", itemLabel: (item) => item.fields.title.value || "Feature" },
            ),
            benefits: fields.array(
              fields.object({ title: text("Title"), description: multiline("Description") }),
              { label: "Benefits", itemLabel: (item) => item.fields.title.value || "Benefit" },
            ),
            industries: stringList("Industries", "Industry"),
          }),
          { label: "Services", itemLabel: (item) => item.fields.title.value || "Service" },
        ),
      },
    }),

    works: singleton({
      label: "Works",
      path: "src/content/works",
      format: { data: "json" },
      schema: {
        categories: stringList("Filter categories", "Category"),
        works: fields.array(
          fields.object({
            slug: text("URL slug"),
            title: text("Title"),
            year: text("Year"),
            category: text("Category", "Must match one of the categories above"),
            client: text("Client"),
            summary: multiline("One-line summary"),
            tags: stringList("Tags", "Tag"),
            services: stringList("Services used", "Service"),
            cover: fields.image({
              label: "Cover image",
              description: "16:10 works best",
              directory: "public/img/works",
              publicPath: "/img/works",
              validation: { isRequired: true },
            }),
            gallery: fields.array(
              fields.image({
                label: "Image",
                directory: "public/img/works",
                publicPath: "/img/works",
                validation: { isRequired: true },
              }),
              { label: "Gallery" },
            ),
            challenge: multiline("The challenge"),
            solution: multiline("What we did"),
            stats: fields.array(
              fields.object({ value: text("Value"), label: text("Label") }),
              { label: "Result stats", itemLabel: (item) => item.fields.value.value || "Stat" },
            ),
            quote: fields.object({
              text: multiline("Quote"),
              author: text("Author"),
              role: text("Role"),
            }),
          }),
          { label: "Projects", itemLabel: (item) => item.fields.title.value || "Project" },
        ),
      },
    }),

    team: singleton({
      label: "Team",
      path: "src/content/team",
      format: { data: "json" },
      schema: {
        team: fields.array(
          fields.object({
            slug: text("URL slug"),
            name: text("Name"),
            role: text("Role"),
            portrait: fields.image({
              label: "Portrait",
              description: "4:5 portrait works best",
              directory: "public/img/team",
              publicPath: "/img/team",
              validation: { isRequired: true },
            }),
            bio: paragraphs("Bio"),
            skills: fields.array(
              fields.object({
                label: text("Skill"),
                value: fields.integer({
                  label: "Percentage",
                  validation: { isRequired: true, min: 0, max: 100 },
                }),
              }),
              { label: "Skills", itemLabel: (item) => item.fields.label.value || "Skill" },
            ),
            socials: fields.array(linkGroup("Link"), {
              label: "Social links",
              itemLabel: (item) => item.fields.label.value || "Link",
            }),
          }),
          { label: "Team members", itemLabel: (item) => item.fields.name.value || "Member" },
        ),
      },
    }),

    testimonials: singleton({
      label: "Testimonials",
      path: "src/content/testimonials",
      format: { data: "json" },
      schema: {
        testimonials: fields.array(
          fields.object({
            id: text("ID", "Any unique value — not shown on the site"),
            quote: multiline("Quote"),
            author: text("Author"),
            role: text("Role and company"),
            location: text("Location"),
            rating: fields.integer({
              label: "Star rating",
              validation: { isRequired: true, min: 1, max: 5 },
            }),
          }),
          { label: "Testimonials", itemLabel: (item) => item.fields.author.value || "Quote" },
        ),
      },
    }),

    values: singleton({
      label: "Values",
      path: "src/content/values",
      format: { data: "json" },
      schema: {
        values: fields.array(
          fields.object({ title: text("Title"), body: multiline("Description") }),
          { label: "Values", itemLabel: (item) => item.fields.title.value || "Value" },
        ),
      },
    }),

    stats: singleton({
      label: "Stats",
      path: "src/content/stats",
      format: { data: "json" },
      schema: {
        stats: fields.array(
          fields.object({
            value: fields.integer({ label: "Number", validation: { isRequired: true } }),
            suffix: fields.text({ label: "Suffix", description: "For example +" }),
            label: text("Label"),
          }),
          { label: "Stats", itemLabel: (item) => item.fields.label.value || "Stat" },
        ),
      },
    }),

    pricing: singleton({
      label: "Pricing",
      path: "src/content/pricing",
      format: { data: "json" },
      schema: {
        modes: fields.array(
          fields.object({ id: text("ID"), label: text("Label"), suffix: text("Price suffix") }),
          { label: "Billing modes", itemLabel: (item) => item.fields.label.value || "Mode" },
        ),
        plans: fields.array(
          fields.object({
            id: text("ID", "Must match the comparison table columns"),
            name: text("Plan name"),
            price: fields.object({
              monthly: fields.integer({ label: "Monthly price", validation: { isRequired: true } }),
              project: fields.integer({ label: "Project price", validation: { isRequired: true } }),
            }),
            blurb: multiline("Short description"),
            features: stringList("Features", "Feature"),
            featured: fields.checkbox({ label: "Highlight as most popular" }),
          }),
          { label: "Plans", itemLabel: (item) => item.fields.name.value || "Plan" },
        ),
        comparison: fields.array(
          fields.object({
            label: text("Feature"),
            values: fields.object({
              starter: text("Starter"),
              growth: text("Growth"),
              scale: text("Scale"),
            }),
          }),
          { label: "Comparison table", itemLabel: (item) => item.fields.label.value || "Row" },
        ),
      },
    }),

    faq: singleton({
      label: "FAQ",
      path: "src/content/faq",
      format: { data: "json" },
      schema: {
        categories: stringList("Categories", "Category"),
        faqs: fields.array(
          fields.object({
            id: text("ID", "Any unique value — not shown on the site"),
            category: text("Category", "Must match one of the categories above"),
            question: text("Question"),
            answer: multiline("Answer"),
          }),
          { label: "Questions", itemLabel: (item) => item.fields.question.value || "Question" },
        ),
      },
    }),

    jobs: singleton({
      label: "Careers — roles & benefits",
      path: "src/content/jobs",
      format: { data: "json" },
      schema: {
        benefits: fields.array(
          fields.object({ title: text("Benefit"), body: multiline("Description") }),
          { label: "Benefits", itemLabel: (item) => item.fields.title.value || "Benefit" },
        ),
        jobs: fields.array(
          fields.object({
            slug: text("URL slug"),
            title: text("Job title"),
            department: text("Department"),
            location: text("Location"),
            type: text("Type"),
            summary: multiline("Summary"),
            responsibilities: stringList("Responsibilities", "Item"),
            requirements: stringList("Requirements", "Item"),
            niceToHave: stringList("Nice to have", "Item"),
          }),
          { label: "Open roles", itemLabel: (item) => item.fields.title.value || "Role" },
        ),
      },
    }),

    innerPages: singleton({
      label: "Inner page copy",
      path: "src/content/pages/inner",
      format: { data: "json" },
      schema: {
        about: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          storyTitle: text("Story heading"),
          storyImage: fields.image({
            label: "Story image",
            directory: "public/img",
            publicPath: "/img",
            validation: { isRequired: true },
          }),
          storyParagraphs: paragraphs("Story paragraphs"),
          valuesLabel: text("Values eyebrow"),
          valuesTitle: text("Values heading"),
        }),
        services: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          processLabel: text("Process eyebrow"),
          processTitle: text("Process heading"),
          process: fields.array(
            fields.object({ title: text("Step title"), body: multiline("Step description") }),
            { label: "Process steps", itemLabel: (item) => item.fields.title.value || "Step" },
          ),
        }),
        works: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          emptyState: text("Empty filter message"),
        }),
        team: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          hiringTitle: text("Hiring band heading"),
          hiringBody: text("Hiring band text", "The number of roles is added automatically"),
          hiringCtaLabel: text("Hiring band button"),
        }),
        pricing: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          comparisonLabel: text("Comparison eyebrow"),
          comparisonTitle: text("Comparison heading"),
        }),
        faq: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          stillTitle: text("Bottom card heading"),
          stillBody: multiline("Bottom card text"),
          stillCtaLabel: text("Bottom card button"),
        }),
        careers: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          whyTitle: text("Why-work-here heading"),
          whyParagraphs: paragraphs("Why-work-here paragraphs"),
          cultureImage: fields.image({
            label: "Culture image",
            directory: "public/img",
            publicPath: "/img",
            validation: { isRequired: true },
          }),
          rolesLabel: text("Open roles eyebrow"),
          applyTitle: text("Application form heading"),
          applyBody: multiline("Application form text"),
        }),
        contact: fields.object({
          title: text("Page title"),
          lead: multiline("Intro"),
          mapLabel: text("Map band label"),
        }),
        notFound: fields.object({
          code: text("Large number"),
          title: text("Heading"),
          body: multiline("Body text"),
          primaryCtaLabel: text("Primary button"),
          secondaryCtaLabel: text("Secondary button"),
        }),
      },
    }),

    legalPages: singleton({
      label: "Privacy & Terms",
      path: "src/content/pages/legal",
      format: { data: "json" },
      schema: {
        privacy: legalGroup("Privacy Policy"),
        terms: legalGroup("Terms of Use"),
      },
    }),
  },
});
