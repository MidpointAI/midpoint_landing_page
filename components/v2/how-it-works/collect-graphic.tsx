"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckIcon, FileTextIcon, MailIcon, RotateCcwIcon } from "lucide-react";

const SPRING = { type: "spring", bounce: 0, duration: 0.55 } as const;

function Node({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5 w-[132px]">
      <p className="text-[13px] font-medium text-foreground leading-tight">{label}</p>
      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{sub}</p>
    </div>
  );
}

/**
 * Step 2: Midpoint requests documents from the sub and their agent, and the
 * certificate and endorsement come back. Plays when the step is in focus;
 * click Replay to run it again.
 */
export default function CollectGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  // 0 idle · 1 requests out · 2 documents back · 3 done
  const [phase, setPhase] = useState(reduced ? 3 : 0);
  const [run, setRun] = useState(0);

  // Sequence runs on timers (never synchronously in the effect body) so it
  // can be cancelled cleanly when the step leaves focus or Replay is pressed.
  useEffect(() => {
    if (reduced) return;
    const timers = [setTimeout(() => setPhase(0), 0)];
    if (isActive) {
      timers.push(
        setTimeout(() => setPhase(1), 500),
        setTimeout(() => setPhase(2), 1700),
        setTimeout(() => setPhase(3), 2900)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [isActive, run, reduced]);

  const requestsOut = phase >= 1;
  const docsBack = phase >= 2;
  const done = phase >= 3;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative grid grid-cols-[132px_1fr_132px] items-center gap-2 min-h-[188px]">
        {/* Midpoint */}
        <div className="flex flex-col gap-3 justify-self-start">
          <Node label="Midpoint" sub="requests + verifies" />
          {/* Document tray */}
          <div className="rounded-lg border border-dashed border-border px-3 py-2 min-h-[64px] w-[132px]">
            <p className="eyebrow mb-1.5">Received</p>
            <div className="space-y-1">
              {["Certificate", "Endorsements"].map((d, i) => (
                <motion.div
                  key={d}
                  initial={false}
                  animate={{ opacity: docsBack ? 1 : 0, x: docsBack ? 0 : 40 }}
                  transition={{ ...SPRING, delay: i * 0.12 }}
                  className="flex items-center gap-1.5 text-[11px] text-foreground/90"
                >
                  <FileTextIcon className="h-3 w-3 text-primary shrink-0" />
                  {d}
                  <motion.span initial={false} animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.6 }} transition={SPRING} className="ml-auto text-primary">
                    <CheckIcon className="h-3 w-3" />
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Lanes */}
        <div className="relative h-full">
          {[{ y: "22%", label: "request" }, { y: "66%", label: "request" }].map((lane, i) => (
            <div key={i} className="absolute left-0 right-0" style={{ top: lane.y }}>
              <div className="h-px bg-border" />
              <motion.span
                initial={false}
                animate={{ x: requestsOut ? "calc(100% - 16px)" : "0%", opacity: requestsOut && !docsBack ? 1 : 0 }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                className="absolute -top-2 left-0 text-primary"
                aria-hidden="true"
              >
                <MailIcon className="h-4 w-4" />
              </motion.span>
              <motion.span
                initial={false}
                animate={{ x: docsBack ? "0%" : "calc(100% - 16px)", opacity: docsBack && !done ? 1 : 0 }}
                transition={{ ...SPRING, delay: i * 0.1 }}
                className="absolute -top-2 left-0 text-foreground"
                aria-hidden="true"
              >
                <FileTextIcon className="h-4 w-4" />
              </motion.span>
            </div>
          ))}
        </div>

        {/* Sub + agent */}
        <div className="flex flex-col gap-3 justify-self-end">
          <Node label="Subcontractor" sub="sends the certificate" />
          <Node label="Their agent" sub="sends the endorsements" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {phase === 0 && "Waiting for the signed agreement."}
          {phase === 1 && "Requests sent to the sub and the agent who wrote the policy."}
          {phase === 2 && "Documents coming back."}
          {phase === 3 && "Both documents received. Your team sent nothing."}
        </p>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0"
        >
          <RotateCcwIcon className="h-3.5 w-3.5" /> Replay
        </button>
      </div>
    </div>
  );
}
