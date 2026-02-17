"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// Static words array defined outside component to prevent recreation
const WORDS = [
  { text: "We", accent: false },
  { text: "review", accent: false },
  { text: "every certificate", accent: true },
  { text: "and", accent: false },
  { text: "every endorsement", accent: true },
  { text: "to", accent: false },
  { text: "uncover", accent: false },
  { text: "the", accent: false },
  { text: "gaps", accent: false },
  { text: "that", accent: false },
  { text: "put", accent: false },
  { text: "your", accent: false },
  { text: "business", accent: false },
  { text: "at", accent: false },
  { text: "risk.", accent: false },
];

export default function StatementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#050505] py-24 md:py-32 lg:py-[200px] px-6">
      <p
        ref={ref}
        className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white leading-[1.3] tracking-tight max-w-5xl mx-auto text-center"
      >
        {WORDS.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={word.accent ? "text-[#C9FF64] italic" : "text-white"}
          >
            {word.text}{" "}
          </motion.span>
        ))}
      </p>
    </section>
  );
}
