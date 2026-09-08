"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RotateCcwIcon } from "lucide-react";
import { Roster, SUBS, PROJECT, type Sub } from "@/components/v2/report";

/**
 * Step 2: requests go to each sub and their agent; certificates and
 * endorsements come back. Rows flip from Requested to Received one at a
 * time while the step is in focus. Replay runs it again.
 */
const LABEL = (s: Sub) => (s.status === "collecting" ? "Requested" : "Received");

export default function CollectGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  const [received, setReceived] = useState(reduced ? SUBS.length : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timers = [setTimeout(() => setReceived(0), 0)];
    if (isActive) {
      SUBS.forEach((_, i) => timers.push(setTimeout(() => setReceived(i + 1), 900 + i * 650)));
    }
    return () => timers.forEach(clearTimeout);
  }, [isActive, run, reduced]);

  const subs: Sub[] = SUBS.map((s, i) => ({
    ...s,
    status: i < received ? "reviewing" : "collecting",
    score: 0,
    evidence: [],
    reviewedDaysAgo: undefined,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">Documents requested</p>
          <p className="text-sm font-medium text-foreground truncate">{PROJECT.name}</p>
        </div>
        <p className="font-mono text-sm tabular-nums text-foreground shrink-0">
          {received}<span className="text-muted-foreground">/{SUBS.length}</span>
          <span className="ml-1.5 text-[11px] text-muted-foreground">received</span>
        </p>
      </div>
      <div className="rounded-lg border border-border bg-background px-3">
        <Roster subs={subs} showRing={false} chipLabel={LABEL} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {received === 0 && "Sent to each subcontractor and the agent who wrote their policy."}
          {received > 0 && received < SUBS.length && "Certificates and endorsements coming back."}
          {received === SUBS.length && "All six returned. Your team sent nothing."}
        </p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0">
          <RotateCcwIcon className="h-3.5 w-3.5" /> Replay
        </button>
      </div>
    </div>
  );
}
