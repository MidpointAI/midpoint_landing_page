/**
 * The one way a section introduces itself: eyebrow, heading, one paragraph,
 * optional link. Always left-aligned on the site rail, with fixed spacing,
 * so every section's heading lands on the same x.
 */
interface SectionIntroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A link or button row under the paragraph. */
  children?: React.ReactNode;
  /** h1 on page-level intros, h2 inside a page. */
  as?: "h1" | "h2";
  /** `intro` sits alone above a grid; `column` sits beside media. */
  measure?: "intro" | "column";
  className?: string;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  children,
  as: Heading = "h2",
  measure = "intro",
  className = "",
}: SectionIntroProps) {
  const measureClass = measure === "column" ? "measure-column" : "measure-intro";
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow-accent mb-4">{eyebrow}</p> : null}
      <Heading className={`${Heading === "h1" ? "heading-1" : "heading-2"} text-foreground`}>{title}</Heading>
      {description ? (
        <p className={`mt-4 text-base md:text-lg leading-relaxed text-muted-foreground ${measureClass}`}>
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
