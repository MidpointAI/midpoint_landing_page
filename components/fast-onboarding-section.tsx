"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

const FAST_ONBOARDING_TIMING = {
  speedLabel: 0.08,
  heading: 0.14,
  paragraph: 0.28,
  bulletsStart: 0.42,
  bulletStagger: 0.08,
  button: 0.74,
  dividerStart: 0.18,
  dividerDotStagger: 0.016,
  dividerDotDuration: 0.12,
  statusLoopStart: 0.3,
  statusLoopInterval: 650,
};

// Status indicator data with exact Figma colors
const statusIndicators = [
  { label: "Onboarding", dotColor: "#c9ff64" },
  { label: "Doc Collection", dotColor: "#c9ff64" },
  { label: "Pending GC", dotColor: "#facc15" },
  { label: "Pending Ammendment", dotColor: "#c9ff64" },
  { label: "Active", dotColor: "#60a5fa" },
  { label: "Expiring Soon", dotColor: "hollow" },
];

// Bullet points for the features
const featureBullets = [
  "Faster subcontractor onboarding",
  "Automated document collection & compliance checks",
  "Clear insight into actual coverage, not just what's on the certificate",
  "Reduced administrative back-and-forth",
];

const dividerDots = Array.from({ length: 36 });
const PILL_REVEAL_PROGRESS = [0.2, 0.34, 0.48, 0.62, 0.76, 0.9];

const WordReveal = memo(function WordReveal({
  text,
  className,
  as = "p",
  isInView,
  prefersReducedMotion,
  delay,
  wordStagger = 0.024,
  duration = 0.3,
}: {
  text: string;
  className: string;
  as?: "h2" | "p" | "span";
  isInView: boolean;
  prefersReducedMotion: boolean;
  delay: number;
  wordStagger?: number;
  duration?: number;
}) {
  const Tag = as;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
          transition={{
            duration: prefersReducedMotion ? 0.12 : duration,
            delay: prefersReducedMotion ? 0 : delay + index * wordStagger,
            ease: ENTRANCE_EASE,
          }}
          className="inline-block mr-[0.28em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
});

// Memoized StatusPill component matching Figma specs
const StatusPill = memo(function StatusPill({
  label,
  dotColor,
  index,
  isInView,
  prefersReducedMotion,
  activeIndex,
  delay,
}: {
  label: string;
  dotColor: string;
  index: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
  activeIndex: number;
  delay: number;
}) {
  const isActive = index <= activeIndex;

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
      transition={{
        duration: prefersReducedMotion ? 0.14 : 0.32,
        delay: prefersReducedMotion ? 0 : delay,
        ease: ENTRANCE_EASE,
      }}
      className="flex items-center gap-[14px] px-5 py-[11px] border border-border rounded-md"
    >
      {dotColor === "hollow" ? (
        <div
          className="w-[14px] h-[14px] rounded-full border-2"
          style={{ borderColor: "#f87171" }}
        />
      ) : (
        <motion.div
          className="w-[14px] h-[14px] rounded-full"
          style={{ backgroundColor: dotColor }}
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        />
      )}
      <span
        className="text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-[1.4] text-muted-foreground"
      >
        {label}
      </span>
    </motion.div>
  );
});

// Fast Forward Icon matching Figma
const FastForwardIcon = memo(function FastForwardIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
});

const AnimatedDivider = memo(function AnimatedDivider({
  isInView,
  prefersReducedMotion,
}: {
  isInView: boolean;
  prefersReducedMotion: boolean;
}) {
  const dotStagger = prefersReducedMotion
    ? 0
    : FAST_ONBOARDING_TIMING.dividerDotStagger;
  const drawStart = prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.dividerStart;

  return (
    <div className="hidden lg:flex relative w-8 justify-center self-stretch pointer-events-none">
      <div
        className="h-full w-px flex flex-col justify-between overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {dividerDots.map((_, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scaleY: 0.25 }}
            animate={isInView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.25 }}
            transition={{
              duration: prefersReducedMotion
                ? 0.08
                : FAST_ONBOARDING_TIMING.dividerDotDuration,
              delay: drawStart + index * dotStagger,
              ease: ENTRANCE_EASE,
            }}
            className="block h-[7px] w-px rounded-full origin-top"
            style={{
              backgroundColor: "color-mix(in oklch, var(--foreground) 26%, transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default function FastOnboardingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(-1);
  const dividerDrawDuration =
    (dividerDots.length - 1) * FAST_ONBOARDING_TIMING.dividerDotStagger +
    FAST_ONBOARDING_TIMING.dividerDotDuration;

  // Animate through status indicators
  useEffect(() => {
    if (!isInView) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const starter = setTimeout(() => {
      setActiveIndex(0);
      timer = setInterval(() => {
        setActiveIndex((prev) => {
          if (prev >= statusIndicators.length - 1) {
            return 0; // Loop back
          }
          return prev + 1;
        });
      }, FAST_ONBOARDING_TIMING.statusLoopInterval);
    }, (prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.statusLoopStart) * 1000);

    return () => {
      clearTimeout(starter);
      if (timer) clearInterval(timer);
    };
  }, [isInView, prefersReducedMotion]);

  return (
    <section
      ref={ref}
      className="relative bg-background py-24 md:py-32 lg:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch relative">
          {/* Left Content */}
          <div className="flex-1 lg:max-w-[55%]">
            {/* Content wrapper */}
            <div className="flex flex-col gap-16">
              {/* Top content block */}
              <div className="flex flex-col gap-8">
                {/* SPEED Label */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.14 : 0.34,
                    delay: prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.speedLabel,
                    ease: ENTRANCE_EASE,
                  }}
                  className="flex items-center gap-2"
                >
                  <FastForwardIcon />
                  <span className="text-base font-bold leading-[1.5] text-primary">
                    SPEED
                  </span>
                </motion.div>

                {/* Heading and Description */}
                <div className="flex flex-col gap-6">
                  <WordReveal
                    as="h2"
                    text="Fast Onboarding, Fast Compliance"
                    isInView={isInView}
                    prefersReducedMotion={prefersReducedMotion}
                    delay={FAST_ONBOARDING_TIMING.heading}
                    wordStagger={0.045}
                    duration={0.34}
                    className="text-[36px] md:text-[44px] lg:text-[52px] font-bold leading-[1.2] tracking-[-0.52px] text-foreground"
                  />

                  <motion.p
                    initial={{ opacity: 0, x: -18 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.14 : 0.42,
                      delay: prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.paragraph,
                      ease: ENTRANCE_EASE,
                    }}
                    className="text-lg leading-[1.5] text-muted-foreground"
                  >
                    Stop wasting hours chasing documents and deciphering policies. We
                    centralize compliance requirements, automate document collection,
                    and extract the real coverage details you need, so your team can
                    focus on building, not insurance.
                  </motion.p>
                </div>
              </div>

              {/* Bottom content block - List and Button */}
              <div className="flex flex-col gap-8">
                {/* Bullet Points */}
                <div className="text-lg leading-[1.5] font-light text-foreground">
                  {featureBullets.map((bullet, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, x: -18 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.14 : 0.34,
                        delay: prefersReducedMotion
                          ? 0
                          : FAST_ONBOARDING_TIMING.bulletsStart +
                            idx * FAST_ONBOARDING_TIMING.bulletStagger,
                        ease: ENTRANCE_EASE,
                      }}
                      className="mb-0"
                    >
                      • {bullet}
                    </motion.p>
                  ))}
                </div>

                {/* Learn More Button */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.14 : 0.32,
                    delay: prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.button,
                    ease: ENTRANCE_EASE,
                  }}
                >
                  <a
                    href="#"
                    className="inline-flex px-6 py-[10px] rounded-xl text-base font-medium leading-[1.5] transition-colors duration-300 hover:opacity-80 bg-card border border-border text-foreground"
                  >
                    Learn more
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Vertical Dotted Divider */}
          <AnimatedDivider
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Right Content - Status Pills */}
          <div className="flex self-stretch lg:pl-8">
            {/* Status Pills */}
            <div className="flex h-full flex-col justify-center gap-[20px]">
              {statusIndicators.map((indicator, idx) => (
                <StatusPill
                  key={indicator.label}
                  label={indicator.label}
                  dotColor={indicator.dotColor}
                  index={idx}
                  isInView={isInView}
                  prefersReducedMotion={prefersReducedMotion}
                  activeIndex={activeIndex}
                  delay={
                    FAST_ONBOARDING_TIMING.dividerStart +
                    PILL_REVEAL_PROGRESS[idx] * dividerDrawDuration
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
