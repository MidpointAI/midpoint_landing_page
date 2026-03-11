"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import { Radar, Hourglass, Banknote } from "lucide-react";

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

// ── SVG donut constants ───────────────────────────────────────────────
const VIEW = 200;
const CENTER = VIEW / 2;
const RADIUS = 88;
const TRACK_STROKE = 2.5;
const TRAIL_STROKE = 14;
const COMET_STROKE = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const LEAD_AHEAD = 1.25;
const COMET_ARC_DEG = 40; // how many degrees the comet spans

/**
 * Scroll-driven donut ring.
 *
 * Strategy for the comet (no segments, no boxes):
 * - Draw one single SVG <circle> stroke for the comet arc
 * - Wrap it in an absolutely-positioned <div> with a CSS
 *   conic-gradient mask that fades the tail to transparent
 * - The mask rotates to follow the comet's position
 *
 * This gives a perfectly smooth gradient fade with zero seams.
 */
function ScrollDonut({ progress }: { progress: number }) {
  const trailP = clamp(progress >= 99.95 ? 100 : progress, 0, 100);
  const leadP = clamp(trailP * LEAD_AHEAD, 0, 100);

  // Trail arc
  const trailDraw = (trailP / 100) * CIRCUMFERENCE;
  const trailGap = CIRCUMFERENCE - trailDraw;

  // Comet: a short arc that sits at the leading edge
  const headAngle = (leadP / 100) * 360; // degrees from 12 o'clock
  const cometSpan = Math.min(COMET_ARC_DEG, headAngle);
  const cometArcLen = (cometSpan / 360) * CIRCUMFERENCE;
  const cometGapLen = CIRCUMFERENCE - cometArcLen;
  // dashoffset positions the drawn portion so it ends at headAngle
  // In SVG (rotated -90deg), stroke starts at 12 o'clock = 0deg
  // dashoffset = -(headAngle / 360) * CIRCUMFERENCE shifts the arc forward
  // but we need the arc to END at headAngle, so offset by the arc start
  const cometOffset = -((headAngle - cometSpan) / 360) * CIRCUMFERENCE;

  const showComet = leadP > 1;

  // CSS conic-gradient mask rotation:
  // The mask fades from transparent (tail) to white (head).
  // We rotate it so the opaque end aligns with the comet head.
  // CSS conic-gradient "from Xdeg" starts at 12 o'clock + X clockwise.
  // Tail starts at (headAngle - cometSpan), head ends at headAngle.
  const maskStartDeg = headAngle - cometSpan;

  return (
    <div className="relative aspect-square w-[245px]">
      {/* Base SVG: track + trail */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full rotate-[-90deg]"
        fill="none"
      >
        {/* Track — thin gray full circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          style={{ stroke: "color-mix(in oklch, var(--foreground) 14%, transparent)" }}
          strokeWidth={TRACK_STROKE}
        />

        {/* Trail — thick green arc, butt/square caps */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="var(--primary)"
          strokeWidth={TRAIL_STROKE}
          strokeLinecap="butt"
          strokeDasharray={`${trailDraw} ${trailGap}`}
          strokeDashoffset={0}
          opacity={0.9}
          style={{ filter: "drop-shadow(0 0 8px rgba(201,255,100,0.12))" }}
        />
      </svg>

      {/* Comet layer: single circle stroke + conic-gradient CSS mask for fade */}
      {showComet && (
        <div
          className="absolute inset-0"
          style={{
            maskImage: `conic-gradient(from ${maskStartDeg}deg, transparent 0deg, white ${cometSpan}deg, transparent ${cometSpan}deg)`,
            WebkitMaskImage: `conic-gradient(from ${maskStartDeg}deg, transparent 0deg, white ${cometSpan}deg, transparent ${cometSpan}deg)`,
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="h-full w-full rotate-[-90deg]"
            fill="none"
          >
            <defs>
              <filter id="cometGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              style={{ stroke: "color-mix(in oklch, var(--primary) 78%, white 22%)" }}
              strokeWidth={COMET_STROKE}
              strokeLinecap="round"
              strokeDasharray={`${cometArcLen} ${cometGapLen}`}
              strokeDashoffset={cometOffset}
              filter="url(#cometGlow)"
            />
          </svg>
        </div>
      )}

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[22px] leading-[1.5] tabular-nums text-primary">
          {Math.round(trailP)}%
        </span>
        <span className="font-mono text-[22px] leading-[1.5] text-muted-foreground">
          Verified
        </span>
      </div>
    </div>
  );
}

// ── Features list ─────────────────────────────────────────────────────
const features = [
  {
    icon: Radar,
    bold: "Full coverage gap detection ",
    normal: "so you\u2019re never blindsided by uninsured subs",
  },
  {
    icon: Hourglass,
    bold: "Automated document gathering and audit support",
    normal: " to save hours of admin work",
  },
  {
    icon: Banknote,
    bold: "Premium-saving recommendations",
    normal: " that traditional brokers often miss",
  },
];

// ── Main section ──────────────────────────────────────────────────────
export default function VerifiedInsurance() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Scroll-linked progress: maps section position to 0–100
  // 0% = section top enters the viewport (becomes visible)
  // 100% = section bottom leaves the top of viewport (fully scrolled past)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progressValue = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(progressValue, "change", (v) => {
    setProgress(v);
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="verified-insurance-heading"
      className="relative overflow-hidden bg-background px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32"
    >
      {/* Top fade — smooth blend from the testimonials dot-pattern above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--background) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Top row: progress ring + text */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
          {/* Left: Scroll-driven donut */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <ScrollDonut progress={progress} />
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-[887px] flex-1"
          >
            <div className="mb-9 flex items-center gap-2">
              <svg
                className="h-6 w-6 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              <span className="text-base font-bold leading-[1.5] text-primary">
                SAVE MORE
              </span>
            </div>
            <h2
              id="verified-insurance-heading"
              className="font-display text-4xl font-bold leading-[1.18] tracking-[-0.05em] text-foreground md:text-[2.7rem]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Verified insurance clarity, compliance, and cost savings built
              for builders.
            </h2>
            <p className="mt-9 max-w-[606px] text-lg font-normal leading-[1.5] text-muted-foreground">
              Midpoint does more than reveal coverage gaps. We handle the heavy
              lifting that slows builders down, collecting documents for audits,
              validating subcontractor compliance, and identifying opportunities
              to drive premiums down.
            </p>
          </motion.div>
        </div>

        {/* Bottom row: 3-column features */}
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.bold}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <feature.icon className="h-6 w-6 text-primary" />
              <p className="text-base leading-[1.5] text-foreground">
                <span className="font-bold">{feature.bold}</span>
                <span className="font-normal text-muted-foreground">
                  {feature.normal}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
