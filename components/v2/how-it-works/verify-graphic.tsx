"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, FlagIcon, RotateCcwIcon } from "lucide-react";
import { ComplianceRing, StatusChip, SUBS, type SubStatus } from "@/components/v2/report";

const SPRING = { type: "spring", bounce: 0, duration: 0.45 } as const;

/**
 * Step 3: Midpoint reviews one sub's evidence against the project's
 * requirements. Checks land one at a time, a flag appears, the score
 * settles, and the flag becomes an action. The GC never touches this.
 */
const SUB = SUBS.find((s) => s.id === "redrock")!; // five checks, one flagged

export default function VerifyGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  const total = SUB.evidence.length;
  const [shown, setShown] = useState(reduced ? total + 1 : 0); // +1 = the follow-up line
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timers = [setTimeout(() => setShown(0), 0)];
    if (isActive) {
      for (let i = 1; i <= total + 1; i++) timers.push(setTimeout(() => setShown(i), 700 + i * 650));
    }
    return () => timers.forEach(clearTimeout);
  }, [isActive, run, reduced, total]);

  const visible = SUB.evidence.slice(0, Math.min(shown, total));
  const okCount = visible.filter((c) => c.ok).length;
  const score = Math.round((okCount / total) * 100);
  const finished = shown >= total;
  const status: SubStatus = !finished ? "reviewing" : visible.some((c) => !c.ok) ? "noncompliant" : "compliant";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <ComplianceRing value={finished ? score : Math.round((visible.length / total) * score)} status={status} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{SUB.name}</p>
          <p className="text-xs text-muted-foreground truncate">{SUB.trade} · {SUB.project}</p>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="rounded-lg border border-border bg-background p-4 min-h-[212px]">
        <div className="flex items-baseline justify-between mb-3">
          <p className="eyebrow">Checked against the contract</p>
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">{visible.length}/{total}</p>
        </div>
        <ul className="space-y-2 text-sm">
          <AnimatePresence initial={false}>
            {visible.map((c) => (
              <motion.li
                key={c.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={SPRING}
                className="flex items-start gap-2"
              >
                {c.ok ? (
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-label="Verified" />
                ) : (
                  <FlagIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" aria-label="Flagged" />
                )}
                <span className="min-w-0">
                  <span className={c.ok ? "text-foreground/85" : "text-foreground"}>{c.label}</span>
                  <AnimatePresence>
                    {!c.ok && shown > total ? (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={SPRING}
                        className="block text-muted-foreground overflow-hidden"
                      >
                        {c.note}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {!finished && "Reading the certificate and the endorsement forms behind it."}
          {finished && shown <= total && "One endorsement missing. Score reflects it."}
          {shown > total && `Reviewed by Midpoint · ${SUB.reviewedOn}. The gap is already being chased.`}
        </p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0">
          <RotateCcwIcon className="h-3.5 w-3.5" /> Replay
        </button>
      </div>
    </div>
  );
}
