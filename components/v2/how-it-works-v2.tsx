"use client";

import { useCallback, useEffect, useRef, useState, createElement } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers
  const headerY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -20]);

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
    <section ref={sectionRef} id="how-it-works" className="w-full bg-white dark:bg-zinc-950 py-24 overflow-hidden scroll-mt-24 md:flex-1">
      <div className="max-w-7xl mx-auto px-6 pb-[80px]">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          style={{ y: headerY }}
        >
          <motion.p
            className="text-zinc-400 dark:text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(4px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Beyond COI checks
          </motion.p>

          {/* Heading with clip-mask reveal */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
            <span className="text-reveal-line text-zinc-900 dark:text-white">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={isInView ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                We Don&apos;t Just Store Documents —
              </motion.span>
            </span>
            <span className="text-reveal-line">
              <motion.span
                className="block text-zinc-900 dark:text-white"
                initial={{ y: "110%" }}
                animate={isInView ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                We <span className="text-lime-600 dark:text-lime-400">Verify</span> Them
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            Most General Contractors assume their construction management software,
            accounting platform, or bookkeeper is handling trade partner compliance —
            they&apos;re not. They&apos;re storing documents. Midpoint goes further: we read
            the policy language itself to confirm your trade partners are truly
            compliant, so you&apos;re protected when it matters — not just organized.
          </motion.p>
        </motion.div>

        <div className="flex md:hidden overflow-x-auto gap-2 mb-8 pb-2 -mx-2 px-2">
          {steps.map((step, i) => (
            <button
              key={step.title}
              onClick={() => handleClick(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                i === activeIndex
                  ? "bg-lime-400 text-zinc-950"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        <motion.div
          className="flex flex-col md:flex-row md:gap-16 items-center justify-center gap-[48px]"
          style={{ y: contentY }}
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(8px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className="hidden md:flex flex-col w-[280px] flex-shrink-0 relative">
            <div className="absolute left-[4px] top-3 bottom-3 w-px bg-zinc-200 dark:bg-zinc-800" />
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
                        isActive ? "bg-lime-400" : "bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
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
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(6px)", transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="py-2"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  {createElement(steps[activeIndex].icon, {
                    className: "h-5 w-5 text-lime-600 dark:text-lime-400",
                  })}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                    Step {activeIndex + 1}
                  </p>
                </div>
                <h3 className="text-2xl text-zinc-900 dark:text-white font-semibold tracking-tight mb-4">
                  {steps[activeIndex].title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed mb-6 max-w-lg">
                  {steps[activeIndex].description}
                </p>
                <p className="text-sm text-lime-600 dark:text-lime-400 font-medium">
                  {steps[activeIndex].highlight}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
