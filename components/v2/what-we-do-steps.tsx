"use client";

import { motion } from "framer-motion";
import ExpertsVerifyGraphic from "@/components/v2/experts-verify-graphic";
import { useStepActivity } from "@/components/v2/step-activity";

// Layout per Figma (node 11133:1164):
//   Step 2 — text left, papers image right
//   Step 3 — centered headline + animated verify graphic
//   Step 4 — text right-aligned (no media)
//   Step 5 — text right-aligned (originally had a radial-gradient highlight;
//            since removed, it now shares the text-right layout)
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
    body: "We establish project by project insurance requirements based on your agreements",
    layout: "centered-graphic",
  },
  {
    step: 4,
    title: "Compliance is determined and reported back to the general contractor",
    body: "We establish project by project insurance requirements based on your agreements",
    layout: "text-right",
  },
  {
    step: 5,
    title: "Ongoing expiration monitoring and reporting",
    body: "We monitor and collect future policy information to keep them compliant and report back to you.",
    layout: "text-right",
  },
];

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* --------------------------------- StepPill -------------------------------- */
function StepPill({ step, isActive }: { step: number; isActive: boolean }) {
  return (
    <motion.div
      className="relative inline-flex items-center justify-center rounded-full border-[0.5px] px-4 py-1 md:px-6 md:py-1.5 backdrop-blur-md"
      animate={{
        borderColor: isActive ? "rgba(242,242,242,1)" : "rgba(242,242,242,0.3)",
        backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
        boxShadow: isActive
          ? "inset 0 4px 12.6px 0 rgba(255,255,255,0.25)"
          : "inset 0 0 0 0 rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.span
        className="text-[13px] tracking-[3.5px] md:text-[18px] md:tracking-[5.76px] font-medium leading-[1.5] whitespace-nowrap"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
        animate={{ color: isActive ? "rgb(201,255,100)" : "rgba(201,255,100,0.35)" }}
        transition={{ duration: 0.4 }}
      >
        STEP {step}
      </motion.span>
    </motion.div>
  );
}

/* ------------------------------- StepTitle/Body ------------------------------ */
function StepTitle({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.h3
      className="text-2xl md:text-[36px] font-bold tracking-[-0.01em] leading-[1.2]"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
      animate={{ color: isActive ? "rgb(255,255,255)" : "rgba(255,255,255,0.3)" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h3>
  );
}

function StepBody({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.p
      className="text-base md:text-[20px] font-light leading-[1.37]"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
      animate={{ color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.p>
  );
}

/* ---------------------------------- StepItem -------------------------------- */
function StepItem({ step }: { step: StepDef }) {
  const { ref, isActive } = useStepActivity(`step-${step.step}`);

  return (
    <div ref={ref} className="relative w-full">
        {/* Step 2 — text left, image right (Figma spec: p-[112px], gap-[43px]) */}
        {step.layout === "text-and-image" && (
          <div className="px-4 md:px-16 lg:px-28 py-16 md:py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[43px]">
            <div className="flex flex-col gap-[43px] w-full lg:w-[500px] flex-shrink-0">
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

        {/* Step 3 — centered headline + animated graphic (p-[112px], gap-[48px]) */}
        {step.layout === "centered-graphic" && (
          <div className="px-0 md:px-16 lg:px-28 py-16 md:py-20 lg:py-28 flex flex-col items-center gap-12">
            <div className="flex flex-col gap-4 items-center text-center max-w-5xl">
              <StepPill step={step.step} isActive={isActive} />
              <h3
                className="text-2xl md:text-[36px] font-bold tracking-[-0.01em] leading-[1.2] md:whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  color: isActive ? "rgb(255,255,255)" : "rgba(255,255,255,0.3)",
                  transition: "color 0.5s",
                }}
              >
                {step.title}
              </h3>
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

        {/* Step 4 — right-aligned text, large gap between title and body */}
        {step.layout === "text-right" && (
          <div className="px-4 md:px-16 lg:px-20 py-16 md:py-20 lg:py-28 flex flex-col items-end">
            <div className="flex flex-col gap-[80px] lg:gap-[109px] w-full max-w-[529px]">
              <div className="flex flex-col gap-4 items-start w-full">
                <StepPill step={step.step} isActive={isActive} />
                <StepTitle isActive={isActive}>{step.title}</StepTitle>
              </div>
              <div className="w-full">
                <StepBody isActive={isActive}>{step.body}</StepBody>
              </div>
            </div>
          </div>
        )}

      </div>
  );
}

/* -------------------------------- Container --------------------------------- */
export default function WhatWeDoSteps() {
  return (
    <section className="w-full bg-[#001512] py-16 md:py-28 px-4 md:px-12 lg:px-28">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 md:gap-12">
        {/* Header */}
        <p
          className="text-[#dadad9] text-[18px] tracking-[5.76px] text-center leading-[1.5]"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
        >
          WHAT WE DO.
        </p>

        {/* Steps — free-floating, no outer box. Each StepItem registers
            itself with the shared StepActivityProvider so only one step
            across the whole page is active at a time. */}
        <div className="w-full flex flex-col">
          {STEPS.map((step) => (
            <StepItem key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
