/**
 * Text beside media on a 12-column grid: text takes 5 columns on the rail,
 * media takes 7. Both are top-aligned so the heading sits at the same y as
 * the top of the graphic. `mediaFirst` swaps the order on desktop only; the
 * text stays first in the DOM.
 */
interface SplitSectionProps {
  text: React.ReactNode;
  media: React.ReactNode;
  mediaFirst?: boolean;
  className?: string;
}

export function SplitSection({ text, media, mediaFirst = false, className = "" }: SplitSectionProps) {
  return (
    <div className={`grid lg:grid-cols-12 gap-x-8 gap-y-12 items-start ${className}`}>
      <div className={`lg:col-span-5 ${mediaFirst ? "lg:col-start-8" : ""}`}>{text}</div>
      <div className={`lg:col-span-7 min-w-0 ${mediaFirst ? "lg:order-first lg:col-start-1" : ""}`}>{media}</div>
    </div>
  );
}
