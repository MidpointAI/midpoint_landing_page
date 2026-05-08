"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useQuoteModal } from "@/components/v2/site-chrome";

const HERO_BG_URL =
  "https://cdn.magicpatterns.com/uploads/aYGrNQuUPNdajTBmWkC5Wu/Hero.svg";

export default function HeroV2() {
  const { openQuote } = useQuoteModal();

  return (
    <div className="relative w-full bg-zinc-950 flex flex-col overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_URL})` }}
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.6) 80%, rgba(9,9,11,0.95) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

      <main className="relative z-10 flex flex-col px-6 text-center items-center justify-center flex-1">
        <p className="text-zinc-400 text-sm tracking-[0.2em] uppercase mb-8">
          Insurance verification, <span className="italic">off your plate</span>
        </p>
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.9] mb-8">
          <span className="text-white block">
            Trade Partner <span className="text-lime-400">Compliance</span>
          </span>
          <span className="text-white block">Without the Headache</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-[612px] mx-auto mb-12 leading-relaxed">
          A dedicated compliance team handling proper risk transfer, flagging gaps
          in coverage and continuously monitoring trade partners across projects.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={openQuote}
            className="px-6 py-2 bg-lime-400 text-zinc-950 text-sm font-medium rounded-full hover:bg-lime-500 transition-colors"
          >
            Get a Quote
          </button>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Learn More <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <div className="relative z-10 flex flex-col items-center pb-10 -mt-[120px]">
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
      </div>
    </div>
  );
}
