"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_BG_URL =
  "https://cdn.magicpatterns.com/uploads/aYGrNQuUPNdajTBmWkC5Wu/Hero.svg";

export default function HeroV2() {
  return (
    <div className="relative w-full bg-background flex flex-col overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_URL})` }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 30%, transparent) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute inset-0 bg-background/75" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklch, var(--background) 60%, transparent) 80%, color-mix(in oklch, var(--background) 95%, transparent) 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <main className="relative z-10 flex flex-col px-6 text-center items-center justify-center flex-1">
        <p className="eyebrow mb-8">
          Insurance verification, <span className="italic">off your plate</span>
        </p>
        <h1 className="heading-display mb-8">
          <span className="text-foreground block">
            Trade Partner <span className="text-primary">Compliance</span>
          </span>
          <span className="text-foreground block">Without the Headache</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[612px] mx-auto mb-12 leading-relaxed">
          A dedicated compliance team handling proper risk transfer, flagging gaps
          in coverage and continuously monitoring trade partners across projects.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/how-it-works">
              See how it works <ArrowRightIcon />
            </Link>
          </Button>
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
          <span className="text-xs text-muted-foreground/70 tracking-widest uppercase">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground/70">
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
