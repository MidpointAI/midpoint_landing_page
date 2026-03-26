"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Eye, ShieldCheck, X } from "lucide-react";

type ViewMode = "verified" | "extraction";
type Phase =
  | "idle"
  | "ai-extracting"
  | "human-verifying"
  | "compliance-checking"
  | "complete";
type WorkflowStepId = "extract" | "review" | "compliance";
type WorkflowStep = {
  id: WorkflowStepId;
  headline: string;
};
type WorkflowSnapshot = {
  phase: Phase;
  currentStep: number;
  extractedIds: string[];
  verifiedIds: string[];
  correctedIds: string[];
  currentVerifyIndex: number;
};

type ExtractionZone = {
  id: string;
  label: string;
  coverage: string;
  sublabel: string;
  top: string;
  left: string;
  width: string;
  height: string;
  aiCorrect: boolean;
  aiCoverage?: string;
};

const VERIFIED_BAR = {
  top: "7.3%",
  left: "3.5%",
  width: "88.5%",
  height: "1.3%",
};

const EXTRACTION_ZONES: ExtractionZone[] = [
  {
    id: "gl",
    label: "General Liability",
    coverage: "$1,000,000 / $2,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "38.5%",
    left: "3%",
    width: "94%",
    height: "11%",
    aiCorrect: true,
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
    aiCorrect: true,
  },
  {
    id: "umbrella",
    label: "Umbrella / Excess",
    coverage: "$1,000,000 / $1,000,000",
    aiCoverage: "$1,500,000 / $1,000,000",
    sublabel: "Each Occurrence / Aggregate",
    top: "57%",
    left: "3%",
    width: "94%",
    height: "4.6%",
    aiCorrect: false,
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
    aiCorrect: true,
  },
];

const ALL_ZONE_IDS = EXTRACTION_ZONES.map((zone) => zone.id);
const VERIFIED_ZONE_IDS = EXTRACTION_ZONES.filter((zone) => zone.aiCorrect).map((zone) => zone.id);
const CORRECTED_ZONE_IDS = EXTRACTION_ZONES.filter((zone) => !zone.aiCorrect).map((zone) => zone.id);

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "extract" as const,
    headline: "AI extracts the COI fields",
  },
  {
    id: "review" as const,
    headline: "Experts review the extracted data",
  },
  {
    id: "compliance" as const,
    headline: "Compliance gets checked",
  },
];

function addUniqueId(previous: string[], id: string) {
  return previous.includes(id) ? previous : [...previous, id];
}

function getNarrativeStepFromPhase(phase: Phase): WorkflowStepId {
  switch (phase) {
    case "idle":
    case "ai-extracting":
      return "extract";
    case "human-verifying":
      return "review";
    case "compliance-checking":
    case "complete":
      return "compliance";
  }
}

function getWorkflowStep(stepId: WorkflowStepId) {
  return WORKFLOW_STEPS.find((step) => step.id === stepId) ?? WORKFLOW_STEPS[0];
}

function getWorkflowSnapshot(stepId: WorkflowStepId): WorkflowSnapshot {
  switch (stepId) {
    case "extract":
      return {
        phase: "ai-extracting",
        currentStep: EXTRACTION_ZONES.length,
        extractedIds: ALL_ZONE_IDS,
        verifiedIds: [],
        correctedIds: [],
        currentVerifyIndex: -1,
      };
    case "review":
      return {
        phase: "human-verifying",
        currentStep: EXTRACTION_ZONES.length,
        extractedIds: ALL_ZONE_IDS,
        verifiedIds: VERIFIED_ZONE_IDS,
        correctedIds: CORRECTED_ZONE_IDS,
        currentVerifyIndex: -1,
      };
    case "compliance":
      return {
        phase: "complete",
        currentStep: EXTRACTION_ZONES.length,
        extractedIds: ALL_ZONE_IDS,
        verifiedIds: VERIFIED_ZONE_IDS,
        correctedIds: CORRECTED_ZONE_IDS,
        currentVerifyIndex: -1,
      };
  }
}

export default function CoiAnalysisShowcase() {
  const ref = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [activeView, setActiveView] = useState<ViewMode>("verified");
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentStep, setCurrentStep] = useState(-1);
  const [extractedIds, setExtractedIds] = useState<string[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  const [correctedIds, setCorrectedIds] = useState<string[]>([]);
  const [currentVerifyIndex, setCurrentVerifyIndex] = useState(-1);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [showCorrectionPopup, setShowCorrectionPopup] = useState(false);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function applyWorkflowSnapshot(stepId: WorkflowStepId) {
    clearTimers();

    const snapshot = getWorkflowSnapshot(stepId);

    setPhase(snapshot.phase);
    setCurrentStep(snapshot.currentStep);
    setExtractedIds(snapshot.extractedIds);
    setVerifiedIds(snapshot.verifiedIds);
    setCorrectedIds(snapshot.correctedIds);
    setCurrentVerifyIndex(snapshot.currentVerifyIndex);
    setHoveredZoneId(null);
    setShowCorrectionPopup(false);
  }

  function resetExtraction() {
    clearTimers();
    setPhase("idle");
    setCurrentStep(-1);
    setExtractedIds([]);
    setVerifiedIds([]);
    setCorrectedIds([]);
    setCurrentVerifyIndex(-1);
    setHoveredZoneId(null);
    setShowCorrectionPopup(false);
  }

  function startHumanVerification() {
    setPhase("human-verifying");
    setCurrentVerifyIndex(0);

    function verifyStep(index: number) {
      setCurrentVerifyIndex(index);
      const zone = EXTRACTION_ZONES[index];
      const verifyDelay = zone.aiCorrect ? 400 : 1000;

      const verify = window.setTimeout(() => {
        if (zone.aiCorrect) {
          setVerifiedIds((previous) => addUniqueId(previous, zone.id));
        } else {
          setCorrectedIds((previous) => addUniqueId(previous, zone.id));
        }

        if (index < EXTRACTION_ZONES.length - 1) {
          const nextStep = window.setTimeout(() => {
            verifyStep(index + 1);
          }, 200);
          timers.current.push(nextStep);
          return;
        }

        const beginComplianceCheck = window.setTimeout(() => {
          setCurrentVerifyIndex(-1);
          setPhase("compliance-checking");

          const complete = window.setTimeout(() => {
            setPhase("complete");
          }, 800);

          timers.current.push(complete);
        }, 350);
        timers.current.push(beginComplianceCheck);
      }, verifyDelay);

      timers.current.push(verify);
    }

    verifyStep(0);
  }

  function startExtraction() {
    resetExtraction();
    setPhase("ai-extracting");

    function runStep(index: number) {
      setCurrentStep(index);

      const capture = window.setTimeout(() => {
        setExtractedIds((previous) => addUniqueId(previous, EXTRACTION_ZONES[index].id));
      }, 600);

      const next = window.setTimeout(() => {
        if (index < EXTRACTION_ZONES.length - 1) {
          runStep(index + 1);
          return;
        }

        setCurrentStep(EXTRACTION_ZONES.length);
        const humanStart = window.setTimeout(() => {
          startHumanVerification();
        }, 800);
        timers.current.push(humanStart);
      }, 1000);

      timers.current.push(capture, next);
    }

    const start = window.setTimeout(() => runStep(0), 400);
    timers.current.push(start);
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const isFullyComplete = phase === "complete";
  const correctionCount = correctedIds.length;
  const activeWorkflowStepId = getNarrativeStepFromPhase(phase);
  const activeWorkflowStep = getWorkflowStep(activeWorkflowStepId);
  const activeWorkflowIndex = WORKFLOW_STEPS.findIndex((step) => step.id === activeWorkflowStepId);
  const canInspectExtractionDetails =
    phase === "complete" || (phase === "human-verifying" && currentVerifyIndex === -1);

  const handleZoneHover = (zoneId: string | null) => {
    setHoveredZoneId(zoneId);
    if (zoneId === "umbrella" && correctedIds.includes("umbrella")) {
      setShowCorrectionPopup(true);
      return;
    }
    setShowCorrectionPopup(false);
  };

  const handleWorkflowStepChange = (direction: "previous" | "next") => {
    const nextIndex = direction === "previous" ? activeWorkflowIndex - 1 : activeWorkflowIndex + 1;

    if (nextIndex < 0 || nextIndex >= WORKFLOW_STEPS.length) {
      return;
    }

    applyWorkflowSnapshot(WORKFLOW_STEPS[nextIndex].id);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background px-6 py-16 md:py-24 lg:py-32"
    >

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* <div className="mb-10 text-center lg:mb-14">
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
        </div> */}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_530px] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="relative w-full" style={{ aspectRatio: "8.5 / 11" }}>
                <Image
                  src="/coi-document.png"
                  alt="Certificate of Insurance"
                  fill
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="absolute inset-0 h-full w-full object-contain"
                  priority
                />

                {activeView === "verified" && (
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      top: VERIFIED_BAR.top,
                      left: VERIFIED_BAR.left,
                      width: VERIFIED_BAR.width,
                      height: VERIFIED_BAR.height,
                    }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        transformOrigin: "left",
                        width: "100%",
                        height: "100%",
                        background: "var(--primary)",
                        mixBlendMode: "multiply",
                      }}
                    />
                  </div>
                )}

                {activeView === "extraction" &&
                  EXTRACTION_ZONES.map((zone, index) => {
                    const isActive = currentStep === index && phase === "ai-extracting";
                    const isExtracted = extractedIds.includes(zone.id);
                    const isVerifying = currentVerifyIndex === index && phase === "human-verifying";
                    const isVerified = verifiedIds.includes(zone.id);
                    const isCorrected = correctedIds.includes(zone.id);
                    const isHovered = hoveredZoneId === zone.id;
                    const visible = isActive || isExtracted;

                    if (!visible) return null;

                    const borderColor = isHovered
                      ? "color-mix(in oklch, var(--foreground) 50%, transparent)"
                      : isVerifying
                        ? "rgba(251, 191, 36, 0.6)"
                        : isCorrected
                          ? "rgba(251, 191, 36, 0.5)"
                          : isVerified
                            ? "rgba(16, 185, 129, 0.5)"
                            : isActive
                              ? "rgba(59, 130, 246, 0.6)"
                              : "rgba(59, 130, 246, 0.3)";

                    const bgColor = isHovered
                      ? "color-mix(in oklch, var(--foreground) 8%, transparent)"
                      : isVerifying
                        ? "rgba(251, 191, 36, 0.08)"
                        : isCorrected
                          ? "rgba(251, 191, 36, 0.06)"
                          : isVerified
                            ? "rgba(16, 185, 129, 0.06)"
                            : isActive
                              ? "rgba(59, 130, 246, 0.12)"
                              : "rgba(59, 130, 246, 0.05)";

                    return (
                      <div
                        key={zone.id}
                        className={`absolute transition-all duration-200 ${
                          isActive || isVerifying ? "animate-pulse" : ""
                        }`}
                        style={{
                          top: zone.top,
                          left: zone.left,
                          width: zone.width,
                          height: zone.height,
                          border: `2px solid ${borderColor}`,
                          background: bgColor,
                          borderRadius: "3px",
                          cursor: canInspectExtractionDetails ? "pointer" : "default",
                          pointerEvents: canInspectExtractionDetails ? "auto" : "none",
                        }}
                        onMouseEnter={() => canInspectExtractionDetails && handleZoneHover(zone.id)}
                        onMouseLeave={() => handleZoneHover(null)}
                      />
                    );
                  })}

                {showCorrectionPopup && (
                  <div
                    className="absolute z-20 w-56 rounded-lg border border-amber-500/30 bg-card/95 p-3 shadow-xl backdrop-blur-sm"
                    style={{
                      top: "68%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowCorrectionPopup(false)}
                      className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] font-medium text-foreground">
                          AI Error Caught
                        </p>
                        <p className="text-[10px] leading-relaxed text-muted-foreground">
                          AI extracted{" "}
                          <span className="font-mono text-amber-600 dark:text-amber-400">$1,500,000</span> — but
                          our expert team caught it. Nothing ever goes unnoticed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex h-9 items-center border-t border-border px-3">
                <span className="text-[11px] text-muted-foreground">test_coi.pdf</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="flex flex-col lg:h-full lg:min-h-0"
          >
            <div className="relative mb-6 flex items-center gap-8">
              <button
                type="button"
                onClick={() => {
                  setActiveView("verified");
                  resetExtraction();
                }}
                className={`relative pb-3 text-lg font-medium transition-colors ${
                  activeView === "verified"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Verified Coverage
                {activeView === "verified" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("extraction");
                  startExtraction();
                }}
                className={`relative pb-3 text-lg font-medium transition-colors ${
                  activeView === "extraction"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                AI Extraction
                {activeView === "extraction" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <div className="absolute bottom-0 -left-4 h-px w-[62%] bg-border" />
            </div>

            {activeView === "verified" && (
              <div className="flex flex-1 flex-col mt-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Eye className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold uppercase tracking-wider text-primary">
                      Gap Detection
                    </span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-4xl font-bold leading-[0.94] tracking-[-0.05em] text-foreground">
                      You are never as covered as you think
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      When subs submit their certificates, we use advanced tools to verify
                      insurance documents with surgical accuracy. We identify hidden risks and
                      optimization opportunities that traditional methods miss.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    See how we can help you
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            )}

            {activeView === "extraction" && (
              <div className="mt-8 flex flex-1 flex-col">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold tracking-[0.22em] text-primary tabular-nums">
                      {String(activeWorkflowIndex + 1).padStart(2, "0")}/
                      {String(WORKFLOW_STEPS.length).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleWorkflowStepChange("previous")}
                        disabled={activeWorkflowIndex === 0}
                        aria-label="Previous extraction step"
                        className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/40 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 disabled:cursor-default disabled:opacity-35 disabled:hover:border-border/40 disabled:hover:bg-transparent"
                      >
                        <ArrowLeft className="h-4.5 w-4.5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWorkflowStepChange("next")}
                        disabled={activeWorkflowIndex === WORKFLOW_STEPS.length - 1}
                        aria-label="Next extraction step"
                        className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/40 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 disabled:cursor-default disabled:opacity-35 disabled:hover:border-border/40 disabled:hover:bg-transparent"
                      >
                        <ArrowRight className="h-4.5 w-4.5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                      </button>
                    </div>
                  </div>

                  <div className="relative min-h-[4.8rem] overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeWorkflowStep.id}
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <h3 className="mb-3 text-4xl font-bold leading-[0.94] tracking-[-0.05em] text-foreground">
                          {activeWorkflowStep.headline}
                        </h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 flex-1 space-y-2">
                  {EXTRACTION_ZONES.map((zone, index) => {
                    const isExtracted = extractedIds.includes(zone.id);
                    const isVerifying = currentVerifyIndex === index && phase === "human-verifying";
                    const isVerified = verifiedIds.includes(zone.id);
                    const isCorrected = correctedIds.includes(zone.id);
                    const isHovered = hoveredZoneId === zone.id;

                    if (!isExtracted) return null;

                    return (
                      <div
                        key={zone.id}
                        className={`rounded-lg border p-3 transition-all duration-200 ${
                          canInspectExtractionDetails ? "cursor-pointer " : ""
                        }${
                          isHovered
                            ? "border-foreground/40 bg-foreground/5"
                            : isVerifying
                              ? "border-amber-500/30 bg-amber-500/5"
                              : isCorrected
                                ? "border-amber-500/20 bg-card"
                                : isVerified
                                  ? "border-emerald-500/20 bg-card"
                                  : "border-blue-500/20 bg-blue-500/5"
                        }`}
                        onMouseEnter={() => canInspectExtractionDetails && handleZoneHover(zone.id)}
                        onMouseLeave={() => handleZoneHover(null)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="mb-0.5 flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {zone.label}
                              </span>
                              {isVerified && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500">
                                  <Check className="h-2.5 w-2.5" />
                                  Verified
                                </span>
                              )}
                              {isCorrected && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-500">
                                  <Check className="h-2.5 w-2.5" />
                                  Corrected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{zone.sublabel}</p>
                          </div>

                          <div className="text-right">
                            {isCorrected && zone.aiCoverage ? (
                              <div>
                                <span className="text-xs text-muted-foreground line-through">
                                  {zone.aiCoverage}
                                </span>
                                <p className="font-mono text-sm font-medium text-foreground">
                                  {zone.coverage}
                                </p>
                              </div>
                            ) : (
                              <p className="font-mono text-sm font-medium text-foreground">
                                {zone.coverage}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isFullyComplete && (
                  <div className="mt-auto border-t border-border pt-2.5">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-xs uppercase tracking-[0.22em] text-emerald-500">
                            Compliance Check Complete
                          </p>
                          <p className="text-sm font-medium text-foreground">All requirements met</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/12">
                          <Check className="h-5 w-5 text-emerald-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {correctionCount > 0
                          ? `${correctionCount} field${correctionCount === 1 ? "" : "s"} corrected during expert review before approval.`
                          : "The extracted coverage matched the requirements without needing corrections."}
                      </p>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      AI extracts the data, experts verify it, and compliance is checked before
                      the certificate is ever approved.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
