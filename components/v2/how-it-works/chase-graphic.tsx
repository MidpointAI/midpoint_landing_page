"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Roster, SUBS, type Sub, type SubStatus } from "@/components/v2/report";

/**
 * Step 4: a policy heading toward expiration. Drag the handle along the
 * timeline (or let it play) to see what Midpoint does at each point and
 * when it finally comes to the GC.
 */
const MARKERS = [
  { at: 0, label: "Today", status: "Verified", note: "Coverage in force. Nothing to do." },
  { at: 0.28, label: "60 days out", status: "Reminder sent", note: "First renewal request to the sub and their agent." },
  { at: 0.5, label: "30 days out", status: "Reminder sent", note: "Second request. Most renewals arrive here." },
  { at: 0.68, label: "7 days out", status: "Escalating", note: "Daily follow-ups. Agent contacted directly." },
  { at: 0.82, label: "Expired", status: "Coverage lapsed", note: "Sub marked non-compliant. Outreach continues." },
  { at: 1, label: "15 days past", status: "Your decision", note: "Flagged in your weekly email with the history and a recommended next step." },
];

// The sub whose policy is heading toward expiration, as the GC sees it at each point.
const BASE = SUBS.find((s) => s.id === "bluebird")!;
const ROW_STATE: { status: SubStatus; score: number; label?: string }[] = [
  { status: "compliant", score: 100 },
  { status: "expiring", score: 100, label: "Renewal requested" },
  { status: "expiring", score: 100, label: "Renewal requested" },
  { status: "expiring", score: 100, label: "Escalating" },
  { status: "noncompliant", score: 60, label: "Coverage lapsed" },
  { status: "noncompliant", score: 60, label: "Your decision" },
];

// Apple's momentum projection: where a flick would come to rest.
const project = (v: number, rate = 0.998) => (v / 1000) * rate / (1 - rate);

export default function ChaseGraphic({ isActive }: { isActive: boolean }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // px along the track
  const [width, setWidth] = useState(1);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0); // keyboard steps read this so fast repeats don't use a stale index
  const [touched, setTouched] = useState(false);
  const drag = useRef<{ offset: number; hist: { t: number; x: number }[] } | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Nearest marker drives the status card.
  useMotionValueEvent(x, "change", (v) => {
    const p = Math.min(1, Math.max(0, v / width));
    let best = 0;
    MARKERS.forEach((m, i) => {
      if (Math.abs(m.at - p) < Math.abs(MARKERS[best].at - p)) best = i;
    });
    idxRef.current = best;
    setIdx(best);
  });

  // Guided playback while the step is in focus, until the user grabs the handle.
  useEffect(() => {
    if (!isActive || touched || reduced) return;
    let i = 0;
    let ctrl: ReturnType<typeof animate> | undefined;
    const step = () => {
      i = (i + 1) % MARKERS.length;
      ctrl = animate(x, MARKERS[i].at * width, { type: "spring", bounce: 0, duration: 0.6 });
    };
    const id = setInterval(step, 1800);
    return () => {
      clearInterval(id);
      ctrl?.stop();
    };
  }, [isActive, touched, reduced, width, x]);

  // Rubber-band past the ends so the boundary feels soft, not frozen.
  const rubber = (v: number) => {
    if (v < 0) return -((-v * 0.55 * width) / (width + 0.55 * -v));
    if (v > width) return width + ((v - width) * 0.55 * width) / (width + 0.55 * (v - width));
    return v;
  };

  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setTouched(true);
    x.stop();
    const track = trackRef.current!.getBoundingClientRect();
    drag.current = { offset: e.clientX - track.left - x.get(), hist: [{ t: performance.now(), x: x.get() }] };
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const track = trackRef.current!.getBoundingClientRect();
    const raw = e.clientX - track.left - drag.current.offset;
    x.set(rubber(raw));
    drag.current.hist.push({ t: performance.now(), x: raw });
    if (drag.current.hist.length > 6) drag.current.hist.shift();
  };
  const onUp = () => {
    if (!drag.current) return;
    const h = drag.current.hist;
    drag.current = null;
    const a = h[0], b = h[h.length - 1];
    const dt = Math.max(1, b.t - a.t);
    const velocity = ((b.x - a.x) / dt) * 1000; // px/s
    const projected = x.get() + project(velocity);
    const target = MARKERS.reduce((best, m) => (Math.abs(m.at * width - projected) < Math.abs(best - projected) ? m.at * width : best), 0);
    animate(x, target, { type: "spring", bounce: 0.15, duration: 0.5, velocity });
  };
  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    setTouched(true);
    const next = Math.min(MARKERS.length - 1, Math.max(0, idxRef.current + dir));
    idxRef.current = next;
    animate(x, MARKERS[next].at * width, { type: "spring", bounce: 0, duration: 0.4 });
  };

  const m = MARKERS[idx];
  const late = idx >= 4;
  const row: Sub = { ...BASE, status: ROW_STATE[idx].status, score: ROW_STATE[idx].score, evidence: [] };

  return (
    <div className="flex flex-col gap-5">
      {/* The row in your weekly email, reacting to where the handle is */}
      <div className="rounded-lg border border-border bg-background px-3">
        <Roster subs={[row]} chipLabel={() => ROW_STATE[idx].label} />
      </div>

      {/* Status card */}
      <div className={`rounded-lg border p-4 transition-colors ${late ? "border-destructive/40 bg-destructive/5" : "border-border bg-background"}`}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">{m.label}</p>
          <p className={`text-sm font-medium ${late ? "text-destructive" : "text-primary"}`}>{m.status}</p>
        </div>
        <p className="mt-2 text-sm text-foreground/90 leading-snug min-h-[40px]">{m.note}</p>
      </div>

      {/* Timeline */}
      <div className="px-2 pt-2 pb-6">
        <div ref={trackRef} className="relative h-1 rounded-full bg-border">
          <motion.div className="absolute left-0 top-0 h-full rounded-full bg-primary origin-left" style={{ width: x }} />
          {MARKERS.map((mk, i) => (
            <div key={mk.label} className="absolute -top-1" style={{ left: `${mk.at * 100}%` }}>
              <div className={`h-3 w-3 -ml-1.5 rounded-full border-2 border-card ${i <= idx ? "bg-primary" : "bg-border"} ${i >= 4 ? "bg-destructive" : ""}`} />
              <span className={`absolute top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono ${i === idx ? "text-foreground" : "text-muted-foreground/60"} ${i === 0 ? "translate-x-0" : ""} ${i === MARKERS.length - 1 ? "-translate-x-full" : ""}`}>
                {mk.label}
              </span>
            </div>
          ))}
          <motion.button
            type="button"
            role="slider"
            aria-label="Days until expiration"
            aria-valuemin={0}
            aria-valuemax={MARKERS.length - 1}
            aria-valuenow={idx}
            aria-valuetext={`${m.label}: ${m.status}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            style={{ x }}
            className="absolute -top-2.5 -ml-3 h-6 w-6 rounded-full bg-primary ring-4 ring-card shadow-md cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-primary/50"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">Drag the handle, or use the arrow keys.</p>
    </div>
  );
}
