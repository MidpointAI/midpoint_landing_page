"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, ClockIcon, ClipboardCheckIcon, BellIcon } from "lucide-react";
import RosterDemo from "@/components/v2/roster-demo";

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: "No More Chasing Certs",
    description:
      "We collect COIs and policy documents from your trade partners — so you can focus on building, not paperwork.",
  },
  {
    icon: ClockIcon,
    title: "Know Before They Show",
    description: "Every sub's coverage is confirmed before they set foot on your jobsite.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Always Audit-Ready",
    description:
      "Compliance records organized by project, ready for the owner or your insurance carrier.",
  },
  {
    icon: BellIcon,
    title: "Gaps Flagged, Not Missed",
    description:
      "Get alerted the moment a policy lapses or an endorsement is missing — not after a claim.",
  },
];

export default function BuiltForBuilders() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-background section-y relative overflow-hidden">
      <div className="relative container-site">
        <div className="flex flex-col md:flex-row md:gap-20 items-center gap-[0px]">
          <div className="w-full md:w-1/2 flex-shrink-0 flex justify-center md:justify-start">
            <RosterDemo />
          </div>

          <div className="w-full md:w-1/2">
            <p className="eyebrow mb-4">
              Why Midpoint?
            </p>
            <h2 className="heading-2 text-foreground mb-5">
              Built for Builders, <span className="text-primary">Not Paper Pushers</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
              You manage jobsites, not filing cabinets.
              <br />
              We handle the compliance so you can focus on the build.
            </p>

            <div className="border-t border-border mb-6" />

            <div className="space-y-1">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const isExpanded = expandedIndex === index;
                return (
                  <div
                    key={benefit.title}
                    onMouseEnter={() => setExpandedIndex(index)}
                    onMouseLeave={() => setExpandedIndex(null)}
                  >
                    <div className="w-full flex items-center py-4 cursor-default pl-[30px] gap-[32px]">
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-semibold text-base tracking-tight flex-1">
                        {benefit.title}
                      </span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground text-sm leading-relaxed pl-9 pb-4">
                            {benefit.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
