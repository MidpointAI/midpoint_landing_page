"use client";

import { useState } from "react";

const steps = [
  {
    step: 2,
    title: "Collect requirements, policy certificates, endorsements.",
    body: "We systematically collect new certificates and policy endorsements from your trade partners.",
    align: "left" as const,
    hasImage: true,
  },
  {
    step: 3,
    title: "Experts verify policy info matches your project.",
    body: "We establish project by project insurance requirements based on your agreements",
    align: "right" as const,
  },
  {
    step: 4,
    title: "Compliance is determined and reported back to the general contractor",
    body: "We establish project by project insurance requirements based on your agreements",
    align: "left" as const,
  },
  {
    step: 5,
    title: "Ongoing expiration monitoring and reporting",
    body: "We establish project by project insurance requirements based on your agreements",
    align: "right" as const,
  },
];

export default function WhatWeDoSteps() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#001512] py-16 md:py-28 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 md:gap-12">
        {/* Header */}
        <p
          className="text-zinc-400 text-lg md:text-[28px] tracking-[8.96px] text-center leading-relaxed"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
        >
          WHAT WE DO.
        </p>

        {/* Steps container with rounded border */}
        <div className="w-full border border-white/30 rounded-[32px] md:rounded-[80px] p-2 md:p-3 overflow-hidden">
          {steps.map((step, index) => {
            const isHovered = hoveredIndex === index;
            const isRight = step.align === "right";

            return (
              <div
                key={step.step}
                className="relative transition-all duration-500 ease-out rounded-[24px] md:rounded-[68px]"
                style={
                  isHovered
                    ? {
                        background:
                          "radial-gradient(ellipse at 80% 20%, rgba(34,37,30,1) 0%, rgba(17,29,24,1) 50%, rgba(0,21,18,1) 100%)",
                      }
                    : undefined
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`
                    px-6 md:px-16 lg:px-20 py-10 md:py-16
                    flex flex-col gap-6 md:gap-10
                    ${step.hasImage ? "lg:flex-row lg:items-center lg:gap-10" : ""}
                    ${isRight && !step.hasImage ? "md:items-end" : "md:items-start"}
                  `}
                >
                  {/* Text content */}
                  <div
                    className={`
                      flex flex-col gap-6 md:gap-10 min-w-0
                      ${step.hasImage ? "lg:flex-1" : "max-w-[530px]"}
                    `}
                  >
                    {/* Step label + title */}
                    <div className="flex flex-col gap-4 md:gap-6">
                      {/* Step pill */}
                      <div className="flex">
                        <div
                          className={`
                            inline-flex items-center justify-center transition-all duration-300
                            ${isHovered ? "bg-[#22251e] rounded-[15px] px-6 md:px-9 py-1.5" : "px-0 py-1.5"}
                          `}
                        >
                          <span
                            className="text-lime-400 text-sm md:text-lg tracking-[5.76px] font-medium"
                            style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                          >
                            STEP {step.step}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-white text-2xl md:text-[36px] font-bold leading-[1.2] tracking-tight"
                        style={{ fontFamily: "var(--font-display), sans-serif" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Body */}
                    <p className="text-white/60 text-base md:text-xl leading-relaxed">
                      {step.body}
                    </p>
                  </div>

                  {/* Image for Step 2 */}
                  {step.hasImage && (
                    <div className="w-full lg:w-2/5 flex-shrink-0 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/papers-flying-figma.png"
                        alt="Insurance documents and certificates being collected"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
