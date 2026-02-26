"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Check, Star, MessageSquare } from "lucide-react";
import SignupModal from "./signup-modal";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  cta: string;
  ctaHref: string;
  popular: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    subtitle: "UP TO 25 ACTIVE SUBS",
    monthlyPrice: 500,
    yearlyPrice: 450,
    features: [
      "COI Collection + AI powered analysis",
      "Expert Verification",
      "Compliance Scoring per sub",
      "Monthly Compliance Reporting",
      "Standard Support",
    ],
    cta: "Get started",
    ctaHref: "/contact",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "25-75 TRADES/SUBS",
    monthlyPrice: 450,
    yearlyPrice: 400,
    features: [
      "Everything in Essential",
      "Enhanced Compliance Reporting",
      "Monthly Dashboard Updates",
      "Priority Support",
    ],
    cta: "Get started",
    ctaHref: "/contact",
    popular: true,
  },
  {
    id: "premier",
    name: "Premier",
    subtitle: "100+ SUBS",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Custom Pricing",
      "Everything in Professional",
      "Full Access Subcontractor",
      "Full audit ready access.",
      "Carrier Advocacy included",
    ],
    cta: "Get in touch",
    ctaHref: "/contact",
    popular: false,
  },
];

const comparisonRows = [
  {
    without: "Staff chasing certs, no real verification",
    with: "We collect and extract requirements from your signed agreements, you send us the contract, we do the rest.",
  },
  {
    without: "Coverage lapses go unnoticed until a claim",
    with: "Continuous monitoring with compliance scores per sub.",
  },
  {
    without: "Generic cert collection ≠ Contract compliance",
    with: "Verified against your specific requirements",
  },
  {
    without: "No leverage at renewal",
    with: "Compliance data used to advocate for lower premiums. Proven results.",
  },
];

// ============================================================================
// ANIMATION WRAPPER
// ============================================================================

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection = memo(function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
});

// ============================================================================
// BACKGROUND LAYER
// ============================================================================

const BackgroundLayer = memo(function BackgroundLayer() {
  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top wash - lime haze */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-40 w-[900px] h-[500px] rounded-full bg-primary/[0.02] blur-[160px]"
      />
      {/* Bottom wash */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[700px] h-[400px] rounded-full bg-primary/[0.015] blur-[140px]"
      />
      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(0, 0%, 4%) 100%)",
        }}
      />
    </div>
  );
});

// ============================================================================
// BILLING TOGGLE
// ============================================================================

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
}

const BillingToggle = memo(function BillingToggle({
  isYearly,
  onToggle,
}: BillingToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/40">
        Billing
      </span>
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="inline-flex rounded-lg border border-border/25 bg-card/40 p-1"
      >
        <button
          role="radio"
          aria-checked={!isYearly}
          onClick={() => onToggle(false)}
          className={`px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${
            !isYearly
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground/50 hover:text-muted-foreground/70"
          }`}
        >
          Monthly
        </button>
        <button
          role="radio"
          aria-checked={isYearly}
          onClick={() => onToggle(true)}
          className={`px-5 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${
            isYearly
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground/50 hover:text-muted-foreground/70"
          }`}
        >
          Yearly
        </button>
      </div>
    </div>
  );
});

// ============================================================================
// PRICING CARD
// ============================================================================

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  position: "left" | "center" | "right";
  onGetStarted: () => void;
}

const PricingCard = memo(function PricingCard({
  tier,
  isYearly,
  position,
  onGetStarted,
}: PricingCardProps) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const isCustom = price === null;
  const isProfessional = position === "center";

  // Position-based classes
  const flexClass = isProfessional ? "flex-[1.08]" : "flex-1";
  const paddingClass = isProfessional
    ? "px-7 lg:px-9 py-10 lg:py-14"
    : "px-6 lg:px-7 py-9 lg:py-12";
  const roundingClass =
    position === "left"
      ? "md:rounded-l-xl"
      : position === "right"
      ? "md:rounded-r-xl"
      : "";

  return (
    <div className={`${flexClass} ${paddingClass} ${roundingClass} flex flex-col`}>
      {/* Plan name + Popular badge */}
      <div className="flex items-center gap-3 mb-2">
        <h3
          className={`font-semibold text-foreground tracking-tight ${
            isProfessional ? "text-xl" : "text-lg"
          }`}
        >
          {tier.name}
        </h3>
        {tier.popular && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
            <Star className="w-2.5 h-2.5" fill="currentColor" />
            Popular
          </span>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-8">
        {tier.subtitle}
      </p>

      {/* Divider */}
      <div className="h-px bg-border/15 mb-8" />

      {/* Price block */}
      <div className="mb-2">
        {isCustom ? (
          <p className="text-lg font-semibold text-foreground leading-none">
            Custom Pricing
          </p>
        ) : (
          <p
            className={`font-bold text-foreground tracking-tight font-mono leading-none ${
              isProfessional ? "text-[28px]" : "text-2xl"
            }`}
          >
            ${price}{" "}
            <span className="text-sm text-muted-foreground/35 font-normal">
              monthly
            </span>
          </p>
        )}
      </div>

      {/* Cadence text - fixed height for alignment */}
      <div className="h-5 mb-10">
        {!isCustom && (
          <p className="text-[11px] text-muted-foreground/30">
            {isYearly ? "Per month, billed yearly" : "Per month"}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/15 mb-8" />

      {/* Features */}
      <ul className="flex flex-col gap-4 mb-10">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 flex-shrink-0 mt-[2px] text-primary/70" />
            <span className="text-[13px] leading-snug text-muted-foreground/55">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={tier.ctaHref}
        onClick={(e) => {
          e.preventDefault();
          onGetStarted();
        }}
        className="mt-auto w-full py-3 rounded-lg text-sm font-medium tracking-tight cursor-pointer flex items-center justify-center gap-2 bg-secondary/80 text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {tier.id === "premier" && <MessageSquare className="w-3.5 h-3.5" />}
        {tier.cta}
      </a>
    </div>
  );
});

// ============================================================================
// MOBILE PRICING CARD (with individual border)
// ============================================================================

const MobilePricingCard = memo(function MobilePricingCard({
  tier,
  isYearly,
  onGetStarted,
}: Omit<PricingCardProps, "position">) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const isCustom = price === null;

  return (
    <div className="rounded-xl border border-border/20 bg-card/30 px-6 py-8 flex flex-col">
      {/* Plan name + Popular badge */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold text-foreground tracking-tight text-lg">
          {tier.name}
        </h3>
        {tier.popular && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
            <Star className="w-2.5 h-2.5" fill="currentColor" />
            Popular
          </span>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-8">
        {tier.subtitle}
      </p>

      {/* Divider */}
      <div className="h-px bg-border/15 mb-8" />

      {/* Price block */}
      <div className="mb-2">
        {isCustom ? (
          <p className="text-lg font-semibold text-foreground leading-none">
            Custom Pricing
          </p>
        ) : (
          <p className="font-bold text-foreground tracking-tight font-mono leading-none text-2xl">
            ${price}{" "}
            <span className="text-sm text-muted-foreground/35 font-normal">
              monthly
            </span>
          </p>
        )}
      </div>

      {/* Cadence text */}
      <div className="h-5 mb-10">
        {!isCustom && (
          <p className="text-[11px] text-muted-foreground/30">
            {isYearly ? "Per month, billed yearly" : "Per month"}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/15 mb-8" />

      {/* Features */}
      <ul className="flex flex-col gap-4 mb-10">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 flex-shrink-0 mt-[2px] text-primary/70" />
            <span className="text-[13px] leading-snug text-muted-foreground/55">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={tier.ctaHref}
        onClick={(e) => {
          e.preventDefault();
          onGetStarted();
        }}
        className="mt-auto w-full py-3 rounded-lg text-sm font-medium tracking-tight cursor-pointer flex items-center justify-center gap-2 bg-secondary/80 text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {tier.id === "premier" && <MessageSquare className="w-3.5 h-3.5" />}
        {tier.cta}
      </a>
    </div>
  );
});

// ============================================================================
// VERTICAL DIVIDER
// ============================================================================

const VerticalDivider = memo(function VerticalDivider() {
  return (
    <div className="hidden md:block w-[2px] flex-shrink-0 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
  );
});

// ============================================================================
// COMPARISON TABLE (Your Experience - Clean Vercel Style)
// ============================================================================

const ComparisonTable = memo(function ComparisonTable() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-24 lg:pb-32">
      {/* Heading */}
      <h3 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl font-light tracking-tight text-foreground mb-12 lg:mb-16">
        Your Experience
      </h3>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-border/10 bg-card/10">
        {/* Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border/10">
          <div className="px-6 py-5 lg:px-8 lg:py-6">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/40 font-medium">
              Without Midpoint
            </p>
          </div>
          <div className="px-6 py-5 lg:px-8 lg:py-6 md:border-l border-border/8 bg-primary/[0.02]">
            <p className="text-[11px] uppercase tracking-[0.12em] text-primary font-medium">
              With Midpoint
            </p>
          </div>
        </div>

        {/* Data Rows */}
        {comparisonRows.map((row, index) => (
          <div
            key={index}
            className={`group grid grid-cols-1 md:grid-cols-2 transition-colors duration-200 hover:bg-card/30 ${
              index < comparisonRows.length - 1 ? "border-b border-border/5" : ""
            }`}
          >
            {/* Without Column */}
            <div className="px-6 py-6 lg:px-8 lg:py-7">
              <p className="text-[14px] text-muted-foreground/55 leading-relaxed">
                {row.without}
              </p>
            </div>

            {/* With Column */}
            <div className="px-6 py-6 lg:px-8 lg:py-7 md:border-l border-border/8 bg-primary/[0.015] group-hover:bg-primary/[0.025] transition-colors">
              <p className="text-[14px] text-foreground/90 leading-relaxed">
                {row.with}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  const handleGetStarted = useCallback(() => {
    setShowSignup(true);
  }, []);

  // Mobile order: Professional first, then Essential, then Premier
  const mobileOrder = [pricingTiers[1], pricingTiers[0], pricingTiers[2]];

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Background Layer */}
      <BackgroundLayer />

      {/* Hero Section */}
      <div className="pt-28 pb-6 lg:pt-36 lg:pb-8">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection delay={0}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.15] mb-5 text-balance">
              Compliance that pays for itself.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <p className="text-sm lg:text-[15px] text-muted-foreground/55 leading-relaxed max-w-lg mx-auto text-balance">
              Priced by the scale of your subcontractor network. Every plan
              includes full-service compliance verification — no software to
              manage, no portal to babysit.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Billing Toggle */}
      <AnimatedSection delay={0.16} className="mb-8 lg:mb-10">
        <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
      </AnimatedSection>

      {/* Pricing Cards */}
      <AnimatedSection delay={0.24}>
        <div className="max-w-5xl mx-auto px-6 pb-20 lg:pb-28">
          {/* Desktop Layout */}
          <div className="hidden md:flex rounded-xl border border-border/15 bg-card/20">
            <PricingCard
              tier={pricingTiers[0]}
              isYearly={isYearly}
              position="left"
              onGetStarted={handleGetStarted}
            />
            <VerticalDivider />
            <PricingCard
              tier={pricingTiers[1]}
              isYearly={isYearly}
              position="center"
              onGetStarted={handleGetStarted}
            />
            <VerticalDivider />
            <PricingCard
              tier={pricingTiers[2]}
              isYearly={isYearly}
              position="right"
              onGetStarted={handleGetStarted}
            />
          </div>

          {/* Mobile Layout - Professional first */}
          <div className="flex flex-col gap-4 md:hidden">
            {mobileOrder.map((tier) => (
              <MobilePricingCard
                key={tier.id}
                tier={tier}
                isYearly={isYearly}
                onGetStarted={handleGetStarted}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Comparison Table */}
      <AnimatedSection delay={0.35}>
        <ComparisonTable />
      </AnimatedSection>

      {/* Signup Modal */}
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </section>
  );
}
