"use client";

import { useCallback, useEffect, useState, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardListIcon,
  MailIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  RefreshCwIcon,
} from "lucide-react";

const INTERVAL = 20000;

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight: string;
}

const steps: Step[] = [
  {
    title: "Subcontractor Insurance Requirements",
    description:
      "You provide your subcontract agreement, project list, and sub roster. Midpoint uploads your contract requirements as the compliance benchmark.",
    icon: ClipboardListIcon,
    highlight: "Your standards become the benchmark",
  },
  {
    title: "Contract Triggering",
    description:
      "When a sub signs a contract, your team simply CCs service@midpointverified.com. Our AI extracts and processes the contract automatically — zero manual entry.",
    icon: MailIcon,
    highlight: "One CC, fully automated",
  },
  {
    title: "Deep Compliance Verification",
    description:
      "We verify every sub's certificate of insurance and endorsement documents against your contract requirements — additional insured, primary & non-contributory, waivers of subrogation, and more.",
    icon: ShieldCheckIcon,
    highlight: "Every endorsement, every date",
  },
  {
    title: "Human Review",
    description:
      "A dedicated Midpoint analyst reviews every AI output to catch edge cases across 3,500+ P&C carriers. No false positives, no missed gaps.",
    icon: UserCheckIcon,
    highlight: "AI + human, no gaps missed",
  },
  {
    title: "Ongoing Management",
    description:
      "We handle outreach to non-compliant subs, track expirations, and pull documents for audits on demand. Verified compliance unlocks preferred carrier rates.",
    icon: RefreshCwIcon,
    highlight: "Compliance that saves you money",
  },
];

export default function HowItWorksV2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [, setProgress] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const tick = 50;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (tick / INTERVAL) * 100;
        if (next >= 100) {
          advance();
          return 0;
        }
        return next;
      });
    }, tick);
    return () => clearInterval(timer);
  }, [isPaused, advance, activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), INTERVAL);
  };

  return (
    <section id="how-it-works" className="w-full bg-background section-y overflow-hidden scroll-mt-24">
      <div className="container-site">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-muted-foreground/70 text-xs tracking-[0.2em] uppercase mb-4">
            Beyond COI checks
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-5">
            We Don&apos;t Just Store Documents —
            <br />
            We <span className="text-primary">Verify</span> Them
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Most General Contractors assume their construction management software,
            accounting platform, or bookkeeper is handling trade partner compliance —
            they&apos;re not. They&apos;re storing documents. Midpoint goes further: we read
            the policy language itself to confirm your trade partners are truly
            compliant, so you&apos;re protected when it matters — not just organized.
          </p>
        </div>

        <div className="flex md:hidden overflow-x-auto gap-2 mb-8 pb-2 -mx-2 px-2">
          {steps.map((step, i) => (
            <button
              key={step.title}
              onClick={() => handleClick(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                i === activeIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:gap-16 items-center justify-center gap-[48px]">
          <div className="hidden md:flex flex-col w-[280px] flex-shrink-0 relative">
            <div className="absolute left-[4px] top-3 bottom-3 w-px bg-secondary" />
            {steps.map((step, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={step.title}
                  onClick={() => handleClick(i)}
                  className="relative flex items-center gap-4 text-left group py-3"
                >
                  <div className="relative flex-shrink-0 z-10">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-[9px] w-[9px] rounded-full transition-colors duration-300 ${
                        isActive ? "bg-primary" : "bg-muted-foreground/50 group-hover:bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground/80"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="py-2"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  {createElement(steps[activeIndex].icon, {
                    className: "h-5 w-5 text-primary",
                  })}
                  <p className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">
                    Step {activeIndex + 1}
                  </p>
                </div>
                <h3 className="text-2xl text-foreground font-semibold tracking-tight mb-4">
                  {steps[activeIndex].title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-lg">
                  {steps[activeIndex].description}
                </p>
                <p className="text-sm text-primary font-medium">
                  {steps[activeIndex].highlight}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
