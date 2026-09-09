"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SubStatus } from "./data";

const STROKE: Record<SubStatus, string> = {
  compliant: "text-primary",
  collecting: "text-chart-4",
  reviewing: "text-chart-4",
  expiring: "text-chart-4",
  noncompliant: "text-destructive",
};

/**
 * A thin arc with one number inside. Animates from its current value, so a
 * changing score reads as a gauge moving rather than a spinner restarting.
 */
export default function ComplianceRing({
  value,
  status,
  size = 40,
  showValue = true,
  className = "",
}: {
  value: number;
  status: SubStatus;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const r = 45;
  const stroke = size >= 64 ? 6 : 8;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <span
      role="img"
      aria-label={`${pct}% compliant`}
      className={`relative inline-flex items-center justify-center shrink-0 transition-colors duration-500 ${STROKE[status]} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: pct / 100 }}
          transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.8 }}
        />
      </svg>
      {showValue ? (
        <span
          className="relative font-mono tabular-nums text-foreground leading-none"
          style={{ fontSize: Math.max(10, Math.round(size * 0.28)) }}
        >
          {pct}
        </span>
      ) : null}
    </span>
  );
}
