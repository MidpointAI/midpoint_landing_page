"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { APP_LOGIN_URL } from "@/lib/site";

const HERO_BG_URL =
  "https://cdn.magicpatterns.com/uploads/aYGrNQuUPNdajTBmWkC5Wu/Hero.svg";

const ease = [0.16, 1, 0.3, 1];

export default function HeroV2() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background parallax + slow zoom settle
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  // Content zooms IN and fades as you scroll away (cinematic exit)
  const contentScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  // useInView on the heading — clip-mask children can't use whileInView
  // because overflow:hidden clips them, making IntersectionObserver think
  // they have 0 visible area and never firing the trigger.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.2 });

  const vp = { once: true, amount: 0 as const };

  return (
    <div ref={sectionRef} className="relative w-full bg-zinc-950 flex flex-col overflow-hidden min-h-screen md:min-h-[100dvh] md:snap-start">
      {/* Background with parallax + zoom settle */}
      <motion.div
        className="absolute inset-[-10%] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_URL})`, y: bgY, scale: bgScale }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute inset-0 bg-zinc-950/75" />

      {/* Ambient lime glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={vp}
        transition={{ duration: 2, delay: 0.8 }}
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 45%, rgba(163,230,53,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.6) 80%, rgba(9,9,11,0.95) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

      <motion.main
        className="relative z-10 flex flex-col px-4 md:px-6 text-center items-center justify-center flex-1"
        style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
      >
        <div className="flex flex-col items-center">
          {/* Subtitle — fade up */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="text-zinc-400 text-sm tracking-[0.2em] uppercase mb-8"
          >
            Insurance verification, <span className="italic">off your plate</span>
          </motion.p>

          {/* Heading — line-by-line clip reveal (driven by useInView on h2) */}
          <h2 ref={headingRef} className="text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.9] mb-8 px-2">
            <span className="text-reveal-line text-white">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={headingInView ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 1, ease, delay: 0.35 }}
              >
                Insurance Compliance for GCs
              </motion.span>
            </span>
            <span className="text-reveal-line text-white">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={headingInView ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 1, ease, delay: 0.5 }}
              >
                <span className="text-lime-400">Managed</span> End to End
              </motion.span>
            </span>
          </h2>

          {/* Body — fade up */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="text-zinc-400 text-lg md:text-xl max-w-[612px] mx-auto mb-12 leading-relaxed"
          >
            A dedicated team plus software: signed agreement → requirements →
            collect → verify → ongoing monitoring.
          </motion.p>

          {/* CTAs — fade up */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-lime-400 px-7 py-2.5 text-sm font-medium text-zinc-950 hover:bg-lime-300 transition-colors"
            >
              Talk to us
            </Link>
            <a
              href={APP_LOGIN_URL}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Log in
            </a>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors px-2"
            >
              Learn more <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </motion.main>

      <motion.div
        className="relative z-10 flex flex-col items-center pb-10 -mt-[120px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={vp}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-80 transition-opacity"
          onClick={() =>
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })
          }
        >
          <span className="text-xs text-zinc-500 tracking-widest uppercase">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-zinc-500">
            <path
              d="M10 4v12m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
