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
      {/* Mobile (< md): vertical tree */}
      <MobileTree activeIndex={activeIndex} coverage={coverage} />

      {/* Desktop (md+): horizontal card */}
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
      className="hidden md:block relative rounded-xl bg-[#151515] shadow-[0_4px_7.1px_rgba(0,0,0,0.58)] ring-1 ring-white/[0.08]"
      style={{
        width: CARD_W,
        height: CARD_H,
        fontFamily: "var(--font-dm-mono), monospace",
        maxWidth: "100%",
      }}
    >
      {/* Connectors under the labels */}
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
 * Mobile vertical-tree layout. Mirrors the desktop card visually — same
 * borderless columns, same SVG connectors with 8px rounded corners, same
 * pathLength animations — just rotated for vertical flow.
 *
 * Structure:
 *   Requirements (centered, top)
 *           │
 *           │  (vertical drop, then 8px arc LEFT)
 *           │
 *      ╭───┘
 *      │
 *      ●  Active Coverage      <- coverage list (active row connects to trunk)
 *      ○  ...
 *      │
 *      │  (trunk continues down through the details)
 *      │
 *      ├──── Detail 1
 *      ├──── Detail 2
 *      ├──── …
 *      ╰──── Last Detail        <- 8px arc RIGHT at trunk bottom
 */

// Mobile layout constants. M_W is the SVG viewBox width that everything
// is measured against; the actual rendered card width is capped at
// M_W via max-width but allowed to scale down to fit narrower viewports.
const M_PAD = 16;
const M_COV_ROW_H = 38; // coverage rows are single-line
const M_DET_ROW_H = 52; // detail rows can wrap to 2 lines
const M_REQ_H = 32;
const M_SECTION_GAP = 24;
const M_W = 320; // SVG viewBox + max card width
const M_TRUNK_X = 28;
const M_LABEL_X = 48; // where coverage / detail labels start
const M_STUB_END_X = M_LABEL_X - 4;
const M_CENTER_X = M_W / 2;
// Backwards-compat alias used below
const M_ROW_H = M_COV_ROW_H;

// Helpers: convert a viewBox X coordinate to a percentage of M_W so the
// HTML labels stay aligned with the SVG as the card scales.
const pctX = (x: number) => `${(x / M_W) * 100}%`;

const mRowY_cov = (i: number) =>
  M_PAD + M_REQ_H + M_SECTION_GAP + i * M_COV_ROW_H + M_COV_ROW_H / 2;
const mDetStartY =
  M_PAD + M_REQ_H + M_SECTION_GAP + COVERAGES.length * M_COV_ROW_H + M_SECTION_GAP;
const mRowY_det = (i: number) => mDetStartY + i * M_DET_ROW_H + M_DET_ROW_H / 2;

function MobileTree({
  activeIndex,
  coverage,
}: {
  activeIndex: number;
  coverage: Coverage;
}) {
  const detailCount = coverage.details.length;
  const lastDetY = mRowY_det(detailCount - 1);
  const cardH = mDetStartY + detailCount * M_DET_ROW_H + M_PAD;

  const reqBottomY = M_PAD + M_REQ_H;
  // The trunk's top sits in the gap BETWEEN Requirements and the first
  // coverage row, so Path A's horizontal segment never crosses a label.
  const trunkTopY = M_PAD + M_REQ_H + M_SECTION_GAP / 2;

  // -------------------------------------------------------------------------
  // PATH A — Requirements → top of trunk (L-bend)
  //   Down from Req center → 8px arc LEFT → horizontal → 8px arc DOWN into
  //   the trunk. Lives entirely above the coverage list so it never
  //   visually crosses any coverage label.
  // -------------------------------------------------------------------------
  const pathA = [
    `M ${M_CENTER_X} ${reqBottomY}`,
    `L ${M_CENTER_X} ${trunkTopY - R}`,
    // going-down → going-left (sweep 1 = clockwise visually)
    `A ${R} ${R} 0 0 1 ${M_CENTER_X - R} ${trunkTopY}`,
    `L ${M_TRUNK_X + R} ${trunkTopY}`,
    // going-left → going-down (sweep 0 = counter-clockwise visually)
    `A ${R} ${R} 0 0 0 ${M_TRUNK_X} ${trunkTopY + R}`,
  ].join(" ");

  // -------------------------------------------------------------------------
  // PATH B — The trunk spine. Runs from just below the top arc all the way
  // down to the last detail row, then arcs RIGHT into the last row's stub.
  // -------------------------------------------------------------------------
  const pathB = [
    `M ${M_TRUNK_X} ${trunkTopY + R}`,
    `L ${M_TRUNK_X} ${lastDetY - R}`,
    // going-down → going-right (sweep 0 = counter-clockwise visually)
    `A ${R} ${R} 0 0 0 ${M_TRUNK_X + R} ${lastDetY}`,
    `L ${M_STUB_END_X} ${lastDetY}`,
  ].join(" ");

  // -------------------------------------------------------------------------
  // PATH C — perpendicular stubs from the trunk to every coverage label
  // (all four) and every detail label except the last (which is part of
  // Path B's rounded bottom corner). Mirrors the desktop "comb stubs".
  // -------------------------------------------------------------------------
  type Stub = { d: string; key: string; orderDelay: number };
  const stubPaths: Stub[] = [];
  // Coverage stubs first, top-to-bottom
  COVERAGES.forEach((_, i) => {
    stubPaths.push({
      d: `M ${M_TRUNK_X} ${mRowY_cov(i)} L ${M_STUB_END_X} ${mRowY_cov(i)}`,
      key: `cov-${i}`,
      orderDelay: 0.55 + i * 0.05,
    });
  });
  // Detail stubs (skip last — it's part of Path B)
  for (let i = 0; i < detailCount - 1; i++) {
    stubPaths.push({
      d: `M ${M_TRUNK_X} ${mRowY_det(i)} L ${M_STUB_END_X} ${mRowY_det(i)}`,
      key: `det-${i}`,
      orderDelay: 0.85 + i * 0.05,
    });
  }

  const stroke = "rgba(255,255,255,0.55)";

  return (
    <div
      className="md:hidden relative rounded-xl bg-[#151515] shadow-[0_4px_7.1px_rgba(0,0,0,0.58)] ring-1 ring-white/[0.08] w-full"
      style={{
        maxWidth: M_W,
        height: cardH,
        fontFamily: "var(--font-dm-mono), monospace",
      }}
    >
      {/* SVG connectors — scale X with the card, keep Y in pixels so arc
          radii stay circular. preserveAspectRatio="none" stretches X. */}
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
          <motion.path
            d={pathA}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_TECH }}
          />
          <motion.path
            d={pathB}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_TECH, delay: 0.45 }}
          />
          {stubPaths.map(({ d, key, orderDelay }) => (
            <motion.path
              key={key}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE_TECH, delay: orderDelay }}
            />
          ))}
        </g>
      </svg>

      {/* Requirements label — centered horizontally at the top */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: M_PAD,
          height: M_REQ_H,
        }}
      >
        <span className="text-[15px] text-white whitespace-nowrap leading-none">
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
              left: pctX(M_LABEL_X),
              right: pctX(M_PAD),
              top: mRowY_cov(i) - M_COV_ROW_H / 2,
              height: M_COV_ROW_H,
            }}
          >
            <motion.span
              className="text-[15px] whitespace-nowrap leading-none"
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

      {/* Detail rows — keyed on activeIndex so rows fully replace */}
      <div key={activeIndex} className="absolute inset-0 pointer-events-none">
        {coverage.details.map((d, i) => (
          <motion.div
            key={d.label}
            className={`absolute flex items-center justify-between gap-2 ${
              d.missing ? "bg-[#ff4848]" : ""
            }`}
            style={{
              left: pctX(M_LABEL_X),
              right: pctX(M_PAD),
              top: mRowY_det(i) - M_DET_ROW_H / 2,
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
              delay: 0.7 + i * 0.06,
            }}
          >
            <span className="text-[12px] text-white leading-tight pr-2">
              {d.label}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {d.value && (
                <span
                  className={`text-[12px] whitespace-nowrap leading-tight ${
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
                <span className="text-[12px] text-white whitespace-nowrap leading-tight">
                  Missing
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inset highlight ring per Figma */}
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
