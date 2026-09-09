"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SplitSection } from "./split-section";
import { revealWhen, EASE as SITE_EASE } from "./motion";

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

  const handleHover = () => {
    if (hasPlayed.current) setReplayKey((k) => k + 1);
  };

  return (
    <section ref={sectionRef} className="w-full bg-background py-16 md:py-24 overflow-hidden">
      <div className="container-site">
        <SplitSection
          mediaFirst
          media={
            <motion.div
              className="relative w-full max-w-[560px] rounded-lg overflow-hidden shadow-xl cursor-pointer"
              onMouseEnter={handleHover}
              {...revealWhen(isInView)}
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
          }
          text={
          <div className="flex flex-col gap-10">
            <motion.div {...revealWhen(isInView, 0.05)}>
              <p className="eyebrow mb-4">Why go deeper than certificates?</p>
              <h2 className="heading-2 text-foreground">
                Because certificates
                <br />
                alone are not enough
              </h2>
              <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed measure-column">
                When subs submit their certificates, we read the forms and policy language behind them, not just the front page. Our insurance experts expose the risks a certificate check alone would never catch.
              </p>
              <div className="mt-6">
                <Button asChild variant="link">
                  <Link href="/how-it-works">
                    See how it works <ArrowRightIcon />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 items-start">
              {quoteLines.map((line, index) => (
                <motion.span
                  key={`${line}-${replayKey}`}
                  className="bg-primary text-primary-foreground px-2 py-1 font-mono text-sm md:text-lg font-semibold tracking-[0.18em]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.4,
                    ease: SITE_EASE,
                    delay: replayKey > 0 ? HIGHLIGHT_DURATION * 0.5 + index * 0.12 : 1.0 + index * 0.12,
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </div>
          </div>
          }
        />
      </div>
    </section>
  );
}
