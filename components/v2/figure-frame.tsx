"use client";

import { motion } from "framer-motion";
import { SPRING } from "./motion";

/**
 * The one frame for every product visual on the site: a card with a mono
 * figure label across the top ("FIG. 01 · Project scorecard"). Pages number
 * their figures in reading order. `isActive` dims the frame when a guided
 * page has moved on to another step.
 */
interface FigureFrameProps {
  n: number;
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  /** A line under the visual, e.g. live status text. */
  caption?: React.ReactNode;
  className?: string;
}

export function FigureFrame({ n, label, children, isActive = true, caption, className = "" }: FigureFrameProps) {
  return (
    <motion.figure
      aria-label={label}
      className={`relative w-full max-w-[560px] rounded-xl border bg-card p-5 md:p-6 overflow-hidden ${className}`}
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.98,
        borderColor: isActive ? "var(--border)" : "var(--border)",
      }}
      transition={SPRING}
    >
      <figcaption className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-foreground/70">Fig. {String(n).padStart(2, "0")}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate">{label}</span>
      </figcaption>
      {children}
      {caption ? <div className="mt-3 text-xs text-muted-foreground">{caption}</div> : null}
    </motion.figure>
  );
}
