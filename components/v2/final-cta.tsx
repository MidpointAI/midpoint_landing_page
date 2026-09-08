"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="w-full px-6 section-y text-center bg-background">
      <h2
        className="text-4xl font-bold text-foreground mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-display), sans-serif" }}
      >
        Ready to stop collecting COIs?
      </h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        Tell us about your projects and trade partners, and we&apos;ll walk you
        through how Midpoint takes compliance off your plate.
      </p>
      <Button size="lg" asChild>
        <Link href="/contact">
          Contact us <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
