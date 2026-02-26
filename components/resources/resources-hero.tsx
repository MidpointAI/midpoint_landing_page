"use client";

import { ChevronDown } from "lucide-react";

export function ResourcesHero() {
  const scrollToContent = () => {
    const content = document.getElementById("resources-content");
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-svh flex flex-col items-center justify-center relative px-6">
      {/* Centered content */}
      <div className="text-center">
        {/* Kicker text */}
        <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] mb-6">
          <span className="text-muted-foreground">Insurance Compliance, </span>
          <span className="text-primary">Decoded</span>
        </p>

        {/* Giant heading */}
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl lg:text-8xl xl:text-[112px] font-extrabold leading-[0.9] tracking-tight">
          <span className="block text-foreground">INSURANCE</span>
          <span className="block text-primary">TERMS</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[28rem] mx-auto text-sm sm:text-[15px] text-muted-foreground mt-8 leading-relaxed">
          Essential knowledge to help builders navigate complex insurance
          landscapes and optimize risk transfer strategies.
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 hover:opacity-50 transition-opacity cursor-pointer"
        aria-label="Scroll to content"
      >
        {/* Pill shape with bouncing dot */}
        <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center pt-1.5">
          <div className="w-1 h-1 rounded-full bg-current animate-bounce" />
        </div>
        {/* Chevron */}
        <ChevronDown className="w-4 h-4" />
      </button>
    </section>
  );
}
