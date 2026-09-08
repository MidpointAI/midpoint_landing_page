"use client";

import { motion } from "framer-motion";
import ExpertsVerifyGraphic from "@/components/v2/experts-verify-graphic";
import { useStepActivity } from "@/components/v2/step-activity";

type StepDef = {
  step: number;
  id: string;
  title: string;
  body: string;
  layout: "text-left" | "text-and-image" | "centered-graphic" | "text-right";
};

// The five things Midpoint does once a subcontract is signed, in the order
// Tyler walks GCs through them on onboarding calls.
const STEPS: StepDef[] = [
  {
    step: 1,
    id: "requirements",
    title: "Pull the requirements from your agreement.",
    body: "Every executed subcontract sets the insurance requirements for that sub on that project. Change the contract and the requirements change with it.",
    layout: "text-left",
  },
  {
    step: 2,
    id: "collect",
    title: "Contact the sub and their agent.",
    body: "We request certificates and endorsements directly from the subcontractor and the agent who wrote the policy, so your team stops chasing.",
    layout: "text-and-image",
  },
  {
    step: 3,
    id: "verify",
    title: "Verify the coverage, not the certificate.",
    body: "Limits, additional insured, primary and non-contributory, waivers, and the endorsement forms behind them. A line in the description-of-operations box doesn't count. The form does.",
    layout: "centered-graphic",
  },
  {
    step: 4,
    id: "chase",
    title: "Chase gaps and renewals.",
    body: "Automated follow-ups to the sub and the agent, warnings ahead of every expiration, and escalation to you only when repeated outreach hasn't worked.",
    layout: "text-right",
  },
  {
    step: 5,
    id: "monitor",
    title: "Report weekly. Monitor for years.",
    body: "A digest every week, and monitoring that continues for two years after the project closes, because claims arrive late.",
    layout: "text-left",
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

function StepItem({ step }: { step: StepDef }) {
  const { ref, isActive } = useStepActivity(`step-${step.step}`);

  return (
    <div ref={ref} id={`step-${step.id}`} className="relative w-full py-12 md:py-20 scroll-mt-28">
      {step.layout === "text-left" && (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-8 w-full max-w-[560px]">
            <div className="flex flex-col gap-4 items-start w-full">
              <StepPill step={step.step} isActive={isActive} />
              <StepTitle isActive={isActive}>{step.title}</StepTitle>
            </div>
            <StepBody isActive={isActive}>{step.body}</StepBody>
          </div>
        </div>
      )}

      {step.layout === "text-and-image" && (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <div className="flex flex-col gap-8 w-full lg:w-[500px] flex-shrink-0">
            <div className="flex flex-col gap-6 items-start">
              <StepPill step={step.step} isActive={isActive} />
              <StepTitle isActive={isActive}>{step.title}</StepTitle>
            </div>
            <StepBody isActive={isActive}>{step.body}</StepBody>
          </div>
          <motion.div
            className="w-full max-w-[520px] flex-shrink-0"
            animate={{ opacity: isActive ? 1 : 0.25 }}
            transition={{ duration: 0.5 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/papers-flying-figma.png"
              alt="Insurance documents and certificates being collected"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </div>
      )}

      {step.layout === "centered-graphic" && (
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col gap-4 items-center text-center max-w-3xl">
            <StepPill step={step.step} isActive={isActive} />
            <StepTitle isActive={isActive}>{step.title}</StepTitle>
            <StepBody isActive={isActive}>{step.body}</StepBody>
          </div>
          <motion.div
            className="w-full flex justify-center"
            animate={{ opacity: isActive ? 1 : 0.35 }}
            transition={{ duration: 0.5 }}
          >
            <ExpertsVerifyGraphic />
          </motion.div>
        </div>
      )}

      {step.layout === "text-right" && (
        <div className="flex flex-col items-end">
          <div className="flex flex-col gap-8 w-full max-w-[560px]">
            <div className="flex flex-col gap-4 items-start w-full">
              <StepPill step={step.step} isActive={isActive} />
              <StepTitle isActive={isActive}>{step.title}</StepTitle>
            </div>
            <StepBody isActive={isActive}>{step.body}</StepBody>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WhatWeDoSteps() {
  return (
    <section id="what-we-do" className="w-full bg-card border-y border-border section-y scroll-mt-20">
      <div className="container-site flex flex-col items-center gap-6">
        <p className="eyebrow text-center">What we do</p>
        <div className="w-full flex flex-col">
          {STEPS.map((step) => (
            <StepItem key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
