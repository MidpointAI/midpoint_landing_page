"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";

/**
 * Animated "Experts verify policy info" graphic.
 *
 * Auto-cycles through 4 coverage types. On each transition:
 *  1. The old details are unmounted instantly (key swap).
 *  2. The Requirements → Active-Coverage line draws — straight when active
 *     row is 0, otherwise an L-shape with two 8px rounded corners.
 *  3. The horizontal from active coverage into the details trunk draws.
 *  4. The details trunk (a "comb" spine with 8px rounded top & bottom
 *     corners that turn into the first and last row stubs) draws.
 *  5. Each detail row fades in top-to-bottom, paired with its short
 *     horizontal stub from the trunk.
 */

type Detail = { label: string; value?: string; check?: boolean; missing?: boolean };
type Coverage = { name: string; details: Detail[] };

const COVERAGES: Coverage[] = [
  {
    name: "General Liability",
    details: [
      { label: "Policy Basis:", value: "Occurrence" },
      { label: "Per Occurrence:", value: "$1,000,000" },
      { label: "Personal and Advertising Injury Limit:", value: "$1,000,000" },
      { label: "Additional Insured - Ongoing operations", check: true },
      { label: "Additional Insured - Completed Ops", check: true },
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
      { label: "Each Employee for Injury by Disease", value: "$1,000,000" },
      { label: "Aggregate for Injury by Disease", value: "$1,000,000" },
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

// ---------------------------------------------------------------------------
// Layout geometry — single source of truth shared by DOM + SVG so the lines
// always land on row centers exactly.
// ---------------------------------------------------------------------------
const PAD = 28;          // card inner padding
const ROW_H = 44;        // every row (requirement / coverage / detail) is this tall
const REQ_W = 140;       // Requirements column width
const COL_GAP = 60;      // gap between columns
const COV_W = 188;       // Coverage column width
const DET_W = 548;       // Details column width
const R = 8;             // rounded corner radius (per spec)
const STUB = 22;         // how far past the trunk each row's horizontal stub extends

// Column X edges (left → right)
const REQ_LEFT = PAD;
const REQ_RIGHT = REQ_LEFT + REQ_W;            // right edge of "Requirements" text box
const COV_LEFT = REQ_RIGHT + COL_GAP;          // left edge of coverage column
const COV_RIGHT = COV_LEFT + COV_W;            // right edge of coverage column
const DET_LEFT = COV_RIGHT + COL_GAP;          // left edge of details column == trunk X
const DET_RIGHT = DET_LEFT + DET_W;
const CARD_W = DET_RIGHT + PAD;

// The vertical "trunk" sits exactly at the left edge of the details column.
const TRUNK_X = DET_LEFT;

// Mid-X for the Requirements→Coverage L-bend (when active row > 0).
const REQ_BEND_X = REQ_RIGHT + COL_GAP / 2;

// Row Y centers (row 0 = the top row in every column).
const rowY = (i: number) => PAD + i * ROW_H + ROW_H / 2;

// Tallest possible card — keep height constant across coverages so the
// card doesn't jump as we cycle.
const MAX_ROWS = Math.max(
  COVERAGES.length,
  ...COVERAGES.map((c) => c.details.length)
);
const CARD_H = PAD * 2 + MAX_ROWS * ROW_H;

// Animation
const CYCLE_MS = 5000;
const EASE_TECH: [number, number, number, number] = [0.65, 0, 0.35, 1];

export default function ExpertsVerifyGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), {
      threshold: 0.2,
    });
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
  const activeY = rowY(activeIndex);

  return (
    <div ref={ref} className="w-full flex justify-center">
      {/* < xl (mobile + tablet + small desktop): vertical tree. The
          horizontal card is only used when there's enough room for it to
          render at full size without crushing the labels. */}
      <MobileTree activeIndex={activeIndex} coverage={coverage} />

      {/* xl and up: horizontal card */}
      <DesktopCard activeIndex={activeIndex} activeY={activeY} coverage={coverage} />
    </div>
  );
}

/* --------------------------------- DesktopCard ----------------------------- */

function DesktopCard({
  activeIndex,
  activeY,
  coverage,
}: {
  activeIndex: number;
  activeY: number;
  coverage: Coverage;
}) {
  return (
    <div
      className="hidden xl:block relative rounded-xl bg-[#151515] shadow-[0_4px_7.1px_rgba(0,0,0,0.58)] ring-1 ring-white/[0.08]"
      style={{
        width: CARD_W,
        height: CARD_H,
        fontFamily: "var(--font-dm-mono), monospace",
      }}
    >
      {/* Connectors under the labels — fixed size since the card itself
          only renders when there's room for the full CARD_W. */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      >
        <Connectors
          key={activeIndex}
          activeIndex={activeIndex}
          activeY={activeY}
          detailCount={coverage.details.length}
        />
      </svg>

      {/* "Requirements" label at row 0 */}
      <Cell left={REQ_LEFT} width={REQ_W} top={rowY(0) - ROW_H / 2}>
        <span className="text-[16px] text-white whitespace-nowrap leading-none">Requirements</span>
      </Cell>

      {/* Coverage column */}
      {COVERAGES.map((c, i) => {
        const isActive = i === activeIndex;
        return (
          <Cell
            key={c.name}
            left={COV_LEFT}
            width={COV_W}
            top={rowY(i) - ROW_H / 2}
          >
            <motion.span
              className="text-[16px] whitespace-nowrap leading-none"
              animate={{
                color: isActive ? "rgb(255,255,255)" : "rgb(157,157,157)",
                fontWeight: isActive ? 500 : 400,
              }}
              transition={{ duration: 0.3, ease: EASE_TECH }}
            >
              {c.name}
            </motion.span>
          </Cell>
        );
      })}

      {/* Details column — keyed on activeIndex so rows fully replace */}
      <div key={activeIndex} className="absolute" style={{ left: DET_LEFT, top: PAD }}>
        {coverage.details.map((d, i) => (
          <motion.div
            key={d.label}
            className={`flex items-center justify-between leading-none ${
              d.missing ? "bg-[#ff4848]" : ""
            }`}
            style={{
              width: DET_W,
              height: ROW_H,
              paddingLeft: STUB + 12, // leaves room for the stub line to reach into the row before the text
              paddingRight: 16,
            }}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.22,
              ease: EASE_TECH,
              delay: 0.7 + i * 0.06,
            }}
          >
            <span className="text-[16px] text-white whitespace-nowrap">{d.label}</span>
            {d.value && (
              <span
                className={`text-[16px] whitespace-nowrap ${
                  d.missing ? "text-white" : "text-[#22c55e]"
                }`}
              >
                {d.value}
              </span>
            )}
            {d.check && <CheckIcon className="h-5 w-5 text-[#22c55e]" strokeWidth={2.5} />}
            {d.missing && !d.value && (
              <span className="text-[16px] text-white whitespace-nowrap">Missing</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Inset highlight ring per Figma */}
      <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_1.9px_rgba(255,255,255,0.25)]" />
    </div>
  );
}

/* --------------------------------- MobileTree ------------------------------ */
/**
 * Mobile vertical-tree layout — file-explorer style.
 *
 *   Requirements
 *   │
 *   ├── General Liability             <- coverage row (active = bold white)
 *   │   │
 *   │   ├── Policy Basis    Occurrence
 *   │   ├── Per Occurrence  $1,000,000
 *   │   ├── …
 *   │   └── Last Detail     ✓         <- bottom rounded corner on sub-trunk
 *   │
 *   ├── Auto
 *   ├── Worker's Comp
 *   └── Umbrella                      <- last coverage = main trunk bottom corner
 *
 * Requirements is the parent. The main trunk spans all four coverage types.
 * The active coverage's endorsement details nest under it via a sub-trunk
 * (one indent level deeper), with their values on the same line.
 */

const M_PAD = 16; // outer card padding (= 16px outside margin per user spec)
const M_REQ_H = 32; // Requirements row height
const M_COV_ROW_H = 30; // coverage rows are tighter on mobile
const M_DET_ROW_H = 42; // detail rows allow ~2 lines of wrap
const M_SECTION_GAP = 8; // gap between Requirements and the tree below
const M_W = 360; // SVG viewBox width — content scales to fit
const M_R = 6; // rounded corner radius (smaller to match the smaller scale)

// X positions in viewBox units
const M_TRUNK_1_X = M_PAD + 6; // main trunk descends just inside the card
const M_LABEL_1_X = M_TRUNK_1_X + 16; // coverage label start
const M_TRUNK_2_X = M_LABEL_1_X + 6; // sub-trunk for active coverage's children
const M_LABEL_2_X = M_TRUNK_2_X + 16; // detail label start

// Helpers
const pctX = (x: number) => `${(x / M_W) * 100}%`;

/**
 * Compute Y centers for every row in the tree given which coverage is
 * active. Detail rows are inserted UNDER the active coverage row, pushing
 * subsequent coverage rows down. Returns row centers and the total card
 * height so the SVG can be sized exactly.
 */
function mobileLayout(activeIndex: number, detailCount: number) {
  const covY: number[] = [];
  const detY: number[] = [];

  let y = M_PAD + M_REQ_H + M_SECTION_GAP;
  for (let i = 0; i < COVERAGES.length; i++) {
    covY.push(y + M_COV_ROW_H / 2);
    y += M_COV_ROW_H;
    if (i === activeIndex) {
      for (let j = 0; j < detailCount; j++) {
        detY.push(y + M_DET_ROW_H / 2);
        y += M_DET_ROW_H;
      }
    }
  }
  const cardH = y + M_PAD;
  return { covY, detY, cardH };
}

function MobileTree({
  activeIndex,
  coverage,
}: {
  activeIndex: number;
  coverage: Coverage;
}) {
  const detailCount = coverage.details.length;
  const { covY, detY, cardH } = mobileLayout(activeIndex, detailCount);
  const activeCovY = covY[activeIndex];
  const lastCovY = covY[covY.length - 1];

  // -------------------------------------------------------------------------
  // MAIN TRUNK (Requirements → all coverage types)
  // Descends from just below Requirements row down to the LAST coverage row,
  // ending with a rounded "└" corner into that coverage's stub.
  // -------------------------------------------------------------------------
  const mainTrunkTopY = M_PAD + M_REQ_H + M_SECTION_GAP / 2;
  const mainTrunkPath = [
    `M ${M_TRUNK_1_X} ${mainTrunkTopY}`,
    `L ${M_TRUNK_1_X} ${lastCovY - M_R}`,
    // going-down → going-right (└ corner, sweep 0 = CCW)
    `A ${M_R} ${M_R} 0 0 0 ${M_TRUNK_1_X + M_R} ${lastCovY}`,
    `L ${M_LABEL_1_X - 2} ${lastCovY}`,
  ].join(" ");

  // Coverage stubs for all rows EXCEPT the last (which is folded into the
  // trunk's rounded bottom corner above).
  const covStubs = covY
    .slice(0, -1)
    .map((y, i) => ({
      d: `M ${M_TRUNK_1_X} ${y} L ${M_LABEL_1_X - 2} ${y}`,
      key: `cov-${i}`,
      delay: 0.4 + i * 0.06,
    }));

  // -------------------------------------------------------------------------
  // SUB-TRUNK (active coverage → its endorsement details)
  // Branches DOWN from just under the active coverage row at one indent
  // level, ending with a rounded "└" into the last detail row's stub.
  // -------------------------------------------------------------------------
  const lastDetY = detY[detY.length - 1] ?? activeCovY;
  const subTrunkTopY = activeCovY + M_COV_ROW_H / 2;
  const subTrunkPath = detailCount > 0
    ? [
        `M ${M_TRUNK_2_X} ${subTrunkTopY}`,
        `L ${M_TRUNK_2_X} ${lastDetY - M_R}`,
        `A ${M_R} ${M_R} 0 0 0 ${M_TRUNK_2_X + M_R} ${lastDetY}`,
        `L ${M_LABEL_2_X - 2} ${lastDetY}`,
      ].join(" ")
    : null;

  // Detail stubs for all rows EXCEPT the last (folded into sub-trunk's
  // rounded corner above).
  const detStubs = detY
    .slice(0, -1)
    .map((y, i) => ({
      d: `M ${M_TRUNK_2_X} ${y} L ${M_LABEL_2_X - 2} ${y}`,
      key: `det-${i}`,
      delay: 0.75 + i * 0.05,
    }));

  const stroke = "rgba(255,255,255,0.55)";

  return (
    <div
      className="xl:hidden relative rounded-xl bg-[#151515] shadow-[0_4px_7.1px_rgba(0,0,0,0.58)] ring-1 ring-white/[0.08] w-full max-w-md md:max-w-xl"
      style={{
        height: cardH,
        fontFamily: "var(--font-dm-mono), monospace",
      }}
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        viewBox={`0 0 ${M_W} ${cardH}`}
        preserveAspectRatio="none"
      >
        <g
          key={activeIndex}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main trunk + last-coverage corner */}
          <motion.path
            d={mainTrunkPath}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_TECH }}
          />
          {/* Coverage stubs (sibling branches) */}
          {covStubs.map(({ d, key, delay }) => (
            <motion.path
              key={key}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE_TECH, delay }}
            />
          ))}
          {/* Sub-trunk for active coverage's children */}
          {subTrunkPath && (
            <motion.path
              d={subTrunkPath}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_TECH, delay: 0.65 }}
            />
          )}
          {/* Detail stubs (children of active coverage) */}
          {detStubs.map(({ d, key, delay }) => (
            <motion.path
              key={key}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE_TECH, delay }}
            />
          ))}
        </g>
      </svg>

      {/* Requirements (parent, top-left) */}
      <div
        className="absolute flex items-center"
        style={{
          left: M_PAD,
          top: M_PAD,
          height: M_REQ_H,
        }}
      >
        <span className="text-[15px] text-white whitespace-nowrap leading-none font-medium">
          Requirements
        </span>
      </div>

      {/* Coverage labels */}
      {COVERAGES.map((c, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={c.name}
            className="absolute flex items-center"
            style={{
              left: pctX(M_LABEL_1_X),
              right: pctX(M_PAD),
              top: covY[i] - M_COV_ROW_H / 2,
              height: M_COV_ROW_H,
            }}
          >
            <motion.span
              className="text-[14px] whitespace-nowrap leading-none"
              animate={{
                color: isActive ? "rgb(255,255,255)" : "rgb(157,157,157)",
                fontWeight: isActive ? 500 : 400,
              }}
              transition={{ duration: 0.3, ease: EASE_TECH }}
            >
              {c.name}
            </motion.span>
          </div>
        );
      })}

      {/* Detail rows — children of the active coverage */}
      <div key={activeIndex} className="absolute inset-0 pointer-events-none">
        {coverage.details.map((d, i) => (
          <motion.div
            key={d.label}
            className={`absolute flex items-center justify-between gap-2 ${
              d.missing ? "bg-[#ff4848]" : ""
            }`}
            style={{
              left: pctX(M_LABEL_2_X),
              right: pctX(M_PAD),
              top: detY[i] - M_DET_ROW_H / 2,
              height: M_DET_ROW_H,
              paddingLeft: d.missing ? 8 : 0,
              paddingRight: d.missing ? 8 : 0,
              borderRadius: d.missing ? 4 : 0,
            }}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.22,
              ease: EASE_TECH,
              delay: 0.8 + i * 0.05,
            }}
          >
            <span className="text-[11px] text-white leading-tight pr-2">
              {d.label}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {d.value && (
                <span
                  className={`text-[11px] whitespace-nowrap leading-tight ${
                    d.missing ? "text-white" : "text-[#22c55e]"
                  }`}
                >
                  {d.value}
                </span>
              )}
              {d.check && (
                <CheckIcon className="h-4 w-4 text-[#22c55e]" strokeWidth={2.5} />
              )}
              {d.missing && !d.value && (
                <span className="text-[11px] text-white whitespace-nowrap leading-tight">
                  Missing
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inset highlight ring */}
      <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_1.9px_rgba(255,255,255,0.25)]" />
    </div>
  );
}

/* ----------------------------------------------------------------------- */

function Cell({
  left,
  width,
  top,
  children,
}: {
  left: number;
  width: number;
  top: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex items-center"
      style={{ left, top, width, height: ROW_H, paddingLeft: 16, paddingRight: 16 }}
    >
      {children}
    </div>
  );
}

/* --------------------------------- Connectors ------------------------------ */

function Connectors({
  activeIndex,
  activeY,
  detailCount,
}: {
  activeIndex: number;
  activeY: number;
  detailCount: number;
}) {
  const stroke = "rgba(255,255,255,0.55)";
  const sw = 1;

  // -------------------------------------------------------------------------
  // PATH A — Requirements → Active Coverage
  //   active = 0:  straight horizontal at row 0
  //   active > 0:  horizontal right → 8px arc DOWN → vertical → 8px arc RIGHT
  //                → horizontal to coverage label
  // -------------------------------------------------------------------------
  const reqY = rowY(0);
  const pathA = useMemo(() => {
    if (activeIndex === 0) {
      return `M ${REQ_RIGHT} ${reqY} L ${COV_LEFT} ${reqY}`;
    }
    return [
      `M ${REQ_RIGHT} ${reqY}`,
      // Horizontal right toward the bend (stop R px before so the arc fits)
      `L ${REQ_BEND_X - R} ${reqY}`,
      // 90° clockwise arc: turning from going-right to going-down
      `A ${R} ${R} 0 0 1 ${REQ_BEND_X} ${reqY + R}`,
      // Vertical drop to just above the next bend
      `L ${REQ_BEND_X} ${activeY - R}`,
      // 90° counter-clockwise arc: turning from going-down to going-right
      `A ${R} ${R} 0 0 0 ${REQ_BEND_X + R} ${activeY}`,
      // Horizontal to the coverage label
      `L ${COV_LEFT} ${activeY}`,
    ].join(" ");
  }, [activeIndex, reqY, activeY]);

  // -------------------------------------------------------------------------
  // PATH B — Incoming horizontal from coverage to the trunk.
  // Always ends at (TRUNK_X + STUB, activeY) so it doubles as the row stub
  // for the active row.
  // -------------------------------------------------------------------------
  const pathB = `M ${COV_RIGHT} ${activeY} L ${TRUNK_X + STUB} ${activeY}`;

  // -------------------------------------------------------------------------
  // PATH C — Details trunk (comb spine).
  // The trunk is drawn as ONE continuous path that traces:
  //   row 0 stub end ← left ← arc DOWN ← vertical ← arc RIGHT → row N-1 stub end
  // The top + bottom 8px rounded corners are the row 0 and row N-1 stubs'
  // transition into the vertical spine.
  // -------------------------------------------------------------------------
  const topY = rowY(0);
  const bottomY = rowY(detailCount - 1);
  const pathC = useMemo(
    () =>
      [
        `M ${TRUNK_X + STUB} ${topY}`,
        `L ${TRUNK_X + R} ${topY}`,
        // 90° arc — going LEFT then DOWN (sweep-flag 0 = counter-clockwise)
        `A ${R} ${R} 0 0 0 ${TRUNK_X} ${topY + R}`,
        `L ${TRUNK_X} ${bottomY - R}`,
        // 90° arc — going DOWN then RIGHT
        `A ${R} ${R} 0 0 0 ${TRUNK_X + R} ${bottomY}`,
        `L ${TRUNK_X + STUB} ${bottomY}`,
      ].join(" "),
    [topY, bottomY]
  );

  // -------------------------------------------------------------------------
  // PATH D — straight perpendicular stubs for every intermediate row that
  // is not the active coverage row (active row's stub is part of Path B,
  // first + last row stubs are part of Path C's rounded corners).
  // -------------------------------------------------------------------------
  const stubPaths = useMemo(() => {
    const out: { d: string; i: number }[] = [];
    for (let i = 1; i < detailCount - 1; i++) {
      if (i === activeIndex) continue;
      out.push({
        d: `M ${TRUNK_X} ${rowY(i)} L ${TRUNK_X + STUB} ${rowY(i)}`,
        i,
      });
    }
    return out;
  }, [activeIndex, detailCount]);

  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* A — Requirements → Active Coverage */}
      <motion.path
        d={pathA}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_TECH }}
      />

      {/* B — Active Coverage → Trunk (also acts as active row's stub) */}
      <motion.path
        d={pathB}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE_TECH, delay: 0.4 }}
      />

      {/* C — Trunk spine */}
      <motion.path
        d={pathC}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_TECH, delay: 0.55 }}
      />

      {/* D — intermediate stubs (drawn in order, top-to-bottom) */}
      {stubPaths.map(({ d, i }) => (
        <motion.path
          key={i}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.18,
            ease: EASE_TECH,
            delay: 0.7 + i * 0.06,
          }}
        />
      ))}
    </g>
  );
}
