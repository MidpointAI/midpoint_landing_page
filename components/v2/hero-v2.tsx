"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitSection } from "./split-section";
import WeeklyEmail from "./weekly-email";

const HERO_BG_URL =
  "https://cdn.magicpatterns.com/uploads/aYGrNQuUPNdajTBmWkC5Wu/Hero.svg";

export default function HeroV2() {
  return (
    <section className="relative w-full bg-background overflow-hidden">
      {/* The framing photo, washed back so the text and the email sit on top of it */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_URL})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklch, var(--background) 60%, transparent) 80%, color-mix(in oklch, var(--background) 95%, transparent) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />

      {/* A faint dot grid over the photo */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 30%, transparent) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative container-site min-h-[calc(100svh-4rem)] flex items-center py-16 md:py-20">
        <SplitSection
          className="w-full lg:items-center"
          text={
            <div>
              <p className="eyebrow-accent mb-8">Insurance verification, off your plate</p>
              {/* Display size, but sized for five columns: four lines at 60px, not six at 96px. */}
              <h1 className="text-5xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-foreground mb-8">
                Trade Partner <span className="text-primary">Compliance</span> Without the Headache
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl measure-column mb-10 leading-relaxed">
                We collect your subcontractors&apos; certificates, verify the coverage against
                your contract, chase what&apos;s missing, and send you one email a week.
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
          }
          media={
            <div className="flex lg:justify-end">
              <WeeklyEmail />
            </div>
          }
        />
      </div>
    </section>
  );
}
