"use client";

import { useRef, memo, useMemo } from "react";
import { motion, useInView } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

// Extended testimonials for infinite scroll effect
const testimonials: Testimonial[] = [
  {
    quote: "Working with Midpoint has been a game-changer. They've cut our compliance management time in half.",
    name: "Spencer Nield",
    title: "Director of Operations",
    company: "A Finer Touch Construction",
  },
  {
    quote: "We went from 10% compliance to 98% with executed agreements across the board.",
    name: "Andy Becker",
    title: "CEO",
    company: "Stonegate Homes",
  },
  {
    quote: "Insurance audits used to give me anxiety. Now I go into audits with complete confidence.",
    name: "Samantha Becher",
    title: "Office & Finance Manager",
    company: "Starwood Custom Homes",
  },
  {
    quote: "The AI caught over $2M in potential exposure that our manual review completely missed.",
    name: "Marcus Chen",
    title: "Risk Manager",
    company: "Apex Development Group",
  },
  {
    quote: "Subcontractor onboarding dropped from 2-3 weeks to under 48 hours. Incredible efficiency.",
    name: "Jennifer Walsh",
    title: "VP of Operations",
    company: "Summit Builders LLC",
  },
  {
    quote: "Finally, a compliance solution that actually understands construction. This is exactly what we needed.",
    name: "David Rodriguez",
    title: "Project Manager",
    company: "Pacific Coast Builders",
  },
  {
    quote: "Our insurance costs dropped 23% in the first year. The ROI speaks for itself.",
    name: "Michelle Torres",
    title: "CFO",
    company: "Torres Development",
  },
  {
    quote: "The real-time monitoring alone has prevented three major compliance issues this quarter.",
    name: "Robert Kim",
    title: "Compliance Director",
    company: "Keystone Construction",
  },
  {
    quote: "I can't imagine going back to spreadsheets. Midpoint has transformed how we operate.",
    name: "Amanda Foster",
    title: "Operations Manager",
    company: "Foster & Sons Building",
  },
  {
    quote: "The support team is phenomenal. They helped us onboard 200+ subs in just two weeks.",
    name: "James Mitchell",
    title: "Owner",
    company: "Mitchell General Contractors",
  },
  {
    quote: "Compliance used to be our biggest headache. Now it runs on autopilot.",
    name: "Sarah Thompson",
    title: "General Manager",
    company: "Thompson Building Co",
  },
  {
    quote: "The dashboard gives me visibility I never had before. Game changer for risk management.",
    name: "Chris Anderson",
    title: "Safety Director",
    company: "Anderson Construction",
  },
];

// MEMOIZED Testimonial Card - prevents unnecessary re-renders
const TestimonialCard = memo(function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  // Memoize initials calculation
  const initials = useMemo(
    () =>
      testimonial.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [testimonial.name]
  );

  return (
    <div className="p-4 mx-2 my-2 rounded-xl bg-[#0a0a0a]/80 border border-[#1a1a1a] hover:border-[#C9FF64]/40 transition-colors duration-300 cursor-default group">
      {/* Quote */}
      <p className="text-sm text-[#777777] leading-relaxed mb-4 group-hover:text-[#999999] transition-colors duration-300">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#C9FF64]/30 transition-colors duration-300">
          <span className="text-xs font-medium text-[#C9FF64]">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-[#555555] truncate">{testimonial.title}</p>
        </div>
      </div>
    </div>
  );
});

// MEMOIZED column component
const TestimonialColumn = memo(function TestimonialColumn({
  testimonials,
  direction,
  speed,
}: {
  testimonials: Testimonial[];
  direction: "up" | "down";
  speed?: string;
}) {
  // Memoize tripled array to prevent recreation
  const tripled = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials]
  );

  // Memoize style object
  const animationStyle = useMemo(
    () => (speed ? { animationDuration: speed } : undefined),
    [speed]
  );

  return (
    <div className="testimonial-column relative h-full overflow-hidden">
      <div
        className={`flex flex-col ${
          direction === "up" ? "animate-marquee-up" : "animate-marquee-down"
        }`}
        style={animationStyle}
      >
        {tripled.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
});

// Memoize gradient style objects outside component
const topGradientClass =
  "absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-transparent z-10 pointer-events-none";
const bottomGradientClass =
  "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-10 pointer-events-none";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Memoize columns to prevent recreation
  const columns = useMemo(
    () => [
      [
        testimonials[0],
        testimonials[5],
        testimonials[10],
        testimonials[2],
        testimonials[7],
        testimonials[4],
      ],
      [
        testimonials[1],
        testimonials[6],
        testimonials[11],
        testimonials[3],
        testimonials[8],
        testimonials[0],
      ],
      [
        testimonials[2],
        testimonials[7],
        testimonials[4],
        testimonials[9],
        testimonials[1],
        testimonials[6],
      ],
      [
        testimonials[3],
        testimonials[8],
        testimonials[5],
        testimonials[10],
        testimonials[0],
        testimonials[7],
      ],
      [
        testimonials[4],
        testimonials[9],
        testimonials[1],
        testimonials[6],
        testimonials[11],
        testimonials[2],
      ],
    ],
    []
  );

  // Memoize backdrop styles - SIMPLIFIED to reduce blur overhead
  const backdropStyle = useMemo(
    () => ({
      background:
        "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(5, 5, 5, 0.98) 0%, rgba(5, 5, 5, 0.9) 30%, rgba(5, 5, 5, 0.7) 50%, rgba(5, 5, 5, 0.4) 70%, transparent 100%)",
    }),
    []
  );

  return (
    <section ref={ref} className="relative h-screen bg-[#050505] overflow-hidden">
      {/* Testimonial Columns Grid - GPU accelerated */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 px-2 md:px-4 gpu-accelerated">
        {/* Column 1 - UP */}
        <div className="hidden md:block h-full">
          <TestimonialColumn
            testimonials={columns[0]}
            direction="up"
            speed="45s"
          />
        </div>

        {/* Column 2 - DOWN */}
        <div className="h-full">
          <TestimonialColumn
            testimonials={columns[1]}
            direction="down"
            speed="50s"
          />
        </div>

        {/* Column 3 - UP */}
        <div className="h-full">
          <TestimonialColumn
            testimonials={columns[2]}
            direction="up"
            speed="42s"
          />
        </div>

        {/* Column 4 - DOWN */}
        <div className="h-full">
          <TestimonialColumn
            testimonials={columns[3]}
            direction="down"
            speed="48s"
          />
        </div>

        {/* Column 5 - UP */}
        <div className="hidden md:block h-full">
          <TestimonialColumn
            testimonials={columns[4]}
            direction="up"
            speed="46s"
          />
        </div>
      </div>

      {/* Top Gradient Fade */}
      <div className={topGradientClass} />

      {/* Bottom Gradient Fade */}
      <div className={bottomGradientClass} />

      {/* Center Text Overlay - OPTIMIZED: removed expensive backdrop-blur */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-center px-12 py-16 pointer-events-auto"
        >
          {/* OPTIMIZED: Solid radial gradient instead of backdrop-blur */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={backdropStyle}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs tracking-[0.3em] uppercase text-[#C9FF64] mb-4 block"
            >
              Testimonials
            </motion.span>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              <em className="italic">Trusted</em> by
              <br />
              <span className="text-[#C9FF64]">Builders</span> Nationwide
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-[#888888] text-base md:text-lg max-w-md mx-auto"
            >
              Join thousands of construction companies who&apos;ve transformed
              their compliance workflow
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex items-center justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  2,500+
                </p>
                <p className="text-xs text-[#555555] uppercase tracking-wider">
                  Companies
                </p>
              </div>
              <div className="w-px h-10 bg-[#333333]" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">98%</p>
                <p className="text-xs text-[#555555] uppercase tracking-wider">
                  Satisfaction
                </p>
              </div>
              <div className="w-px h-10 bg-[#333333]" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">4.9</p>
                <p className="text-xs text-[#555555] uppercase tracking-wider">
                  Rating
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
