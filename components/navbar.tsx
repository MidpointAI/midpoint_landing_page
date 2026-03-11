"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

// Animation variants defined OUTSIDE component to prevent recreation
const hamburgerTopVariants: Variants = {
  open: { rotate: 45, y: 6 },
  closed: { rotate: 0, y: 0 },
};

const hamburgerMiddleVariants: Variants = {
  open: { opacity: 0 },
  closed: { opacity: 1 },
};

const hamburgerBottomVariants: Variants = {
  open: { rotate: -45, y: -6 },
  closed: { rotate: 0, y: 0 },
};

const mobileMenuVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Transition config defined outside to prevent recreation
const hamburgerTransition = { duration: 0.3 };
const menuTransition = { duration: 0.25, ease: "easeOut" as const };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Determine which nav links to show based on current page
  const isHomePage = pathname === "/";
  const isResourcesPage = pathname === "/resources";

  // Memoize toggle handler
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Memoize close handler for menu items
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoize animation state
  const animationState = useMemo(() => (isOpen ? "open" : "closed"), [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] h-[72px]">
      {/* Glass background layer - OPTIMIZED: reduced blur from 2xl to lg */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />

      {/* Top edge light refraction shine - theme aware */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {/* Secondary subtle shine for depth */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      {/* Bottom border with subtle glow - theme aware */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent" />

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 xl:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="block group">
          <Image
            src="/Midpoint-Logo.svg"
            alt="Midpoint"
            width={158}
            height={22}
            className="h-5 w-auto transition-opacity duration-300 dark:brightness-0 dark:invert group-hover:opacity-80"
            priority
          />
        </Link>

        {/* Desktop Nav Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {/* Show Home on resources page, Resources on home page, both on other pages */}
          {!isHomePage && (
            <Link
              href="/"
              className="text-sm tracking-[0.1em] uppercase px-5 py-2.5 border border-foreground/20 text-foreground/90 font-medium hover:border-primary hover:text-primary transition-all duration-300 rounded-xl"
            >
              Home
            </Link>
          )}
          {!isResourcesPage && (
            <Link
              href="/resources"
              className="text-sm tracking-[0.1em] uppercase px-5 py-2.5 border border-foreground/20 text-foreground/90 font-medium hover:border-primary hover:text-primary transition-all duration-300 rounded-xl"
            >
              Resources
            </Link>
          )}
          <Link
            href="/contact"
            className="text-sm tracking-[0.1em] uppercase px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-foreground transition-colors duration-300 rounded-xl"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Hamburger - using variants for performance */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-3 min-h-[44px] min-w-[44px] items-center justify-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <motion.span
            className="h-px w-6 bg-foreground block"
            variants={hamburgerTopVariants}
            animate={animationState}
            transition={hamburgerTransition}
          />
          <motion.span
            className="h-px w-6 bg-foreground block"
            variants={hamburgerMiddleVariants}
            animate={animationState}
            transition={hamburgerTransition}
          />
          <motion.span
            className="h-px w-6 bg-foreground block"
            variants={hamburgerBottomVariants}
            animate={animationState}
            transition={hamburgerTransition}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={menuTransition}
            className="absolute left-0 right-0 top-[72px] md:hidden overflow-hidden"
          >
            {/* Glass background for mobile menu - OPTIMIZED: reduced blur */}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-lg" />

            {/* Top shine on mobile menu - theme aware */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            {/* Bottom border - theme aware */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />

            {/* Content */}
            <div className="relative flex flex-col items-center py-8 gap-4">
              <div className="mb-2">
                <ThemeToggle />
              </div>
              {/* Show Home on resources page, Resources on home page, both on other pages */}
              {!isHomePage && (
                <Link
                  href="/"
                  className="text-sm tracking-[0.1em] uppercase px-6 py-3 border border-foreground/20 text-foreground/90 font-medium hover:border-primary hover:text-primary transition-all duration-300 rounded-xl w-48 text-center"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              )}
              {!isResourcesPage && (
                <Link
                  href="/resources"
                  className="text-sm tracking-[0.1em] uppercase px-6 py-3 border border-foreground/20 text-foreground/90 font-medium hover:border-primary hover:text-primary transition-all duration-300 rounded-xl w-48 text-center"
                  onClick={closeMenu}
                >
                  Resources
                </Link>
              )}
              <Link
                href="/contact"
                className="text-sm tracking-[0.1em] uppercase px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-foreground transition-colors duration-300 rounded-xl w-48 text-center"
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
