"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionIntro } from "./section-intro";
import { SPRING } from "./motion";
import { FigureFrame } from "./figure-frame";
import { Roster, SUBS, type Sub, type SubStatus } from "@/components/v2/report";


// Same five steps as /how-it-works, condensed. Each shows one sub in the
// state the GC would see it at that point.
interface Step {
  id: string;
  title: string;
  body: string;
  highlight: string;
  row: { status: SubStatus; score: number; label?: string; showRing?: boolean; expanded?: boolean };
}

const STEPS: Step[] = [
  {
    id: "requirements",
    title: "Pull the requirements from your agreement",
    body: "Every executed subcontract sets the insurance requirements for that sub on that project. You CC us on the signed agreement and that's the trigger.",
    highlight: "Your contract is the benchmark",
    row: { status: "collecting", score: 0, label: "Requirements set", showRing: false },
  },
  {
    id: "collect",
    title: "Contact the sub and their agent",
    body: "We request certificates and endorsements directly from the subcontractor and the agent who wrote the policy. Your team stops chasing.",
    highlight: "You send nothing",
    row: { status: "collecting", score: 0, label: "Requested", showRing: false },
  },
  {
    id: "verify",
    title: "Verify the coverage, not the certificate",
    body: "Limits, additional insured, waivers, and the endorsement forms behind them, read by our compliance team and scored against your project.",
    highlight: "Reviewed by people, reported to you",
    row: { status: "noncompliant", score: 80, expanded: true },
  },
  {
    id: "chase",
    title: "Chase gaps and renewals",
    body: "Automated follow-ups to the sub and the agent, warnings ahead of every expiration, and escalation to you only when repeated outreach hasn't worked.",
    highlight: "It reaches you only when it needs you",
    row: { status: "expiring", score: 100, label: "Renewal requested" },
  },
  {
    id: "monitor",
    title: "Report weekly. Monitor for years",
    body: "One short email a week listing each trade partner and where they stand, and monitoring that continues for two years after the project closes.",
    highlight: "One email. No login.",
    row: { status: "compliant", score: 100 },
  },
];

const BASE = SUBS.find((s) => s.id === "redrock")!;

export default function HowItWorksV2() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const row: Sub = { ...BASE, status: step.row.status, score: step.row.score };

  return (
    <section id="how-it-works" className="w-full bg-background section-y section-rule overflow-hidden scroll-mt-24">
      <div className="container-site">
        <SectionIntro
          className="mb-14"
          eyebrow="Beyond COI checks"
          title={
            <>
              We don&apos;t just store documents.
              <br />
              We <span className="text-primary">verify</span> them.
            </>
          }
          description="Most builders assume their construction software, accounting platform, or bookkeeper is handling trade partner compliance. They're storing documents. Midpoint reads the policy language itself and reports back what it means for each sub on each project."
        />

        {/* Mobile: step chips */}
        <div className="flex md:hidden overflow-x-auto gap-2 mb-8 pb-2 -mx-2 px-2" role="tablist" aria-label="Steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                i === active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[260px_1fr_minmax(0,380px)] gap-10 lg:gap-14 items-start">
          {/* Desktop: step list */}
          <div className="hidden md:flex flex-col relative" role="tablist" aria-label="Steps">
            <div className="absolute left-[4px] top-3 bottom-3 w-px bg-border" />
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className="relative flex items-center gap-4 text-left group py-3"
                >
                  <span className="relative flex-shrink-0 z-10">
                    <motion.span
                      animate={{ scale: on ? [1, 1.3, 1] : 1 }}
                      transition={on ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                      className={`block h-[9px] w-[9px] rounded-full transition-colors duration-300 ${on ? "bg-primary" : "bg-muted-foreground/50 group-hover:bg-muted-foreground"}`}
                    />
                  </span>
                  <span className={`text-sm font-medium transition-colors duration-300 ${on ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground/80"}`}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active step */}
          <div className="min-w-0" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={SPRING}
                className="py-2"
              >
                <p className="eyebrow mb-4">Step {active + 1} of {STEPS.length}</p>
                <h3 className="heading-3 text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-lg">{step.body}</p>
                <p className="text-sm text-primary font-medium mb-6">{step.highlight}</p>
                <Button asChild variant="link" size="sm">
                  <Link href={`/how-it-works#step-${step.id}`}>
                    See this step in full <ArrowRightIcon />
                  </Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* One sub, as the GC sees it at this step */}
          <FigureFrame n={2} label="In your weekly email" className="self-center">
            <div className="rounded-lg border border-border bg-background px-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Roster
                    subs={[row]}
                    showRing={step.row.showRing ?? true}
                    chipLabel={() => step.row.label}
                    expandedId={step.row.expanded ? row.id : null}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </FigureFrame>
        </div>
      </div>
    </section>
  );
}
