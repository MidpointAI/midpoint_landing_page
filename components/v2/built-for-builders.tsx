"use client";

import RosterDemo from "@/components/v2/roster-demo";

/**
 * The outcome, not the feature list: one line and the report the GC
 * receives. The process itself lives in How It Works below.
 */
export default function BuiltForBuilders() {
  return (
    <section className="w-full bg-background section-y relative overflow-hidden">
      <div className="container-site grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">Why Midpoint?</p>
          <h2 className="heading-2 text-foreground mb-5">
            Built for Builders, <span className="text-primary">Not Paper Pushers</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            You manage jobsites, not filing cabinets. We collect, verify, and monitor every trade partner&apos;s coverage, and you get one score per sub, per project, in a weekly email.
          </p>
        </div>
        <div className="flex justify-center lg:justify-start lg:order-first">
          <RosterDemo />
        </div>
      </div>
    </section>
  );
}
