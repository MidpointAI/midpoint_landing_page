"use client";

import { useActiveStepId } from "@/components/v2/step-activity";

/** Sticky progress rail for the steps: where am I, where can I go. */
export default function StepRail({ steps }: { steps: { id: string; step: number; title: string }[] }) {
  const active = useActiveStepId();
  const go = (id: string) => {
    document.getElementById(`step-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <nav aria-label="Steps" className="hidden lg:block sticky top-1/2 -translate-y-1/2 self-start">
      <ol className="relative flex flex-col gap-4 pl-4 border-l border-border">
        {steps.map((s) => {
          const on = active === `step-${s.id}`;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={on ? "step" : undefined}
                className="group flex items-center gap-3 text-left"
              >
                <span className={`absolute -left-[5px] h-[9px] w-[9px] rounded-full transition-colors ${on ? "bg-primary" : "bg-border group-hover:bg-muted-foreground"}`} />
                <span className={`font-mono text-[11px] tracking-[0.25em] transition-colors ${on ? "text-primary" : "text-muted-foreground/60 group-hover:text-muted-foreground"}`}>
                  0{s.step}
                </span>
                <span className={`text-xs transition-colors max-w-[150px] leading-snug ${on ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground"}`}>
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
