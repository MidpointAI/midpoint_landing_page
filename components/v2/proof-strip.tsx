"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const proofs: {
  label: string;
  value: string;
  detail: string;
  attribution?: string;
}[] = [
  {
    label: "Stonegate Homes",
    value: "~10% → 98%",
    detail: "Required insurance on trades",
    attribution: "Andy Becker, CEO",
  },
  {
    label: "Ovation",
    value: "Signed",
    detail: "Large Southwest GC",
  },
  {
    label: "Claim outcome",
    value: "~$500K",
    detail: "Transferred to a sub",
  },
];

export default function ProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-zinc-950 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-14">
        <motion.p
          className="text-zinc-500 text-[11px] md:text-xs tracking-[0.2em] uppercase text-center mb-8"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Proof
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {proofs.map((proof, index) => (
            <motion.div
              key={proof.label}
              className="text-center sm:text-left sm:px-6 sm:border-l sm:border-white/[0.08] first:sm:border-l-0 first:sm:pl-0"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 + index * 0.08,
              }}
            >
              <p
                className="text-zinc-500 text-[11px] tracking-[0.16em] uppercase mb-2"
                style={{ fontFamily: "var(--font-dm-mono), monospace" }}
              >
                {proof.label}
              </p>
              <p
                className="text-white text-2xl md:text-[28px] font-semibold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                {proof.value}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">{proof.detail}</p>
              {proof.attribution && (
                <p className="text-zinc-600 text-xs mt-2">{proof.attribution}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
