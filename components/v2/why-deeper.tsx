"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const quoteLines = [
  "“ISSUED AS A MATTER OF",
  "INFORMATION ONLY AND",
  "CONFERS NO RIGHTS UPON",
  "THE CERTIFICATE HOLDER”",
];

const HIGHLIGHT_DURATION = 1.5;

export default function WhyDeeper() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [replayKey, setReplayKey] = useState(0);
  const hasPlayed = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Aggressive parallax: certificate and text at very different rates
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -70]);
  // Exit: scale and fade
  const sectionScale = useTransform(scrollYProgress, [0.7, 1], [1, 0.9]);
  const sectionOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  const handleHover = () => {
    if (hasPlayed.current) {
      setReplayKey((k) => k + 1);
    }
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-32 overflow-hidden md:min-h-[100dvh] md:snap-start md:flex md:flex-col md:justify-center" ref={sectionRef}>
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6"
        style={{ scale: sectionScale, opacity: sectionOpacity }}
      >
        <motion.p
          className="text-zinc-400 dark:text-zinc-400 text-xs md:text-sm tracking-[0.32em] uppercase text-center mb-16"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(4px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Why do you go deeper than certificates?
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            style={{ y: imageY }}
          >
            <motion.div
              className="relative w-full max-w-[560px] rounded-md overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-2xl dark:shadow-black/50 cursor-pointer"
              onMouseEnter={handleHover}
              initial={{ opacity: 0, scale: 0.75, filter: "blur(16px)", x: -60, rotateY: 12 }}
              animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, rotateY: 0 } : { opacity: 0, scale: 0.75, filter: "blur(16px)", x: -60, rotateY: 12 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Continuous gentle float */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/coi-certificate-figma.png"
                  alt="Certificate of Liability Insurance with verification progress"
                  className="w-full h-auto block"
                />
              </motion.div>
              {/* Highlight overlay on disclaimer text */}
              <motion.div
                key={`highlight-${replayKey}`}
                className="absolute left-[2%] top-[3.5%] w-[96%] h-[5.5%] bg-lime-400/70 origin-left pointer-events-none"
                style={{ mixBlendMode: "multiply" }}
                initial={{ opacity: 0, scaleX: 0, scaleY: 0.6 }}
                animate={
                  isInView
                    ? { opacity: 1, scaleX: 1, scaleY: 1 }
                    : { opacity: 0, scaleX: 0, scaleY: 0.6 }
                }
                transition={{
                  duration: HIGHLIGHT_DURATION,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: replayKey > 0 ? 0 : 0.5,
                }}
                onAnimationComplete={() => {
                  hasPlayed.current = true;
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 flex flex-col gap-12"
            style={{ y: textY }}
          >
            <div className="flex flex-col gap-8">
              {/* Heading with clip-mask reveal */}
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1]">
                <span className="text-reveal-line text-zinc-900 dark:text-white">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={isInView ? { y: "0%" } : { y: "110%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  >
                    Because Certificates
                  </motion.span>
                </span>
                <span className="text-reveal-line text-zinc-900 dark:text-white">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={isInView ? { y: "0%" } : { y: "110%" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  >
                    alone are not enough
                  </motion.span>
                </span>
              </h2>
              <div className="flex flex-col gap-6">
                <motion.p
                  className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed max-w-[480px]"
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(4px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                >
                  When subs submit their certificates, we use advanced tools to
                  verify insurance documents with surgical accuracy. Because of
                  our Insurance Experts, we expose the risks that others don&apos;t
                  even know to look for.
                </motion.p>
                <motion.a
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 text-lime-600 dark:text-lime-400 font-medium text-base hover:text-lime-700 dark:hover:text-lime-300 transition-colors w-fit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                >
                  Learn How
                  <ArrowRight className="h-5 w-5" />
                </motion.a>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-start">
              {quoteLines.map((line, index) => (
                <motion.span
                  key={`${line}-${replayKey}`}
                  className="bg-lime-400 text-black px-2 py-1 text-base md:text-xl font-bold tracking-[0.18em]"
                  style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                  initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0, filter: "blur(0px)" }
                      : { opacity: 0, x: -40, filter: "blur(4px)" }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: replayKey > 0
                      ? HIGHLIGHT_DURATION * 0.5 + index * 0.12
                      : 1.0 + index * 0.12,
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
