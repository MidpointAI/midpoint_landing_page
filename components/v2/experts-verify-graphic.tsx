"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";

/**
 * Animated "Experts verify policy info" graphic.
 *
 * Cycles through four coverage types (General Liability → Auto → Worker's Comp → Umbrella).
 * On each step:
 *   1. Old details fade out
 *   2. The horizontal connector slides to the new coverage row
 *   3. The right-side vertical line + stubs draw in
 *   4. Each detail row fades in top-to-bottom
 *
 * Tight, technical easings — no bounce. Monospace type throughout.
 */

type Detail = {
  label: string;
  value?: string;
  check?: boolean;
  missing?: boolean;
};

type Coverage = {
  name: string;
  details: Detail[];
};

const COVERAGES: Coverage[] = [
  {
    name: "General Liability",
    details: [
      { label: "Policy Basis:", value: "Occurrence" },
      { label: "Per Occurrence:", value: "$1,000,000" },
      { label: "Personal & Adv. Injury Limit:", value: "$1,000,000" },
      { label: "Additional Insured — Ongoing Ops", check: true },
      { label: "Additional Insured — Completed Ops", check: true },
      { label: "Waiver of Subrogation", check: true },
      { label: "Primary and Non-Contributory", check: true },
    ],
  },
  {
    name: "Auto",
    details: [
      { label: "Policy Basis:", value: "Any Auto" },
      { label: "Combined Single Limit:", value: "$1,000,000" },
      { label: "Waiver of Subrogation", missing: true },
      { label: "Primary and Non-Contributory", missing: true },
      { label: "Cancellation Notice", check: true },
    ],
  },
  {
    name: "Worker's Comp",
    details: [
      { label: "Each Accident", value: "$1,000,000" },
      { label: "Each Employee — Injury by Disease", value: "$1,000,000" },
      { label: "Aggregate — Injury by Disease", value: "$1,000,000" },
      { label: "Waiver of Subrogation", check: true },
      { label: "Cancellation Notice", missing: true },
    ],
  },
  {
    name: "Umbrella",
    details: [
      { label: "Policy Basis:", value: "Occurrence" },
      { label: "Per Occurrence:", value: "$1,000,000" },
      { label: "Aggregate Limit:", value: "$1,000,000" },
      { label: "Waiver of Subrogation", check: true },
      { label: "Primary and Non-Contributory", check: true },
      { label: "Cancellation Notice", check: true },
    ],
  },
];

// Layout constants (matched to Figma)
const COVERAGE_ROW_HEIGHT = 40; // px — must match py-2 + line-height in coverage list
const DETAIL_ROW_HEIGHT = 40;
const COVERAGE_LIST_TOP = 8; // pt-2 on the coverage list
const DETAILS_LIST_TOP = 6; // pt-[6px] on the details list
const CYCLE_MS = 4200;
const EASE_TECH: [number, number, number, number] = [0.65, 0, 0.35, 1];

export default function ExpertsVerifyGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Pause cycling when the graphic is off-screen — IntersectionObserver
  // we own instead of useInView so behavior is explicit.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % COVERAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [isVisible]);

  const coverage = COVERAGES[activeIndex];
  // Y-center of the active coverage row inside the coverage column
  const activeCoverageY = COVERAGE_LIST_TOP + activeIndex * COVERAGE_ROW_HEIGHT + COVERAGE_ROW_HEIGHT / 2;

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[920px] mx-auto rounded-xl border border-white/[0.06] bg-[#151515] shadow-[0_4px_7.1px_rgba(0,0,0,0.58),inset_0_0_1.9px_rgba(255,255,255,0.25)]"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      <div className="flex items-start gap-12 md:gap-[59px] p-6">
        {/* Column 1 — Requirements label */}
        <div className="relative flex h-[51px] items-center px-4 py-[18px] shrink-0">
          <p className="text-[15px] text-white whitespace-nowrap leading-tight">Requirements</p>
        </div>

        {/* Column 2 — Coverage list */}
        <div className="relative flex flex-col pt-2 shrink-0 w-[180px]">
          {COVERAGES.map((c, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={c.name}
                className="flex items-center px-4 py-2"
                style={{ height: `${COVERAGE_ROW_HEIGHT}px` }}
              >
                <motion.p
                  className="text-[15px] whitespace-nowrap leading-tight"
                  animate={{
                    color: isActive ? "rgb(255,255,255)" : "rgb(157,157,157)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                  transition={{ duration: 0.3, ease: EASE_TECH }}
                >
                  {c.name}
                </motion.p>
              </div>
            );
          })}
        </div>

        {/* Column 3 — Details list. Keyed on activeIndex so React fully replaces
            the rows. Each row enters with a small stagger; no exit animation —
            outgoing rows just disappear, so the new set starts drawing
            immediately rather than waiting for an exit. */}
        <div className="relative flex flex-col pt-[6px] flex-1 min-w-0 w-[549px]">
          <div key={activeIndex} className="flex flex-col">
            {coverage.details.map((d, i) => (
              <motion.div
                key={d.label}
                className={`flex items-center justify-between px-4 py-2 ${
                  d.missing ? "bg-[#ff4848]" : ""
                }`}
                style={{ height: `${DETAIL_ROW_HEIGHT}px` }}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: EASE_TECH, delay: 0.2 + i * 0.055 }}
              >
                <p className="text-[15px] text-white whitespace-nowrap leading-tight">{d.label}</p>
                {d.value && (
                  <p
                    className={`text-[15px] whitespace-nowrap leading-tight ${
                      d.missing ? "text-white" : "text-[#22c55e]"
                    }`}
                  >
                    {d.value}
                  </p>
                )}
                {d.check && <CheckIcon className="h-5 w-5 text-[#22c55e]" strokeWidth={2.5} />}
                {d.missing && !d.value && (
                  <p className="text-[15px] text-white whitespace-nowrap leading-tight">Missing</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lines overlay — absolutely positioned across the whole card */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="card-bounds">
            <rect x="0" y="0" width="100%" height="100%" />
          </clipPath>
        </defs>

        <ConnectorLines key={activeIndex} activeCoverageY={activeCoverageY} detailCount={coverage.details.length} />
      </svg>
    </div>
  );
}

/**
 * The animated connector lines. Re-keyed on activeIndex so each transition replays.
 *
 * Geometry (matched to the layout above with p-6 = 24px outer padding, 59px gap):
 *   - Card padding-left: 24
 *   - "Requirements" column: 0..~140 (px-4 + text)
 *   - Gap to coverage: 59
 *   - Coverage col left: 24 + 140 + 59 = ~223
 *   - Coverage col width: 180
 *   - Coverage col right: ~403
 *   - Gap to details: 59
 *   - Details col left: ~462
 *
 * In practice we draw lines that hit the visible coverage label text. The
 * exact pixels are tuned to match the rendered layout.
 */
function ConnectorLines({
  activeCoverageY,
  detailCount,
}: {
  activeCoverageY: number;
  detailCount: number;
}) {
  // X positions in px, relative to the outer svg (which spans the whole card).
  // Card padding-top is 24, so add it.
  const REQ_X = 138; // approx right edge of "Requirements" text
  const COV_LEFT_X = 197;
  const COV_RIGHT_X = 405;
  const DETAILS_LEFT_X = 464;
  const DETAILS_INNER_X = 480; // where the row's small left stub begins
  const REQ_ROW_Y = 24 + 25; // 24 padding + 51/2

  const activeY = 24 + activeCoverageY;
  const detailsTopY = 24 + DETAILS_LIST_TOP + DETAIL_ROW_HEIGHT / 2;
  const detailsBottomY = detailsTopY + (detailCount - 1) * DETAIL_ROW_HEIGHT;

  const stroke = "rgba(255,255,255,0.55)";
  const sw = 1;

  return (
    <g>
      {/* 1. Horizontal from Requirements right edge to coverage column left.
            Y always at the active coverage row's center. Drawn first. */}
      <motion.line
        x1={REQ_X}
        x2={COV_LEFT_X}
        y1={activeY}
        y2={activeY}
        stroke={stroke}
        strokeWidth={sw}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: EASE_TECH }}
      />

      {/* 1b. Tiny vertical drop from Requirements label height down to active row,
              only if not already on row 0 — keeps "Requirements →" pointing at
              the right coverage even visually. We skip this in v1: the horiz
              line already shifts vertically per active. */}

      {/* 2. Horizontal from coverage column right edge to details column left.
             At active row Y. */}
      <motion.line
        x1={COV_RIGHT_X}
        x2={DETAILS_LEFT_X}
        y1={activeY}
        y2={activeY}
        stroke={stroke}
        strokeWidth={sw}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: EASE_TECH, delay: 0.18 }}
      />

      {/* 3. Vertical line in the details column connecting all rows */}
      <motion.line
        x1={DETAILS_LEFT_X}
        x2={DETAILS_LEFT_X}
        y1={Math.min(activeY, detailsTopY)}
        y2={detailsBottomY}
        stroke={stroke}
        strokeWidth={sw}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE_TECH, delay: 0.34 }}
        style={{ transformOrigin: `${DETAILS_LEFT_X}px ${Math.min(activeY, detailsTopY)}px` }}
      />

      {/* 4. Small horizontal stubs from the vertical line into each detail row.
             Sequential — top-to-bottom. */}
      {Array.from({ length: detailCount }).map((_, i) => {
        const y = detailsTopY + i * DETAIL_ROW_HEIGHT;
        return (
          <motion.line
            key={i}
            x1={DETAILS_LEFT_X}
            x2={DETAILS_INNER_X}
            y1={y}
            y2={y}
            stroke={stroke}
            strokeWidth={sw}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.18, ease: EASE_TECH, delay: 0.4 + i * 0.06 }}
          />
        );
      })}
    </g>
  );
}
