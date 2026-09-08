"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

// Rates and tiers reflect the model discussed in Aug–Sep 2026 planning:
// $100/sub base, complexity multipliers of 1.25× and 1.5×, $6,000 floor,
// project-based proposals above ~100 subs. Confirm before publishing.
const FLOOR = 6000;
const PROPOSAL_THRESHOLD = 100;

type Tier = { id: string; name: string; rate: number; fits: string; signals: string[] };

const TIERS: Tier[] = [
  {
    id: "standard",
    name: "Standard",
    rate: 100,
    fits: "Residential and light commercial work with a handful of active projects.",
    signals: ["A few active projects at a time", "Under $5M in annual subcontractor spend", "Typical certificate and endorsement requirements"],
  },
  {
    id: "elevated",
    name: "Elevated",
    rate: 125,
    fits: "Commercial builders running several projects with more demanding contracts.",
    signals: ["Four to eight active projects", "$5M to $15M in annual subcontractor spend", "Project-specific requirement sets"],
  },
  {
    id: "complex",
    name: "Complex",
    rate: 150,
    fits: "Large commercial or multi-site programs with strict, varied insurance requirements.",
    signals: ["Nine or more active projects", "$15M+ in annual subcontractor spend", "Owner-driven requirements, wrap-ups, or unusual coverages"],
  },
];

const estimate = (subs: number, rate: number) => Math.max(FLOOR, subs * rate);

function Money({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `$${Math.round(v).toLocaleString("en-US")}`);
  useEffect(() => {
    const ctrl = animate(mv, value, { type: "spring", bounce: 0, duration: 0.5 });
    return () => ctrl.stop();
  }, [value, mv]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

export default function PricingPage() {
  const [subs, setSubs] = useState(40);
  const [tierId, setTierId] = useState("standard");
  const tier = TIERS.find((t) => t.id === tierId)!;
  const total = estimate(subs, tier.rate);
  const atFloor = subs * tier.rate < FLOOR;
  const needsProposal = subs >= PROPOSAL_THRESHOLD;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Pricing"
        title="Subs × complexity = your yearly price."
        description="One rate per active subcontractor, set by how complex your projects are. Billed annually. No per-seat licenses, no modules, nothing to log into."
      />

      {/* The formula, stated plainly */}
      <section className="container-site pb-16 md:pb-20">
        <div className="rounded-xl border border-border bg-card p-6 md:p-10">
          <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-6 text-center">
            <div>
              <p className="font-mono text-3xl md:text-4xl text-foreground tabular-nums">Active subs</p>
              <p className="mt-2 text-sm text-muted-foreground">Everyone with a signed agreement on a current project.</p>
            </div>
            <p className="font-mono text-3xl text-primary">×</p>
            <div>
              <p className="font-mono text-3xl md:text-4xl text-foreground">Complexity rate</p>
              <p className="mt-2 text-sm text-muted-foreground">$100, $125, or $150 per sub, per year.</p>
            </div>
            <p className="font-mono text-3xl text-primary">=</p>
            <div>
              <p className="font-mono text-3xl md:text-4xl text-primary">Yearly price</p>
              <p className="mt-2 text-sm text-muted-foreground">Minimum ${FLOOR.toLocaleString("en-US")} a year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complexity tiers */}
      <section className="container-site pb-16 md:pb-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-4">Complexity</p>
          <h2 className="heading-2 text-foreground mb-4">Three rates. Your projects decide which one.</h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Complexity is mostly about how much subcontractor work you run and how demanding the insurance requirements are. We confirm the tier with you on the first call.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-7 flex flex-col">
              <p className="eyebrow mb-3">{t.name}</p>
              <p className="font-mono text-4xl text-foreground tabular-nums">
                ${t.rate}
                <span className="text-base text-muted-foreground"> / sub / year</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t.fits}</p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                {t.signals.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Estimator */}
      <section className="container-site pb-16 md:pb-20">
        <div className="rounded-xl border border-border bg-card p-6 md:p-10 grid lg:grid-cols-[1fr_minmax(0,360px)] gap-10 items-center">
          <div>
            <p className="eyebrow mb-4">Estimate</p>
            <h2 className="heading-3 text-foreground mb-6">Try your numbers.</h2>

            <label htmlFor="subs" className="flex items-baseline justify-between text-sm text-muted-foreground mb-2">
              <span>Active subcontractors</span>
              <span className="font-mono text-foreground tabular-nums">{subs}{subs >= 150 ? "+" : ""}</span>
            </label>
            <input
              id="subs"
              type="range"
              min={10}
              max={150}
              step={1}
              value={subs}
              onChange={(e) => setSubs(Number(e.target.value))}
              className="w-full accent-primary"
            />

            <p className="text-sm text-muted-foreground mt-6 mb-2">Project complexity</p>
            <div role="radiogroup" aria-label="Project complexity" className="inline-flex rounded-full border border-border bg-background p-0.5">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={tierId === t.id}
                  onClick={() => setTierId(t.id)}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tierId === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tierId === t.id && <motion.span layoutId="tier-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
                  <span className="relative">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="eyebrow mb-3">Estimated yearly price</p>
            <p className="font-mono text-5xl text-primary">
              <Money value={total} />
            </p>
            <p className="mt-3 text-sm text-muted-foreground min-h-[40px]">
              {needsProposal
                ? "At this size we price by project instead. We'll build a proposal you can put into a bid."
                : atFloor
                  ? `${subs} × $${tier.rate} is under the $${FLOOR.toLocaleString("en-US")} minimum, so the minimum applies.`
                  : `${subs} subs × $${tier.rate} per sub.`}
            </p>
            <Button asChild className="mt-4">
              <Link href="/contact">
                {needsProposal ? "Request a proposal" : "Confirm your tier"} <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The fine print, plainly */}
      <section className="container-prose pb-20 md:pb-28">
        <dl className="divide-y divide-border border-y border-border">
          {[
            ["What counts as an active sub", "Any subcontractor with a signed agreement on a project that's currently open. Subs on closed projects stay monitored for two years at no extra charge."],
            ["Renewal", "Your first year is locked at signing. At renewal we recount active subs and confirm the tier, and the price moves with your business, up or down."],
            ["Larger programs", `Above ${PROPOSAL_THRESHOLD} subs, or across multiple large projects, we price by project so you can build it into bids. Onboarding for large implementations is scoped in the proposal.`],
            ["What's included", "Everything: collection, verification against your contracts, follow-ups with subs and their agents, expiration monitoring, and the weekly status email. There are no add-ons."],
          ].map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-8 py-6">
              <dt className="text-sm font-medium text-foreground">{k}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 text-center">
          <h2 className="heading-3 text-foreground mb-3">Want a number for your roster?</h2>
          <p className="text-muted-foreground mb-6">Tell us how many subs and what you build. You&apos;ll have a price on the first call.</p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
        </div>
      </section>
    </main>
  );
}
