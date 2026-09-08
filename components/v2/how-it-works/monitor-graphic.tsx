"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type Week = { label: string; verified: number; expiring: number; missing: number; decision: number; note?: string };

const WEEKS: Week[] = [
  { label: "Week 1", verified: 18, expiring: 4, missing: 6, decision: 0, note: "Onboarding. Requests out to every sub on the roster." },
  { label: "Week 2", verified: 24, expiring: 3, missing: 2, decision: 1, note: "One sub 15 days past expiration. Flagged for you." },
  { label: "Week 3", verified: 27, expiring: 1, missing: 1, decision: 0, note: "Decision made. Renewals in. Nothing needs you this week." },
  { label: "2 years later", verified: 27, expiring: 0, missing: 0, decision: 0, note: "Project closed in 2026. Coverage still tracked through 2028." },
];

function Count({ value, accent }: { value: number; accent?: boolean }) {
  const spring = useSpring(value, { bounce: 0, duration: 0.6 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span className={`tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{rounded}</motion.span>;
}

/** Step 5: the weekly status email, week by week. */
export default function MonitorGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isActive || touched || reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % WEEKS.length), 3200);
    return () => clearInterval(id);
  }, [isActive, touched, reduced]);

  const go = (d: number) => {
    setTouched(true);
    setI((v) => (v + d + WEEKS.length) % WEEKS.length);
  };
  const w = WEEKS[i];

  const rows: { label: string; value: number; accent?: boolean }[] = [
    { label: "Verified", value: w.verified },
    { label: "Expiring in 30 days", value: w.expiring },
    { label: "Missing a document", value: w.missing },
    { label: "Needs your decision", value: w.decision, accent: w.decision > 0 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="min-w-0">
            <p className="eyebrow">Weekly status</p>
            <p className="text-sm font-medium text-foreground truncate">{w.label}</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous week" onClick={() => go(-1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" aria-label="Next week" onClick={() => go(1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <dl className="px-4 py-2 font-mono text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 py-2 border-t border-border/60 first-of-type:border-t-0">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd><Count value={r.value} accent={r.accent} /></dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex justify-center gap-1.5" aria-hidden="true">
        {WEEKS.map((_, k) => (
          <motion.span key={k} animate={{ width: k === i ? 20 : 6, backgroundColor: k === i ? "var(--primary)" : "var(--border)" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="h-1.5 rounded-full" />
        ))}
      </div>
      <p className="text-xs text-muted-foreground min-h-[32px]">{w.note}</p>
    </div>
  );
}
