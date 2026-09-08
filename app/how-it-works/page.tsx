"use client";

import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import WhatWeDoSteps from "@/components/v2/what-we-do-steps";
import { StepActivityProvider } from "@/components/v2/step-activity";
import { Button } from "@/components/ui/button";

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
    body: "Who's verified, who's expiring, who's ignoring us, and anything that needs a decision from you.",
  },
];

const youGet = [
  {
    title: "A weekly digest",
    body: "Every trade partner by status: verified, expiring, missing documents, or waiting on you.",
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

const decisions = [
  "Hold a payment until the coverage is in place",
  "Restrict site access for that trade partner",
  "Accept an exception or alternative documentation",
  "Replace the subcontractor",
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
    <StepActivityProvider>
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="w-full section-y">
          <div className="container-site flex flex-col items-center text-center gap-6">
            <p className="eyebrow">How it works</p>
            <h1 className="heading-1 md:text-6xl text-foreground max-w-3xl">
              Sign the sub. CC us.
              <br />
              Go back to building.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
              From the moment a subcontract is signed, we collect the certificates, verify the coverage against your contract, chase what&apos;s missing, and report back weekly. You don&apos;t log in to anything.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button size="lg" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/resources/proper-risk-transfer">
                  Read the risk transfer guide <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What you do */}
        <section id="what-you-do" className="w-full section-y border-t border-border scroll-mt-20">
          <div className="container-site">
            <div className="max-w-2xl mb-12">
              <p className="eyebrow mb-4">What you do</p>
              <h2 className="heading-2 text-foreground">Three things. Then you&apos;re done.</h2>
            </div>
            <ol className="grid md:grid-cols-3 gap-4">
              {youDo.map((item, i) => (
                <li key={item.title} className="rounded-xl border border-border bg-card p-7 flex flex-col gap-4">
                  <span className="font-mono text-sm text-primary tracking-[0.3em]">0{i + 1}</span>
                  <h3 className="heading-4 text-base text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What we do: five steps */}
        <WhatWeDoSteps />

        {/* What you get back */}
        <section id="what-you-get" className="w-full section-y scroll-mt-20">
          <div className="container-site">
            <div className="max-w-2xl mb-12">
              <p className="eyebrow mb-4">What you get back</p>
              <h2 className="heading-2 text-foreground">Visibility without the busywork.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {youGet.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-7">
                  <h3 className="heading-4 text-base text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When a sub won't respond */}
        <section id="escalation" className="w-full section-y border-t border-border scroll-mt-20">
          <div className="container-site grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
            <div>
              <p className="eyebrow mb-4">When a sub won&apos;t respond</p>
              <h2 className="heading-2 text-foreground">We chase. You decide.</h2>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                We contact the sub and their agent repeatedly. After roughly thirty days without resolution, or fifteen days past an expiration, that trade partner lands in your weekly digest with the missing item, the outreach history, and a recommended next step. The decision stays yours:
              </p>
              <ul className="flex flex-col gap-3">
                {decisions.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* When a claim comes */}
        <section id="claims" className="w-full section-y border-t border-border scroll-mt-20">
          <div className="container-site grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
            <div>
              <p className="eyebrow mb-4">When a claim comes</p>
              <h2 className="heading-2 text-foreground">Insurance responds to paperwork, not intentions.</h2>
            </div>
            <div className="rounded-xl border border-primary/25 bg-primary/5 p-7 md:p-8">
              <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                A $6M custom home flooded. The claim came to roughly $300K, including the owner&apos;s mortgage while the house was unlivable. Because the signed subcontract and the verified coverage were already in place, the claim was tendered correctly and covered in full.
              </p>
              {/* TODO: name Starwood Custom Homes once approved; confirm the $300K figure with Tyler. */}
              <p className="mt-5 eyebrow text-muted-foreground/70">Custom home builder, Arizona</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full section-y border-t border-border scroll-mt-20">
          <div className="container-prose">
            <p className="eyebrow mb-4">Questions builders ask</p>
            <h2 className="heading-2 text-foreground mb-10">Before you hand it off</h2>
            <div className="divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none text-base md:text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pr-10 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full section-y border-t border-border">
          <div className="container-prose text-center">
            <h2 className="heading-2 text-foreground mb-4">Ready to stop thinking about insurance?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
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
  );
}
