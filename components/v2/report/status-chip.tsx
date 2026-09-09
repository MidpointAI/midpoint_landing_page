import { STATUS_LABEL, type SubStatus } from "./data";

const DOT: Record<SubStatus, string> = {
  compliant: "bg-primary",
  collecting: "bg-chart-4",
  reviewing: "bg-chart-4",
  expiring: "bg-chart-4",
  noncompliant: "bg-destructive",
};

/** Five states, quiet enough to sit inside a row. */
export default function StatusChip({ status, label, className = "" }: { status: SubStatus; label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 eyebrow text-[10px] tracking-[0.16em] whitespace-nowrap ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${DOT[status]}`} aria-hidden="true" />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
