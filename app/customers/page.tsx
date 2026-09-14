import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import StatsStrip from "@/components/v2/stats-strip";
import { CompanyLogo, logoHeightClass, TestimonialCard } from "@/components/v2/testimonial-card";
import { OnePagerTrigger } from "@/components/one-pager-trigger";
import { DividedGrid, DIVIDED_CELL } from "@/components/v2/divided-grid";
import { SubNav } from "@/components/v2/sub-nav";
import {
  customerStories,
  OUTCOME_LABEL,
  testimonials,
  type CustomerStory,
} from "@/components/v2/customer-stories-data";

// Only stories with written permission on file reach the page.
const stories = customerStories.filter((s) => s.approved);
const hero = stories.find((s) => s.hero) ?? stories[0];
const supporting = stories.filter((s) => s !== hero);

function quoteFor(story: CustomerStory) {
  return testimonials.find((t) => t.name === story.testimonialName);
}

/** The client's logo, large, with place and size underneath. Leads every story. */
function StoryMeta({
  story,
  size = "md",
  className = "",
}: {
  story: CustomerStory;
  size?: "md" | "lg";
  className?: string;
}) {
  const heights = size === "lg" ? (["h-12", "h-24"] as const) : (["h-9", "h-20"] as const);
  return (
    <div className={className}>
      {story.logo ? (
        <CompanyLogo logo={story.logo} name={story.company} className={`${logoHeightClass(story.logo, ...heights)} text-foreground`} />
      ) : (
        <p className="heading-4 text-foreground">{story.company}</p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground/80">{story.company}</span> · {story.location} · {story.scale}
      </p>
    </div>
  );
}

/** Every client with a logo on file, in one row under the header. */
function ClientLogoRow() {
  const withLogo = stories.filter((s) => s.logo);
  if (withLogo.length === 0) return null;
  return (
    <div className="container-site pb-12 md:pb-16">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 items-center" aria-label="Clients">
        {withLogo.map((s) => (
          <li key={s.id}>
            <a href={`#${s.outcome}`} className="inline-block opacity-80 transition-opacity hover:opacity-100" aria-label={`${s.company} story`}>
              <CompanyLogo logo={s.logo!} name={s.company} className={logoHeightClass(s.logo!, "h-8", "h-16")} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Narrative({ story, compact = false }: { story: CustomerStory; compact?: boolean }) {
  const parts = [
    ["The problem", story.problem],
    ["What we did", story.action],
    ["The result", story.result],
  ] as const;
  return (
    <dl className={compact ? "space-y-4" : "space-y-6"}>
      {parts.map(([k, v]) => (
        <div key={k}>
          <dt className="eyebrow mb-1.5">{k}</dt>
          <dd className={`${compact ? "text-sm" : "text-base"} text-foreground/90 leading-relaxed`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const SECTIONS = [
  { label: "Overview", id: "overview" },
  { label: "Results", id: "results" },
  { label: "Premium", id: "premium" },
  { label: "Subs respond", id: "subs-respond" },
  { label: "Audits and claims", id: "audit-and-claims" },
];

export default function CustomersPage() {
  const heroQuote = quoteFor(hero);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SubNav title="Customers" items={SECTIONS} />

      <PageHeader
        className="scroll-mt-28"
        id="overview"
        eyebrow="Customers"
        title="Builders who stopped chasing certificates"
        description="Arizona builders who handed trade partner compliance to Midpoint. What they were dealing with, what we took over, and what changed."
      />

      <ClientLogoRow />

      <div id="results" className="scroll-mt-28">
        <StatsStrip />
      </div>

      {/* Hero story */}
      <section id={hero.outcome} className="container-site pt-16 md:pt-20 pb-6 scroll-mt-28">
        <p className="eyebrow-accent mb-4">{OUTCOME_LABEL[hero.outcome]}</p>
        <article className="rounded-xl border border-primary/30 bg-card p-7 md:p-10 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
          <div>
            <StoryMeta story={hero} size="lg" className="mb-8" />
            <h2 className="heading-2 text-foreground mb-8">{hero.headline}</h2>
            <Narrative story={hero} />
          </div>
          <div className="flex flex-col lg:border-l lg:border-border lg:pl-14">
            <p className="font-mono text-6xl md:text-7xl text-primary tabular-nums leading-none">{hero.stat.value}</p>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">{hero.stat.label}</p>
            {heroQuote ? (
              <TestimonialCard item={heroQuote} showMark={false} showHighlight={false} className="mt-10 pt-8 border-t border-border" />
            ) : null}
          </div>
        </article>
      </section>

      {/* Supporting stories */}
      <section className="container-site pt-10 pb-16 md:pb-20">
        <DividedGrid cols="md:grid-cols-2">
          {supporting.map((story) => {
            const quote = quoteFor(story);
            return (
              <article
                key={story.id}
                id={story.outcome}
                className={`${DIVIDED_CELL} flex flex-col scroll-mt-28`}
              >
                <p className="eyebrow-accent mb-4">{OUTCOME_LABEL[story.outcome]}</p>
                <StoryMeta story={story} className="mb-6" />
                <h2 className="heading-3 text-foreground mb-6">{story.headline}</h2>
                <Narrative story={story} compact />
                <div className="mt-8 flex items-baseline gap-3">
                  <p className="font-mono text-4xl text-primary tabular-nums leading-none">{story.stat.value}</p>
                  <p className="text-sm text-muted-foreground">{story.stat.label}</p>
                </div>
                {quote ? (
                  <TestimonialCard item={quote} showMark={false} showHighlight={false} className="mt-8 pt-6 border-t border-border" />
                ) : null}
              </article>
            );
          })}
        </DividedGrid>
      </section>

      {/* Producer hand-off */}
      <section className="container-site pb-16 md:pb-20">
        <div className="rounded-xl border border-border bg-secondary/30 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Sending this to a client? The one-pager covers the same ground on one sheet.
          </p>
          <OnePagerTrigger variant="link" className="justify-start">
            Open the one-pager <ArrowRightIcon />
          </OnePagerTrigger>
        </div>
      </section>

      {/* CTA */}
      <section className="section-rule">
        <div className="container-site section-y">
          <h2 className="heading-2 text-foreground mb-3">Want your name here?</h2>
          <p className="text-muted-foreground mb-6 measure-intro">
            Tell us how many trade partners you run and what you build. We&apos;ll show you what the first month looks like.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
        </div>
      </section>
    </main>
  );
}
