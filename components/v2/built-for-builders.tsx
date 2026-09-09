"use client";

import RosterDemo from "@/components/v2/roster-demo";
import { SectionIntro } from "./section-intro";
import { SplitSection } from "./split-section";

/**
 * The outcome, not the feature list: one line and the report the GC
 * receives. The process itself lives in How It Works below.
 */
export default function BuiltForBuilders() {
  return (
    <section className="w-full bg-background section-y relative overflow-hidden">
      <div className="container-site">
        <SplitSection
          mediaFirst
          text={
            <SectionIntro
              eyebrow="Why Midpoint?"
              measure="column"
              title={
                <>
                  Built for Builders, <span className="text-primary">Not Paper Pushers</span>
                </>
              }
              description="You manage jobsites, not filing cabinets. We collect, verify, and monitor every trade partner's coverage, and you get one score per sub, per project, in a weekly email."
            />
          }
          media={<RosterDemo />}
        />
      </div>
    </section>
  );
}
