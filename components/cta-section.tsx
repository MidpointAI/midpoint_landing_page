"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-background py-24 md:py-32 lg:py-[200px] px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8 block"
        >
          Ready?
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-[1.1]"
        >
          <em className="italic">Transform</em> your
          <br />
          <span className="text-primary">compliance strategy</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground mt-12 max-w-xl mx-auto leading-relaxed"
        >
          Join hundreds of builders who&apos;ve eliminated paperwork headaches
          and reduced their insurance costs.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-10 md:mt-16"
        >
          {/* Primary Button */}
          <a
            href="/contact"
            className="relative px-8 sm:px-12 py-5 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium overflow-hidden group rounded-xl"
          >
            <span className="relative z-10">Request a Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </a>

          {/* Secondary Button */}
          <a
            href="/resources"
            className="px-8 sm:px-12 py-5 border border-border text-foreground text-sm tracking-[0.15em] uppercase font-light hover:border-primary hover:text-primary transition-colors duration-300 rounded-xl"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
