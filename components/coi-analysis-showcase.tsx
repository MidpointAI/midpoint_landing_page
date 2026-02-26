"use client";

import { useRef, useState, useEffect, memo, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Highlight zones mapped to actual COI document sections (corrected percentages)
const highlightZones = [
  {
    id: "gl",
    label: "General Liability",
    coverage: "$1,000,000 / $2,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "38.5%",
    left: "3%",
    width: "94%",
    height: "11%"
  },
  {
    id: "auto",
    label: "Auto Liability",
    coverage: "$1,000,000",
    sublabel: "Combined Single Limit",
    top: "49.5%",
    left: "3%",
    width: "94%",
    height: "7.5%"
  },
  {
    id: "umbrella",
    label: "Umbrella / Excess",
    coverage: "$1,000,000 / $1,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "57%",
    left: "3%",
    width: "94%",
    height: "4.6%"
  },
  {
    id: "wc",
    label: "Workers Comp",
    coverage: "$1,000,000",
    sublabel: "Each Accident",
    top: "61.5%",
    left: "3%",
    width: "94%",
    height: "6%"
  },
];

// Memoized CheckIcon to prevent unnecessary re-renders
const CheckIcon = memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-3 h-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
});

// Memoized ExtractedCard component
const ExtractedCard = memo(function ExtractedCard({
  zone,
  isActive,
  isComplete,
  isHovered,
  onHover,
  onHoverEnd
}: {
  zone: typeof highlightZones[0];
  isActive: boolean;
  isComplete: boolean;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const highlighted = isActive || isHovered;
  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        height: "auto",
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`
        border-l-2 pl-4 py-2 cursor-pointer transition-colors duration-200
        ${highlighted ? "border-primary" : "border-border"}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors duration-200 ${highlighted ? "text-foreground" : "text-muted-foreground"}`}>
              {zone.label}
            </span>
            {isComplete && (
              <span className="text-primary">
                <CheckIcon className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{zone.sublabel}</p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`text-lg font-mono tabular-nums whitespace-nowrap transition-colors duration-200 ${highlighted ? "text-primary" : "text-foreground"}`}
        >
          {zone.coverage}
        </motion.span>
      </div>
    </motion.div>
  );
});

export default function CoiAnalysisShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [currentStep, setCurrentStep] = useState(-1);
  const [extractedZones, setExtractedZones] = useState<string[]>([]);
  const [flyingData, setFlyingData] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    if (!isInView) return;

    // Start animation sequence
    const startDelay = setTimeout(() => {
      setCurrentStep(0);
    }, 800);

    return () => clearTimeout(startDelay);
  }, [isInView]);

  useEffect(() => {
    if (currentStep < 0) return;

    // Add current zone to extracted list
    if (currentStep < highlightZones.length) {
      // Start flying animation
      setFlyingData(highlightZones[currentStep].id);

      const timer1 = setTimeout(() => {
        setExtractedZones(prev => [...prev, highlightZones[currentStep].id]);
        setFlyingData(null);
      }, 700);

      // Move to next step after extraction - separate timeout for proper cleanup
      const timer2 = setTimeout(() => {
        if (currentStep < highlightZones.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setCurrentStep(highlightZones.length); // Complete state
        }
      }, 1300); // 700 + 600

      // Clean up both timers
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [currentStep]);

  const isComplete = currentStep >= highlightZones.length;

  return (
    <section
      ref={ref}
      className="relative bg-background py-16 md:py-24 lg:py-32 px-6 overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block"
          >
            Intelligent Analysis
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground tracking-tight"
          >
            See AI in <em className="italic">Action</em>
          </motion.h2>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Document Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full lg:w-[55%] max-w-[500px] mx-auto lg:mx-0"
          >
            {/* Document Container */}
            <div className="relative bg-card border border-border p-2 rounded-xl">
              {/* Processing Indicator */}
              <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 bg-card px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isComplete ? "bg-primary" : "bg-primary animate-pulse"}`} />
                <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                  {isComplete ? "Analysis Complete" : "Processing..."}
                </span>
              </div>

              {/* COI Image with Overlay */}
              <div className="relative aspect-[8.5/11] w-full bg-white">
                <Image
                  src="/coi-document.png"
                  alt="Certificate of Insurance"
                  fill
                  className="object-contain"
                  priority
                />

                {/* Highlight Overlays */}
                {highlightZones.map((zone, idx) => {
                  const isActiveZone = currentStep === idx;
                  const isExtracted = extractedZones.includes(zone.id);
                  const isFlying = flyingData === zone.id;
                  const isHovered = hoveredZone === zone.id;
                  const shouldHighlight = isActiveZone || isHovered;

                  return (
                    <motion.div
                      key={zone.id}
                      className="absolute pointer-events-none"
                      style={{
                        top: zone.top,
                        left: zone.left,
                        width: zone.width,
                        height: zone.height,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: shouldHighlight ? 1 : isExtracted ? 0.5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Highlight Box - with visible background fill */}
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

                      {/* Zone Label */}
                      {shouldHighlight && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider shadow-lg rounded-md"
                        >
                          {zone.label}
                        </motion.div>
                      )}

                      {/* Flying Data Pill - animates from document to cards */}
                      {isFlying && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-end pr-2 z-20"
                          initial={{ opacity: 1 }}
                          animate={{
                            opacity: [1, 1, 0],
                            x: [0, 20, 150],
                            scale: [1, 1.05, 0.9]
                          }}
                          transition={{
                            duration: 0.6,
                            times: [0, 0.4, 1],
                            ease: "easeInOut"
                          }}
                        >
                          <span className="bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono font-medium shadow-lg whitespace-nowrap rounded-full">
                            {zone.coverage}
                          </span>
                        </motion.div>
                      )}

                      {/* Small extracted indicator */}
                      {isExtracted && !shouldHighlight && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-primary flex items-center justify-center rounded-full shadow-sm"
                        >
                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* File Name */}
              <div className="mt-2 text-center">
                <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                  test_coi.pdf
                </span>
              </div>
            </div>
          </motion.div>

          {/* Extracted Data Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-[45%] max-w-[400px] mx-auto lg:mx-0"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${extractedZones.length > 0 ? "bg-primary" : "bg-muted"}`} />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Extracted Data
              </span>
              {extractedZones.length > 0 && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {extractedZones.length}/{highlightZones.length}
                </span>
              )}
            </div>

            {/* Extracted Cards */}
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {highlightZones.map((zone) => {
                  const isExtracted = extractedZones.includes(zone.id);
                  const isActive = currentStep === highlightZones.findIndex(z => z.id === zone.id);

                  if (!isExtracted) return null;

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

              {/* Empty State */}
              {extractedZones.length === 0 && (
                <div className="flex items-center justify-center h-[200px] border border-dashed border-border text-muted-foreground text-sm rounded-xl">
                  <span className="animate-pulse">Analyzing document...</span>
                </div>
              )}
            </div>

            {/* Compliance Summary */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 pt-4 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground block mb-1">
                        Compliance Score
                      </span>
                      <span className="text-sm text-muted-foreground">
                        All requirements met
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-light text-primary font-mono">98%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView && isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "< 30s", label: "Processing" },
            { value: "99.2%", label: "Accuracy" },
            { value: "50+", label: "Data Points" },
            { value: "24/7", label: "Monitoring" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xl md:text-2xl font-light text-foreground font-mono mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
