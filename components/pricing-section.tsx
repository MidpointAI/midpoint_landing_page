"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Check, Star, MessageSquare, ArrowRight } from "lucide-react";
import SignupModal from "./signup-modal";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  subsRange: string;
  startingPrice: string | null;
  priceNote: string;
  features: string[];
  cta: string;
  popular: boolean;
  isCustom: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    subtitle: "Small teams getting started",
    subsRange: "Up to 25 subs",
    startingPrice: "6,000",
    priceNote: "Minimum annual fee",
    features: [
      "COI Collection + AI powered analysis",
      "Expert Verification",
      "Compliance Scoring per sub",
      "Monthly Compliance Reporting",
      "Standard Support",
    ],
    cta: "Get Started",
    popular: false,
    isCustom: false,
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "Growing contractor networks",
    subsRange: "25-75 subs",
    startingPrice: "7,500",
    priceNote: "Formula-based pricing",
    features: [
      "Everything in Essential",
      "Enhanced Compliance Reporting",
      "Monthly Dashboard Updates",
      "Priority Support",
    ],
    cta: "Get Started",
    popular: true,
    isCustom: false,
  },
  {
    id: "premier",
    name: "Premier",
    subtitle: "Enterprise scale operations",
    subsRange: "100+ subs",
    startingPrice: null,
    priceNote: "Tailored to your needs",
    features: [
      "Everything in Professional",
      "Full Access Subcontractor Portal",
      "Audit-ready documentation",
      "Carrier Advocacy included",
      "Dedicated Account Manager",
    ],
    cta: "Contact Sales",
    popular: false,
    isCustom: true,
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
      <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-[900px] h-[500px] rounded-full bg-primary/[0.02] blur-[160px]" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[700px] h-[400px] rounded-full bg-primary/[0.015] blur-[140px]" />
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
// PRICING CARD
// ============================================================================

interface PricingCardProps {
  tier: PricingTier;
  onGetStarted: () => void;
  onContact: () => void;
}

const PricingCard = memo(function PricingCard({
  tier,
  onGetStarted,
  onContact,
}: PricingCardProps) {
  const isProfessional = tier.popular;

  return (
    <div
      className={`relative flex flex-col p-6 lg:p-8 rounded-xl border transition-all duration-200 ${
        isProfessional
          ? "border-primary/40 bg-card/30"
          : "border-border/20 bg-card/10 hover:border-border/30"
      }`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
            <Star className="w-3 h-3" fill="currentColor" />
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1">
          {tier.name}
        </h3>
        <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
          {tier.subsRange}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {tier.isCustom ? (
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              Custom
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              {tier.priceNote}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground/50">From</span>
              <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
                ${tier.startingPrice}
              </span>
              <span className="text-sm text-muted-foreground/40">/year</span>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-1">
              {tier.priceNote}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/15 mb-6" />

      {/* Features */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span className="text-sm text-muted-foreground/70 leading-snug">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {tier.isCustom ? (
        <button
          onClick={onContact}
          className="w-full py-3 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 border border-border/30 text-foreground hover:border-primary hover:text-primary transition-colors duration-150"
        >
          <MessageSquare className="w-4 h-4" />
          {tier.cta}
        </button>
      ) : (
        <button
          onClick={onGetStarted}
          className={`w-full py-3 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150 ${
            isProfessional
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-secondary/80 text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

// ============================================================================
// COMPARISON TABLE
// ============================================================================

const ComparisonTable = memo(function ComparisonTable() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-24 lg:pb-32">
      <h3 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl font-light tracking-tight text-foreground mb-12 lg:mb-16">
        Your Experience
      </h3>

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
            <div className="px-6 py-6 lg:px-8 lg:py-7">
              <p className="text-[14px] text-muted-foreground/55 leading-relaxed">
                {row.without}
              </p>
            </div>
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
  const [showSignup, setShowSignup] = useState(false);

  const handleGetStarted = useCallback(() => {
    setShowSignup(true);
  }, []);

  const handleContact = useCallback(() => {
    window.location.href = "mailto:hello@midpoint.com";
  }, []);

  return (
    <section className="relative bg-background overflow-hidden">
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
            <p className="text-sm lg:text-[15px] text-muted-foreground/55 leading-relaxed max-w-lg mx-auto text-balance mb-3">
              Priced by the scale of your subcontractor network. Every plan
              includes full-service compliance verification — no software to
              manage, no portal to babysit.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <p className="text-xs text-muted-foreground/40">
              Starting at <span className="text-primary font-semibold">$6,000</span>/year
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Pricing Cards */}
      <AnimatedSection delay={0.2}>
        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                onGetStarted={handleGetStarted}
                onContact={handleContact}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Comparison Table */}
      <AnimatedSection delay={0.3}>
        <ComparisonTable />
      </AnimatedSection>

      {/* Signup Modal */}
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </section>
  );
}
