"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ProjectScorecard, Roster, SUBS, PROJECT, type Sub, type SubStatus } from "@/components/v2/report";
import { FigureFrame } from "./figure-frame";

/**
 * Six subs on one project, moving from Collecting through Reviewing to their
 * final state as the section comes into view. Hover or focus a row to see
 * what Midpoint checked; the sequence pauses while you look.
 */
type Stage = 0 | 1 | 2; // collecting → reviewing → final

function withStage(sub: Sub, stage: Stage): Sub {
  if (stage === 2) return sub;
  const status: SubStatus = stage === 0 ? "collecting" : "reviewing";
  return { ...sub, status, score: stage === 0 ? 0 : Math.round(sub.score * 0.4), reviewedDaysAgo: undefined, evidence: [] };
}

export default function RosterDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [stages, setStages] = useState<Stage[]>(() => SUBS.map(() => (reduced ? 2 : 0)));
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const paused = expanded !== null;

  // Advance one sub one stage at a time, top to bottom, until everything settles.
  useEffect(() => {
    if (!inView || reduced || paused) return;
    const id = setInterval(() => {
      setStages((prev) => {
        const i = prev.findIndex((s) => s < 2);
        if (i === -1) return prev;
        const next = [...prev];
        next[i] = (next[i] + 1) as Stage;
        return next;
      });
    }, 550);
    return () => clearInterval(id);
  }, [inView, reduced, paused]);

  const subs = SUBS.map((s, i) => withStage(s, stages[i]));
  const done = stages.every((s) => s === 2);

  return (
    <div ref={ref} className="w-full">
      <FigureFrame
        n={1}
        label="Project scorecard"
        caption={<span aria-live="polite">{done ? "Reviewed by Midpoint. Hover a sub to see what was checked." : "Collecting and reviewing certificates…"}</span>}
      >
      <ProjectScorecard name={PROJECT.name} location={PROJECT.location} subs={subs} framed={false}>
        <Roster
          subs={subs}
          expandedId={expanded}
          onRowEnter={(id) => { if (stages[SUBS.findIndex((s) => s.id === id)] === 2) setExpanded(id); }}
          onRowLeave={() => setExpanded(pinned)}
          onRowSelect={(id) => { const next = pinned === id ? null : id; setPinned(next); setExpanded(next); }}
        />
      </ProjectScorecard>
      </FigureFrame>
    </div>
  );
}
