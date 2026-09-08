import { CheckIcon, FlagIcon } from "lucide-react";
import type { EvidenceCheck } from "./data";

/**
 * What Midpoint checked on one subcontractor. A receipt, not a form:
 * the review already happened and this is the record the GC gets.
 */
export default function EvidenceTrail({
  checks,
  reviewedOn,
  compact = false,
}: {
  checks: EvidenceCheck[];
  reviewedOn?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "text-xs" : "text-sm"}>
      <ul className="space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-2">
            {c.ok ? (
              <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-label="Verified" />
            ) : (
              <FlagIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" aria-label="Flagged" />
            )}
            <span className="min-w-0">
              <span className={c.ok ? "text-foreground/85" : "text-foreground"}>{c.label}</span>
              {c.note ? <span className="block text-muted-foreground">{c.note}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      {reviewedOn ? (
        <p className="mt-3 eyebrow text-[10px] tracking-[0.16em] text-muted-foreground/70">Reviewed by Midpoint · {reviewedOn}</p>
      ) : null}
    </div>
  );
}
