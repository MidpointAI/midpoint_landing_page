"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  // Multi-color hover palette — harmonious with the lime/green theme
  const colors = [
    "oklch(0.75 0.18 130 / 0.4)",  // lime green
    "oklch(0.70 0.14 160 / 0.35)", // teal
    "oklch(0.65 0.16 250 / 0.3)",  // soft blue
    "oklch(0.72 0.12 85 / 0.35)",  // warm gold
    "oklch(0.68 0.15 300 / 0.25)", // muted purple
    "oklch(0.80 0.19 115 / 0.45)", // bright lime (primary)
    "oklch(0.60 0.13 195 / 0.3)",  // cyan
    "oklch(0.70 0.10 50 / 0.3)",   // amber
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-12 w-20 border-l border-neutral-400/50 dark:border-neutral-400/25"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-12 w-20 border-t border-r border-neutral-400/50 dark:border-neutral-400/25"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-neutral-500/40 dark:text-neutral-400/20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
