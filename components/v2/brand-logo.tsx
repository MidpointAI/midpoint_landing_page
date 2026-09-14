/**
 * Brand logo rendered through a CSS mask so it takes the current
 * `--primary` token instead of the hardcoded lime baked into the SVGs.
 * Works in both light and dark themes without separate assets.
 */
interface BrandLogoProps {
  variant?: "wordmark" | "mark";
  className?: string;
}

const ASSETS = {
  wordmark: { src: "/v2/Property_1Frame_2.svg", ratio: 361 / 84 },
  mark: { src: "/v2/Mark.svg", ratio: 1 },
} as const;

export default function BrandLogo({ variant = "wordmark", className = "" }: BrandLogoProps) {
  const { src, ratio } = ASSETS[variant];
  return (
    <span
      role="img"
      aria-label="Midpoint"
      className={`block bg-primary ${className}`}
      style={{
        aspectRatio: `${ratio}`,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
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
