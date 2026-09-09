"use client";

import { useActiveStepId } from "@/components/v2/step-activity";
import { STEP_META } from "@/components/v2/what-we-do-steps";

/**
 * Five small ticks that live inside the page sub-nav while the reader is in
 * the What We Do section: where am I in five, and jump to any of them. The
 * activity tracker lights the current one; clicking lands a step at the top
 * of the viewport, the same way every other sub-nav link lands a section.
 */
export default function StepTicks() {
  const active = useActiveStepId();
  const go = (id: string) => {
    document.getElementById(`step-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <ol className="flex items-center gap-1" aria-label="Steps">
      {STEP_META.map((s) => {
        const on = active === `step-${s.id}`;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-current={on ? "step" : undefined}
              aria-label={`Step ${s.step}: ${s.title}`}
              title={s.title}
              className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                on ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {s.step}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
