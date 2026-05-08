"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, ClockIcon, ClipboardCheckIcon, BellIcon } from "lucide-react";

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
    <section className="w-full bg-zinc-950 py-36 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:gap-20 items-center gap-[0px]">
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className="relative aspect-square max-w-[560px] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Papers_flyingss.png"
                alt="Flying papers representing compliance paperwork"
                className="w-full h-full object-contain invert"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(9,9,11,1) 75%)",
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <p
              className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Why Midpoint?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">
              Built for Builders, <span className="text-lime-400">Not Paper Pushers</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10">
              You manage jobsites, not filing cabinets.
              <br />
              We handle the compliance so you can focus on the build.
            </p>

            <div className="border-t border-zinc-800 mb-6" />

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
                      <Icon className="h-5 w-5 text-lime-400 flex-shrink-0" />
                      <span className="text-white font-semibold text-base tracking-tight flex-1">
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
                          <p className="text-zinc-400 text-sm leading-relaxed pl-9 pb-4">
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
