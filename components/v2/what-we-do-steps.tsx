"use client";

import { motion } from "framer-motion";
import { useStepActivity } from "@/components/v2/step-activity";
import { FigureFrame } from "@/components/v2/figure-frame";
import RequirementsGraphic from "@/components/v2/how-it-works/requirements-graphic";
import CollectGraphic from "@/components/v2/how-it-works/collect-graphic";
import ChaseGraphic from "@/components/v2/how-it-works/chase-graphic";
import VerifyGraphic from "@/components/v2/how-it-works/verify-graphic";
import MonitorGraphic from "@/components/v2/how-it-works/monitor-graphic";
import StepRail from "@/components/v2/how-it-works/step-rail";

type StepDef = {
  step: number;
  id: string;
  title: string;
  /** Short name for the figure label. */
  figure: string;
  body: string;
};

// The five things Midpoint does once a subcontract is signed, in the order
// Tyler walks GCs through them on onboarding calls.
const STEPS: StepDef[] = [
  {
    step: 1,
    id: "requirements",
    figure: "Requirements",
    title: "Pull the requirements from your agreement.",
    body: "Every executed subcontract sets the insurance requirements for that sub on that project. Change the contract and the requirements change with it.",
  },
  {
    step: 2,
    id: "collect",
    figure: "Outreach",
    title: "Contact the sub and their agent.",
    body: "We request certificates and endorsements directly from the subcontractor and the agent who wrote the policy, so your team stops chasing.",
  },
  {
    step: 3,
    id: "verify",
    figure: "Verification",
    title: "Verify the coverage, not the certificate.",
    body: "Limits, additional insured, primary and non-contributory, waivers, and the endorsement forms behind them. A line in the description-of-operations box doesn't count. The form does.",
  },
  {
    step: 4,
    id: "chase",
    figure: "Follow-up",
    title: "Chase gaps and renewals.",
    body: "Automated follow-ups to the sub and the agent, warnings ahead of every expiration, and escalation to you only when repeated outreach hasn't worked.",
  },
  {
    step: 5,
    id: "monitor",
    figure: "Weekly report",
    title: "Report weekly. Monitor for years.",
    body: "Every week you get one short email listing each trade partner and where they stand: verified, expiring soon, missing a document, or waiting on a decision from you. Nothing to log into. And it doesn't stop when the project does: we keep tracking every sub's coverage for two years after completion, because claims arrive late.",
  },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

/** The "STEP n" pill. Shared with the page hero so step 1 matches steps 2 to 5. */
export function StepPill({ step, isActive }: { step: number; isActive: boolean }) {
  return (
    <motion.div
      className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/60 px-5 py-1.5 backdrop-blur-md"
      animate={{ opacity: isActive ? 1 : 0.4 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="font-mono text-xs md:text-sm font-medium tracking-[0.3em] text-primary whitespace-nowrap">
        STEP {step}
      </span>
    </motion.div>
  );
}

function StepTitle({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.h3
      className="heading-2 text-foreground"
      animate={{ opacity: isActive ? 1 : 0.35 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.h3>
  );
}

function StepBody({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.p
      className="text-muted-foreground text-base md:text-lg leading-relaxed"
      animate={{ opacity: isActive ? 1 : 0.35 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}

function StepGraphic({ id, isActive }: { id: string; isActive: boolean }) {
  switch (id) {
    case "requirements":
      return <RequirementsGraphic isActive={isActive} />;
    case "collect":
      return <CollectGraphic isActive={isActive} />;
    case "verify":
      return <VerifyGraphic isActive={isActive} />;
    case "chase":
      return <ChaseGraphic isActive={isActive} />;
    default:
      return <MonitorGraphic isActive={isActive} />;
  }
}

/**
 * One stage per step: the same two-column layout every time, tall enough
 * to hold the viewport, so scrolling moves you from one focused step to
 * the next. Text on the left, an interactive graphic on the right.
 */
function StepItem({ step }: { step: StepDef }) {
  const { ref, isActive } = useStepActivity(`step-${step.id}`);

  return (
    <div
      ref={ref}
      id={`step-${step.id}`}
      className="relative w-full min-h-[calc(100svh-4rem)] flex items-center py-16 snap-start scroll-mt-20"
    >
      <div className="w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 max-w-[520px]">
          <StepPill step={step.step} isActive={isActive} />
          <StepTitle isActive={isActive}>{step.title}</StepTitle>
          <StepBody isActive={isActive}>{step.body}</StepBody>
        </div>
        <div className="flex justify-center lg:justify-end">
          <FigureFrame n={step.step} label={step.figure} isActive={isActive}>
            <StepGraphic id={step.id} isActive={isActive} />
          </FigureFrame>
        </div>
      </div>
    </div>
  );
}

export default function WhatWeDoSteps() {
  return (
    <section id="what-we-do" className="w-full bg-card border-y border-border scroll-mt-20">
      <div className="container-site">
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
          <StepRail steps={STEPS} />
          <div className="flex flex-col">
            <p className="eyebrow pt-16 -mb-8">What we do</p>
            {STEPS.map((step) => (
              <StepItem key={step.step} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
