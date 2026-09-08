"use client";

import ComplianceRing from "./compliance-ring";
import { projectScore, type Sub, type SubStatus } from "./data";

/**
 * The report a GC actually receives: one project, its subs, one number.
 * Header only here; pair it with <Roster> for the rows.
 */
export default function ProjectScorecard({
  name,
  location,
  subs,
  children,
}: {
  name: string;
  location?: string;
  subs: Sub[];
  children?: React.ReactNode;
}) {
  const score = projectScore(subs);
  const status: SubStatus = subs.some((s) => s.status === "noncompliant")
    ? "noncompliant"
    : subs.every((s) => s.status === "compliant")
      ? "compliant"
      : "reviewing";
  const compliant = subs.filter((s) => s.status === "compliant").length;

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <ComplianceRing value={score} status={status} size={56} />
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-1">Project compliance</p>
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          {location ? <p className="text-xs text-muted-foreground">{location}</p> : null}
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm text-foreground tabular-nums">
            {compliant}<span className="text-muted-foreground">/{subs.length}</span>
          </p>
          <p className="text-[11px] text-muted-foreground">subs verified</p>
        </div>
      </div>
      {children ? <div className="pt-2">{children}</div> : null}
    </div>
  );
}
