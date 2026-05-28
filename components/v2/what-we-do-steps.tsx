"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ExpertsVerifyGraphic from "@/components/v2/experts-verify-graphic";

// Layout per Figma (node 11133:1164):
//   Step 2 — text left, papers image right
//   Step 3 — centered headline + animated verify graphic
//   Step 4 — text right-aligned (no media)
//   Step 5 — text right-aligned, with radial-gradient highlight bg
type StepDef = {
  step: number;
  title: string;
  body: string;
  layout: "text-and-image" | "centered-graphic" | "text-right" | "text-right-highlight";
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
    layout: "text-right-highlight",
  },
];

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* --------------------------------- StepPill -------------------------------- */
function StepPill({ step, isActive }: { step: number; isActive: boolean }) {
  return (
    <motion.div
      className="inline-flex items-center justify-center rounded-full border-[0.5px] px-6 py-1.5"
      animate={{
        borderColor: isActive ? "rgba(242,242,242,1)" : "rgba(242,242,242,0.3)",
      }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.span
        className="text-[18px] font-medium tracking-[5.76px] leading-[1.5] whitespace-nowrap"
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
const StepItem = forwardRef<HTMLDivElement, { step: StepDef; isActive: boolean }>(
  function StepItem({ step, isActive }, ref) {
    // Background — only Step 5 ever shows the radial gradient (per Figma)
    const showGradient = step.layout === "text-right-highlight" && isActive;

    return (
      <motion.div
        ref={ref}
        className="relative w-full rounded-lg overflow-hidden border-b border-black/50 last:border-b-0"
        animate={
          showGradient
            ? {
                background:
                  "radial-gradient(ellipse at 82% 24%, rgba(34,37,30,1) 0%, rgba(17,29,24,1) 50%, rgba(0,21,18,1) 100%)",
              }
            : { background: "rgba(0,0,0,0)" }
        }
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Step 2 — text left, image right (Figma spec: p-[112px], gap-[43px]) */}
        {step.layout === "text-and-image" && (
          <div className="px-8 md:px-16 lg:px-28 py-16 md:py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[43px]">
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
          <div className="px-6 md:px-16 lg:px-28 py-16 md:py-20 lg:py-28 flex flex-col items-center gap-12">
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

        {/* Step 4 — right-aligned text, large gap between title and body */}
        {step.layout === "text-right" && (
          <div className="px-8 md:px-16 lg:px-20 py-16 md:py-20 lg:py-28 flex flex-col items-end">
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

        {/* Step 5 — right-aligned text with radial gradient highlight on active */}
        {step.layout === "text-right-highlight" && (
          <div className="px-8 md:px-16 lg:px-20 py-16 md:py-20 lg:py-28 flex flex-col items-end">
            <div className="flex flex-col gap-[70px] lg:gap-[94px] w-full max-w-[512px]">
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
      </motion.div>
    );
  }
);

/* -------------------------------- Container --------------------------------- */
export default function WhatWeDoSteps() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const pickClosest = () => {
      const viewportMid = window.innerHeight / 2;
      let best: number | null = null;
      let bestDist = Infinity;

      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const dist = Math.abs(rect.top + rect.height / 2 - viewportMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      setActiveIndex(best);
    };

    pickClosest();
    window.addEventListener("scroll", pickClosest, { passive: true });
    window.addEventListener("resize", pickClosest);
    return () => {
      window.removeEventListener("scroll", pickClosest);
      window.removeEventListener("resize", pickClosest);
    };
  }, []);

  return (
    <section className="w-full bg-[#001512] py-16 md:py-28 px-6 md:px-12 lg:px-28">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 md:gap-12">
        {/* Header */}
        <p
          className="text-[#dadad9] text-[18px] tracking-[5.76px] text-center leading-[1.5]"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
        >
          WHAT WE DO.
        </p>

        {/* Steps wrapper — single rounded card per Figma */}
        <div className="w-full border border-white/30 rounded-2xl overflow-hidden">
          {STEPS.map((step, index) => (
            <StepItem
              key={step.step}
              step={step}
              isActive={activeIndex === index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
