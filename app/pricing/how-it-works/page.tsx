"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Pricing scenario data
const pricingScenarios = [
  { subs: 20, projects: 3, loadFactor: "1.15x", price: "$6,000", isFloor: true },
  { subs: 30, projects: 5, loadFactor: "1.25x", price: "$6,000", isFloor: true },
  { subs: 50, projects: 8, loadFactor: "1.40x", price: "$7,000", isFloor: false },
  { subs: 75, projects: 12, loadFactor: "1.60x", price: "$12,000", isFloor: false },
  { subs: 100, projects: 15, loadFactor: "1.75x", price: "$17,500", isFloor: false },
  { subs: 150, projects: 20, loadFactor: "2.00x", price: "$30,000", isFloor: false },
];

const FORMULA = "MAX($6,000, $100 × Subs × Load Factor)";

function CopyableFormula() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(FORMULA);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-4 bg-card/50 border border-border/50 px-6 py-4 rounded-lg hover:border-primary/50 hover:bg-card/80 transition-all duration-200 cursor-pointer"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200">
        {copied ? (
          <Check className="w-4 h-4 text-primary" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        )}
      </span>
      <code className="text-lg lg:text-xl font-mono font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
        {FORMULA}
      </code>
    </button>
  );
}

export default function HowPricingWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <section className="py-16 lg:py-20 text-center border-b border-border">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
              How Pricing Works
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Simple, transparent pricing that scales with your business.
            </p>
          </section>

          {/* The Formula */}
          <section className="py-12 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              The Formula
            </h2>
            <div className="flex justify-center">
              <CopyableFormula />
            </div>
            <p className="text-center text-muted-foreground text-sm mt-6 max-w-md mx-auto">
              Your annual price is the greater of the $6,000 minimum or the calculated fee.
            </p>
          </section>

          {/* Model Assumptions */}
          <section className="py-12 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              Model Assumptions
            </h2>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-foreground">Base Rate</span>
                <span className="font-mono text-foreground font-medium">$100<span className="text-muted-foreground font-normal">/sub/year</span></span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-foreground">Project Complexity Weight</span>
                <span className="font-mono text-foreground font-medium">0.05<span className="text-muted-foreground font-normal"> per project</span></span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-foreground">Minimum Annual Fee</span>
                <span className="font-mono text-foreground font-medium">$6,000<span className="text-muted-foreground font-normal"> floor</span></span>
              </div>
            </div>
          </section>

          {/* How It's Calculated */}
          <section className="py-12 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              How It&apos;s Calculated
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Load Factor
                </p>
                <code className="text-sm font-mono text-primary">
                  1 + (Active Projects × 0.05)
                </code>
                <p className="text-sm text-muted-foreground mt-3">
                  More projects increase your load factor, reflecting higher compliance overhead.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Calculated Fee
                </p>
                <code className="text-sm font-mono text-primary">
                  $100 × Subs × Load Factor
                </code>
                <p className="text-sm text-muted-foreground mt-3">
                  If below $6,000, the minimum floor applies.
                </p>
              </div>
            </div>
          </section>

          {/* Example Scenarios */}
          <section className="py-12 border-b border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              Example Scenarios
            </h2>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <div>Subs</div>
              <div>Projects</div>
              <div>Load Factor</div>
              <div className="text-right">Annual Price</div>
            </div>

            {/* Table Rows */}
            {pricingScenarios.map((scenario, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 py-4 border-b border-border/50 last:border-b-0"
              >
                <div className="font-mono text-foreground">{scenario.subs}</div>
                <div className="font-mono text-muted-foreground">{scenario.projects}</div>
                <div className="font-mono text-muted-foreground">{scenario.loadFactor}</div>
                <div className={`font-mono font-medium text-right ${scenario.isFloor ? "text-amber-500 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {scenario.price}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                <span>$6,000 floor applied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Formula-driven</span>
              </div>
            </div>
          </section>

          {/* Renewal Policy */}
          <section className="py-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Renewal Policy
            </h2>
            <p className="text-foreground">
              Year 1 price is locked at signing. At renewal (Year 2+), we re-calculate your quote with your updated subcontractor count and active projects.
            </p>
          </section>

          {/* CTA */}
          <section className="py-12 border-t border-border text-center">
            <p className="text-muted-foreground mb-6">
              Ready to get started?
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Your Quote
              </Link>
              <a
                href="mailto:hello@midpoint.com"
                className="px-6 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-foreground/50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
