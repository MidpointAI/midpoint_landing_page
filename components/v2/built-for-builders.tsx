"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Aggressive parallax: image and text at very different rates
  const imageY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  // Exit: scale down as you scroll past
  const sectionScale = useTransform(scrollYProgress, [0.7, 1], [1, 0.9]);
  const sectionOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  return (
    <section ref={sectionRef} className="w-full bg-white dark:bg-zinc-950 py-36 relative overflow-hidden md:min-h-[100dvh] md:snap-start md:flex md:flex-col md:justify-center">
      <motion.div
        className="relative max-w-7xl mx-auto px-4 md:px-6"
        style={{ scale: sectionScale, opacity: sectionOpacity }}
      >
        <div className="flex flex-col md:flex-row md:gap-20 items-center gap-[0px]">
          <motion.div
            className="w-full md:w-1/2 flex-shrink-0"
            style={{ y: imageY, rotate: imageRotate }}
          >
            <motion.div
              className="relative aspect-square max-w-[560px] mx-auto"
              initial={{ opacity: 0, scale: 0.7, filter: "blur(16px)", x: -80 }}
              animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 } : { opacity: 0, scale: 0.7, filter: "blur(16px)", x: -80 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Continuous gentle float when idle */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/papers-flying-figma.png"
                  alt="Flying papers representing compliance paperwork"
                  className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.10)] dark:drop-shadow-none"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="w-full md:w-1/2" style={{ y: textY }}>
            <motion.p
              className="text-zinc-400 dark:text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(4px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Why Midpoint?
            </motion.p>

            {/* Heading with clip-mask reveal */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              <span className="text-reveal-line text-zinc-900 dark:text-white">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : { y: "110%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                  Built for Builders,{" "}
                  <span className="text-lime-600 dark:text-lime-400">Not Paper Pushers</span>
                </motion.span>
              </span>
            </h2>

            <motion.p
              className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg leading-relaxed mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              You manage jobsites, not filing cabinets.
              <br />
              We handle the compliance so you can focus on the build.
            </motion.p>

            <motion.div
              className="border-t border-zinc-200 dark:border-zinc-800 mb-6"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              style={{ transformOrigin: "left" }}
            />

            <div className="space-y-1">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const isExpanded = expandedIndex === index;
                return (
                  <motion.div
                    key={benefit.title}
                    onMouseEnter={() => setExpandedIndex(index)}
                    onMouseLeave={() => setExpandedIndex(null)}
                    initial={{ opacity: 0, x: 60, filter: "blur(4px)" }}
                    animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: 60, filter: "blur(4px)" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.55 + index * 0.1,
                    }}
                  >
                    <div className="w-full flex items-center py-4 cursor-default pl-[30px] gap-[32px]">
                      <Icon className="h-5 w-5 text-lime-600 dark:text-lime-400 flex-shrink-0" />
                      <span className="text-zinc-900 dark:text-white font-semibold text-base tracking-tight flex-1">
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
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed pl-9 pb-4">
                            {benefit.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
