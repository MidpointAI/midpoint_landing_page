"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/v2/ui/button";
import { useQuoteModal } from "@/components/v2/site-chrome";
import WhatWeDoSteps from "@/components/v2/what-we-do-steps";
import FooterV2 from "@/components/v2/footer-v2";
import NoOrphans from "@/components/v2/no-orphans";
import {
  StepActivityProvider,
  useStepActivity,
} from "@/components/v2/step-activity";

const youGet = [
  {
    title: "Weekly compliance digest",
    body: "A clear summary lands in your inbox every week — who’s verified, who’s outstanding, who needs a push.",
  },
  {
    title: "Records organized by project",
    body: "Every document for every sub, sorted by project and ready to pull whenever you or an auditor needs it.",
  },
  {
    title: "Optional portal access",
    body: "Log in any time you want a real-time view. Or don’t — the work doesn’t depend on you using it.",
  },
];

function Step1Hero() {
  const { openQuote } = useQuoteModal();
  const { ref, isActive } = useStepActivity("step-1");

  // Same easing as the rest of the steps for visual continuity.
  const EASE = [0.25, 0.1, 0.25, 1] as const;

  // We use OPACITY-based animation (not color) so the underlying Tailwind
  // dark-mode color classes (text-black dark:text-white, etc.) still apply.
  // motion.animate.color would override Tailwind in both modes.
  return (
    <section
      ref={ref}
      className="w-full pt-36 pb-24 md:pt-44 md:pb-32 px-4 md:px-6 bg-[#f4ffe0] dark:bg-zinc-900"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 md:gap-14">
        {/* Section subhead — matches the "WHAT WE DO." subhead on the
            WhatWeDoSteps section below, just inverted for the lighter
            background here. */}
        <motion.p
          className="text-zinc-700 dark:text-[#dadad9] text-[18px] tracking-[5.76px] text-center leading-[1.5]"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          animate={{ opacity: isActive ? 1 : 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          WHAT YOU DO.
        </motion.p>

        <div className="flex flex-col items-center gap-10 md:gap-12 max-w-[794px]">
          <div className="flex flex-col items-center gap-5 md:gap-6">
            {/* Step pill — frosted glass when active, fades to outline when inactive */}
            <motion.div
              className="relative inline-flex items-center justify-center rounded-full border-[0.5px] border-zinc-900/80 dark:border-white px-4 py-1 md:px-6 md:py-1.5 backdrop-blur-md"
              animate={{
                backgroundColor: isActive
                  ? "rgba(24,24,27,0.04)"
                  : "rgba(24,24,27,0)",
                boxShadow: isActive
                  ? "inset 0 4px 12.6px 0 rgba(255,255,255,0.25)"
                  : "inset 0 0 0 0 rgba(255,255,255,0)",
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span
                className="text-[13px] tracking-[3.5px] md:text-[18px] md:tracking-[5.76px] font-medium leading-[1.5] whitespace-nowrap text-zinc-900 dark:text-[#c9ff64]"
                style={{ fontFamily: "var(--font-dm-mono), monospace" }}
              >
                STEP 1
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-[72px] font-bold text-black dark:text-white tracking-tight text-center leading-[1.2]"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
              animate={{ opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Sign the sub. CC us.
              <br />
              Go back to building.
            </motion.h1>
          </div>

          {/* Body */}
          <motion.p
            className="text-[#001512] dark:text-zinc-300 text-base md:text-lg lg:text-[22px] leading-relaxed text-center"
            animate={{ opacity: isActive ? 1 : 0.3 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <NoOrphans>
              After a subcontractor signs, you CC us on the agreement. From that
              moment on, we collect every certificate, chase every renewal, verify
              every endorsement, flag every gap, and stand behind your risk transfer
              when a claim shows up. You read one weekly report. We handle the rest.
            </NoOrphans>
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Button
            size="lg"
            onClick={openQuote}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-2 text-sm px-8 rounded-xl"
          >
            See if your file holds up <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <StepActivityProvider>
      <HowItWorksContent />
    </StepActivityProvider>
  );
}

function HowItWorksContent() {
  const { openQuote } = useQuoteModal();

  return (
    <main className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen">
      <Step1Hero />

      {/* Steps 2–5: What we do */}
      <WhatWeDoSteps />


      {/* What you get back */}
      <section className="w-full py-24 px-4 md:px-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p
              className="text-zinc-400 dark:text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-dm-mono), monospace" }}
            >
              What you get back
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Visibility without the busywork.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {youGet.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-6"
              >
                <h3
                  className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight mb-3"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not software callout */}
      <section className="w-full py-24 px-4 md:px-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Not another tool to manage.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
            There&apos;s a portal if you ever want to look. You don&apos;t need to.
            <br className="hidden sm:block" />
            Our team does the work — you stay focused on building.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full px-4 md:px-6 py-20 text-center bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <h2
          className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Ready to stop collecting COIs?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
          Get a custom quote in under 60 seconds. No sales call required.
        </p>
        <Button size="lg" onClick={openQuote} className="gap-2 text-base px-10">
          Get a Quote Now <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </section>

      <FooterV2 />
    </main>
  );
}
