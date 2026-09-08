"use client";

import { motion } from "framer-motion";
import ExpertsVerifyGraphic from "@/components/v2/experts-verify-graphic";
import { useStepActivity } from "@/components/v2/step-activity";

type StepDef = {
  step: number;
  title: string;
  body: string;
  layout: "text-and-image" | "centered-graphic" | "text-right";
};

const STEPS: StepDef[] = [
  {
    step: 2,
    title: "Collect requirements, policy certificates, endorsements.",
    body: "We systematically collect new certificates and policy endorsements from your trade partners.",
    layout: "text-and-image",
  },
  {
    step: 3,
    title: "Experts verify policy info matches your project.",
    body: "We establish project by project insurance requirements based on your agreements.",
    layout: "centered-graphic",
  },
  {
    step: 4,
    title: "Compliance is determined and reported back to you.",
    body: "Every requirement is checked against the actual policy language, and you get the result without doing the reading.",
    layout: "text-right",
  },
  {
    step: 5,
    title: "Ongoing expiration monitoring and reporting.",
    body: "We monitor and collect future policy information to keep trade partners compliant and report back to you.",
    layout: "text-right",
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
    <div ref={ref} className="relative w-full py-12 md:py-20">
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
            className="w-full flex justify-center overflow-x-auto"
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
    <section className="w-full bg-card border-y border-border section-y">
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
