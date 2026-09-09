/**
 * A card grid where the lines are the layout: one outer border and radius,
 * 1px of the border colour between cells, no gutters, no per-card rounding.
 * Children must paint their own background (`bg-card`) so the 1px gaps read
 * as lines.
 */
interface DividedGridProps {
  /** Tailwind column classes for the breakpoints you want, e.g. "md:grid-cols-2". */
  cols: string;
  children: React.ReactNode;
  className?: string;
}

export const DIVIDED_CELL = "bg-card p-7 md:p-8";

export function DividedGrid({ cols, children, className = "" }: DividedGridProps) {
  return (
    <div className={`grid ${cols} gap-px bg-border rounded-xl border border-border overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
