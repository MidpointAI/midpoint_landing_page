"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[72px]">
      {/* Glass background layer */}
      <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-2xl" />

      {/* Top edge light refraction shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Secondary subtle shine for depth */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9FF64]/10 to-transparent" />

      {/* Bottom border with subtle glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="block group">
          <Image
            src="/midpoint-logo.png"
            alt="Midpoint"
            width={140}
            height={20}
            className="h-5 w-auto brightness-0 invert transition-all duration-300 group-hover:invert-0 group-hover:brightness-100 group-hover:sepia group-hover:saturate-[10] group-hover:hue-rotate-[30deg]"
            priority
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          <a
            href="#resources"
            className="text-sm tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
          >
            Resources
          </a>
          <a
            href="#contact"
            className="text-sm tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
          >
            Contact
          </a>
        </div>

        {/* Desktop CTA */}
        <a
          href="#get-started"
          className="hidden md:inline-block text-sm tracking-[0.1em] uppercase px-6 py-3 bg-[#C9FF64] text-[#050505] font-medium hover:bg-white transition-colors duration-300"
        >
          Get Started
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-3 min-h-[44px] min-w-[44px] items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="h-px w-6 bg-white block"
            animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="h-px w-6 bg-white block"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="h-px w-6 bg-white block"
            animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[72px] md:hidden overflow-hidden"
          >
            {/* Glass background for mobile menu */}
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl" />

            {/* Top shine on mobile menu */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Bottom border */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center py-8 gap-6">
              <a
                href="#resources"
                className="text-sm tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Resources
              </a>
              <a
                href="#contact"
                className="text-sm tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
              <a
                href="#get-started"
                className="text-sm tracking-[0.1em] uppercase px-6 py-3 bg-[#C9FF64] text-[#050505] font-medium hover:bg-white transition-colors duration-300 mt-4"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
