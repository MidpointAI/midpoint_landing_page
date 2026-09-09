"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_BG_URL =
  "https://cdn.magicpatterns.com/uploads/aYGrNQuUPNdajTBmWkC5Wu/Hero.svg";

export default function HeroV2() {
  return (
    <div className="relative w-full bg-background flex flex-col overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_URL})` }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 30%, transparent) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute inset-0 bg-background/75" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklch, var(--background) 60%, transparent) 80%, color-mix(in oklch, var(--background) 95%, transparent) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <main className="relative z-10 flex flex-col justify-center flex-1">
        <div className="container-site">
        <p className="eyebrow-accent mb-8">Insurance verification, off your plate</p>
        <h1 className="heading-display mb-8">
          <span className="text-foreground block">
            Trade Partner <span className="text-primary">Compliance</span>
          </span>
          <span className="text-foreground block">Without the Headache</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl measure-intro mb-12 leading-relaxed">
          We collect your subcontractors&apos; certificates, verify the coverage against
          your contract, chase what&apos;s missing, and report back every week.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="ghost" className="self-start sm:self-auto">
            <Link href="/how-it-works">
              See how it works <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">We reply within one business day.</p>
        </div>
      </main>

    </div>
  );
}
