"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="w-full bg-background">
      <div className="container-site section-y border-t border-border">
        <h2 className="heading-2 text-foreground mb-4">Ready to stop collecting COIs?</h2>
        <p className="text-muted-foreground text-lg mb-8 measure-intro">
          Tell us about your projects and trade partners, and we&apos;ll walk you
          through how Midpoint takes compliance off your plate.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">
            Contact us <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
      </div>
    </section>
  );
}
