/**
 * Compact header for interior pages: eyebrow, title, one line of context.
 * Replaces the full-screen heroes so every non-home page opens the same way.
 */
interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  id?: string;
}

export function PageHeader({ eyebrow, title, description, className = "", id }: PageHeaderProps) {
  return (
    <header id={id} className={`container-site pt-14 md:pt-20 pb-10 md:pb-14 ${className}`}>
      {eyebrow ? <p className="eyebrow-accent mb-4">{eyebrow}</p> : null}
      <h1 className="heading-1 text-foreground">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
