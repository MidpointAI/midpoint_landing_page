"use client";

import { motion } from "framer-motion";
import { useStepActivity } from "@/components/v2/step-activity";
import { FigureFrame } from "@/components/v2/figure-frame";
import RequirementsGraphic from "@/components/v2/how-it-works/requirements-graphic";
import CollectGraphic from "@/components/v2/how-it-works/collect-graphic";
import ChaseGraphic from "@/components/v2/how-it-works/chase-graphic";
import VerifyGraphic from "@/components/v2/how-it-works/verify-graphic";
import MonitorGraphic from "@/components/v2/how-it-works/monitor-graphic";

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

/** Step ids, numbers, and titles for anything that navigates the steps. */
export const STEP_META = STEPS.map(({ id, step, title }) => ({ id, step, title }));

/** Text never dims below 60%: an off-focus step should still be readable. */
const TEXT_DIM = 0.6;

/** "Step 3 of 5" in the mono label style, in the accent while the step is current. */
function StepCount({ step, isActive }: { step: number; isActive: boolean }) {
  return (
    <motion.p
      className={`font-mono text-[11px] uppercase tracking-[0.16em] ${isActive ? "text-primary" : "text-muted-foreground"}`}
      animate={{ opacity: isActive ? 1 : TEXT_DIM }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      Step {step} of {STEPS.length}
    </motion.p>
  );
}

function StepTitle({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.h3
      className="heading-2 text-foreground"
      animate={{ opacity: isActive ? 1 : TEXT_DIM }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.h3>
  );
}

function StepBody({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.p
      className="text-muted-foreground text-base md:text-lg leading-relaxed measure-column"
      animate={{ opacity: isActive ? 1 : TEXT_DIM }}
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
 * One stage per step on the site's five/seven split: text on the rail, an
 * interactive graphic in the other seven columns. Stages take their own
 * height, with the same padding and a hairline between them, so the gap
 * from one step to the next is always the same.
 */
function StepItem({ step }: { step: StepDef }) {
  const { ref, isActive } = useStepActivity(`step-${step.id}`);

  return (
    <div
      ref={ref}
      id={`step-${step.id}`}
      className="relative w-full py-16 md:py-20 border-t border-border first:border-t-0 scroll-mt-28"
    >
      <div className="w-full grid lg:grid-cols-12 gap-x-8 gap-y-10 items-center">
        <div className="lg:col-span-5 flex flex-col gap-5">
          <StepCount step={step.step} isActive={isActive} />
          <StepTitle isActive={isActive}>{step.title}</StepTitle>
          <StepBody isActive={isActive}>{step.body}</StepBody>
        </div>
        <div className="lg:col-span-7 flex lg:justify-end">
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
    <section id="what-we-do" className="w-full section-rule scroll-mt-28">
      <div className="container-site">
        <p className="eyebrow-accent pt-16 md:pt-20">What we do</p>
        <div className="mt-6">
          {STEPS.map((step) => (
            <StepItem key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
