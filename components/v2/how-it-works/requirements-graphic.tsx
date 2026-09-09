"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPRING = { type: "spring", bounce: 0, duration: 0.45 } as const;

type Version = "original" | "amended";

const CLAUSES: Record<Version, string[]> = {
  original: [
    "General liability of $1,000,000 per occurrence",
    "Auto liability of $1,000,000 combined single limit",
    "Workers' compensation per statute",
  ],
  amended: [
    "General liability of $2,000,000 per occurrence",
    "Umbrella liability of $5,000,000",
    "Owner named additional insured, ongoing and completed operations",
  ],
};

const REQUIREMENTS: Record<Version, { k: string; v: string }[]> = {
  original: [
    { k: "General liability", v: "$1M / occurrence" },
    { k: "Auto liability", v: "$1M CSL" },
    { k: "Workers' comp", v: "Statutory" },
  ],
  amended: [
    { k: "General liability", v: "$2M / occurrence" },
    { k: "Umbrella", v: "$5M" },
    { k: "Additional insured", v: "Ongoing + completed" },
    { k: "Workers' comp", v: "Statutory" },
  ],
};

/**
 * Step 1: the agreement sets the requirements. Flip between the original
 * subcontract and an amended one and watch the requirement list follow.
 */
export default function RequirementsGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  const [version, setVersion] = useState<Version>("original");
  const [touched, setTouched] = useState(false);

  // Demonstrate once when the step comes into focus, unless the user has taken over.
  useEffect(() => {
    if (!isActive || touched || reduced) return;
    const t = setTimeout(() => setVersion("amended"), 1600);
    return () => clearTimeout(t);
  }, [isActive, touched, reduced]);

  const pick = (v: Version) => {
    setTouched(true);
    setVersion(v);
  };

  return (
    <div className="flex flex-col gap-5">
      <div role="radiogroup" aria-label="Agreement version" className="inline-flex self-start rounded-full border border-border bg-background p-0.5">
        {(["original", "amended"] as Version[]).map((v) => (
          <button
            key={v}
            role="radio"
            aria-checked={version === v}
            onClick={() => pick(v)}
            className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              version === v ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {version === v && (
              <motion.span layoutId="req-pill" className="absolute inset-0 rounded-full bg-primary" transition={SPRING} />
            )}
            <span className="relative">{v === "original" ? "Original agreement" : "Amended agreement"}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Agreement */}
        <div className="rounded-lg border border-border bg-background p-4 min-h-[172px]">
          <p className="eyebrow mb-3">Subcontract</p>
          <ul className="space-y-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {CLAUSES[version].map((c) => (
                <motion.li
                  key={c}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={SPRING}
                  className="text-sm leading-snug text-foreground/80"
                >
                  {c}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {/* Arrow */}
        <motion.svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="text-primary" animate={{ x: [0, 3, 0] }} transition={reduced ? { duration: 0 } : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }} aria-hidden="true">
          <path d="M1 8h24m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        {/* Requirements */}
        <div className="rounded-lg border border-border bg-background p-4 min-h-[172px]">
          <p className="eyebrow mb-3">Requirements</p>
          <ul className="space-y-2 font-mono text-[12px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {REQUIREMENTS[version].map((r) => (
                <motion.li
                  key={r.k}
                  layout
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={SPRING}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-muted-foreground">{r.k}</span>
                  <motion.span key={r.v} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-right">
                    {r.v}
                  </motion.span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Change the contract and the requirements change with it.</p>
    </div>
  );
}
