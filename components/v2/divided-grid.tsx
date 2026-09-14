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
  /**
   * `card`: one rounded outer border, cells on the card colour.
   * `rules`: no box at all, just a rule above and below and lines between
   * cells, for sections that already sit between the page rails.
   */
  frame?: "card" | "rules";
}

export const DIVIDED_CELL = "bg-card p-7 md:p-8";
/** Cell styling for `frame="rules"` in a two-column grid: page colour, padding kept off the rail edges. */
export const RULED_CELL = "bg-background py-7 md:py-8 md:px-8 md:odd:pl-0 md:even:pr-0";
/** The same for a grid that is one row wide: first cell flush left, last flush right. */
export const RULED_ROW_CELL = "bg-background py-7 md:py-8 md:px-8 md:first:pl-0 md:last:pr-0";

export function DividedGrid({ cols, children, className = "", frame = "card" }: DividedGridProps) {
  const frameClass =
    frame === "card" ? "rounded-xl border border-border overflow-hidden" : "border-y border-border";
  return <div className={`grid ${cols} gap-px bg-border ${frameClass} ${className}`}>{children}</div>;
}
