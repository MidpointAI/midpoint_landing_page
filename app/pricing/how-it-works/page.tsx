import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DividedGrid, DIVIDED_CELL } from "@/components/v2/divided-grid";
import { SubNav } from "@/components/v2/sub-nav";

const SECTIONS = [
  { label: "Overview", id: "overview" },
  { label: "Two ways to price", id: "plans" },
  { label: "What's included", id: "included" },
  { label: "Why this pricing", id: "why" },
  { label: "Fine print", id: "fine-print" },
];

export const metadata: Metadata = {
  title: "Pricing | Midpoint",
  description: "A flat rate per subcontractor for builders under 100 subs, and a per-project rate for larger general contractors and commercial outfits. Everything included.",
  alternates: { canonical: "/pricing/how-it-works" },
};

// $150 per sub per year and the $6,000 minimum confirmed by Andy, Sep 2026.
const PER_SUB = "$150";
const MINIMUM = "$6,000";
const THRESHOLD = 100;

const included = [
  "Every active sub, on every project, held to that project's requirements",
  "Certificates and endorsements requested from the sub and their agent, then verified against your contract",
  "Follow-up on every gap and every expiration until it's resolved",
  "Monitoring for two years after each project closes",
  "One weekly status email, and a portal if you ever want it",
];

const projectFactors = [
  { k: "Subcontractor spend", v: "How much subcontracted work the project carries." },
  { k: "Number of subs", v: "How many trade partners we'll be collecting from and verifying." },
  { k: "Project value", v: "The size of the job the coverage is protecting." },
  { k: "Our risk", v: "What we take on by verifying, and standing behind, compliance on that project." },
];

const why = [
  {
    title: "Requirements are set per project, not per company",
    body: "The same subcontractor can be on two of your projects with two different requirement sets. We hold each one to the right contract, so a simpler job and a stricter job are each verified on their own terms.",
  },
  {
    title: "We do the work, not your office",
    body: "Requests, chasing, verification, expirations. Your team sends nothing and reads one email a week. That's the service you're paying for.",
  },
  {
    title: "It doesn't end when the project does",
    body: "Claims arrive late. We keep collecting and verifying coverage for two years after a project closes, so your risk transfer holds when it's tested.",
  },
  {
    title: "We work with your agent on next year",
    body: "Verified compliance is worth something to carriers. We coordinate with your agent and the carrier you choose so your own program reflects it at renewal.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SubNav title="Pricing" items={SECTIONS} />

      <PageHeader
        id="overview"
        className="scroll-mt-28"
        eyebrow="Pricing"
        title="Two ways to price. Both include everything."
        description={`Builders with fewer than ${THRESHOLD} active subcontractors pay a flat rate per sub. Larger general contractors and commercial outfits pay a rate per project. Either way, the whole service is included.`}
      />

      {/* The two paths */}
      <section id="plans" className="container-site pb-16 md:pb-20 scroll-mt-28">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-7 md:p-9 flex flex-col">
            <p className="eyebrow mb-3">Per subcontractor</p>
            <p className="font-mono text-4xl md:text-5xl text-foreground tabular-nums">
              {PER_SUB}
              <span className="block sm:inline text-base text-muted-foreground sm:ml-2">per sub, per year</span>
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              For builders with fewer than {THRESHOLD} active subcontractors. One rate for every sub with a signed agreement on a current project, confirmed on the first call. Billed annually, {MINIMUM} minimum.
            </p>
            <div className="mt-auto pt-6">
              <Button asChild>
                <Link href="/contact">
                  Get your rate <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-card p-7 md:p-9 flex flex-col">
            <p className="eyebrow mb-3">Per project</p>
            <p className="font-mono text-4xl md:text-5xl text-foreground">Quoted per project</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              For general contractors with {THRESHOLD}+ subs and commercial outfits. Each project gets its own rate you can build into the bid. The rate maps to four things:
            </p>
            <dl className="mt-5 space-y-2.5">
              {projectFactors.map((f) => (
                <div key={f.k} className="flex gap-3 text-sm">
                  <dt className="w-40 shrink-0 font-medium text-foreground">{f.k}</dt>
                  <dd className="text-muted-foreground">{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-6">
              <Button asChild>
                <Link href="/contact">
                  Request a proposal <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Included */}
      <section id="included" className="section-rule container-site pt-16 md:pt-20 pb-16 md:pb-20 scroll-mt-28">
        <div className="rounded-xl border border-border bg-card p-7 md:p-9 grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12">
          <div>
            <p className="eyebrow mb-3">Included in both</p>
            <h2 className="heading-3 text-foreground">No modules. No add-ons. Nothing to log into.</h2>
          </div>
          <ul className="space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3 text-sm md:text-base text-foreground/90">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why the price is what it is */}
      <section id="why" className="section-rule container-site pt-16 md:pt-20 pb-16 md:pb-20 scroll-mt-28">
        <div className="measure-intro mb-10">
          <p className="eyebrow mb-4">Why it&apos;s priced this way</p>
          <h2 className="heading-2 text-foreground">You&apos;re paying for the nuance, and for not having to manage it.</h2>
        </div>
        <DividedGrid cols="md:grid-cols-2">
          {why.map((w) => (
            <div key={w.title} className={DIVIDED_CELL}>
              <h3 className="heading-4 text-base text-foreground mb-3">{w.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
            </div>
          ))}
        </DividedGrid>
      </section>

      {/* Fine print + CTA */}
      <section id="fine-print" className="section-rule scroll-mt-28">
        <div className="container-prose pt-16 md:pt-20 pb-20 md:pb-28">
        <dl className="divide-y divide-border border-y border-border">
          {[
            ["Active sub", "Any subcontractor with a signed agreement on a project that's currently open. The same sub on two projects counts once for per-sub pricing, and is verified separately against each project's requirements."],
            ["Renewal", "Your first year is locked at signing. At renewal we recount active subs, or re-scope your projects, and the price moves with your business."],
            ["Changing paths", `Grow past ${THRESHOLD} subs, or take on a large commercial job, and we'll move you to per-project pricing at renewal.`],
          ].map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-[180px_1fr] gap-2 sm:gap-8 py-6">
              <dt className="text-sm font-medium text-foreground">{k}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 text-center">
          <h2 className="heading-3 text-foreground mb-3">Want a number for your roster or your next project?</h2>
          <p className="text-muted-foreground mb-6">Tell us how many subs and what you build. You&apos;ll have it on the first call.</p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
        </div>
        </div>
      </section>
    </main>
  );
}
