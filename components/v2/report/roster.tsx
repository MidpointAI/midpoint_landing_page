"use client";

import { AnimatePresence, motion } from "framer-motion";
import ComplianceRing from "./compliance-ring";
import StatusChip from "./status-chip";
import EvidenceTrail from "./evidence-trail";
import type { Sub } from "./data";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

/**
 * Rows of subcontractors with a status chip and a compliance ring. Pass
 * `expandedId` to reveal one row's evidence trail beneath it.
 */
export default function Roster({
  subs,
  expandedId,
  onRowEnter,
  onRowLeave,
  onRowSelect,
}: {
  subs: Sub[];
  expandedId?: string | null;
  onRowEnter?: (id: string) => void;
  onRowLeave?: () => void;
  onRowSelect?: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-border/70" onMouseLeave={onRowLeave}>
      {subs.map((s) => {
        const open = expandedId === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onMouseEnter={() => onRowEnter?.(s.id)}
              onFocus={() => onRowEnter?.(s.id)}
              onClick={() => onRowSelect?.(s.id)}
              aria-expanded={open}
              className={`w-full flex items-center gap-3 py-2.5 text-left transition-colors rounded-md -mx-2 px-2 ${
                open ? "bg-secondary/50" : "hover:bg-secondary/40"
              }`}
            >
              <ComplianceRing value={s.score} status={s.status} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground truncate">{s.name}</span>
                <span className="block text-xs text-muted-foreground truncate">{s.trade}</span>
              </span>
              <StatusChip status={s.status} />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="trail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={SPRING}
                  className="overflow-hidden"
                >
                  <div className="pb-3 pl-[46px] pr-2">
                    <EvidenceTrail checks={s.evidence} reviewedOn={s.reviewedOn} compact />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
