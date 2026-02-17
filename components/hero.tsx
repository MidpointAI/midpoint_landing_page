"use client";

import { motion } from "framer-motion";
import { GrainGradient } from "@paper-design/shaders-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-6 py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Cinematic Shader Background */}
      <div className="absolute inset-0 z-0">
        <GrainGradient
          style={{ width: "100%", height: "100%" }}
          colors={["#030806", "#0a1f12", "#122e1a", "#1a4525", "#256035", "#3d8050"]}
          colorBack="#050505"
          softness={0.25}
          intensity={0.9}
          noise={0.55}
          shape="corners"
          speed={0.25}
          scale={1.6}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/80" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm tracking-[0.3em] uppercase text-[#555555] mb-8"
      >
        Insurance Compliance, Reimagined
      </motion.p>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-display text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] tracking-[0.02em] text-white uppercase text-center"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        Eliminate
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="font-display text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] tracking-[0.02em] text-[#C9FF64] uppercase text-center mt-[-1vw]"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        Paperwork
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-lg md:text-xl text-[#888888] max-w-xl mt-16 leading-relaxed tracking-wide text-center"
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
          href="#get-started"
          className="relative px-8 sm:px-12 py-5 bg-[#C9FF64] text-[#050505] text-sm tracking-[0.15em] uppercase font-medium overflow-hidden group"
        >
          <span className="relative z-10">Start Free</span>
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700"
          />
        </a>

        {/* Secondary Button */}
        <a
          href="#demo"
          className="px-8 sm:px-12 py-5 border border-[#2a2a2a] text-white text-sm tracking-[0.15em] uppercase font-light hover:border-[#C9FF64] hover:text-[#C9FF64] transition-colors duration-300"
        >
          Watch Demo
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
        <div className="relative w-6 h-10 rounded-full border-2 border-[#444444] group-hover:border-[#C9FF64] transition-colors duration-300">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-1 h-2 rounded-full bg-[#C9FF64] animate-mouse-scroll" />
        </div>
        <div className="flex justify-center mt-3">
          <svg
            className="w-3 h-3 text-[#444444] group-hover:text-[#C9FF64] transition-colors duration-300 animate-bounce-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
