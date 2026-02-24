"use client";

import { useRef, useState, memo, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// Pricing tier data
const pricingTiers = [
  {
    id: "essential",
    name: "Essential",
    subtitle: "UP TO 25 ACTIVE SUBS",
    monthlyPrice: 500,
    yearlyPrice: 400,
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
    yearlyPrice: 360,
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

// Comparison data
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

// Memoized CheckIcon
const CheckIcon = memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
});

// Memoized MessageIcon for "Get in touch" button
const MessageIcon = memo(function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
});

// Billing Toggle Component
const BillingToggle = memo(function BillingToggle({
  isYearly,
  onToggle,
}: {
  isYearly: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          isYearly ? "bg-primary" : "bg-border"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform duration-200 ${
            isYearly ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs">Billed Yearly</span>
    </button>
  );
});

// Pricing Card Component
const PricingCard = memo(function PricingCard({
  tier,
  isYearly,
  onToggleYearly,
  index,
}: {
  tier: typeof pricingTiers[0];
  isYearly: boolean;
  onToggleYearly: () => void;
  index: number;
}) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const isCustom = price === null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="relative flex flex-col h-full"
    >
      {/* Card */}
      <div className="flex-1 flex flex-col p-6 md:p-8 rounded-xl bg-card/50 border border-border hover:border-border/80 transition-colors duration-300">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
            {tier.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Popular
              </span>
            )}
          </div>
          <p className="text-xs tracking-[0.15em] uppercase text-muted">{tier.subtitle}</p>
        </div>

        {/* Separator */}
        <div className="h-px bg-border mb-6" />

        {/* Price */}
        <div className="mb-6">
          {isCustom ? (
            <p className="text-2xl font-semibold text-foreground font-mono">Custom Pricing</p>
          ) : (
            <>
              <p className="text-2xl font-semibold text-foreground font-mono">
                ${price} <span className="text-base font-normal text-muted-foreground">monthly</span>
              </p>
              <div className="mt-3">
                <BillingToggle isYearly={isYearly} onToggle={onToggleYearly} />
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="h-px bg-border mb-6" />

        {/* Features */}
        <ul className="flex-1 space-y-4 mb-8">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary mt-0.5 flex-shrink-0">
                <CheckIcon className="w-4 h-4" />
              </span>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={tier.ctaHref}
          className={`
            w-full py-3 px-6 text-center text-sm font-medium rounded-xl transition-colors duration-300
            ${
              tier.id === "premier"
                ? "bg-card border border-border text-foreground hover:border-primary hover:text-primary flex items-center justify-center gap-2"
                : "bg-primary text-primary-foreground hover:bg-foreground"
            }
          `}
        >
          {tier.id === "premier" && <MessageIcon className="w-4 h-4" />}
          {tier.cta}
        </a>
      </div>
    </motion.div>
  );
});

// Comparison Row Component
const ComparisonRow = memo(function ComparisonRow({
  row,
  index,
}: {
  row: typeof comparisonRows[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-6 border-b border-border last:border-b-0"
    >
      <p className="text-sm text-muted-foreground">{row.without}</p>
      <p className="text-sm text-muted-foreground">{row.with}</p>
    </motion.div>
  );
});

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section ref={ref} className="relative bg-background py-24 md:py-32 lg:py-40 px-6 overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 20%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-4"
          >
            Compliance that pays for itself.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Priced by the scale of your subcontractor network. Every plan includes full-service
            compliance verification — no software to manage, no portal to babysit.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 mb-24 md:mb-32">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isYearly={isYearly}
              onToggleYearly={() => setIsYearly(!isYearly)}
              index={index}
            />
          ))}
        </div>

        {/* Your Experience Section */}
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-semibold text-foreground mb-8"
          >
            Your <span className="text-primary">Experience</span>
          </motion.h3>

          {/* Column Headers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pb-4 border-b border-border"
          >
            <p className="text-sm font-medium text-foreground">Without Midpoint</p>
            <p className="text-sm font-medium text-primary">With Midpoint</p>
          </motion.div>

          {/* Comparison Rows */}
          <div>
            {comparisonRows.map((row, index) => (
              <ComparisonRow key={index} row={row} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
