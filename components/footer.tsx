"use client";

import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Memoized static styles defined OUTSIDE component
const starsBackgroundStyle = {
  backgroundImage: `radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.2), transparent),
                    radial-gradient(1.5px 1.5px at 200px 50px, rgba(201,255,100,0.5), transparent),
                    radial-gradient(1px 1px at 250px 90px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1px 1px at 300px 150px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 350px 30px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1.5px 1.5px at 400px 100px, rgba(201,255,100,0.4), transparent),
                    radial-gradient(1px 1px at 450px 70px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1px 1px at 500px 140px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 550px 50px, rgba(255,255,255,0.2), transparent),
                    radial-gradient(1px 1px at 600px 120px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1.5px 1.5px at 650px 80px, rgba(201,255,100,0.5), transparent),
                    radial-gradient(1px 1px at 700px 40px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 750px 160px, rgba(255,255,255,0.3), transparent),
                    radial-gradient(1px 1px at 800px 90px, rgba(255,255,255,0.4), transparent),
                    radial-gradient(1px 1px at 850px 130px, rgba(255,255,255,0.2), transparent)`,
  backgroundSize: '900px 200px',
};

const earthHorizonStyle = {
  background: `
    radial-gradient(ellipse 120% 60% at 85% 120%, rgba(30, 80, 60, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse 100% 50% at 80% 115%, rgba(20, 60, 45, 0.5) 0%, transparent 45%),
    radial-gradient(ellipse 80% 40% at 75% 110%, rgba(15, 45, 35, 0.6) 0%, transparent 40%)
  `,
};

const atmosphereGlowStyle = {
  background: `
    radial-gradient(ellipse 150% 8% at 80% 95%, rgba(100, 200, 150, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 120% 4% at 75% 98%, rgba(201, 255, 100, 0.2) 0%, transparent 60%)
  `,
};

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Quick links",
    links: [
      { title: "Resources", href: "/resources" },
      { title: "Contact us", href: "/contact" },
      { title: "FAQ", href: "#faq" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "Blog", href: "/blog" },
      { title: "Articles", href: "/articles" },
    ],
  },
  {
    label: "Legal",
    links: [
      { title: "Terms of service", href: "/terms-and-conditions" },
      { title: "Privacy policy", href: "/terms-and-conditions" },
      { title: "Cookie settings", href: "/terms-and-conditions" },
    ],
  },
];

type AnimatedContainerProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

// Memoized AnimatedContainer - uses transform/opacity instead of filter for GPU performance
const AnimatedContainer = memo(function AnimatedContainer({
  className,
  delay = 0.1,
  children
}: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Memoized Footer component
const Footer = memo(function Footer() {
  return (
    <footer className="relative w-full bg-[#050505]">
      {/* Top Separator */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />
      </div>

      {/* CTA Section with Space Horizon */}
      <div className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedContainer delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl bg-[#080808] border border-[#1a1a1a] p-8 md:p-12 lg:p-16 min-h-[320px]">
              {/* Space/Earth Horizon Effect - using memoized styles */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Stars background */}
                <div className="absolute inset-0 opacity-40" style={starsBackgroundStyle} />

                {/* Earth horizon glow - atmospheric effect */}
                <div className="absolute bottom-0 right-0 w-full h-full" style={earthHorizonStyle} />

                {/* Atmosphere glow line */}
                <div className="absolute bottom-0 right-0 w-full h-full" style={atmosphereGlowStyle} />
              </div>

              {/* Curved horizon line SVG */}
              <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <svg
                  className="absolute bottom-0 right-0 w-full h-full"
                  viewBox="0 0 1200 400"
                  fill="none"
                  preserveAspectRatio="xMaxYMax slice"
                >
                  {/* Earth surface curve */}
                  <path
                    d="M1400 450 Q1100 280 600 320 Q200 350 -100 380"
                    stroke="url(#earthCurve)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                  />

                  {/* Atmosphere glow curve */}
                  <path
                    d="M1400 440 Q1100 265 600 305 Q200 335 -100 365"
                    stroke="url(#atmosphereGlow)"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.8"
                  />

                  {/* Outer atmosphere */}
                  <path
                    d="M1400 430 Q1100 250 600 290 Q200 320 -100 350"
                    stroke="url(#outerAtmosphere)"
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.5"
                  />

                  <defs>
                    {/* Earth surface gradient - blue/green earth tones */}
                    <linearGradient id="earthCurve" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1a4a3a" stopOpacity="0" />
                      <stop offset="30%" stopColor="#2d6b50" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#3d8060" stopOpacity="1" />
                      <stop offset="70%" stopColor="#2d6b50" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1a4a3a" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Atmosphere glow - lime/cyan */}
                    <linearGradient id="atmosphereGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4a9070" stopOpacity="0" />
                      <stop offset="25%" stopColor="#7bc090" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#C9FF64" stopOpacity="1" />
                      <stop offset="75%" stopColor="#7bc090" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#4a9070" stopOpacity="0.2" />
                    </linearGradient>

                    {/* Outer atmosphere - subtle cyan */}
                    <linearGradient id="outerAtmosphere" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a090" stopOpacity="0" />
                      <stop offset="40%" stopColor="#90d0b0" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#a0e0c0" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#60a090" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent z-10" />

              {/* Content */}
              <div className="relative z-20 max-w-xl">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight"
                >
                  Experience <em className="italic">effortless</em>{" "}
                  <span className="text-[#C9FF64]">compliance</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-4 text-[#888888] text-base md:text-lg"
                >
                  AI-powered verification that catches what humans miss. Join thousands of companies worldwide.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-white text-[#0a0a0a] text-sm font-medium rounded-xl hover:bg-[#C9FF64] transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </motion.div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Logo & Contact Info */}
          <AnimatedContainer className="space-y-6" delay={0.2}>
            <a href="/" className="block">
              <Image
                src="/midpoint-logo.png"
                alt="Midpoint"
                width={140}
                height={28}
                className="h-7 w-auto brightness-0 invert"
              />
            </a>

            <div className="space-y-1 text-sm text-[#666666]">
              <p>548 Market Street</p>
              <p>Suite 95673</p>
              <p>San Francisco, CA 94104</p>
              <p>United States</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-xs text-[#555555] uppercase tracking-wider mb-2">Phone number</p>
                <a href="tel:1-800-123-4567" className="text-sm text-[#888888] hover:text-[#C9FF64] transition-colors">
                  1-800-123-4567
                </a>
              </div>
              <div>
                <p className="text-xs text-[#555555] uppercase tracking-wider mb-2">Email</p>
                <a href="mailto:hello@midpoint.com" className="text-sm text-[#888888] hover:text-[#C9FF64] transition-colors">
                  hello@midpoint.com
                </a>
              </div>
            </div>
          </AnimatedContainer>

          {/* Right: Link Columns */}
          <div className="grid grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.3 + index * 0.1}>
                <div>
                  <h3 className="text-sm font-medium text-[#888888] mb-4">
                    {section.label}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          className="text-sm text-[#555555] hover:text-[#C9FF64] transition-colors duration-200"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <AnimatedContainer delay={0.6}>
          <div className="mt-12 pt-8 border-t border-[#1a1a1a] text-center">
            <p className="text-sm text-[#555555]">
              © {new Date().getFullYear()} Midpoint. All rights reserved.
            </p>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
});

export default Footer;
