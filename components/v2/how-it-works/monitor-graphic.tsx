"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ProjectScorecard, Roster, SUBS, PROJECT, type Sub, type SubStatus } from "@/components/v2/report";

type Override = Partial<Pick<Sub, "status" | "score">>;
type Week = { label: string; note: string; overrides: Record<string, Override> };

// The same six subs, week by week. Scores are the project-level report.
const WEEKS: Week[] = [
  {
    label: "Week 1",
    note: "Onboarding. Requests out to every sub on the roster.",
    overrides: {
      saguaro: { status: "compliant", score: 100 },
      "copper-ridge": { status: "reviewing", score: 40 },
      "mesa-verde": { status: "collecting", score: 0 },
      ironwood: { status: "collecting", score: 0 },
      bluebird: { status: "collecting", score: 0 },
      redrock: { status: "collecting", score: 0 },
    },
  },
  {
    label: "Week 2",
    note: "Five verified. Redrock is missing one endorsement; we're on it.",
    overrides: { redrock: { status: "noncompliant", score: 80 } },
  },
  {
    label: "Week 3",
    note: "Endorsement received. Nothing needs you this week.",
    overrides: { redrock: { status: "compliant", score: 100 } },
  },
  {
    label: "Week 6",
    note: "Bluebird's policy renews in 30 days. Reminder already sent.",
    overrides: { redrock: { status: "compliant", score: 100 }, bluebird: { status: "expiring", score: 100 } },
  },
  {
    label: "Two years later",
    note: "Project closed. Coverage still tracked for two more years, because claims arrive late.",
    overrides: { redrock: { status: "compliant", score: 100 } },
  },
];

const applyWeek = (w: Week): Sub[] =>
  SUBS.map((s) => {
    const o = w.overrides[s.id];
    return o ? { ...s, status: (o.status ?? s.status) as SubStatus, score: o.score ?? s.score } : s;
  });

/** Step 5: the weekly status email is the project scorecard, week by week. */
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
  const week = WEEKS[i];
  const subs = applyWeek(week);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow mb-0.5">Your weekly status email</p>
          <p className="text-sm font-medium text-foreground truncate">{week.label}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" aria-label="Previous week" onClick={() => go(-1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="Next week" onClick={() => go(1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ProjectScorecard name={PROJECT.name} location={PROJECT.location} subs={subs}>
        <Roster subs={subs} />
      </ProjectScorecard>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground min-h-[32px]">{week.note}</p>
        <div className="flex gap-1.5 shrink-0" aria-hidden="true">
          {WEEKS.map((_, k) => (
            <motion.span key={k} animate={{ width: k === i ? 18 : 6, backgroundColor: k === i ? "var(--primary)" : "var(--border)" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="h-1.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
