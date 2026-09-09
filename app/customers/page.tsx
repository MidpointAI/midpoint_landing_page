import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import StatsStrip from "@/components/v2/stats-strip";
import { CompanyLogo, logoHeightClass, TestimonialCard } from "@/components/v2/testimonial-card";
import { OnePagerTrigger } from "@/components/one-pager-trigger";
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

/** Company, place, and size on one line above every story. */
function StoryMeta({ story, className = "" }: { story: CustomerStory; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      {story.logo ? (
        <CompanyLogo logo={story.logo} name={story.company} className={logoHeightClass(story.logo, "h-7", "h-12")} />
      ) : (
        <span className="text-sm font-medium text-foreground">{story.company}</span>
      )}
      <span className="text-sm text-muted-foreground">
        {story.location} · {story.scale}
      </span>
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

export default function CustomersPage() {
  const heroQuote = quoteFor(hero);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Customers"
        title="Builders who stopped chasing certificates"
        description="Arizona builders who handed trade partner compliance to Midpoint. What they were dealing with, what we took over, and what changed."
      />

      <StatsStrip />

      {/* Hero story */}
      <section id={hero.outcome} className="container-site pt-16 md:pt-20 pb-6 scroll-mt-24">
        <p className="eyebrow mb-4">{OUTCOME_LABEL[hero.outcome]}</p>
        <article className="rounded-xl border border-primary/30 bg-card p-7 md:p-10 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
          <div>
            <StoryMeta story={hero} className="mb-6" />
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
        <div className="grid md:grid-cols-2 gap-4">
          {supporting.map((story) => {
            const quote = quoteFor(story);
            return (
              <article
                key={story.id}
                id={story.outcome}
                className="rounded-xl border border-border bg-card p-7 md:p-8 flex flex-col scroll-mt-24"
              >
                <p className="eyebrow mb-4">{OUTCOME_LABEL[story.outcome]}</p>
                <StoryMeta story={story} className="mb-5" />
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
        </div>
      </section>

      {/* Producer hand-off + CTA */}
      <section className="container-prose pb-20 md:pb-28">
        <div className="rounded-xl border border-border bg-secondary/30 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Sending this to a client? The one-pager covers the same ground on one sheet.
          </p>
          <OnePagerTrigger variant="link" className="justify-start">
            Open the one-pager <ArrowRightIcon />
          </OnePagerTrigger>
        </div>
        <div className="mt-16 text-center">
          <h2 className="heading-2 text-foreground mb-3">Want your name here?</h2>
          <p className="text-muted-foreground mb-6">
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
