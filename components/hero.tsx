"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useThemeColors } from "@/hooks/use-theme-colors";

// Dynamically import the shader component to reduce initial bundle size
const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full bg-background"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--shader-3) 0%, var(--background) 70%)",
        }}
      />
    ),
  },
);

// Theme-aware shader background component
function ShaderBackground() {
  const { colors, colorBack } = useThemeColors();

  return (
    <GrainGradient
      style={{ width: "100%", height: "100%" }}
      colors={colors}
      colorBack={colorBack}
      softness={0.4}
      intensity={1}
      noise={0.08}
      shape="corners"
      speed={0.3}
      scale={1.5}
    />
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Cinematic Shader Background - dynamically loaded */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div
              className="w-full h-full bg-background"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--shader-3) 0%, var(--background) 70%)",
              }}
            />
          }
        >
          {/* <ShaderBackground /> */}
        </Suspense>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8"
        >
          Insurance Compliance, <em className="italic">Reimagined</em>
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] tracking-[0.02em] text-foreground uppercase text-center"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Eliminate
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-display text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] tracking-[0.02em] text-primary uppercase text-center mt-[-1vw]"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Paperwork
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mt-16 leading-relaxed tracking-wide text-center"
        >
          AI-powered verification that catches what humans miss. Coverage gaps.
          Expired certificates. Hidden exposures.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-6 mt-12 md:mt-16 lg:mt-20"
        >
          {/* Primary Button */}
          <a
            href="/contact"
            className="relative px-8 sm:px-12 py-5 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium overflow-hidden group rounded-xl"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </a>

          {/* Secondary Button */}
          <a
            href="/resources"
            className="px-8 sm:px-12 py-5 border border-border text-foreground text-sm tracking-[0.15em] uppercase font-light hover:border-primary hover:text-primary transition-colors duration-300 rounded-xl"
          >
            Learn More
          </a>

          {/* One Pager Button */}
          <a
            href="/one-pager"
            className="px-8 sm:px-12 py-5 bg-[#1a1a19] text-[#c9ff64] text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#2a2a29] transition-colors duration-300 rounded-xl"
          >
            View One Pager
          </a>
        </motion.div>
      </div>

      {/* Professional Mouse Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer"
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
