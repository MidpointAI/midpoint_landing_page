"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";

type ViewMode = "verified" | "extraction";

type HighlightZone = {
  id: string;
  label: string;
  coverage: string;
  sublabel: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

const highlightZones: HighlightZone[] = [
  {
    id: "gl",
    label: "General Liability",
    coverage: "$1,000,000 / $2,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "38.5%",
    left: "3%",
    width: "94%",
    height: "11%",
  },
  {
    id: "auto",
    label: "Auto Liability",
    coverage: "$1,000,000",
    sublabel: "Combined Single Limit",
    top: "49.5%",
    left: "3%",
    width: "94%",
    height: "7.5%",
  },
  {
    id: "umbrella",
    label: "Umbrella / Excess",
    coverage: "$1,000,000 / $1,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "57%",
    left: "3%",
    width: "94%",
    height: "4.6%",
  },
  {
    id: "wc",
    label: "Workers Comp",
    coverage: "$1,000,000",
    sublabel: "Each Accident",
    top: "61.5%",
    left: "3%",
    width: "94%",
    height: "6%",
  },
];

const viewOptions: Array<{ id: ViewMode; label: string }> = [
  { id: "verified", label: "Verified Coverage" },
  { id: "extraction", label: "AI Extraction" },
];

const CheckIcon = memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-3 w-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
});

const ShieldIcon = memo(function ShieldIcon() {
  return (
    <svg
      className="h-5 w-5 text-primary"
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

const ArrowIcon = memo(function ArrowIcon() {
  return (
    <svg
      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
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

const ExtractedCard = memo(function ExtractedCard({
  zone,
  isActive,
  isComplete,
  isHovered,
  onHover,
  onHoverEnd,
}: {
  zone: HighlightZone;
  isActive: boolean;
  isComplete: boolean;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const highlighted = isActive || isHovered;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -32, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.98 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`rounded-2xl border px-4 py-3 transition-colors duration-200 ${
        highlighted
          ? "border-primary/70 bg-primary/10 shadow-[0_0_0_1px_rgba(201,255,100,0.15)]"
          : "border-border bg-card/70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                highlighted ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {zone.label}
            </span>
            {isComplete ? (
              <span className="text-primary">
                <CheckIcon />
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{zone.sublabel}</p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.24 }}
          className={`whitespace-nowrap text-base font-mono tabular-nums md:text-lg ${
            highlighted ? "text-primary" : "text-foreground"
          }`}
        >
          {zone.coverage}
        </motion.span>
      </div>
    </motion.div>
  );
});

export default function CoiAnalysisShowcase() {
  const ref = useRef<HTMLElement | null>(null);
  const timerIdsRef = useRef<number[]>([]);
  const tabRefs = useRef<Record<ViewMode, HTMLButtonElement | null>>({
    verified: null,
    extraction: null,
  });
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const [activeView, setActiveView] = useState<ViewMode>("verified");
  const [currentStep, setCurrentStep] = useState(-1);
  const [extractedZones, setExtractedZones] = useState<string[]>([]);
  const [flyingData, setFlyingData] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const clearExtractionTimers = useCallback(() => {
    timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timerIdsRef.current = [];
  }, []);

  const resetExtractionState = useCallback(() => {
    clearExtractionTimers();
    setCurrentStep(-1);
    setExtractedZones([]);
    setFlyingData(null);
    setHoveredZone(null);
  }, [clearExtractionTimers]);

  const startExtractionSequence = useCallback(() => {
    clearExtractionTimers();
    setHoveredZone(null);

    if (prefersReducedMotion) {
      setCurrentStep(highlightZones.length);
      setExtractedZones(highlightZones.map((zone) => zone.id));
      setFlyingData(null);
      return;
    }

    setCurrentStep(-1);
    setExtractedZones([]);
    setFlyingData(null);

    const runStep = (stepIndex: number) => {
      const zone = highlightZones[stepIndex];
      setCurrentStep(stepIndex);
      setFlyingData(zone.id);

      const captureTimer = window.setTimeout(() => {
        setExtractedZones((previous) =>
          previous.includes(zone.id) ? previous : [...previous, zone.id]
        );
        setFlyingData(null);
      }, 700);

      const nextTimer = window.setTimeout(() => {
        if (stepIndex < highlightZones.length - 1) {
          runStep(stepIndex + 1);
          return;
        }

        setCurrentStep(highlightZones.length);
      }, 1300);

      timerIdsRef.current.push(captureTimer, nextTimer);
    };

    const initialTimer = window.setTimeout(() => {
      runStep(0);
    }, 300);

    timerIdsRef.current.push(initialTimer);
  }, [clearExtractionTimers, prefersReducedMotion]);

  const handleViewChange = useCallback(
    (nextView: ViewMode) => {
      if (nextView === activeView) {
        return;
      }

      setActiveView(nextView);

      if (nextView === "verified") {
        resetExtractionState();
        return;
      }

      startExtractionSequence();
    },
    [activeView, resetExtractionState, startExtractionSequence]
  );

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();

      const currentIndex = viewOptions.findIndex((option) => option.id === activeView);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + viewOptions.length) % viewOptions.length;
      const nextView = viewOptions[nextIndex].id;

      handleViewChange(nextView);
      tabRefs.current[nextView]?.focus();
    },
    [activeView, handleViewChange]
  );

  useEffect(() => {
    return () => {
      clearExtractionTimers();
    };
  }, [clearExtractionTimers]);

  const isExtractionComplete = currentStep >= highlightZones.length;
  const processingLabel =
    activeView === "verified" || isExtractionComplete ? "Analysis Complete" : "Processing...";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background px-6 py-16 md:py-24 lg:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,255,100,0.08),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center lg:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-4 block text-xs uppercase tracking-[0.4em] text-primary"
          >
            Intelligent Analysis
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            See AI in <em className="italic">Action</em>
          </motion.h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="relative w-full max-w-[560px]"
          >
            <div className="relative rounded-[28px] border border-border bg-card/90 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    activeView === "verified" || isExtractionComplete
                      ? "bg-primary"
                      : "animate-pulse bg-primary"
                  }`}
                />
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {processingLabel}
                </span>
              </div>

              <div className="relative aspect-[8.5/11] overflow-hidden rounded-[20px] bg-white">
                <Image
                  src="/coi-document.png"
                  alt="Certificate of Insurance"
                  fill
                  className="object-contain"
                  priority
                />

                <AnimatePresence mode="wait" initial={false}>
                  {activeView === "verified" ? (
                    <motion.div
                      key="verified-highlight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="absolute inset-0"
                    >
                      <div
                        className="absolute left-[17.8%] top-[5.6%] h-[2.3%] w-[72%] mix-blend-multiply"
                        style={{ backgroundColor: "#c9ff64" }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="extraction-highlight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="absolute inset-0"
                    >
                      {highlightZones.map((zone, index) => {
                        const isActiveZone = currentStep === index;
                        const isExtracted = extractedZones.includes(zone.id);
                        const isFlying = flyingData === zone.id;
                        const isHovered = hoveredZone === zone.id;
                        const shouldHighlight = isActiveZone || isHovered;

                        return (
                          <motion.div
                            key={zone.id}
                            className="pointer-events-none absolute"
                            style={{
                              top: zone.top,
                              left: zone.left,
                              width: zone.width,
                              height: zone.height,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: shouldHighlight ? 1 : isExtracted ? 0.5 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div
                              className="absolute inset-0 transition-all duration-200"
                              style={{
                                backgroundColor: shouldHighlight
                                  ? "rgba(34, 197, 94, 0.18)"
                                  : isExtracted
                                  ? "rgba(34, 197, 94, 0.06)"
                                  : "transparent",
                                border: shouldHighlight
                                  ? "2px solid #22C55E"
                                  : isExtracted
                                  ? "1px solid rgba(34, 197, 94, 0.4)"
                                  : "none",
                                boxShadow: shouldHighlight
                                  ? "0 0 12px rgba(34, 197, 94, 0.3), inset 0 0 8px rgba(34, 197, 94, 0.1)"
                                  : "none",
                              }}
                            />

                            {shouldHighlight ? (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-6 left-0 rounded-md bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground shadow-lg"
                              >
                                {zone.label}
                              </motion.div>
                            ) : null}

                            {isFlying ? (
                              <motion.div
                                className="absolute inset-0 z-20 flex items-center justify-end pr-2"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: [1, 1, 0], x: [0, 20, 150], scale: [1, 1.05, 0.9] }}
                                transition={{
                                  duration: 0.6,
                                  times: [0, 0.4, 1],
                                  ease: "easeInOut",
                                }}
                              >
                                <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-medium whitespace-nowrap text-primary-foreground shadow-lg">
                                  {zone.coverage}
                                </span>
                              </motion.div>
                            ) : null}

                            {isExtracted && !shouldHighlight ? (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm"
                              >
                                <CheckIcon className="h-2.5 w-2.5 text-white" />
                              </motion.div>
                            ) : null}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  test_coi.pdf
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="w-full max-w-[420px] lg:ml-auto"
          >
            <div className="mb-6 flex justify-start lg:justify-end">
              <div
                role="tablist"
                aria-label="COI analysis views"
                className="inline-flex rounded-full border border-border bg-card/80 p-1 shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur"
              >
                {viewOptions.map((option) => {
                  const isSelected = activeView === option.id;

                  return (
                    <button
                      key={option.id}
                      ref={(node) => {
                        tabRefs.current[option.id] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`${option.id}-tab`}
                      aria-controls={`${option.id}-panel`}
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => handleViewChange(option.id)}
                      onKeyDown={handleTabKeyDown}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(201,255,100,0.28)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {activeView === "verified" ? (
                <motion.div
                  key="verified-panel"
                  id="verified-panel"
                  role="tabpanel"
                  aria-labelledby="verified-tab"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6 rounded-[28px] border border-border/80 bg-card/55 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <ShieldIcon />
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      Gap Detection
                    </span>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[44px]">
                      You are never as covered as you think
                    </h3>

                    <p className="text-base leading-8 text-foreground md:text-lg">
                      When subs submit their certificates, we use advanced tools to verify
                      insurance documents with surgical accuracy. We identify hidden risks and
                      optimization opportunities that traditional methods miss.
                    </p>

                    <a
                      href="#"
                      className="group inline-flex items-center text-base font-medium text-primary transition-opacity hover:opacity-80"
                    >
                      See how we can help you
                      <ArrowIcon />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="extraction-panel"
                  id="extraction-panel"
                  role="tabpanel"
                  aria-labelledby="extraction-tab"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[28px] border border-border/80 bg-card/55 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                >
                  <div className="min-h-[240px] space-y-3">
                    <AnimatePresence mode="popLayout">
                      {highlightZones.map((zone) => {
                        const isExtracted = extractedZones.includes(zone.id);
                        const isActive = currentStep === highlightZones.findIndex((item) => item.id === zone.id);

                        if (!isExtracted) {
                          return null;
                        }

                        return (
                          <ExtractedCard
                            key={zone.id}
                            zone={zone}
                            isActive={isActive}
                            isComplete={!isActive}
                            isHovered={hoveredZone === zone.id}
                            onHover={() => setHoveredZone(zone.id)}
                            onHoverEnd={() => setHoveredZone(null)}
                          />
                        );
                      })}
                    </AnimatePresence>

                    {extractedZones.length === 0 ? (
                      <div className="flex h-[240px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                        <span className="animate-pulse">Analyzing document...</span>
                      </div>
                    ) : null}
                  </div>

                  <AnimatePresence>
                    {isExtractionComplete ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, delay: 0.12 }}
                        className="mt-6 border-t border-border pt-5"
                      >
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Compliance Score
                            </span>
                            <span className="text-sm text-muted-foreground">
                              All requirements met
                            </span>
                          </div>
                          <span className="text-3xl font-light text-primary md:text-4xl">98%</span>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
