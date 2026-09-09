"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import WhatWeDoSteps from "@/components/v2/what-we-do-steps";
import { StepActivityProvider } from "@/components/v2/step-activity";
import { Button } from "@/components/ui/button";
import EscalationDemo from "@/components/v2/how-it-works/escalation-demo";
import { SubNav } from "@/components/v2/sub-nav";
import StepTicks from "@/components/v2/how-it-works/step-ticks";
import { SectionIntro } from "@/components/v2/section-intro";
import { SplitSection } from "@/components/v2/split-section";
import { DividedGrid, RULED_ROW_CELL } from "@/components/v2/divided-grid";

const SECTIONS = [
  { label: "What you do", id: "what-you-do" },
  { label: "What we do", id: "what-we-do", detail: <StepTicks /> },
  { label: "What you get", id: "what-you-get" },
  { label: "Your decisions", id: "escalation" },
  { label: "Claims", id: "claims" },
  { label: "FAQ", id: "faq" },
];

// TODO: confirm the intake address. Meeting notes reference service@midpointverify.com;
// the site uses the midpointverified.com domain everywhere else.
const INTAKE_EMAIL = "service@midpointverified.com";

const youDo = [
  {
    title: "Send us your sub list and project list once.",
    body: "That's the whole onboarding. We build the roster and start from your active projects.",
  },
  {
    title: `CC ${INTAKE_EMAIL} on every executed subcontract.`,
    body: "When in doubt, send it. The signed agreement is what triggers everything we do.",
  },
  {
    title: "Read one weekly email.",
    body: "A short status report every week: which subs are verified, whose coverage expires soon, who still owes us a document, and anything that needs your call.",
  },
];

const youGet = [
  {
    title: "One weekly status email",
    body: "A plain-English list of every trade partner: who's verified, whose coverage expires soon, who still owes us a document, and which items need a decision from you. It takes two minutes to read and there's nothing to log into.",
    example: [
      { label: "Verified", value: "24 trade partners" },
      { label: "Expiring in 30 days", value: "3" },
      { label: "Missing a document", value: "2, being chased" },
      { label: "Needs your decision", value: "1" },
    ],
  },
  {
    title: "Records filed by project",
    body: "Every certificate and endorsement for every sub, ready the day an auditor or a carrier asks.",
  },
  {
    title: "A portal, if you want it",
    body: "Log in any time for a real-time view. You won't need to. The work doesn't depend on it.",
  },
];

const faqs = [
  {
    q: "Do I have to use a portal?",
    a: "No. You CC us on agreements and read a weekly email. A portal exists for a real-time view whenever you want one, but nothing depends on you logging in.",
  },
  {
    q: "Will my subs actually respond?",
    a: "We contact the subcontractor and the agent who wrote their policy, follow up automatically, and escalate to you only after repeated outreach hasn't worked. Most respond in the first cycle because the request comes with the exact requirements from their own signed agreement.",
  },
  {
    q: "Are you replacing my staff?",
    a: "We take the chasing and the document review. Your team keeps the decisions and gets its time back for the build.",
  },
  {
    q: "What about projects already underway?",
    a: "Send the executed agreements you have. Active projects go into monitoring immediately, and we work through the backlog as documents come in.",
  },
  {
    q: "What happens after a project ends?",
    a: "Monitoring continues for two years after completion. Claims arrive late, and the coverage that was in force on the day of the work is what matters.",
  },
  {
    q: "What does it cost?",
    a: "It depends on how many trade partners and active projects you run. Tell us about your projects and we'll give you a number on the first call.",
  },
];

export default function HowItWorksPage() {
  return (
    <MotionConfig reducedMotion="user">
    <StepActivityProvider>
      <main className="min-h-screen bg-background text-foreground">
        <SubNav title="How It Works" items={SECTIONS} />

        {/* Hero: on the rail, like the home page */}
        <section className="container-site pt-14 md:pt-20 pb-16 md:pb-20">
          <SectionIntro
            as="h1"
            eyebrow="How it works"
            title={
              <>
                Sign the sub. CC us.
                <br />
                Go back to building.
              </>
            }
            description="From the moment a subcontract is signed, we collect the certificates, verify the coverage against your contract, chase what's missing, and report back weekly. You don't log in to anything."
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button variant="ghost" size="lg" className="self-start sm:self-auto" asChild>
                <Link href="/resources/proper-risk-transfer">
                  Read the risk transfer guide <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </SectionIntro>
        </section>

        {/* What you do */}
        <section id="what-you-do" className="w-full section-y section-rule scroll-mt-28">
          <div className="container-site">
            <SectionIntro className="mb-12" eyebrow="What you do" title={<>Three things. Then you&apos;re done.</>} />
            <DividedGrid cols="md:grid-cols-3" frame="rules">
              {youDo.map((item, i) => (
                <div key={item.title} className={`${RULED_ROW_CELL} flex flex-col gap-4`}>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">0{i + 1}</span>
                  <h3 className="heading-4 text-base text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </DividedGrid>
          </div>
        </section>

        {/* What we do: five steps */}
        <WhatWeDoSteps />

        {/* What you get back */}
        <section id="what-you-get" className="w-full section-y section-rule scroll-mt-28">
          <div className="container-site">
            <SectionIntro className="mb-12" eyebrow="What you get back" title="Visibility without the busywork." />
            <DividedGrid cols="md:grid-cols-3" frame="rules">
              {youGet.map((item) => (
                <div key={item.title} className={`${RULED_ROW_CELL} flex flex-col`}>
                  <h3 className="heading-4 text-base text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  {"example" in item && item.example ? (
                    <dl className="mt-6 text-sm font-mono">
                      <p className="eyebrow mb-2">Example, one week</p>
                      <div className="divide-y divide-border border-y border-border">
                        {item.example.map((row) => (
                          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
                            <dt className="text-muted-foreground">{row.label}</dt>
                            <dd className={row.label === "Needs your decision" ? "text-primary" : "text-foreground"}>{row.value}</dd>
                          </div>
                        ))}
                      </div>
                    </dl>
                  ) : null}
                </div>
              ))}
            </DividedGrid>
          </div>
        </section>

        {/* When a sub won't respond */}
        <section id="escalation" className="w-full section-y section-rule scroll-mt-28">
          <div className="container-site">
            <SplitSection
              text={
                <SectionIntro
                  eyebrow="When a sub won't respond"
                  title="We chase. You decide."
                  measure="column"
                  description="We contact the sub and their agent repeatedly. After roughly thirty days without resolution, or fifteen days past an expiration, that trade partner shows up in your weekly status email with what's missing, every attempt we've made to get it, and a recommended next step. The decision stays yours."
                />
              }
              media={
                <div className="flex lg:justify-end">
                  <EscalationDemo />
                </div>
              }
            />
          </div>
        </section>

        {/* When a claim comes */}
        <section id="claims" className="w-full section-y section-rule scroll-mt-28">
          <div className="container-site">
            <SplitSection
              text={<SectionIntro eyebrow="When a claim comes" title="Insurance responds to paperwork, not intentions." measure="column" />}
              media={
                <blockquote className="border-y border-border py-6 md:py-8">
                  <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                    A $6M custom home flooded. The claim came to roughly $300K, including the owner&apos;s mortgage while the house was unlivable. Because the signed subcontract and the verified coverage were already in place, the claim was tendered correctly and covered in full.
                  </p>
                  {/* TODO: name Starwood Custom Homes once approved; confirm the $300K figure with Tyler. */}
                  <footer className="mt-5 eyebrow">Custom home builder, Arizona</footer>
                </blockquote>
              }
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full section-y section-rule scroll-mt-28">
          <div className="container-site grid lg:grid-cols-12 gap-x-8 gap-y-10 items-start">
            <SectionIntro className="lg:col-span-5" eyebrow="Questions builders ask" title="Before you hand it off" />
            <div className="lg:col-span-7 divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none text-base md:text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
                    {f.q}
                    <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full section-rule">
          <div className="container-site section-y">
            <h2 className="heading-2 text-foreground mb-4">Ready to stop thinking about insurance?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 measure-intro">
              Tell us about your projects and trade partners. We&apos;ll walk you through how the handoff works.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
          </div>
        </section>
      </main>
    </StepActivityProvider>
    </MotionConfig>
  );
}
