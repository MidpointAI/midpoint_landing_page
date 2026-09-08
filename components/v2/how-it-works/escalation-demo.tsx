"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Roster, SUBS, type Sub } from "@/components/v2/report";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

type Decision = "hold" | "restrict" | "exception" | "replace";

const DECISIONS: { id: Decision; label: string; result: string }[] = [
  { id: "hold", label: "Hold payment", result: "Payment held until the endorsement arrives. The sub and their agent were told why." },
  { id: "restrict", label: "Restrict site access", result: "Crew flagged at the gate for this project. Outreach continues in the background." },
  { id: "exception", label: "Accept an exception", result: "Exception recorded with your note and the date. The row shows Compliant with an asterisk in your report." },
  { id: "replace", label: "Replace the sub", result: "Removed from the project roster. Their file stays on record for the two-year window." },
];

const HISTORY = [
  "60 days out: renewal requested from the sub and their agent",
  "30 days out: second request",
  "7 days out: daily follow-ups, agent contacted directly",
  "Expired: marked not compliant, outreach continues",
  "15 days past: flagged in your weekly email",
];

const FLAGGED: Sub = { ...SUBS.find((s) => s.id === "bluebird")!, status: "noncompliant", score: 60, evidence: [] };

/**
 * "We chase. You decide." The one row that reached you, the history of
 * what we did first, and the four calls that are yours. Each shows its
 * consequence; none of them requires logging in.
 */
export default function EscalationDemo() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const row: Sub =
    decision === "exception"
      ? { ...FLAGGED, status: "compliant", score: 100 }
      : FLAGGED;
  const chip = () =>
    decision === "hold" ? "Payment held" : decision === "restrict" ? "Access restricted" : decision === "exception" ? "Exception accepted" : "Your decision";

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">From your weekly email</p>
        <button type="button" onClick={() => setShowHistory((v) => !v)} className="text-xs font-medium text-primary hover:underline">
          {showHistory ? "Hide what we did" : "What we did first"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showHistory ? (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden text-xs text-muted-foreground space-y-1.5 border-l border-border pl-3"
          >
            {HISTORY.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </motion.ol>
        ) : null}
      </AnimatePresence>

      <div className="rounded-lg border border-border bg-background px-3 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {decision === "replace" ? (
            <motion.p key="removed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-3 text-sm text-muted-foreground">
              Removed from {FLAGGED.project}.
            </motion.p>
          ) : (
            <motion.div key="row" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={SPRING}>
              <Roster subs={[row]} chipLabel={chip} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DECISIONS.map((d) => (
          <Button
            key={d.id}
            size="sm"
            variant={decision === d.id ? "default" : "outline"}
            aria-pressed={decision === d.id}
            onClick={() => setDecision(d.id)}
            className="justify-center"
          >
            {d.label}
          </Button>
        ))}
      </div>

      <div className="flex items-start justify-between gap-4 min-h-[40px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={decision ?? "none"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={SPRING}
            className="text-xs text-muted-foreground"
          >
            {decision ? DECISIONS.find((d) => d.id === decision)!.result : "Pick one to see what happens. You can change your mind."}
          </motion.p>
        </AnimatePresence>
        {decision ? (
          <button type="button" onClick={() => setDecision(null)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0">
            <RotateCcwIcon className="h-3.5 w-3.5" /> Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
