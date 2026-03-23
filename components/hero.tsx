"use client";

import { motion } from "framer-motion";
import { Boxes } from "@/components/ui/background-boxes";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const USE_BOXES = true;

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Interactive Grid Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {USE_BOXES ? (
          <>
            <Boxes />
            <div className="absolute inset-0 w-full h-full bg-background z-[1] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_42%,transparent_40%,black_80%)] pointer-events-none" />
          </>
        ) : (
          <BackgroundRippleEffect />
        )}
      </motion.div>

      {/* Gradient overlays for edge blending */}
      <div className="absolute inset-0 z-[4] bg-gradient-to-b from-background/30 via-transparent to-background/60 pointer-events-none" />

      {/* Background shadow behind text — hides grid under text, reveals it around edges */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 38% 28% at 50% 42%, var(--background) 0%, var(--background) 50%, transparent 100%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-5"
        >
          Insurance Compliance, <em className="italic">Reimagined</em>
        </motion.p>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col items-center"
        >
          <h1
            className="font-display text-[clamp(5rem,16vw,12rem)] font-black leading-[0.78] tracking-[-0.03em] text-foreground text-center"
          >
            Eliminate
          </h1>
          <h1
            className="font-display text-[clamp(5rem,16vw,12rem)] font-black leading-[0.78] tracking-[-0.03em] text-primary text-center -mt-1"
          >
            Paperwork
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mt-10 leading-relaxed tracking-wide text-center"
        >
          AI-powered verification that catches what humans miss. Coverage gaps.
          Expired certificates. Hidden exposures.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-6 mt-12 md:mt-16 lg:mt-20"
        >
          {/* Primary Button */}
          <a
            href="/contact"
            className="relative px-8 sm:px-12 py-5 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium overflow-hidden group rounded-xl pointer-events-auto"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/15 to-transparent dark:via-white/25 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </a>

          {/* Secondary Button */}
          <a
            href="/resources"
            className="px-8 sm:px-12 py-5 border border-border bg-background text-foreground text-sm tracking-[0.15em] uppercase font-light hover:border-primary hover:text-primary transition-colors duration-300 rounded-xl pointer-events-auto"
          >
            Learn More
          </a>

        </motion.div>
      </div>

      {/* Professional Mouse Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer pointer-events-auto"
      >
        <div className="relative w-6 h-10 rounded-full border-2 border-muted-foreground group-hover:border-primary transition-colors duration-300">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-1 h-2 rounded-full bg-primary animate-mouse-scroll" />
        </div>
        <div className="flex justify-center mt-3">
          <svg
            className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors duration-300 animate-bounce-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
