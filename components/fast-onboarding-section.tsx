"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";

const FAST_ONBOARDING_TIMING = {
  speedLabel: 2,
  heading: 0.22,
  paragraph: 0.58,
  bulletsStart: 1.08,
  bulletStagger: 0.18,
  button: 2.34,
  dividerStart: 2.72,
  dividerDotStagger: 0.03,
  dividerDotDuration: 0.18,
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
  delay,
  wordStagger = 0.028,
  duration = 0.34,
}: {
  text: string;
  className: string;
  as?: "h2" | "p" | "span";
  isInView: boolean;
  delay: number;
  wordStagger?: number;
  duration?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{
            duration: prefersReducedMotion ? 0.12 : duration,
            delay: prefersReducedMotion ? 0 : delay + index * wordStagger,
            ease: [0.22, 1, 0.36, 1],
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
  activeIndex,
  delay,
}: {
  label: string;
  dotColor: string;
  index: number;
  isInView: boolean;
  activeIndex: number;
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isActive = index <= activeIndex;

  return (
    <motion.div
      initial={{ opacity: 0, x: -26 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -26 }}
      transition={{
        duration: prefersReducedMotion ? 0.16 : 0.4,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
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

// Shield/Radar Icon for Gap Detection
const ShieldIcon = memo(function ShieldIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
});

// Arrow Icon
const ArrowIcon = memo(function ArrowIcon() {
  return (
    <svg
      className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
});

const AnimatedDivider = memo(function AnimatedDivider({
  isInView,
}: {
  isInView: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const dotStagger = prefersReducedMotion ? 0 : FAST_ONBOARDING_TIMING.dividerDotStagger;
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
              ease: [0.22, 1, 0.36, 1],
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
  const gapRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isGapInView = useInView(gapRef, { once: true, margin: "-100px" });
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
      }, 800);
    }, (FAST_ONBOARDING_TIMING.dividerStart + 0.2) * 1000);

    return () => {
      clearTimeout(starter);
      if (timer) clearInterval(timer);
    };
  }, [isInView]);

  return (
    <>
      {/* Fast Onboarding Section */}
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.42,
                      delay: FAST_ONBOARDING_TIMING.speedLabel,
                      ease: [0.22, 1, 0.36, 1],
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
                      delay={FAST_ONBOARDING_TIMING.heading}
                      wordStagger={0.07}
                      duration={0.42}
                      className="text-[36px] md:text-[44px] lg:text-[52px] font-bold leading-[1.2] tracking-[-0.52px] text-foreground"
                    />

                    <motion.p
                      initial={{ opacity: 0, x: -26 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -26 }}
                      transition={{
                        duration: 0.55,
                        delay: FAST_ONBOARDING_TIMING.paragraph,
                        ease: [0.22, 1, 0.36, 1],
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
                        initial={{ opacity: 0, x: -26 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -26 }}
                        transition={{
                          duration: 0.42,
                          delay:
                            FAST_ONBOARDING_TIMING.bulletsStart +
                            idx * FAST_ONBOARDING_TIMING.bulletStagger,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-0"
                      >
                        • {bullet}
                      </motion.p>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: FAST_ONBOARDING_TIMING.button,
                      ease: [0.22, 1, 0.36, 1],
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
            <AnimatedDivider isInView={isInView} />

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

      {/* Gap Detection Section - with overflow for COI to extend into next section */}
      <section
        ref={gapRef}
        className="relative bg-background overflow-visible py-20 lg:py-32 px-6 pb-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative min-h-[500px]">
            {/* Left - Certificate Image (extends past section) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isGapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:absolute lg:left-0 lg:top-0 w-full lg:w-[55%]"
              style={{ zIndex: 1 }}
            >
              <div className="relative">
                <Image
                  src="/coi-document.png"
                  alt="ACORD Certificate of Liability Insurance"
                  width={821}
                  height={1091}
                  className="object-contain w-full h-auto rounded-sm"
                />
                {/* Yellow highlight bar effect */}
                <div
                  className="absolute top-[5.6%] left-[17.8%] w-[72%] h-[2.3%] mix-blend-multiply"
                  style={{ backgroundColor: "#c9ff64" }}
                />
              </div>

              {/* Gradient fade at bottom - fades into background */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 80%)"
                }}
              />
            </motion.div>

            {/* Right - Gap Detection Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isGapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-[375px] lg:ml-auto lg:pt-8"
              style={{ zIndex: 2 }}
            >
              <div className="flex flex-col gap-4">
                {/* GAP DETECTION Label */}
                <div className="flex items-center gap-2">
                  <ShieldIcon />
                  <span className="text-base font-bold leading-[1.5] text-primary">
                    GAP DETECTION
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-[32px] md:text-[36px] lg:text-[44px] font-bold leading-[1.2] tracking-[-0.44px] text-foreground">
                    You are never as covered as you think
                  </h3>

                  <p className="text-lg leading-[1.5] text-foreground">
                    When subs submit their certificates, we use advanced tools to
                    verify insurance documents with surgical accuracy. We identify
                    hidden risks and optimization opportunities that traditional
                    methods miss.
                  </p>

                  <a
                    href="#"
                    className="group inline-flex items-center text-base font-medium leading-[1.5] hover:opacity-80 transition-opacity text-primary"
                  >
                    See how we can help you
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Extra space to allow COI to extend visually */}
        <div className="h-[200px] lg:h-[350px]" />
      </section>
    </>
  );
}
