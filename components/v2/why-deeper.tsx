"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const quoteLines = [
  "“ISSUED AS A MATTER OF",
  "INFORMATION ONLY AND",
  "CONFERS NO RIGHTS UPON",
  "THE CERTIFICATE HOLDER”",
];

const HIGHLIGHT_DURATION = 1.5;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function WhyDeeper() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [replayKey, setReplayKey] = useState(0);
  const hasPlayed = useRef(false);

  const handleHover = () => {
    if (hasPlayed.current) setReplayKey((k) => k + 1);
  };

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section ref={sectionRef} className="w-full bg-background section-y overflow-hidden">
      <div className="container-site">
        <motion.p className="eyebrow text-center mb-16" {...reveal(0)}>
          Why go deeper than certificates?
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 flex justify-center">
            <motion.div
              className="relative w-full max-w-[560px] rounded-md overflow-hidden shadow-xl cursor-pointer"
              onMouseEnter={handleHover}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/coi-certificate-figma.png"
                alt="Certificate of Liability Insurance with the disclaimer highlighted"
                className="w-full h-auto block"
              />
              {/* Highlight sweeps across the disclaimer line */}
              <motion.div
                key={`highlight-${replayKey}`}
                className="absolute left-[2%] top-[3.5%] w-[96%] h-[5.5%] bg-primary/70 origin-left pointer-events-none"
                style={{ mixBlendMode: "multiply" }}
                initial={{ opacity: 0, scaleX: 0, scaleY: 0.6 }}
                animate={isInView ? { opacity: 1, scaleX: 1, scaleY: 1 } : { opacity: 0, scaleX: 0, scaleY: 0.6 }}
                transition={{ duration: HIGHLIGHT_DURATION, ease: [0.25, 0.1, 0.25, 1], delay: replayKey > 0 ? 0 : 0.5 }}
                onAnimationComplete={() => {
                  hasPlayed.current = true;
                }}
              />
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="heading-2 text-foreground">
                <span className="text-reveal-line">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={isInView ? { y: "0%" } : { y: "110%" }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                  >
                    Because certificates
                  </motion.span>
                </span>
                <span className="text-reveal-line">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={isInView ? { y: "0%" } : { y: "110%" }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                  >
                    alone are not enough
                  </motion.span>
                </span>
              </h2>
              <motion.p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[480px]" {...reveal(0.4)}>
                When subs submit their certificates, we read the forms and policy language behind them, not just the front page. Our insurance experts expose the risks a certificate check alone would never catch.
              </motion.p>
              <motion.div {...reveal(0.55)}>
                <Button asChild variant="link">
                  <Link href="/how-it-works">
                    Learn how <ArrowRightIcon />
                  </Link>
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-col gap-3 items-start">
              {quoteLines.map((line, index) => (
                <motion.span
                  key={`${line}-${replayKey}`}
                  className="bg-primary text-primary-foreground px-2 py-1 font-mono text-sm md:text-lg font-bold tracking-[0.18em]"
                  initial={{ opacity: 0, x: -24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: replayKey > 0 ? HIGHLIGHT_DURATION * 0.5 + index * 0.12 : 1.0 + index * 0.12,
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
