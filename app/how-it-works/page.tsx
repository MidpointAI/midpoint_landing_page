"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WhatWeDoSteps, { StepPill } from "@/components/v2/what-we-do-steps";
import NoOrphans from "@/components/v2/no-orphans";
import { StepActivityProvider, useStepActivity } from "@/components/v2/step-activity";
import { Button } from "@/components/ui/button";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const youGet = [
  {
    title: "Weekly compliance digest",
    body: "A clear summary lands in your inbox every week: who's verified, who's outstanding, who needs a push.",
  },
  {
    title: "Records organized by project",
    body: "Every document for every sub, sorted by project and ready to pull whenever you or an auditor needs it.",
  },
  {
    title: "Optional portal access",
    body: "Log in any time you want a real-time view. Or don't. The work doesn't depend on you using it.",
  },
];

function Step1Hero() {
  const { ref, isActive } = useStepActivity("step-1");
  return (
    <section ref={ref} className="w-full bg-background section-y">
      <div className="container-site flex flex-col items-center text-center gap-8">
        <motion.p
          className="eyebrow"
          animate={{ opacity: isActive ? 1 : 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          What you do
        </motion.p>
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <StepPill step={1} isActive={isActive} />
          <motion.h1
            className="heading-1 md:text-6xl text-foreground"
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Sign the sub. CC us.
            <br />
            Go back to building.
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl"
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <NoOrphans>
              After a subcontractor signs, you CC us on the agreement. From that moment on, we collect every certificate, chase every renewal, verify every endorsement, flag every gap, and stand behind your risk transfer when a claim shows up. You read one weekly report. We handle the rest.
            </NoOrphans>
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <StepActivityProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Step1Hero />
        <WhatWeDoSteps />

        <section className="w-full section-y border-t border-border">
          <div className="container-site">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <p className="eyebrow mb-4">What you get back</p>
              <h2 className="heading-2 text-foreground">Visibility without the busywork.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {youGet.map(({ title, body }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-7">
                  <h3 className="heading-4 text-base text-foreground mb-3">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full section-y border-t border-border">
          <div className="container-prose text-center">
            <h2 className="heading-2 text-foreground mb-4">Not another tool to manage.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              There&apos;s a portal if you ever want to look. You don&apos;t need to. Our team does the work, so you stay focused on building.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </section>
      </main>
    </StepActivityProvider>
  );
}
