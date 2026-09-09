import type { Logo, Testimonial } from "./customer-stories-data";

/**
 * A client logo drawn through a CSS mask in the foreground colour, so the same
 * transparent PNG reads correctly on light and dark backgrounds.
 */
export function CompanyLogo({
  logo,
  name,
  className = "h-6",
}: {
  logo: Logo;
  name: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`block bg-foreground/80 ${className}`}
      style={{
        aspectRatio: `${logo.ratio}`,
        maskImage: `url(${logo.src})`,
        WebkitMaskImage: `url(${logo.src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "left center",
        WebkitMaskPosition: "left center",
      }}
    />
  );
}

/** Wordmarks sit at the base height; stacked marks (roughly square) get more room to stay legible. */
export function logoHeightClass(logo: Logo, base = "h-6", stacked = "h-10") {
  return logo.ratio < 2 ? stacked : base;
}

/** Company logo if one is on file; otherwise the name in the eyebrow style. */
export function CompanyMark({ item }: { item: Testimonial }) {
  if (item.logo) {
    return <CompanyLogo logo={item.logo} name={item.company} className={logoHeightClass(item.logo)} />;
  }
  return <span className="eyebrow">{item.company}</span>;
}

/**
 * One quote with its attribution. Used on the home page (three across) and on
 * /customers next to each story. Pass `className` for the outer card styling
 * the call site needs; the card itself only lays out its content.
 */
export function TestimonialCard({
  item,
  className = "",
  showMark = true,
  showHighlight = true,
}: {
  item: Testimonial;
  className?: string;
  showMark?: boolean;
  /** Off where the same number already sits next to the quote. */
  showHighlight?: boolean;
}) {
  const highlight = showHighlight ? item.highlight : undefined;
  return (
    <figure className={`flex flex-col ${className}`}>
      {showMark || highlight ? (
        <div className="flex items-center justify-between gap-4 mb-6 min-h-6">
          {showMark ? <CompanyMark item={item} /> : <span />}
          {highlight ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary whitespace-nowrap">
              {highlight}
            </span>
          ) : null}
        </div>
      ) : null}
      <blockquote className="text-base text-foreground/90 leading-relaxed flex-1">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-sm text-muted-foreground">{item.title}</p>
      </figcaption>
    </figure>
  );
}
